import "server-only";

export type TurnstileAction =
  | "contact"
  | "quote"
  | "demo"
  | "quick_contact"
  | "career_application";

type Verification = { success: true } | { success: false; error: string };
const unavailable =
  "Security verification is temporarily unavailable. Please try again shortly or contact info@locator.ae.";
const rejected =
  "We could not verify your security check. Please complete it again and retry.";

/** Never trust the browser's success callback: validate every submission before email delivery. */
export async function verifyTurnstile(
  form: FormData,
  action: TurnstileAction
): Promise<Verification> {
  const token = form.get("cf-turnstile-response");
  if (typeof token !== "string" || !token.trim() || token.length > 2048) {
    return { success: false, error: rejected };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  const testKey = (key: string) => /^[123]x0{10,}/.test(key);
  // Cloudflare's official local-test response has a synthetic hostname and no
  // real action. Only this explicit pair in next dev can use that response.
  // There is no automatic key fallback; production builds reject test keys.
  const developmentTestMode =
    process.env.NODE_ENV === "development" &&
    process.env.SITE_ENV !== "production" &&
    siteKey === "1x00000000000000000000AA" &&
    secret === "1x0000000000000000000000000000000AA";
  if (
    !secret ||
    !siteKey ||
    !hostnames.length ||
    ((testKey(secret) || testKey(siteKey)) && !developmentTestMode)
  ) {
    return { success: false, error: unavailable };
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      }
    );
    if (!response.ok) return { success: false, error: unavailable };
    const result: unknown = await response.json();
    if (!result || typeof result !== "object")
      return { success: false, error: rejected };
    const data = result as Record<string, unknown>;
    if (
      data.success !== true ||
      (!developmentTestMode &&
        (data.action !== action ||
          typeof data.hostname !== "string" ||
          !hostnames.includes(data.hostname.toLowerCase())))
    ) {
      return { success: false, error: rejected };
    }
    return { success: true };
  } catch {
    // Do not log tokens, secrets, form content or provider response bodies.
    return { success: false, error: unavailable };
  }
}
