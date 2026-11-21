'use client'
import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

function StoreBadge({ kind }: { kind: 'ios' | 'android' }) {
  const isIos = kind === 'ios'
  return (
    <div className="gts-store-btn" style={{ background: isIos ? '#1360ee' : '#0f1117' }}>
      <span style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,.16)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        {isIos ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 12.5c-.03-2.9 2.37-4.3 2.48-4.37-1.35-1.97-3.46-2.24-4.21-2.27-1.79-.18-3.5 1.05-4.41 1.05-.91 0-2.31-1.03-3.8-1-1.95.03-3.76 1.14-4.76 2.89-2.03 3.53-.52 8.76 1.46 11.63.96 1.4 2.11 2.98 3.62 2.92 1.45-.06 2-.93 3.75-.93 1.75 0 2.24.93 3.77.9 1.56-.03 2.55-1.42 3.51-2.83 1.1-1.62 1.56-3.2 1.58-3.28-.03-.02-3.02-1.16-3.05-4.6zM14.6 4.1c.8-.98 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.86-1.4 2.24-1.22 3.55 1.29.1 2.6-.65 3.41-1.63z"/></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M17.6 9.48l1.84-3.18a.5.5 0 0 0-.86-.5l-1.86 3.22a11 11 0 0 0-8.44 0L6.42 5.8a.5.5 0 0 0-.86.5l1.84 3.18A7.5 7.5 0 0 0 3.5 16h17a7.5 7.5 0 0 0-3.9-6.52zM8 13.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
        )}
      </span>
      <span>
        <span style={{ display: 'block', fontSize: 'var(--f-9-5)', color: 'rgba(255,255,255,.72)', lineHeight: 1.2 }}>{isIos ? 'Available on the' : 'Android app on'}</span>
        <span style={{ display: 'block', fontSize: 'var(--f-13-5)', fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>{isIos ? 'App Store' : 'Google Play'}</span>
      </span>
    </div>
  )
}

export default function GpsTrackingHero() {
  return (
    <>
      <style>{`
        @keyframes gtsRise { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        /* The artwork is already fanned at an angle, so this just floats it — no extra tilt */
        @keyframes gtsDrift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .gts-hero { position: relative; overflow: hidden; background: #ffffff; }
        .gts-hero-grid {
          position: relative; z-index: 1; max-width: var(--w-1200); margin: 0 auto;
          padding: clamp(32px,6vh,64px) 28px clamp(64px,9vh,96px);
          display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(28px,5vw,56px); align-items: start;
        }
        @media (max-width: 900px) {
          .gts-hero-grid { grid-template-columns: 1fr; text-align: center; }
          .gts-copy-align { align-items: center !important; }
          .gts-store-row { justify-content: center !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .gts-copy { animation: gtsRise .85s ${EASE} .05s both; }
          .gts-viz  { animation: gtsRise .9s ${EASE} .15s both; }
          .gts-viz-inner { animation: gtsDrift 6s ease-in-out infinite; }
        }
        .gts-store-btn {
          display: inline-flex; align-items: center; gap: 10px; padding: 9px 18px 9px 9px;
          border-radius: 12px; cursor: pointer; transition: transform .2s ${EASE}, box-shadow .2s ${EASE};
          box-shadow: 0 10px 24px rgba(15,23,42,.16);
        }
        .gts-store-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(15,23,42,.22); }
      `}</style>

      <section className="gts-hero">
        {/* Soft ambient corner glow */}
        <div aria-hidden="true" style={{ position: 'absolute', width: '520px', height: '520px', top: '-220px', right: '-140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(19,96,238,.10), transparent 70%)', pointerEvents: 'none' }} />

        <SoftwareNavbar />

        <div className="gts-hero-grid">
          {/* Copy */}
          <div className="gts-copy gts-copy-align" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h1 style={{ margin: 0, fontSize: 'max(clamp(24px, calc(1.5vw + 15px), 34px), min(2.361vw, 49.3px))', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-.02em', color: '#1d1d1f', maxWidth: '480px' }}>
              <span style={{ color: '#1360ee' }}>GPS Tracking System</span> for Vehicles in the UAE
            </h1>
            <p style={{ margin: '14px 0 0', fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.7, color: '#6e6e73', maxWidth: '42ch' }}>
              Our GPS tracker software makes your life easier when it comes to managing your vehicles and team &mdash;
              live, accurate, and always within reach.
            </p>

            <div className="gts-store-row" style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
              <StoreBadge kind="ios" />
              <StoreBadge kind="android" />
            </div>
          </div>

          {/* Visual — real app screens, gently tilted */}
          <div className="gts-viz" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="gts-viz-inner" style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Image
                src="/services/gps-tracking-system/hero.png"
                alt="LOCATOR GPS tracking app screens — live map, dashboard, trip summaries, detailed reports, and login"
                width={822}
                height={791}
                sizes="(max-width: 900px) 88vw, 480px"
                style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 34px 54px rgba(19,96,238,.22))' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
