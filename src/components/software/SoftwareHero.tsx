'use client'
// Pinned hero: the mobile device fan shows first, then cross-fades in place to
// the web dashboard view as the user scrolls (smooth, scroll-driven) — mirroring
// the Locator-websites hero. Fully responsive; mobile shows a single device each.
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import HeroNotificationPhone from '@/components/software/HeroNotificationPhone'

// Left to right across the fan. The centre slot is the one live screen — see
// HeroNotificationPhone for why that one is markup and the other four are not.
type Phone =
  | { kind: 'image'; id: string; src: string; alt: string; cls: string }
  | { kind: 'notifications'; id: string; cls: string }

const PHONES: Phone[] = [
  { kind: 'image', id: 'report',    src: '/software/hero-phone/mobile-graphical-report.webp', alt: 'Locator app — graphical report', cls: 'sw-ph-2' },
  { kind: 'image', id: 'notifs',    src: '/software/hero-phone/mobile-notifications.png',     alt: 'Locator app — notifications',    cls: 'sw-ph-1' },
  { kind: 'notifications', id: 'notifications',                                                                       cls: 'sw-ph-0' },
  { kind: 'image', id: 'summary',   src: '/software/hero-phone/mobile-summary.webp',          alt: 'Locator app — vehicle summary',  cls: 'sw-ph-1 sw-ph-r' },
  { kind: 'image', id: 'map',       src: '/software/hero-phone/mobile-map-view.webp',         alt: 'Locator app — live map view',    cls: 'sw-ph-2 sw-ph-r' },
]

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const smoothstep = (t: number) => t * t * (3 - 2 * t)

