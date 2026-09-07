"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import {
  QuickMessageFormState,
  sendQuickContact,
} from "@/app/actions/send-quick-contact";

const companyLinks = [
  { href: "/about/purpose", label: "Who We Are" },
  { href: "/about/vision", label: "Vision" },
  { href: "/about/career", label: "Careers" },
  { href: "/about/newsroom", label: "Newsroom" },
  { href: "/about/newsroom/blog", label: "Blog" },
];

const serviceLinks = [
  {
    href: "/service/vehicle-tracking-system",
    label: "Vehicle Tracking System",
  },
  { href: "/service/car-tracking-system", label: "Car Tracking System" },
  { href: "/service/car-tracker", label: "Car Tracker" },
  { href: "/service/car-gps-tracker", label: "Car GPS Tracker" },
  { href: "/service/fleet-telematics", label: "Fleet Telematics" },
  { href: "/service/video-telematics", label: "Video Telematics" },
  { href: "/service/smart-iot", label: "Smart IoT & Asset Intelligence" },
  { href: "/service/task-manager", label: "Task Manager" },
  {
    href: "/service/tracking-devices",
    label: "Tracking Devices & Accessories",
  },
  { href: "/service/gps-tracker", label: "GPS Tracker" },
  { href: "/service/gps-tracking-system", label: "GPS Tracking System" },
  { href: "/securepath", label: "Securepath" },
  { href: "/asateel-certified-obu", label: "Asateel Certified OBU" },
];

const supportLinks = [
  { href: "/software#faq", label: "FAQ" },
  { href: "/benefits-of-gps-tracking", label: "Benefits Of GPS Tracking" },
];

const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
  {
    href: "https://plus.google.com",
    label: "Google+",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
      </svg>
    ),
  },
];

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const INPUT_BASE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e7f0",
  borderRadius: "8px",
  padding: "8px 11px",
  color: "#1d1d1f",
  fontSize: "var(--f-12)",
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
  transition: `border-color 280ms ${EASE}, background 280ms ${EASE}, box-shadow 280ms ${EASE}`,
};

const initialState: QuickMessageFormState = { success: false };

