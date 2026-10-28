"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ViewportNativeImage } from "@/components/common/ViewportImage";

/**
 * IoTFeaturesSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Pixel-perfect recreation of the reference:
 *  • Perspective 3D grid background on left/right sides (CSS-only)
 *  • Soft blue radial glow bottom-left
 *  • Title with accent-colored span
 *  • 3 feature cards with icon, copy, and visual preview at bottom
 *  • Each preview area accepts a placeholder image (swap with real assets)
 *  • Smooth scroll-triggered staggered card reveals
 *  • Fully responsive: 3 cols → 2 → 1
 *
 * Usage:
 *   import IoTFeaturesSection from "@/components/IoTFeaturesSection";
 *   <IoTFeaturesSection />
 *
 *   // With custom card images:
 *   <IoTFeaturesSection
 *     features={[
 *       { ...defaults[0], previewImage: "/imgs/gps-tracking.png" },
 *       ...
 *     ]}
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */

const DEFAULT_FEATURES = [
  {
    id: "gps",
    icon: "pin",
    title: "GPS Asset Tracking",
    description:
      "LOCATOR's IoT GPS asset tracking helps UAE businesses monitor cargo containers, refrigerated trailers, yachts, and rental fleets with live location, movement history, and geofence alerts — reducing asset loss and resolving claims faster.",
    preview: "map",
    previewImage: "/real-time/map.webp",
    href: "/service/smart-iot#gps-asset-tracking",
    cta: "Explore GPS Asset Tracking",
  },
  {
    id: "iot",
    icon: "wifi",
    title: "IoT Sensors & Telemetry Projects",
    description:
      "LOCATOR delivers industrial telematics and IoT equipment tracking with real-time usage, idle monitoring, and service alerts to improve uptime, safety, and job-site control.",
    preview: "telemetry",
    previewImage: "/real-time/graph.webp",
    href: "/service/smart-iot#iot-sensors",
    cta: "Explore IoT Sensors",
  },
  {
    id: "machinery",
    icon: "machinery",
    title: "Equipment & Heavy Machinery Monitoring",
    description:
      "LOCATOR delivers custom IoT sensors with real-time telemetry to monitor temperature, fuel, movement, and equipment health—improving compliance, reliability, and operational efficiency.",
    preview: "excavator",
    previewImage: "/real-time/percentage.webp",
    href: "/service/smart-iot#equipment-machinery",
    cta: "Explore Machinery Monitoring",
  },
];