export default function SoftwareHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const webRef = useRef<HTMLDivElement>(null)
  const [animateWeb, setAnimateWeb] = useState(false)

  // On a hard refresh the browser restores the previous scroll position before
  // React mounts, which would drop the hero straight into its mid-transition
  // (desktop-visible) state. Force it back to the top so every load/refresh
  // always starts from the initial mobile-fan state, matching first paint.
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !('history' in window)) return
    const prevRestoration = window.history.scrollRestoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = prevRestoration || 'auto'
      }
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const mob = mobileRef.current
    const web = webRef.current
    if (!wrap || !mob || !web) return

    let raf = 0
    const apply = () => {
      raf = 0
      const dist = wrap.offsetHeight - window.innerHeight
      const scrolled = clamp(-wrap.getBoundingClientRect().top, 0, dist || 1)
      const p = dist > 0 ? scrolled / dist : 0

      // Sequential, eased hand-off: the mobile fan fades/lifts out over its own
      // window and the web fan fades/rises in over a later window, with only a
      // short overlap between them (instead of both spanning the same 40% of
      // scroll) so they read as one clean swap rather than two decks mixing.
      const mobileT = smoothstep(clamp((p - 0.15) / 0.28))
      const webT = smoothstep(clamp((p - 0.34) / 0.28))

      const mOp = 1 - mobileT
      mob.style.opacity = String(mOp)
      mob.style.transform = `translateY(${-mobileT * 46}px) scale(${1 - mobileT * 0.09})`
      mob.style.pointerEvents = mOp < 0.5 ? 'none' : 'auto'

      const wOp = webT
      web.style.opacity = String(wOp)
      web.style.transform = `translateY(${(1 - webT) * 56}px) scale(${0.92 + webT * 0.08})`
      web.style.pointerEvents = wOp > 0.5 ? 'auto' : 'none'

      // Trigger animation when web layer starts fading in
      if (wOp > 0.1 && !animateWeb) {
        setAnimateWeb(true)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [animateWeb])

  return (
    <>
      <style>{`
        @keyframes heroRise { from { opacity:0; transform:translateY(36px); } to { opacity:1; transform:none; } }
        @keyframes swGlow { 0%,100% { opacity:.55; } 50% { opacity:.9; } }
        
        /* Peacock feather animation for mobile phones */
        @keyframes peacockCenter {
          0% { opacity: 0; transform: translateY(30px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes peacockLeft1 {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.9); }
          100% { opacity: 1; transform: rotate(-10deg) scale(.90); }
        }
        @keyframes peacockLeft2 {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.78); }
          100% { opacity: 1; transform: rotate(-18deg) scale(.78); }
        }
        @keyframes peacockRight1 {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.9); }
          100% { opacity: 1; transform: rotate(10deg) scale(.90); }
        }
        @keyframes peacockRight2 {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.78); }
          100% { opacity: 1; transform: rotate(18deg) scale(.78); }
        }
        
        @keyframes browserFadeInCenter {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes browserFadeInL1 {
          0% { opacity: 0; transform: translateY(56px) rotate(-4deg); }
          100% { opacity: 1; transform: translateY(6%) rotate(-4deg); }
        }
        @keyframes browserFadeInL2 {
          0% { opacity: 0; transform: translateY(60px) rotate(-8deg); }
          100% { opacity: 1; transform: translateY(10%) rotate(-8deg); }
        }
        @keyframes browserFadeInR1 {
          0% { opacity: 0; transform: translateY(56px) rotate(4deg); }
          100% { opacity: 1; transform: translateY(6%) rotate(4deg); }
        }
        @keyframes browserFadeInR2 {
          0% { opacity: 0; transform: translateY(60px) rotate(8deg); }
          100% { opacity: 1; transform: translateY(10%) rotate(8deg); }
        }

        /* Tall wrapper provides the scroll distance for the transition */
        .sw-pin-wrap { position: relative; height: 185vh; background: #ffffff; }

        .sw-pin {
          position: sticky; top: 0;
          height: 100svh;
          display: flex; flex-direction: column;
          overflow: hidden; isolation: isolate;
          background: #ffffff;
        }

        .sw-hero-body {
          flex: 1 1 auto; min-height: 0;
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(10px, 1.6vh, 24px);
          padding: clamp(10px, 2vh, 30px) 24px clamp(16px, 3vh, 40px);
        }
        .sw-copy { text-align: center; max-width: var(--w-1120); width: 100%; }
        @media (prefers-reduced-motion: no-preference) {
          .sw-copy { animation: heroRise .9s cubic-bezier(.22,.61,.36,1) .05s both; }
        }

        .sw-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 12px 24px; border-radius: 999px; border: none;
          transition: .18s cubic-bezier(.22,.61,.36,1);
          display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; text-decoration: none;
        }
        .sw-btn-primary { background: #1360ee; color: #fff; }
        .sw-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); }
        .sw-btn-ghost { background: transparent; color: #1360ee; padding: 12px 6px; }
        .sw-btn-ghost:hover { color: #0d4fd4; transform: translateY(-1px); }

        /* ── Stage holds both cross-fading layers ── */
        .sw-stage {
          position: relative; flex: 1 1 auto; min-height: 0;
          width: 100%; max-width: var(--w-1240); margin: 0 auto;
        }
        .sw-glow {
          position: absolute; left: 50%; bottom: 6%; width: min(74%, 840px); height: 60%;
          transform: translateX(-50%);
          background: radial-gradient(60% 60% at 50% 60%, rgba(19,96,238,.18), transparent 72%);
          filter: blur(26px); z-index: 0;
        }
        @media (prefers-reduced-motion: no-preference) { .sw-glow { animation: swGlow 7s ease-in-out infinite; } }

        .sw-layer {
          position: absolute; inset: 0; z-index: 1;
          display: flex; justify-content: center;
          will-change: opacity, transform;
        }
        /* no per-layer padding → max-height:100% caps exactly to the stage,
           so a device can never grow up over the copy */
        .sw-layer-mobile { align-items: flex-end; }
        /* Sits over the mobile fan and is faded, not removed, so at opacity 0 it
           would still be the top hit-target and swallow the pointer before it
           reached the centre phone's notification cards. Nothing in this layer
           is interactive, so it never needs the pointer at all. */
        .sw-layer-web { align-items: flex-end; pointer-events: none; }

        /* ── Mobile device fan ── */
        .sw-phone {
          position: relative; height: clamp(260px, 50vh, 540px);
          max-height: 100%;
          aspect-ratio: 466 / 1000; width: auto; flex: 0 0 auto;
          border-radius: 14% / 6.6%;
          filter: drop-shadow(0 26px 42px rgba(20,40,90,.22));
          transform-origin: bottom center;
        }
        .sw-phone img { object-fit: contain; }
        
        /* Peacock feather animation - premium feel */
        @media (prefers-reduced-motion: no-preference) {
          .sw-phone { 
            animation-duration: 1.2s;
            animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            animation-fill-mode: both;
          }
          .sw-ph-0 { 
            animation-name: peacockCenter;
            animation-delay: 0.3s;
          }
          .sw-ph-1 { 
            animation-name: peacockLeft1;
            animation-delay: 0.65s;
          }
          .sw-ph-2 { 
            animation-name: peacockLeft2;
            animation-delay: 0.8s;
          }
          .sw-ph-1.sw-ph-r { 
            animation-name: peacockRight1;
            animation-delay: 0.7s;
          }
          .sw-ph-2.sw-ph-r { 
            animation-name: peacockRight2;
            animation-delay: 0.85s;
          }
        }
        
        /* Final positions - ORIGINAL LAYOUT RESTORED */
        .sw-ph-0 { z-index: 5; margin: 0 -1%; }
        .sw-ph-1 { z-index: 4; transform: rotate(-10deg) scale(.90); margin: 0 -1%; }
        .sw-ph-2 { z-index: 3; transform: rotate(-18deg) scale(.78); margin: 0 -1%; }
        .sw-ph-1.sw-ph-r { transform: rotate(10deg)  scale(.90); }
        .sw-ph-2.sw-ph-r { transform: rotate(18deg) scale(.78); }

        /* ── Web browser fan (5 images) ── */
        .sw-web-fan { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; }
        .sw-wb {
          position: relative; aspect-ratio: 1092 / 1000; flex: 0 0 auto;
          border-radius: 12px; overflow: hidden; background: #fff;
          border: 1px solid #e7ebf3;
          /* No drop shadow: the cards overlap in a fan, so a large downward shadow from
             each one stacked into a single grey smudge pooling beneath the whole group.
             The hairline border alone separates the cards. */
          will-change: opacity, transform;
        }
        .sw-wb img { object-fit: cover; }
        
        /* Staggered entrance animation - ONLY when .animate class is added */
        @media (prefers-reduced-motion: no-preference) {
          .sw-web-fan.animate .sw-wb-c { animation: browserFadeInCenter 1.4s ease-out 0.1s both; }
          .sw-web-fan.animate .sw-wb-l1 { animation: browserFadeInL1 1.4s ease-out 0.5s both; }
          .sw-web-fan.animate .sw-wb-r1 { animation: browserFadeInR1 1.4s ease-out 0.7s both; }
          .sw-web-fan.animate .sw-wb-l2 { animation: browserFadeInL2 1.4s ease-out 0.9s both; }
          .sw-web-fan.animate .sw-wb-r2 { animation: browserFadeInR2 1.4s ease-out 1.1s both; }
        }
        
        /* Center browser (largest, z-index 5) */
        .sw-wb-c { height: clamp(240px, 48vh, 520px); max-height: 100%; width: auto; z-index: 5; }
        /* Left browsers */
        .sw-wb-l1 { height: clamp(200px, 40vh, 430px); max-height: 88%; width: auto; z-index: 4; margin-right: -13%; transform: translateY(6%) rotate(-4deg); }
        .sw-wb-l2 { height: clamp(180px, 36vh, 390px); max-height: 82%; width: auto; z-index: 3; margin-right: -13%; transform: translateY(10%) rotate(-8deg); }
        /* Right browsers */
        .sw-wb-r1 { height: clamp(200px, 40vh, 430px); max-height: 88%; width: auto; z-index: 4; margin-left: -13%;  transform: translateY(6%) rotate(4deg); }
        .sw-wb-r2 { height: clamp(180px, 36vh, 390px); max-height: 82%; width: auto; z-index: 3; margin-left: -13%;  transform: translateY(10%) rotate(8deg); }

        @media (max-width: 820px) {
          .sw-ph-2 { display: none; }
          .sw-ph-1 { transform: rotate(-11deg) scale(.88); margin: 0 -2%; }
          .sw-ph-1.sw-ph-r { transform: rotate(11deg) scale(.88); }
          .sw-wb-l2, .sw-wb-r2 { display: none; }
          .sw-wb-l1 { margin-right: -10%; transform: translateY(4%) rotate(-5deg); }
          .sw-wb-r1 { margin-left: -10%; transform: translateY(4%) rotate(5deg); }
          .sw-wb-c { height: auto; width: min(92vw, 540px); }
        }
        @media (max-width: 520px) {
          .sw-ph-1, .sw-ph-2 { display: none; }
          .sw-ph-0 { margin: 0; }
          .sw-wb-l1, .sw-wb-l2, .sw-wb-r1, .sw-wb-r2 { display: none; }
        }
      `}</style>

      <div className="sw-pin-wrap" ref={wrapRef}>
        <div className="sw-pin">
          <SoftwareNavbar />

          <div className="sw-hero-body">
            <div className="sw-copy">
              <p style={{ display: 'block', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: '#1360ee', marginBottom: 'clamp(8px,1.4vh,14px)' }}>
                Locator Fleet Telematics
              </p>
              <h1 style={{ fontSize: 'max(clamp(21px,2.5vw,28px), min(1.944vw, 40.6px))', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-.015em', color: '#1d1d1f', maxWidth: '40ch', margin: '0 auto' }}>
                One Platform for Complete Fleet Visibility <span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px', marginLeft: '8px', verticalAlign: 'middle' }} />
              </h1>
              <p style={{ maxWidth: '560px', margin: 'clamp(8px,1.4vh,14px) auto 0', fontSize: 'max(clamp(13px, 1.35vw, 16px), min(1.111vw, 23.2px))', lineHeight: 1.5, color: '#3a3a3c' }}>
                GPS tracking, fleet management, driver monitoring, tasks, expenses, inspections, maintenance and AI dashcams for your entire fleet, all in one platform across the UAE.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: 'clamp(14px, 2.2vh, 24px)', flexWrap: 'wrap' }}>
                <Link href="/get-a-quote" className="sw-btn sw-btn-primary">Get a quote</Link>
                <Link href="/get-a-free-demo" className="sw-btn sw-btn-ghost">Get a demo →</Link>
              </div>
              <p style={{ marginTop: 'clamp(8px,1.4vh,14px)' }}>
                <Link href="#dashcam" style={{ color: '#1360ee', fontWeight: 700, fontSize: 'var(--f-15)', textDecoration: 'none' }}>
                  Watch how it works ›
                </Link>
              </p>
            </div>

            <div className="sw-stage">
              <div className="sw-glow" aria-hidden="true" />

              {/* Layer 1 — mobile fan (default) */}
              <div className="sw-layer sw-layer-mobile" ref={mobileRef}>
                {PHONES.map((p) => (
                  <div key={p.id} className={`sw-phone ${p.cls}`}>
                    {p.kind === 'notifications'
                      ? <HeroNotificationPhone />
                      : <Image src={p.src} alt={p.alt} fill sizes="(max-width: 520px) 72vw, (max-width: 820px) 42vw, 24vw" priority loading="eager" />}
                  </div>
                ))}
              </div>

              {/* Layer 2 — web browser fan (5 images revealed on scroll) */}
              <div className="sw-layer sw-layer-web" ref={webRef} style={{ opacity: 0 }}>
                <div className={`sw-web-fan ${animateWeb ? 'animate' : ''}`}>
                  <div className="sw-wb sw-wb-l2">
                    <Image src="/software/desktop/software-page-animation-5.png" alt="Locator web — fleet overview" fill sizes="(max-width: 820px) 0px, 24vw" priority loading="eager" />
                  </div>
                  <div className="sw-wb sw-wb-l1">
                    <Image src="/software/desktop/software-page-animation-4.png" alt="Locator web — route playback" fill sizes="(max-width: 820px) 32vw, 28vw" priority loading="eager" />
                  </div>
                  <div className="sw-wb sw-wb-c">
                    <Image src="/software/desktop/software-page-animation-1.png" alt="Locator web — live fleet map with alerts" fill sizes="(max-width: 820px) 92vw, 44vw" priority loading="eager" />
                  </div>
                  <div className="sw-wb sw-wb-r1">
                    <Image src="/software/desktop/software-page-animation-2.png" alt="Locator web — graphical reports" fill sizes="(max-width: 820px) 32vw, 28vw" priority loading="eager" />
                  </div>
                  <div className="sw-wb sw-wb-r2">
                    <Image src="/software/desktop/software-page-animation-3.png" alt="Locator web — live map" fill sizes="(max-width: 820px) 0px, 24vw" priority loading="eager" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
