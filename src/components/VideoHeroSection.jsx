"use client";

import { useEffect, useRef, useState } from "react";
import { ViewportNativeImage } from "@/components/common/ViewportImage";
import {
  LOCATOR_VIDEO_ALLOW,
  LOCATOR_VIDEO_POSTER,
  LOCATOR_VIDEO_TITLE,
  locatorVideoEmbed,
} from "@/components/locator-video";

/**
 * VideoHeroSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Pixel-perfect recreation of the reference design:
 *  • Floating lavender-blue decorative blocks with soft glow and depth
 *  • Layered 3-D composition (blocks go both behind AND in front of video)
 *  • Large centered video player with dark overlay (Vimeo embed, mounted
 *    on visibility or click — see src/components/locator-video.ts for the shared source)
 *  • Frosted-glass play button with hover states
 *  • Sparkle / star detail at bottom-right of video
 *  • Light blue section background with subtle radial center highlight
 *  • Smooth scroll-triggered entrance animations
 *
 * Usage:
 *   import VideoHeroSection from "@/components/VideoHeroSection";
 *   <VideoHeroSection />                      // the LOCATOR brand film
 *   <VideoHeroSection poster="https://..." />  // override the still only
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function VideoHeroSection({
  headline = "All your Vehicles, Assets & Staffs on One Software",
  subline = "Take control of your whole operation with LOCATOR GPS Tracking",
  poster = LOCATOR_VIDEO_POSTER,
}) {
  const sectionRef = useRef(null);
  const videoCardRef = useRef(null);
  const startedRef = useRef(false);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  // Scroll-triggered reveal
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Load the player only when its card is meaningfully visible. Muted,
  // inline playback permits autoplay on desktop and mobile browsers.
  useEffect(() => {
    const card = videoCardRef.current;
    if (!card || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
      if (!startedRef.current) {
        startedRef.current = true;
        setMuted(true);
        setPlaying(true);
      }
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // A deliberate click retains the previous sound-on playback behavior.
  const handlePlay = () => {
    startedRef.current = true;
    setMuted(false);
    setPlaying(true);
  };

  return (
    <section ref={sectionRef} className={`vhs ${active ? "vhs--active" : ""}`}>
      {/* Opens the connection to Vimeo's player and thumbnail hosts as soon as
          this section mounts, well before the viewer clicks play — DNS lookup
          and TLS handshake are the slowest part of a cold embed load, and
          doing them ahead of time is what actually shows up as "the video
          starts faster". React hoists these into <head> on its own. */}
      <link rel="preconnect" href="https://player.vimeo.com" />
      <link rel="preconnect" href="https://f.vimeocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://i.vimeocdn.com" />

      {/* ── Subtle radial center glow on background ── */}
      <div className="vhs__bg-glow" />

      {/* ── TEXT HEADER ── */}
      <div className="vhs__header">
        <h2 className="vhs__headline">{headline}</h2>
        <p className="vhs__subline">{subline}</p>
      </div>

      {/* ── MAIN COMPOSITION (decorative blocks + video) ── */}
      <div className="vhs__stage">
        {/* ─ Decorative floating blocks ─ */}
        {/* Top-left large block (partially behind video) */}
        <div className="vhs__block vhs__block--tl" />

        {/* Top-right partial block (clips at right edge) */}
        <div className="vhs__block vhs__block--tr" />

        {/* Bottom-left smaller square block */}
        <div className="vhs__block vhs__block--bl" />

        {/* Bottom-right large block (partially in front of video) */}
        <div className="vhs__block vhs__block--br" />

        {/* ─ VIDEO WRAPPER ─ */}
        <div className="vhs__video-outer">
          {/* Subtle glow behind the video card */}
          <div className="vhs__video-glow" />

          <div ref={videoCardRef} className="vhs__video-card" onClick={playing ? undefined : handlePlay}>
            {/* The still stays mounted for the whole life of the card rather
                than being swapped out on click. Vimeo's iframe paints nothing
                until its player document boots, and with the still removed
                that second or so read as an empty pane with the section's own
                background and floating blocks showing through it. Leaving the
                (already-decoded) image underneath means the frame the viewer
                sees while the embed loads is the film's own — it fades out
                only once the player has loaded over the top of it. */}
            <ViewportNativeImage
              className={`vhs__video vhs__poster${ready ? " vhs__poster--hidden" : ""}`}
              src={poster}
              alt=""
            />

            {playing && (
              <iframe
                className="vhs__video vhs__frame"
                src={`${locatorVideoEmbed()}&muted=${muted ? 1 : 0}&playsinline=1`}
                title={LOCATOR_VIDEO_TITLE}
                allow={LOCATOR_VIDEO_ALLOW}
                allowFullScreen
                onLoad={() => setReady(true)}
                style={{ border: 0 }}
              />
            )}

            {/* Overlay and button belong to the poster state only. Once the
                embed is mounted they would sit over Vimeo's own controls and
                swallow clicks meant for it, so both leave the tree entirely
                rather than being hidden with a class. The pause icon went with
                them — transport is Vimeo's job now. */}
            {!playing && (
              <>
                {/* Dark cinematic overlay */}
                <div className="vhs__overlay" />

                {/* Frosted-glass play button */}
                <button
                  className="vhs__play-btn"
                  aria-label={`Play video: ${LOCATOR_VIDEO_TITLE}`}
                  onClick={handlePlay}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 3.5L16.5 10 5 16.5V3.5Z" fill="white" />
                  </svg>
                </button>
              </>
            )}

          </div>
        </div>

        {/* Bottom-right large block overlaid IN FRONT of video (3D layer) */}
        <div className="vhs__block vhs__block--br-front" />
      </div>

      {/* ── STYLES ── */}
      <style jsx>{`
        /* ── Variables ─────────────────────────────────────────────── */
        .vhs {
          --bg: #eef0f4;
          --block-color: rgba(210, 220, 240, 0.72);
          --block-border: rgba(200, 212, 235, 0.5);
          --block-shadow: rgba(180, 200, 230, 0.3);
          --headline: #1360ee;
          --subline: #6b7a8d;
          --video-radius: 14px;
          --enter-dur: 0.95s;
          --enter-ease: cubic-bezier(0.16, 1, 0.3, 1);

          position: relative;
          width: 100%;
          background: linear-gradient(
            160deg,
            #edf1f7 0%,
            #f2f4f8 40%,
            #eef0f4 100%
          );
          padding: var(--s-section-y) 0;
          overflow: hidden;
          font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        /* ── Background radial highlight (center luminosity) ───────── */
        .vhs__bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              ellipse 70% 55% at 50% 60%,
              rgba(255, 255, 255, 0.55) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 30% at 52% 30%,
              rgba(200, 220, 245, 0.2) 0%,
              transparent 65%
            );
          pointer-events: none;
          z-index: 0;
        }

        /* ── Header ─────────────────────────────────────────────────── */
        .vhs__header {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 clamp(20px, 5vw, 60px);
          margin-bottom: clamp(28px, 4vw, 52px);
          opacity: 0;
          transform: translateY(22px);
          transition: opacity var(--enter-dur) var(--enter-ease),
            transform var(--enter-dur) var(--enter-ease);
        }
        .vhs--active .vhs__header {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.05s;
        }

        .vhs__headline {
          font-size: var(--t-display);
          font-weight: 700;
          color: var(--headline);
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0 0 clamp(10px, 1.5vw, 16px);
        }

        .vhs__subline {
          font-size: var(--t-lead);
          color: var(--subline);
          font-weight: 400;
          line-height: 1.6;
          max-width: 520px;
          margin: 0 auto;
        }

        /* ── Stage (positioning context for all blocks) ─────────────── */
        .vhs__stage {
          position: relative;
          z-index: 5;
          width: 100%;
          /* Was a flat 1100px — see the --w-* token block in globals.css. Every
             decorative block below is positioned against THIS box, so the video
             card's own cap grows with it (--w-video) rather than staying at 800px
             and letting the blocks drift off the edges of the video they overlap. */
          max-width: var(--w-narrow);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        /* ── Floating decorative blocks ─────────────────────────────── */
        .vhs__block {
          position: absolute;
          background: var(--block-color);
          border: 1px solid var(--block-border);
          border-radius: 10px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          opacity: 0;
          transition: opacity 1s var(--enter-ease),
            transform 1s var(--enter-ease);
        }

        /* Inner soft light highlight on blocks */
        .vhs__block::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.55) 0%,
            rgba(255, 255, 255, 0.08) 60%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* Subtle inner glow on block edges */
        .vhs__block::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(180, 200, 230, 0.2);
          pointer-events: none;
        }

        .vhs--active .vhs__block {
          opacity: 1;
        }

        /* Top-left: large, partially behind video */
        .vhs__block--tl {
          width: clamp(200px, 28vw, 370px);
          height: clamp(140px, 19vw, 252px);
          top: clamp(-20px, -2vw, -28px);
          left: clamp(-10px, 0vw, 2%);
          z-index: 1;
          transform: translateX(-18px) translateY(14px);
          transition-delay: 0.15s;
          box-shadow: 0 8px 32px var(--block-shadow),
            0 2px 8px rgba(160, 185, 220, 0.2);
        }
        .vhs--active .vhs__block--tl {
          transform: translateX(0) translateY(0);
        }

        /* Top-right: clips at right edge */
        .vhs__block--tr {
          width: clamp(120px, 16vw, 210px);
          height: clamp(90px, 12vw, 155px);
          top: clamp(-18px, -1.5vw, -22px);
          right: clamp(-60px, -5vw, -40px);
          z-index: 1;
          border-radius: 10px;
          transform: translateX(18px) translateY(14px);
          transition-delay: 0.25s;
          box-shadow: 0 8px 32px var(--block-shadow),
            0 2px 8px rgba(160, 185, 220, 0.2);
        }
        .vhs--active .vhs__block--tr {
          transform: translateX(0) translateY(0);
        }

        /* Bottom-left: smaller square */
        .vhs__block--bl {
          width: clamp(100px, 13vw, 175px);
          height: clamp(90px, 12vw, 160px);
          bottom: clamp(-18px, -2vw, -24px);
          left: clamp(-10px, 0vw, 2%);
          z-index: 1;
          transform: translateX(-18px) translateY(-14px);
          transition-delay: 0.2s;
          box-shadow: 0 8px 32px var(--block-shadow),
            0 2px 8px rgba(160, 185, 220, 0.2);
        }
        .vhs--active .vhs__block--bl {
          transform: translateX(0) translateY(0);
        }

        /* Bottom-right large (BEHIND video, z-index:1) */
        .vhs__block--br {
          width: clamp(180px, 24vw, 310px);
          height: clamp(160px, 21vw, 278px);
          bottom: clamp(-30px, -3vw, -42px);
          right: clamp(-20px, -1vw, 0%);
          z-index: 1;
          transform: translateX(18px) translateY(-14px);
          transition-delay: 0.3s;
          box-shadow: 0 8px 32px var(--block-shadow),
            0 2px 8px rgba(160, 185, 220, 0.2);
        }
        .vhs--active .vhs__block--br {
          transform: translateX(0) translateY(0);
        }

        /* Bottom-right block (BEHIND video, z-index:1) */
        .vhs__block--br-front {
          width: clamp(170px, 23vw, 295px);
          height: clamp(150px, 20vw, 264px);
          bottom: clamp(-28px, -2.8vw, -40px);
          right: clamp(-18px, -0.8vw, 2px);
          z-index: 1;
          transform: translateX(18px) translateY(-14px);
          transition-delay: 0.35s;
          /* slightly different shade — top-right is brighter (catches light) */
          background: rgba(215, 224, 243, 0.5);
          box-shadow: 0 12px 40px rgba(160, 185, 220, 0.35),
            0 2px 8px rgba(160, 185, 220, 0.25);
        }
        .vhs--active .vhs__block--br-front {
          transform: translateX(0) translateY(0);
        }

        /* ── Video wrapper (centers it above the blocks) ─────────────── */
        .vhs__video-outer {
          position: relative;
          z-index: 10;
          width: 100%;
          /* The 90% is what keeps the blocks peeking out on either side and is
             unchanged; only the pixel cap now scales — see --w-video. */
          max-width: min(90%, var(--w-video));
          margin: 0 auto;
        }

        /* Soft ambient glow behind the video card */
        .vhs__video-glow {
          position: absolute;
          inset: -24px -18px;
          border-radius: calc(var(--video-radius) + 20px);
          background: radial-gradient(
            ellipse 80% 70% at 50% 50%,
            rgba(180, 210, 240, 0.28) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: -1;
          filter: blur(8px);
        }

        /* ── Video card ─────────────────────────────────────────────── */
        .vhs__video-card {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: var(--video-radius);
          overflow: hidden;
          /* Last line of defence behind the frame: the player's own letterbox
             colour, so no part of the light section background can show
             through the embed at any point during its load. */
          background: #0b1220;
          cursor: pointer;
          opacity: 0;
          transform: translateY(32px) scale(0.97);
          transition: opacity var(--enter-dur) var(--enter-ease),
            transform var(--enter-dur) var(--enter-ease),
            box-shadow 0.4s ease;
          box-shadow: 0 32px 80px rgba(30, 60, 100, 0.22),
            0 8px 24px rgba(30, 60, 100, 0.12),
            0 1px 0 rgba(255, 255, 255, 0.6) inset;
        }
        .vhs--active .vhs__video-card {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 0.1s;
        }
        .vhs__video-card:hover {
          box-shadow: 0 40px 90px rgba(30, 60, 100, 0.28),
            0 10px 28px rgba(30, 60, 100, 0.16),
            0 1px 0 rgba(255, 255, 255, 0.6) inset;
        }

        /* Top edge highlight on video card */
        .vhs__video-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.45);
          z-index: 10;
          pointer-events: none;
        }

        .vhs__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: var(--video-radius);
        }

        /* The still is never the click target — the card itself carries the
           handler — so it stays out of the way of the player's controls even
           while it is still on screen. The delay on the fade covers the gap
           between the iframe's load event and Vimeo painting its first frame. */
        .vhs__poster {
          z-index: 1;
          opacity: 1;
          pointer-events: none;
          transition: opacity 0.45s ease 0.25s;
        }
        .vhs__poster--hidden {
          opacity: 0;
        }

        /* The embed, stacked over the still it replaces. */
        .vhs__frame {
          z-index: 2;
        }

        /* ── Cinematic dark overlay ──────────────────────────────────── */
        .vhs__overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 20, 40, 0.42);
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.5s ease;
          border-radius: var(--video-radius);
        }

        /* ── Play / Pause button ─────────────────────────────────────── */
        .vhs__play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          z-index: 5;
          width: var(--i-play);
          height: var(--i-play);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);
          box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.45),
            0 8px 32px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            background 0.3s ease, box-shadow 0.3s ease;
        }
        .vhs__play-btn:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: rgba(255, 255, 255, 0.32);
          box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.6),
            0 12px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }
        .vhs__play-btn:active {
          transform: translate(-50%, -50%) scale(0.96);
        }

        /* ── Floating micro-animation on blocks (subtle drift) ──────── */
        .vhs--active .vhs__block--tl {
          animation: blockDrift1 8s ease-in-out 1.2s infinite;
        }
        .vhs--active .vhs__block--bl {
          animation: blockDrift2 9s ease-in-out 1.5s infinite;
        }
        .vhs--active .vhs__block--tr {
          animation: blockDrift3 7s ease-in-out 1.8s infinite;
        }
        .vhs--active .vhs__block--br {
          animation: blockDrift1 10s ease-in-out 1s infinite;
        }
        .vhs--active .vhs__block--br-front {
          animation: blockDrift2 11s ease-in-out 2s infinite;
        }

        @keyframes blockDrift1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-5px) translateX(3px);
          }
          66% {
            transform: translateY(3px) translateX(-2px);
          }
        }

        @keyframes blockDrift2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          40% {
            transform: translateY(5px) translateX(-3px);
          }
          70% {
            transform: translateY(-3px) translateX(2px);
          }
        }

        @keyframes blockDrift3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-4px) translateX(-4px);
          }
        }

        /* ── Responsive ──────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .vhs__block--tr {
            right: -30px;
          }
        }

        @media (max-width: 640px) {
          .vhs__block--tl {
            width: 45vw;
            height: 28vw;
          }
          .vhs__block--tr {
            width: 25vw;
            height: 18vw;
            right: -20px;
          }
          .vhs__block--bl {
            width: 22vw;
            height: 20vw;
          }
          .vhs__block--br {
            width: 38vw;
            height: 32vw;
          }
          .vhs__block--br-front {
            width: 36vw;
            height: 30vw;
          }
        }

        @media (max-width: 400px) {
          .vhs__block--tr {
            display: none;
          }
          .vhs__block--tl {
            width: 48vw;
            height: 30vw;
          }
        }

        /* ── Reduced motion ──────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .vhs__header,
          .vhs__video-card,
          .vhs__block {
            transition: none !important;
            animation: none !important;
          }
          .vhs__header,
          .vhs__video-card,
          .vhs__block {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