export default function IoTFeaturesSection({
  heading = "Smart IoT & GPS Asset Tracking Solutions UAE",
  accent = "Real-Time Control",
  prefix = "with ",
  subheading = "Real-time visibility for road teams, machines, and business assets.",
  features = DEFAULT_FEATURES,
}) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setActive(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`iot ${active ? "iot--active" : ""}`}>
      {/* ── BACKGROUND LAYERS ── */}
      <div className="iot__bg">
        {/* Perspective grid - LEFT side */}
        <div className="iot__grid iot__grid--left">
          <div className="iot__grid-inner" />
        </div>
        {/* Perspective grid - RIGHT side */}
        <div className="iot__grid iot__grid--right">
          <div className="iot__grid-inner" />
        </div>
        {/* Soft blue glow bottom-left */}
        <div className="iot__glow iot__glow--bl" />
        {/* Subtle top fade */}
        <div className="iot__glow iot__glow--top" />
      </div>

      {/* ── HEADER ── */}
      <div className="iot__header">
        <h2 className="iot__heading">
          {heading}{" "}
          <br className="iot__br" />
          <span className="iot__accent-prefix">{prefix}</span>
          <span className="iot__accent">{accent}</span>
        </h2>
        <p className="iot__subheading">{subheading}</p>
      </div>

      {/* ── FEATURE CARDS ── */}
      <div className="iot__grid-cards">
        {features.map((feature, i) => (
          <FeatureCard key={feature.id} feature={feature} delay={i * 0.15} />
        ))}
      </div>

      <style jsx>{`
        .iot {
          position: relative;
          width: 100%;
          padding: var(--s-section-y) var(--s-section-x);
          background: linear-gradient(180deg, #fbfcfd 0%, #f4f6f9 100%);
          overflow: hidden;
          font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          isolation: isolate;
        }

        /* ── Background layers ── */
        .iot__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* Perspective 3D grid - both sides */
        .iot__grid {
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(120px, 14vw, 240px);
          overflow: hidden;
          perspective: 600px;
          perspective-origin: 50% 50%;
        }
        .iot__grid--left {
          left: 0;
        }
        .iot__grid--right {
          right: 0;
        }

        .iot__grid-inner {
          position: absolute;
          inset: -20% -50%;
          background-image:
            linear-gradient(rgba(150, 170, 195, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(150, 170, 195, 0.4) 1px, transparent 1px);
          background-size: 60px 60px;
          transform-origin: 50% 50%;
        }
        .iot__grid--left .iot__grid-inner {
          transform: rotateY(38deg) translateX(20%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
        }
        .iot__grid--right .iot__grid-inner {
          transform: rotateY(-38deg) translateX(-20%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
        }

        /* Soft blue glow bottom-left */
        .iot__glow--bl {
          position: absolute;
          bottom: -10%;
          left: -10%;
          width: 50%;
          height: 70%;
          background: radial-gradient(
            ellipse at 30% 70%,
            rgba(140, 180, 230, 0.35) 0%,
            rgba(140, 180, 230, 0.15) 30%,
            transparent 65%
          );
          filter: blur(40px);
        }
        /* Faint top vignette */
        .iot__glow--top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, transparent 100%);
        }

        /* ── Header ── */
        .iot__header {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 1100px;
          margin: 0 auto clamp(40px, 5vw, 64px);
          padding: 0 clamp(8px, 2vw, 24px);
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .iot--active .iot__header {
          opacity: 1;
          transform: translateY(0);
        }

        .iot__heading {
          margin: 0 0 clamp(14px, 2vw, 24px);
          font-size: var(--t-display);
          font-weight: 400;
          color: #4b5560;
          line-height: 1.2;
          letter-spacing: -0.015em;
        }
        .iot__accent-prefix {
          color: #4b5560;
        }
        .iot__accent {
          color: #1360ee;
          font-weight: 500;
        }
        .iot__br {
          display: block;
        }

        .iot__subheading {
          margin: 0 auto;
          max-width: 700px;
          font-size: var(--t-lead);
          color: #4b5560;
          line-height: 1.6;
          font-weight: 400;
        }

        /* ── Feature cards grid ── */
        .iot__grid-cards {
          position: relative;
          z-index: 2;
          /* Was a flat 1280px. See the --w-* token block in globals.css: identical
             below ~1600px, tracks the viewport above it. The header above keeps its
             own 1100px cap on purpose — that one is a reading measure for a centred
             heading, not a container, and a wider monitor does not make a long line
             of prose easier to read. */
          max-width: var(--w-mid);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--s-grid-gap);
        }

        @media (max-width: 1023px) {
          .iot__grid-cards { grid-template-columns: repeat(2, 1fr); }
          .iot__br { display: none; }
        }
        @media (max-width: 639px) {
          .iot__grid-cards { grid-template-columns: 1fr; }
          .iot__grid { width: 60px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .iot__header { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Feature Card                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function FeatureCard({ feature, delay }) {
  return (
    <article className="fc" style={{ "--enter-delay": `${delay}s` }}>
      {/* Top: icon + title */}
      <div className="fc__top">
        <div className="fc__icon">
          <FeatureIcon name={feature.icon} />
        </div>
        <h3 className="fc__title">{feature.title}</h3>
      </div>

      {/* Description */}
      <p className="fc__description">{feature.description}</p>

      {/* Divider */}
      <div className="fc__divider" />

      {/* Preview image area */}
      <div className="fc__preview">
        <FeaturePreview type={feature.preview} customImage={feature.previewImage} />
      </div>

      {/* CTA — deep-links to this topic's block on the Smart IoT page */}
      {feature.href && (
        <Link href={feature.href} className="fc__cta">
          <span>{feature.cta}</span>
          <span className="fc__cta-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      )}

      <style jsx>{`
        /* :global — styled-jsx only auto-scopes DOM tags, not the <Link>
           component, so a scoped .fc__cta selector would never match. */
        :global(.fc__cta) {
          margin-top: clamp(18px, 2vw, 24px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 10px 10px 20px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f4;
          color: #0f1e35;
          font-size: var(--t-body);
          font-weight: 700;
          line-height: 1.25;
          text-decoration: none;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 6px 18px -10px rgba(70, 100, 140, 0.35);
          transition:
            background 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
            color 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        :global(.fc__cta:hover) {
          background: #1360ee;
          border-color: #1360ee;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 16px 32px -12px rgba(19, 96, 238, 0.6);
        }

        /* Arrow rides in its own tile that inverts with the button. */
        :global(.fc__cta-arrow) {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: rgba(19, 96, 238, 0.1);
          color: #1360ee;
          transition:
            background 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
            color 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        :global(.fc__cta:hover .fc__cta-arrow) {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          transform: translateX(3px);
        }
        :global(.fc__cta:focus-visible) {
          outline: 2px solid #1360ee;
          outline-offset: 3px;
        }

        .fc {
          position: relative;
          background: linear-gradient(165deg, #f7f9fc 0%, #eef2f7 100%);
          border-radius: 20px;
          padding: var(--s-card-y) var(--s-card-x);
          display: flex;
          flex-direction: column;
          min-height: clamp(420px, 36vw, 480px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 4px 16px rgba(70, 100, 140, 0.06),
            0 1px 3px rgba(70, 100, 140, 0.04);
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1) var(--enter-delay),
            transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) var(--enter-delay),
            box-shadow 0.4s ease;
        }

        :global(.iot--active) .fc {
          opacity: 1;
          transform: translateY(0);
        }

        .fc:hover {
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 8px 24px rgba(70, 100, 140, 0.1),
            0 2px 6px rgba(70, 100, 140, 0.06);
        }

        .fc__top {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: clamp(18px, 2vw, 26px);
        }

        .fc__icon {
          flex-shrink: 0;
          width: var(--i-tile);
          height: var(--i-tile);
          border-radius: 9px;
          background: linear-gradient(135deg, #d9e8fb 0%, #c0d8f5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7) inset;
        }

        .fc__title {
          margin: 4px 0 0;
          font-size: var(--t-h3);
          font-weight: 600;
          color: #4a5560;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .fc__description {
          margin: 0 0 clamp(16px, 2vw, 22px);
          font-size: var(--t-micro);
          color: #6b8aa8;
          line-height: 1.6;
          font-weight: 400;
        }

        .fc__divider {
          width: 50px;
          height: 1.5px;
          background: #1360ee;
          margin-bottom: clamp(16px, 2vw, 24px);
          border-radius: 1px;
        }

        .fc__preview {
          flex: 1;
          min-height: clamp(180px, 18vw, 230px);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: transparent;
        }
      `}</style>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Feature Icon                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function FeatureIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none" };
  const color = "#1360ee";

  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 7a2 2 0 100-4 2 2 0 000 4z" fill={color}/>
        </svg>
      );
    case "wifi":
      return (
        <svg {...common}>
          <path d="M10 13.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill={color}/>
          <path d="M10 9c-1.66 0-3.18.67-4.27 1.76l1.41 1.41A4.005 4.005 0 0110 11c1.1 0 2.1.45 2.83 1.17l1.41-1.41C13.18 9.67 11.66 9 10 9z" fill={color}/>
          <path d="M10 5c-2.76 0-5.26 1.12-7.07 2.93l1.41 1.41A8.06 8.06 0 0110 7c2.21 0 4.21.9 5.66 2.34l1.41-1.41A9.964 9.964 0 0010 5z" fill={color}/>
        </svg>
      );
    case "machinery":
      return (
        <svg {...common}>
          <path d="M10 2L3 16h14L10 2zm0 4l4 8H6l4-8z" fill={color}/>
        </svg>
      );
    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Feature Preview (placeholder visuals for each card)                         */
/* ─────────────────────────────────────────────────────────────────────────── */
function FeaturePreview({ type, customImage }) {
  // If user passes a custom image src, render that instead of the placeholder SVG
  //
  // Fetch before the section arrives, without preloading these offscreen
  // previews in the document head or waiting for their reveal animation.
  if (customImage) {
    return (
      <ViewportNativeImage
        src={customImage}
        alt=""
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
        }}
      />
    );
  }

  switch (type) {
    case "map":
      return <MapPreview />;
    case "telemetry":
      return <TelemetryPreview />;
    case "excavator":
      return <ExcavatorPreview />;
    default:
      return null;
  }
}

/* ─── Map preview (Card 1) ─── */
function MapPreview() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice"
           style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8f0e8" />
            <stop offset="50%" stopColor="#f0f4ec" />
            <stop offset="100%" stopColor="#e2e8e0" />
          </linearGradient>
        </defs>
        <rect width="320" height="220" fill="url(#mapBg)" />
        {/* Roads */}
        <path d="M-10,80 Q60,90 120,120 T280,150 L330,170" stroke="#d6dde0" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M40,-10 Q60,40 80,80 T120,180 L130,230" stroke="#d6dde0" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M200,-10 Q210,40 230,90 T280,200" stroke="#d6dde0" strokeWidth="8" fill="none" strokeLinecap="round"/>
        {/* Green park areas */}
        <ellipse cx="50" cy="50" rx="50" ry="35" fill="#c8d8b8" opacity="0.55" />
        <ellipse cx="270" cy="70" rx="45" ry="30" fill="#c8d8b8" opacity="0.5" />
        <ellipse cx="230" cy="190" rx="55" ry="35" fill="#c8d8b8" opacity="0.45" />
        {/* Route line (blue) */}
        <path d="M40,180 Q80,150 120,140 Q170,135 200,120 Q230,108 260,95"
              stroke="#1360ee" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M40,180 Q80,150 120,140 Q170,135 200,120 Q230,108 260,95"
              stroke="#1360ee" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.25"/>
      </svg>

      {/* Asset card overlay */}
      <div style={{
        position: "absolute", top: "16px", left: "16px",
        background: "#ffffff", borderRadius: "10px", padding: "10px 12px",
        display: "flex", alignItems: "center", gap: "10px",
        boxShadow: "0 6px 18px rgba(30,60,100,0.12), 0 1px 3px rgba(30,60,100,0.08)",
        minWidth: "150px", fontFamily: "inherit",
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: "linear-gradient(135deg, #1360ee, #0d4fd4)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="5" width="12" height="7" rx="1" fill="white"/>
            <rect x="4" y="3" width="8" height="3" rx="0.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#3a4456", lineHeight: 1.2 }}>ASSET AST-21</div>
          <div style={{ fontSize: "8.5px", color: "#7a8aa0", marginTop: "2px", display: "flex", gap: "3px", alignItems: "center" }}>
            <span style={{ color: "#1360ee" }}>📍</span> Dubai - Al Quoz
          </div>
          <div style={{ fontSize: "8.5px", color: "#7a8aa0", marginTop: "1px" }}>
            🔋 Battery: <strong style={{ color: "#1360ee" }}>78%</strong> | 12V
          </div>
        </div>
      </div>

      {/* Location pins */}
      <div style={{ position: "absolute", left: "28%", top: "78%", fontSize: "26px" }}>📍</div>
      <div style={{ position: "absolute", left: "60%", top: "55%", fontSize: "22px" }}>
        <span style={{ display: "inline-block", background: "#3ec46d", color: "white", borderRadius: "50%", width: "26px", height: "26px", lineHeight: "26px", textAlign: "center", fontSize: "13px", boxShadow: "0 3px 8px rgba(62,196,109,0.5)" }}>🔔</span>
      </div>
      <div style={{ position: "absolute", left: "82%", top: "32%", fontSize: "22px", color: "#e74c3c" }}>📍</div>

      {/* Live tracking pill */}
      <div style={{
        position: "absolute", bottom: "12px", left: "12px",
        background: "rgba(220,240,225,0.95)", borderRadius: "20px",
        padding: "5px 12px", fontSize: "10px", fontWeight: 600, color: "#3a8a4f",
        display: "flex", alignItems: "center", gap: "6px",
      }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3ec46d", boxShadow: "0 0 4px #3ec46d" }} />
        Live Tracking
      </div>
    </div>
  );
}

/* ─── Telemetry preview (Card 2) ─── */
function TelemetryPreview() {
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "linear-gradient(160deg, #f4f7fa 0%, #e8eef5 100%)",
      padding: "14px 12px", overflow: "hidden",
    }}>
      {/* Top row: sensor device + 2 stat cards */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        {/* Sensor device */}
        <div style={{ flex: "0 0 26%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" }}>
          <div style={{ fontSize: "14px", color: "#1360ee" }}>📶</div>
          <div style={{
            width: "32px", height: "44px", borderRadius: "6px 6px 4px 4px",
            background: "linear-gradient(180deg, #ffffff 0%, #e8ecf2 100%)",
            border: "1px solid #d8dde6", boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
            position: "relative", marginTop: "4px",
          }}>
            <div style={{ position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "#1360ee" }} />
            <div style={{ position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%)", width: "10px", height: "8px", background: "#3a4456", borderRadius: "0 0 3px 3px" }} />
          </div>
        </div>

        {/* Temperature card */}
        <div style={{ flex: 1, background: "white", borderRadius: "8px", padding: "8px 10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "8.5px", color: "#7a8aa0", fontWeight: 500 }}>🌡️ Temperature</span>
            <span style={{ fontSize: "7.5px", color: "#3ec46d", fontWeight: 600 }}>● Normal</span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a4456", marginTop: "2px" }}>69°C</div>
          <div style={{ fontSize: "7px", color: "#9aa5b8" }}>Coolant Temp.</div>
          <svg viewBox="0 0 100 24" style={{ width: "100%", height: "20px", marginTop: "3px" }}>
            <polyline points="0,16 15,12 30,14 45,8 60,11 75,5 90,9 100,4" fill="none" stroke="#1360ee" strokeWidth="1.2"/>
          </svg>
        </div>

        {/* Fuel card */}
        <div style={{ flex: 1, background: "white", borderRadius: "8px", padding: "8px 10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "8.5px", color: "#7a8aa0", fontWeight: 500 }}>⛽ Fuel Level</span>
            <span style={{ fontSize: "7.5px", color: "#3ec46d", fontWeight: 600 }}>● Normal</span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3a4456", marginTop: "2px" }}>
            72% <span style={{ fontSize: "8px", fontWeight: 400, color: "#7a8aa0" }}>288 L</span>
          </div>
          <div style={{ fontSize: "7px", color: "#9aa5b8" }}>Avg.(1h)</div>
          <div style={{ marginTop: "3px", height: "5px", background: "#e8ecf2", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #1360ee, #4d94ff)" }} />
          </div>
        </div>
      </div>

      {/* Engine hours card */}
      <div style={{ background: "white", borderRadius: "8px", padding: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "8.5px", color: "#7a8aa0", fontWeight: 500 }}>⏱ Engine Hours</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#3a4456" }}>1,240 hrs</div>
            <div style={{ fontSize: "7px", color: "#9aa5b8" }}>Total Runtime</div>
          </div>
          <svg viewBox="0 0 100 36" style={{ flex: 1, height: "36px" }}>
            <defs>
              <linearGradient id="engineG" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#1360ee" stopOpacity="0"/>
                <stop offset="100%" stopColor="#1360ee" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M0,30 L15,25 L30,22 L45,18 L60,12 L75,8 L90,4 L100,2 L100,36 L0,36 Z" fill="url(#engineG)"/>
            <polyline points="0,30 15,25 30,22 45,18 60,12 75,8 90,4 100,2" fill="none" stroke="#1360ee" strokeWidth="1.5"/>
          </svg>
        </div>
        <div style={{ fontSize: "7px", color: "#3ec46d", marginTop: "2px" }}>↑ 12% vs last 7 days</div>
      </div>

      {/* Live Data pill */}
      <div style={{
        position: "absolute", bottom: "8px", left: "12px",
        display: "flex", alignItems: "center", gap: "5px",
        fontSize: "9px", color: "#3a8a4f", fontWeight: 600,
      }}>
        <span style={{ color: "#3ec46d" }}>📶</span> Live Data
        <span style={{ fontSize: "7px", color: "#9aa5b8", fontWeight: 400 }}>Last updated: 2 sec ago</span>
      </div>
    </div>
  );
}

/* ─── Excavator preview (Card 3) ─── */
function ExcavatorPreview() {
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "linear-gradient(135deg, #d8dee5 0%, #b8c2d0 100%)",
      overflow: "hidden",
    }}>
      {/* Excavator placeholder SVG */}
      <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice"
           style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.85 }}>
        {/* Ground */}
        <rect x="0" y="140" width="320" height="80" fill="#a8b2c0"/>
        <ellipse cx="220" cy="180" rx="80" ry="15" fill="#8a94a3" opacity="0.5"/>
        {/* Excavator body */}
        <rect x="200" y="100" width="55" height="30" rx="3" fill="#3a4456"/>
        <rect x="210" y="90" width="40" height="15" rx="2" fill="#5a6478"/>
        <rect x="215" y="92" width="30" height="11" fill="#88a2c0" opacity="0.7"/>
        {/* Arm */}
        <polygon points="245,108 290,80 295,90 250,118" fill="#3a4456"/>
        <polygon points="288,82 312,108 305,116 282,90" fill="#3a4456"/>
        <polygon points="305,108 318,118 314,128 300,118" fill="#5a6478"/>
        {/* Tracks */}
        <rect x="195" y="128" width="65" height="14" rx="2" fill="#1a1f2a"/>
        <circle cx="205" cy="135" r="4" fill="#3a4456"/>
        <circle cx="220" cy="135" r="4" fill="#3a4456"/>
        <circle cx="235" cy="135" r="4" fill="#3a4456"/>
        <circle cx="250" cy="135" r="4" fill="#3a4456"/>
      </svg>

      {/* Monitoring card overlay */}
      <div style={{
        position: "absolute", top: "12px", left: "12px",
        background: "white", borderRadius: "10px", padding: "12px",
        width: "62%", boxShadow: "0 6px 18px rgba(30,60,100,0.18)",
        fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "5px",
            background: "linear-gradient(135deg, #d9e8fb, #c0d8f5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "10px" }}>🏗️</span>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#3a4456" }}>Excavator EXC-102</span>
        </div>
        <div style={{ fontSize: "8.5px", color: "#3ec46d", fontWeight: 600, marginBottom: "10px" }}>● Active</div>

        {/* Utilization with circular progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div>
            <div style={{ fontSize: "9px", color: "#7a8aa0", fontWeight: 500 }}>Utilization</div>
            <div style={{ fontSize: "7.5px", color: "#9aa5b8" }}>⏱ Today</div>
          </div>
          <div style={{ position: "relative", width: "34px", height: "34px" }}>
            <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="14" stroke="#e8ecf2" strokeWidth="3" fill="none"/>
              <circle cx="18" cy="18" r="14" stroke="#1360ee" strokeWidth="3" fill="none"
                      strokeDasharray={`${78 * 0.88} 200`} strokeLinecap="round"/>
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "9px", fontWeight: 700, color: "#3a4456",
            }}>78%</div>
          </div>
        </div>

        {/* Fuel level */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ fontSize: "9px", color: "#7a8aa0", fontWeight: 500 }}>Fuel Level</span>
            <span style={{ fontSize: "9px", color: "#3a4456", fontWeight: 700 }}>65%</span>
          </div>
          <div style={{ height: "4px", background: "#e8ecf2", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: "65%", height: "100%", background: "linear-gradient(90deg, #3ec46d, #2ea957)" }} />
          </div>
        </div>

        {/* Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "9px", color: "#7a8aa0", fontWeight: 500 }}>Status</span>
          <span style={{
            fontSize: "8.5px", fontWeight: 600, color: "#3a8a4f",
            background: "rgba(220,240,225,0.95)", padding: "2px 8px", borderRadius: "10px",
          }}>● Operating</span>
        </div>
      </div>
    </div>
  );
}
