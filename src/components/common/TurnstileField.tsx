"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { TurnstileAction } from "@/lib/turnstile";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: TurnstileAction;
      theme: "light";
      size: "compact" | "flexible";
      retry: "auto";
      "retry-interval": number;
      "refresh-expired": "auto";
      "refresh-timeout": "auto";
      "response-field": false;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": (code: string) => boolean;
      "timeout-callback": () => void;
      "unsupported-callback": () => void;
    }
  ) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
    locatorTurnstileLoaded?: () => void;
  }
}

let loading: Promise<TurnstileApi> | null = null;

/** A single official script shared by the main form and footer, with retry after failure. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (loading) return loading;
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=locatorTurnstileLoaded";
    script.async = true;
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      delete window.locatorTurnstileLoaded;
      script.remove();
      loading = null;
      reject(new Error("Security check unavailable"));
    };
    const timer = window.setTimeout(fail, 15_000);
    script.onerror = fail;
    // Async scripts must use Cloudflare's SDK callback, not turnstile.ready().
    // Register it before insertion, and wait for it even if the global API has
    // already appeared while the SDK is still initializing.
    window.locatorTurnstileLoaded = () => {
      if (settled) return;
      if (!window.turnstile) {
        fail();
        return;
      }
      settled = true;
      clearTimeout(timer);
      delete window.locatorTurnstileLoaded;
      resolve(window.turnstile);
    };
    document.head.appendChild(script);
  });
  return loading;
}

export default function TurnstileField({
  action,
  onTokenChange,
  resetKey,
  deferred = false,
}: {
  action: TurnstileAction;
  onTokenChange: (token: string) => void;
  resetKey: unknown;
  deferred?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const pathname = usePathname();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const [activated, setActivated] = useState(!deferred);

  useEffect(() => {
    if (activated) return;
    const form = container.current?.closest("form");
    if (!form) return;
    const activate = () => setActivated(true);
    // Focus starts loading even when someone jumps directly to a form field.
    form.addEventListener("focusin", activate);
    if (!("IntersectionObserver" in window)) {
      activate();
      return () => form.removeEventListener("focusin", activate);
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) activate(); },
      { rootMargin: "600px 0px" },
    );
    observer.observe(form);
    return () => {
      observer.disconnect();
      form.removeEventListener("focusin", activate);
    };
  }, [activated]);

  useEffect(() => {
    let cancelled = false;
    let widget: string | undefined;
    const update = (value: string, message = "") => {
      if (cancelled) return;
      setToken(value);
      onTokenChange(value);
      setError(message);
    };
    // Synchronize with the external widget after every completed submission.
    // Tokens are single-use, including when email delivery later fails.
    update("");
    if (siteKey && activated) {
      loadTurnstile()
        .then((api) => {
          if (cancelled || !container.current) return;
          // Choose once per challenge: flexible fills the form (300px minimum),
          // while compact fits narrower cards. Resizing must not recreate an
          // active widget or discard a visitor's successful verification.
          const size =
            container.current.getBoundingClientRect().width >= 300
              ? "flexible"
              : "compact";
          container.current.style.minHeight =
            size === "compact" ? "140px" : "65px";
          widget = api.render(container.current, {
            sitekey: siteKey,
            action,
            theme: "light",
            size,
            "response-field": false,
            retry: "auto",
            "retry-interval": 8000,
            "refresh-expired": "auto",
            "refresh-timeout": "auto",
            callback: (value) => update(value),
            "expired-callback": () =>
              update(
                "",
                "Your security check expired. Please complete it again."
              ),
            "error-callback": (code) => {
              if (cancelled) return true;
              const safeCode = /^\d{3,6}$/.test(String(code))
                ? String(code)
                : "";
              const configurationError = [
                "110100",
                "110110",
                "110200",
                "400020",
                "400021",
                "400070",
              ].includes(safeCode);
              update(
                "",
                configurationError
                  ? `Security verification is unavailable for this site${safeCode ? ` (code ${safeCode})` : ""}. Please use the contact options below.`
                  : `Security verification could not complete${safeCode ? ` (code ${safeCode})` : ""}. It will retry automatically, or you can retry below.`
              );
              // Only a category and public diagnostic code; never a token or form data.
              console.warn(
                "[LOCATOR Turnstile]",
                action,
                safeCode || "unknown"
              );
              return true;
            },
            "timeout-callback": () =>
              update("", "The security check timed out. Please retry."),
            "unsupported-callback": () =>
              update(
                "",
                "This browser could not complete the security check. Please try another browser."
              ),
          });
        })
        .catch(() =>
          update(
            "",
            "Security verification could not load. Check your connection and retry."
          )
        );
    }
    return () => {
      cancelled = true;
      if (widget !== undefined) window.turnstile?.remove(widget);
      onTokenChange("");
    };
  }, [action, onTokenChange, resetKey, retry, siteKey, pathname, activated]);

  return (
    <div
      style={{ margin: "14px 0", minWidth: 0 }}
      data-turnstile-action={action}
      data-turnstile-state={
        token ? "verified" : error || !siteKey ? "error" : "pending"
      }
    >
      <div
        ref={container}
        style={{
          minHeight: siteKey ? 65 : undefined,
          width: "100%",
          overflowX: "auto",
        }}
      />
      <input type="hidden" name="cf-turnstile-response" value={token} />
      {process.env.NODE_ENV === "development" &&
        siteKey === "1x00000000000000000000AA" && (
          <p style={{ margin: "6px 0", fontSize: 12, color: "#526071" }}>
            Development test widget — not a production anti-spam check.
          </p>
        )}
      <p
        role="status"
        aria-live="polite"
        style={{
          margin: "6px 0",
          fontSize: 12,
          lineHeight: 1.5,
          color: error || !siteKey ? "#b42318" : "#526071",
        }}
      >
        {!siteKey
          ? "Security verification is temporarily unavailable. Please contact info@locator.ae or try again later."
          : error ||
            (token
              ? "Security check complete. You can submit the form."
              : "Please complete the security check before submitting.")}
      </p>
      {siteKey && error && (
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          style={{
            font: "inherit",
            fontSize: 12,
            color: "#104ebc",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Retry security check
        </button>
      )}
      {!token && (
        <p
          style={{
            margin: "6px 0",
            fontSize: 12,
            lineHeight: 1.5,
            color: "#526071",
          }}
        >
          Having trouble?{" "}
          <a
            href="mailto:info@locator.ae"
            style={{ color: "#104ebc", textDecoration: "underline" }}
          >
            Email us
          </a>{" "}
          or{" "}
          <a
            href={`tel:${siteConfig.phone}`}
            style={{ color: "#104ebc", textDecoration: "underline" }}
          >
            call {siteConfig.phoneDisplay}
          </a>
          .
        </p>
      )}
      <noscript>
        JavaScript is required to verify this form. You can also contact
        info@locator.ae.
      </noscript>
    </div>
  );
}
