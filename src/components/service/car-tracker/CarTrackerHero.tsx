'use client'
import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function CarTrackerHero() {
  return (
    <>
      <style>{`
        @keyframes ctHeroRise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes ctRing {
          0%,100% { opacity: .12; transform: scale(1) rotate(0deg); }
          50%      { opacity: .2;  transform: scale(1.05) rotate(180deg); }
        }
        .ct-hero { position: relative; overflow: hidden; isolation: isolate; background: linear-gradient(135deg, #1a6bf0 0%, #0d4fd4 100%); }
        .ct-hero-grid {
          position: relative; z-index: 1;
          max-width: var(--w-1200); margin: 0 auto;
          padding: clamp(28px,5vh,56px) 28px clamp(88px,11vh,120px);
          display: grid; grid-template-columns: 1.1fr 1fr;
          gap: clamp(28px,5vw,56px); align-items: center;
        }
        @media (max-width: 900px) {
          .ct-hero-grid { grid-template-columns: 1fr; text-align: center; }
          .ct-hero-copy-align { align-items: center !important; }
          .ct-hero-btns { justify-content: center !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .ct-hero-copy { animation: ctHeroRise .85s ${EASE} .05s both; }
          .ct-hero-viz  { animation: ctHeroRise .9s ${EASE} .15s both; }
          .ct-ring { animation: ctRing 12s linear infinite; }
        }
        .ct-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,.22); pointer-events: none; }
        .ct-btn {
          font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
          padding: 13px 24px; border-radius: 999px; border: none;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 8px;
          white-space: nowrap; text-decoration: none;
        }
        .ct-btn-primary { background: #fff; color: #0d4fd4; box-shadow: 0 14px 30px rgba(9,25,60,.28); }
        .ct-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(9,25,60,.34); }
        .ct-btn-ghost { background: rgba(255,255,255,.1); color: #fff; border: 1.5px solid rgba(255,255,255,.4); }
        .ct-btn-ghost:hover { background: rgba(255,255,255,.18); transform: translateY(-2px); }
        .ct-icon-chip { width: 20px; height: 20px; border-radius: 6px; background: rgba(13,79,212,.1); display: grid; place-items: center; flex-shrink: 0; }
      `}</style>

      <section className="ct-hero">
        {/* Decorative rings, matching SoftwareCTA's dark-panel language but for a blue field */}
        <div className="ct-ring" style={{ width: '520px', height: '520px', left: '-180px', top: '-200px' }} />
        <div className="ct-ring" style={{ width: '340px', height: '340px', left: '-90px', top: '-90px', animationDuration: '9s', animationDelay: '-4s' }} />
        <div className="ct-ring" style={{ width: '460px', height: '460px', right: '-140px', bottom: '-160px', animationDelay: '-6s' }} />

        <SoftwareNavbar />

        <div className="ct-hero-grid">
          {/* Copy */}
          <div className="ct-hero-copy ct-hero-copy-align" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h1 style={{ margin: 0, fontSize: 'max(clamp(28px,4vw,46px), min(3.194vw, 66.7px))', fontWeight: 400, lineHeight: 1.22, letterSpacing: '-.015em', color: 'rgba(255,255,255,.92)', maxWidth: '15ch' }}>
              <strong style={{ fontWeight: 800, color: '#fff' }}>Car Tracker App</strong> for Live Fleet Tracking and Alerts
            </h1>

            <p style={{ margin: '18px 0 0', fontSize: 'max(clamp(14px,1.35vw,16.5px), min(1.146vw, 23.93px))', lineHeight: 1.65, color: 'rgba(255,255,255,.78)', maxWidth: '42ch' }}>
              You are guaranteed optimum performance from your vehicles with our car tracker — live location,
              driver behaviour, and fleet health, all in one app.
            </p>

            <div className="ct-hero-btns" style={{ display: 'flex', gap: '14px', marginTop: '30px', flexWrap: 'wrap' }}>
              <Link href="/get-a-quote" className="ct-btn ct-btn-primary">
                <span className="ct-icon-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d4fd4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M8 11l2.5 2.5L16 8" /></svg>
                </span>
                Get a free quote
              </Link>
              <Link href="/get-a-free-demo" className="ct-btn ct-btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21" /></svg>
                Get a free demo
              </Link>
            </div>
          </div>

          {/* Visual — real app screens on an amber ambient glow */}
          <div className="ct-hero-viz" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Image
              src="/services/car-tracker/hero.png"
              alt="LOCATOR Car Tracker app — trips view with route playback and live view with vehicle status"
              width={1200}
              height={1215}
              sizes="(max-width: 900px) 88vw, 520px"
              style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px', height: 'auto', display: 'block', filter: 'drop-shadow(0 30px 50px rgba(9,25,60,.4))' }}
              priority
            />
          </div>
        </div>

        {/* Wave divider into the section below — blue dips to a shallow point at centre */}
        <svg aria-hidden="true" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: '-1px', width: '100%', height: 'clamp(40px,6vw,84px)', display: 'block' }}>
          <path d="M0,0 L1440,0 L1440,38 C1080,86 1080,86 720,98 C360,86 360,86 0,38 Z" fill="#ffffff" />
        </svg>
      </section>
    </>
  )
}