export default function Footer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const [quickContactState, formAction, isPending] = useActionState(
    sendQuickContact,
    initialState
  );

  const focusIn = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.currentTarget.style.borderColor = "#1360ee";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(19,96,238,0.10)";
  };
  const focusOut = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.currentTarget.style.borderColor = "#e2e7f0";
    e.currentTarget.style.boxShadow = "none";
  };

  useEffect(() => {
    if (quickContactState.success) {
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  }, [quickContactState]);

  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #f9fafc 0%, #f5f7fb 100%)",
      }}
    >
      {/* ── Faded top hairline (softer than a flat border) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #dde3ee 20%, #dde3ee 80%, transparent)",
        }}
      />

      {/* ── Ambient depth — barely-there radial highlight, not a heavy gradient ── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <div
          style={{
            position: "absolute",
            width: "620px",
            height: "620px",
            top: "-320px",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle, rgba(19,96,238,0.045) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          margin: "0 auto",
          padding: "48px 20px 0",
        }}
      >
        {/* ── Secondary brand mark — same logo used across the Software pages ── */}
        <div style={{ marginBottom: "36px", paddingLeft: "24px" }}>
          {/* eager: small, and lazy left an empty gap where the brand mark goes
              for as long as the footer was on screen mid-download. */}
          <Image
            src="/brand/logo-wordmark.png"
            alt="Locator"
            width={2617}
            height={911}
            loading="eager"
            style={{ width: "auto", height: "48px" }}
          />
        </div>

        {/* ── 5-column grid: [form] [company] [services] [support] [connect] ── */}
        {/* Connect is the widest of the two fixed columns so the map reads as a proper
            landscape panel rather than a thumbnail. The three link columns are no
            longer an equal `repeat(3, 1fr)`: Services carries the longest labels and
            Support only ever holds two short ones, so weighting them 1 / 1.1 / 0.8
            spends the width where the text actually needs it instead of leaving a
            column of dead space next to the map. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "clamp(190px,19%,250px) 0.82fr 2.05fr 0.82fr clamp(300px,28%,380px)",
            gap: "clamp(20px,2.5vw,36px)",
            alignItems: "start",
          }}
          className="footer-main-grid"
        >
          {/* ── Quick Contact ── */}
          <div
            className="footer-contact-card"
            style={{
              background: "#ffffff",
              border: "1px solid #e7ebf3",
              borderRadius: "16px",
              padding: "18px",
              boxShadow: "0 6px 24px rgba(19,96,238,0.06)",
              transition: `box-shadow 320ms ${EASE}, transform 320ms ${EASE}`,
            }}
          >
            <h3
              style={{
                color: "#1360ee",
                fontSize: "var(--f-13)",
                fontWeight: 700,
                marginBottom: "14px",
                letterSpacing: "0.03em",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#1360ee",
                  display: "inline-block",
                  flexShrink: 0,
                  boxShadow: "0 0 0 3px rgba(19,96,238,0.14)",
                }}
              />
              Quick Contact
            </h3>

            <form
              action={formAction}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {/* Name + Phone side by side */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <input
                  placeholder="Name"
                  name="name"
                  required
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  style={INPUT_BASE}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <input
                  placeholder="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  style={INPUT_BASE}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <input
                placeholder="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                style={INPUT_BASE}
                onFocus={focusIn}
                onBlur={focusOut}
                required
              />
              <textarea
                name="message"
                placeholder="Your message…"
                rows={2}
                value={form.message}
                onChange={set("message")}
                style={{ ...INPUT_BASE, resize: "none", lineHeight: 1.5 }}
                onFocus={focusIn}
                onBlur={focusOut}
                required
              />
              {quickContactState.error && (
                <p
                  style={{
                    color: "#e5484d",
                    fontSize: "var(--f-9-5)",
                    margin: 0,
                  }}
                >
                  {quickContactState.error}
                </p>
              )}
              {quickContactState.success && (
                <p
                  style={{
                    color: "#13923f",
                    fontSize: "var(--f-9-5)",
                    margin: 0,
                  }}
                >
                  Message sent — we'll be in touch soon.
                </p>
              )}
              <button
                className="footer-btn-primary"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Sending…" : "Send Message"}
              </button>
            </form>
            <p
              style={{
                marginTop: "10px",
                color: "#9aa3b2",
                fontSize: "var(--f-9-5)",
                lineHeight: 1.5,
              }}
            >
              We use cookies to give you the best experience on our website.
            </p>
          </div>

          {/* ── Company ── */}
          <FooterCol title="Company" links={companyLinks} />

          {/* ── Services ── */}
          <FooterCol title="Services" links={serviceLinks} split />

          {/* ── Support ── */}
          <FooterCol title="Support" links={supportLinks} />

          {/* ── Connect ── */}
          <div>
            <ColHeading>Connect</ColHeading>

            {/* Map — framed like a premium photo mat so it reads as an intentional element, not an afterthought */}
            <div className="footer-map-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "1px 4px 8px",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1360ee"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  style={{
                    fontSize: "var(--f-11)",
                    fontWeight: 700,
                    color: "#1d1d1f",
                    letterSpacing: "0.01em",
                  }}
                >
                  Find Us
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=City+Tower+2+Sheikh+Zayed+Road+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map"
                style={{
                  display: "block",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <iframe
                  title="Locator Dubai"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1788!2d55.27076!3d25.20484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1cbe99!2sCity%20Tower%202!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                  width="100%"
                  height="210"
                  style={{ border: 0, display: "block", pointerEvents: "none" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Soft scrim so Google's own attribution bar blends into our chrome instead of competing with it */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "36px",
                    background:
                      "linear-gradient(180deg, transparent, rgba(15,23,42,0.32))",
                    pointerEvents: "none",
                  }}
                />
                {/* "View map" pill */}
                <div
                  className="footer-map-pill"
                  style={{
                    position: "absolute",
                    bottom: "9px",
                    right: "9px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "#1360ee",
                    borderRadius: "20px",
                    padding: "4px 10px",
                    color: "#fff",
                    fontSize: "var(--f-9-5)",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    pointerEvents: "none",
                    boxShadow: "0 2px 8px rgba(19,96,238,0.35)",
                  }}
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  VIEW MAP
                </div>
              </a>
            </div>

            {/* Address + phone stacked compactly */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "7px",
                  alignItems: "flex-start",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1360ee"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginTop: "1px", flexShrink: 0 }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  style={{
                    color: "#5a6472",
                    fontSize: "var(--f-11-5)",
                    lineHeight: 1.5,
                  }}
                >
                  City Tower 2, Sheikh Zayed Road, Dubai, UAE
                </span>
              </div>
              <a href="tel:+971508746688" className="footer-phone">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1360ee"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.73 12 19.79 19.79 0 0 1 1.67 3.43 2 2 0 0 1 3.66 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 5.91 5.91l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                050 874 66 88
              </a>
            </div>

            <a href="/get-a-quote" className="footer-btn-outline">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get a Quote
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            margin: "32px 0 0",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #e2e7f0 15%, #e2e7f0 85%, transparent)",
          }}
        />

        {/* ── Bottom bar ──
            Two groups, not three: legal on the left, the people behind it on the
            right. The brand mark that used to sit here is gone — the same logo
            already opens the footer a few hundred pixels above, and repeating it
            inside one block reads as a mistake rather than as reinforcement. */}
        <div className="footer-bottom">
          <div className="footer-bottom-legal">
            <span>
              Copyright 2026{" "}
              <a
                href="https://aryzetech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-textlink"
              >
                Synosys
              </a>{" "}
              · All Rights Reserved
            </span>
            <span className="footer-sep" aria-hidden="true" />
            <a href="/sitemap.xml" className="footer-textlink">
              Sitemap
            </a>
          </div>

          <div className="footer-bottom-meta">
            <div className="footer-socials">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Credit temporarily hidden. The separator goes with it — on its own
                it would trail after the social icons with nothing to divide.
                Uncomment both together to restore. */}
            {/* <span className="footer-sep" aria-hidden="true" />

            <span>
              Crafted by{' '}
              <a
                href="https://www.linkedin.com/in/mudassar-fullstack/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-textlink footer-credit"
              >
                Mudassar
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM2.4 21h5.16V9.5H2.4zM9.9 9.5V21h5.16v-6.06c0-1.6.3-3.15 2.29-3.15 1.95 0 1.98 1.83 1.98 3.25V21h5.16v-7c0-4.24-.92-7.5-5.88-7.5-2.38 0-3.98 1.31-4.64 2.55h-.07V9.5z" />
                </svg>
              </a>
            </span> */}
          </div>
        </div>
      </div>

      {/* Interaction & responsive styles */}
      <style>{`
        /* Services flows into two balanced sub-columns. Only while the footer is
           actually five-across — below 1100px the columns restack and each cell
           is far too narrow to hold two lists of these labels. */
        .footer-col-split { columns: 2; column-gap: clamp(14px,1.8vw,28px); }
        @media (max-width: 1100px) {
          .footer-col-split { columns: 1; }
        }

        @media (max-width: 1100px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
        @media (max-width: 720px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .footer-main-grid input::placeholder,
        .footer-main-grid textarea::placeholder {
          color: #9aa3b2;
        }

        .footer-contact-card:hover {
          box-shadow: 0 10px 32px rgba(19,96,238,0.10);
          transform: translateY(-2px);
        }

        /* Nav links — color glide + sliding underline */
        /* Non-link sub-heading that names the section a column's links sit
           under — sits between the kicker and the list, so it reads as a
           label rather than as the first item of the list. */
        .footer-col-lead {
          /* Matches .footer-link exactly (dot, size, colour, gap) so it reads as
             the first entry of the list rather than a heavier heading above it.
             The 10px bottom margin is the same gap the <ul> puts between items,
             which keeps the whole column on one rhythm. */
          margin: 0 0 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #5a6472;
          font-size: var(--f-13);
          font-weight: 400;
        }

        .footer-link {
          position: relative;
          color: #5a6472;
          font-size: var(--f-13);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 280ms ${EASE}, gap 280ms ${EASE};
        }
        .footer-link-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #1360ee;
          flex-shrink: 0;
          display: inline-block;
          transition: transform 280ms ${EASE};
        }
        .footer-link-text {
          position: relative;
        }
        .footer-link-text::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -3px;
          height: 1px;
          background: #1360ee;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms ${EASE};
        }
        .footer-link:hover {
          color: #1360ee;
          gap: 9px;
        }
        .footer-link:hover .footer-link-dot {
          transform: scale(1.7);
        }
        .footer-link:hover .footer-link-text::after {
          transform: scaleX(1);
        }

        /* Primary CTA button */
        .footer-btn-primary {
          background: linear-gradient(135deg, #1360ee 0%, #0d4fd4 100%);
          border: none;
          border-radius: 8px;
          padding: 9px;
          color: #fff;
          font-size: var(--f-12);
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.05em;
          width: 100%;
          box-shadow: 0 3px 14px rgba(19,96,238,0.28);
          transition: transform 280ms ${EASE}, box-shadow 280ms ${EASE}, filter 280ms ${EASE};
        }
        .footer-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(19,96,238,0.40);
          filter: brightness(1.06);
        }
        .footer-btn-primary:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 3px 10px rgba(19,96,238,0.30);
        }

        /* Outline CTA (Get a Quote) */
        .footer-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: #ffffff;
          border: 1px solid #1360ee;
          border-radius: 7px;
          padding: 8px 14px;
          color: #1360ee;
          font-size: var(--f-11);
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.04em;
          width: 100%;
          transition: background 280ms ${EASE}, color 280ms ${EASE}, transform 280ms ${EASE}, box-shadow 280ms ${EASE};
        }
        .footer-btn-outline:hover {
          background: #1360ee;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(19,96,238,0.30);
        }
        .footer-btn-outline:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 4px 10px rgba(19,96,238,0.24);
        }

        /* Map — premium "photo mat" frame: soft border + generous inset padding + layered shadow */
        .footer-map-card {
          background: #ffffff;
          border: 1px solid #e7ebf3;
          border-radius: 18px;
          /* Tight left/right so the map gets the width instead of the mat. Top keeps
             a little more room for the "Find Us" label to sit off the border. */
          padding: 7px 4px 4px;
          margin-bottom: 12px;
          box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 12px 28px -8px rgba(19,96,238,0.14);
          transition: transform 320ms ${EASE}, box-shadow 320ms ${EASE}, border-color 320ms ${EASE};
        }
        .footer-map-card:hover {
          transform: translateY(-3px);
          border-color: #d3ddf0;
          box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 18px 38px -8px rgba(19,96,238,0.22);
        }
        .footer-map-pill {
          transition: transform 280ms ${EASE};
        }
        .footer-map-card:hover .footer-map-pill {
          transform: scale(1.05);
        }

        /* Phone link */
        .footer-phone {
          display: flex;
          gap: 7px;
          align-items: center;
          color: #1d1d1f;
          font-size: var(--f-13);
          font-weight: 600;
          text-decoration: none;
          transition: color 280ms ${EASE}, transform 280ms ${EASE};
        }
        .footer-phone:hover {
          color: #1360ee;
          transform: translateX(2px);
        }

        /* Logo */
        /* Bottom bar */
        /* The right padding is a keep-out for the ContactDock chat launcher, which
           is position:fixed at right:20px and 48px wide (see ContactDock's
           --cd-edge / --cd-size). This footer row only insets 20px from the
           viewport, so without the reserve the last item — the credit — sits
           underneath the button at every width, not just narrow ones. */
        .footer-bottom {
          padding: 18px 64px 22px 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px 24px;
        }
        .footer-bottom-legal,
        .footer-bottom-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          color: #8a93a2;
          font-size: var(--f-11);
        }
        .footer-socials { display: flex; align-items: center; gap: 10px; }

        /* A hairline rule rather than a typed "|" — it holds its weight when the
           text around it wraps, where a pipe would be left stranded on a line. */
        .footer-sep {
          width: 1px;
          height: 12px;
          background: #dfe4ed;
          flex-shrink: 0;
        }

        /* Stacked and centred once the row can no longer hold both groups —
           space-between on a wrapped flex line otherwise shoves the two groups to
           opposite edges with a gap of dead space between them. */
        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            justify-content: center;
            text-align: center;
            /* The dock tucks in to --cd-edge:12px below this breakpoint, so the
               keep-out shrinks with it. */
            padding-right: 52px;
          }
          .footer-bottom-legal,
          .footer-bottom-meta { justify-content: center; }
        }

        /* Social icons */
        .footer-social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #eef1f7;
          border: 1px solid #e7ebf3;
          border-radius: 8px;
          color: #5a6472;
          text-decoration: none;
          transition: background 300ms ${EASE}, color 300ms ${EASE}, border-color 300ms ${EASE}, transform 300ms ${EASE}, box-shadow 300ms ${EASE};
        }
        .footer-social:hover {
          background: #1360ee;
          border-color: #1360ee;
          color: #fff;
          transform: translateY(-3px) scale(1.06);
          box-shadow: 0 10px 22px rgba(19,96,238,0.32), 0 0 0 4px rgba(19,96,238,0.08);
        }
        .footer-social:active {
          transform: translateY(-1px) scale(1.02);
        }

        /* Bottom-bar text links */
        .footer-textlink {
          color: #8a93a2;
          text-decoration: none;
          transition: color 280ms ${EASE};
        }
        .footer-textlink:hover {
          color: #1360ee;
        }
        /* Keeps the name and its LinkedIn mark on one line, and stops the icon
           being pushed onto its own row when the bottom bar wraps. */
        .footer-credit {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
          white-space: nowrap;
        }
        .footer-credit svg {
          opacity: .7;
          transition: opacity 280ms ${EASE};
        }
        .footer-credit:hover svg { opacity: 1; }
      `}</style>
    </footer>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4
      style={{
        color: "#1360ee",
        fontSize: "var(--f-10-5)",
        fontWeight: 700,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "14px",
          height: "1.5px",
          background: "#1360ee",
          borderRadius: "2px",
        }}
      />
      {children}
    </h4>
  );
}

