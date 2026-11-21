'use client'
import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function CarGpsHero() {
  return (
    <>
      <style>{`
        @keyframes cghRise { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        @keyframes cghFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .cgh-hero { position: relative; overflow: hidden; background: #ffffff; }
        .cgh-grid {
          position: relative; z-index: 1; max-width: var(--w-1200); margin: 0 auto;
          padding: clamp(32px,6vh,64px) 28px clamp(64px,9vh,96px);
          display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(28px,5vw,56px); align-items: start;
        }
        @media (max-width: 900px) {
          .cgh-grid { grid-template-columns: 1fr; text-align: center; }
          .cgh-copy-align { align-items: center !important; }
          .cgh-btns { justify-content: center !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .cgh-copy { animation: cghRise .85s ${EASE} .05s both; }
          .cgh-viz  { animation: cghRise .9s ${EASE} .15s both; }
          .cgh-float { animation: cghFloat 5.5s ease-in-out infinite; }
        }
        .cgh-btn {
          font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
          padding: 13px 24px; border-radius: 999px; border: none; transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; text-decoration: none;
        }
        .cgh-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 26px rgba(19,96,238,.28); }
        .cgh-btn-primary:hover { background: #0d4fd4; transform: translateY(-2px); box-shadow: 0 14px 32px rgba(19,96,238,.36); }
        .cgh-btn-ghost { background: #fff; color: #1360ee; border: 1.5px solid #dbe3f5; }
        .cgh-btn-ghost:hover { border-color: #1360ee; transform: translateY(-2px); }
      `}</style>

      <section className="cgh-hero">
        <SoftwareNavbar />

        <div className="cgh-grid">
          {/* Copy */}
          <div className="cgh-copy cgh-copy-align" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: 'clamp(20px,3vw,40px)' }}>
            <h1 style={{ margin: 0, fontSize: 'max(clamp(24px, calc(1.5vw + 15px), 34px), min(2.361vw, 49.3px))', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-.02em', color: '#1d1d1f', maxWidth: '480px' }}>
              The Best <span style={{ color: '#1360ee' }}>Car GPS Tracker</span> for Maximum Visibility
            </h1>
            <p style={{ margin: '14px 0 0', fontSize: 'max(clamp(14px,1.35vw,16.5px), min(1.146vw, 23.93px))', color: '#8a93a2', fontWeight: 600 }}>
              A perfect solution to monitor your vehicles
            </p>

            <div className="cgh-btns" style={{ display: 'flex', gap: '14px', marginTop: '22px', flexWrap: 'wrap' }}>
              <Link href="/get-a-quote" className="cgh-btn cgh-btn-primary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M8 11l2.5 2.5L16 8" /></svg>
                Get a free quote
              </Link>
              <Link href="/get-a-free-demo" className="cgh-btn cgh-btn-ghost">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21" /></svg>
                Get a free demo
              </Link>
            </div>
          </div>

          {/* Visual — the artwork carries its own blue blob, phone, map, and accents */}
          <div className="cgh-viz" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Image
              className="cgh-float"
              src="/services/car-gps-tracker/hero.png"
              alt="Route traced across a map with a phone dropping a live location pin"
              width={1200}
              height={1010}
              sizes="(max-width: 900px) 88vw, 460px"
              style={{ width: '100%', maxWidth: '460px', height: 'auto', display: 'block' }}
              priority
            />
          </div>
        </div>
      </section>
    </>
  )
}