/**
 * `split` flows the list into two balanced sub-columns via CSS multi-column.
 * Services carries 13 links against Company's 5 and Support's 2, so as a single
 * stack it ran roughly three times the height of its neighbours and dragged the
 * whole footer down with it. Multi-column is the right tool here rather than
 * slicing the array in two: the browser balances the halves itself, so adding or
 * removing a service never leaves one side stranded.
 *
 * `break-inside: avoid` keeps a link from being torn across the column boundary,
 * and the gap moves to margin-bottom because multi-column ignores flex gap.
 */
function FooterCol({
  title,
  links,
  split = false,
  lead,
}: {
  title: string;
  links: { href: string; label: string }[];
  split?: boolean;
  lead?: string;
}) {
  return (
    <div>
      <ColHeading>{title}</ColHeading>
      {lead ? (
        <p className="footer-col-lead">
          <span className="footer-link-dot" />
          <span>{lead}</span>
        </p>
      ) : null}
      <ul
        className={split ? "footer-col-split" : undefined}
        style={
          split
            ? { listStyle: "none", margin: 0, padding: 0 }
            : {
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }
        }
      >
        {links.map((l) => (
          <li
            key={l.href}
            style={
              split ? { breakInside: "avoid", marginBottom: "10px" } : undefined
            }
          >
            <Link href={l.href} className="footer-link">
              <span className="footer-link-dot" />
              <span className="footer-link-text">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
