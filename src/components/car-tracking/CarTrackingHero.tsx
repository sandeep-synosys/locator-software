import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * The opening. Two columns rather than the centred stack the rest of the service
 * pages use: this page has a product to show, and a live-map panel beside the
 * headline says what the product is faster than another paragraph would.
 *
 * The panel is an illustration rather than a screenshot: it stays legible at any
 * width and does not date the moment the UI changes.
 */
export default function CarTrackingHero() {
  return (
    <>
      <style>{`
        .cts-hero {
          position: relative; overflow: hidden; background: #fff;
          padding: clamp(16px,2vw,28px) 28px clamp(56px,7vw,92px);
        }
        /* One soft wash of brand blue behind the panel side, so the white page
           has a light source rather than a coloured block. */
        .cts-hero::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          width: min(860px, 78vw); height: min(680px, 62vw);
          top: -18%; right: -14%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.13), transparent 70%);
        }
        .cts-hero::after {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(15,17,23,.09) 1px, transparent 0);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse 62% 58% at 22% 8%, #000 0%, transparent 74%);
          mask-image: radial-gradient(ellipse 62% 58% at 22% 8%, #000 0%, transparent 74%);
        }

        .cts-hero-inner {
          position: relative; z-index: 1;
          max-width: var(--w-1180); margin: 0 auto;
          padding-top: clamp(8px,1.5vw,16px);
          display: grid; grid-template-columns: 1.1fr 1fr;
          gap: clamp(32px,5vw,72px); align-items: start;
        }
        @media (max-width: 940px) {
          .cts-hero-inner { grid-template-columns: 1fr; gap: clamp(38px,6vw,52px); }
        }

        @keyframes ctsRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) {
          .cts-anim { opacity: 0; animation: ctsRise .8s ${EASE} var(--d, 0ms) forwards; }
        }

        .cts-crumb {
          display: flex; align-items: center; gap: 9px; flex-wrap: wrap;
          font-size: var(--f-13); font-weight: 500; color: #9aa1ad;
          margin-bottom: clamp(20px,3vw,30px);
        }
        .cts-crumb a { color: #6e6e73; text-decoration: none; transition: color .2s ${EASE}; }
        .cts-crumb a:hover { color: #1360ee; }
        .cts-crumb span[aria-current] { color: #1d1d1f; font-weight: 600; }

        .cts-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin-bottom: 20px;
        }
        .cts-eyebrow::before { content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px; }

        .cts-title {
          margin: 0; max-width: 560px;
          font-size: clamp(24px, calc(1.5vw + 15px), 34px); font-weight: 800;
          line-height: 1.22; letter-spacing: -.02em; color: #1d1d1f;
        }
        .cts-title em { font-style: normal; color: #1360ee; }
        @media (max-width: 420px) { .cts-title { font-size: clamp(22px, 6.4vw, 26px); letter-spacing: -.014em; } }

        .cts-lead {
          margin: clamp(14px,1.8vw,18px) 0 0; max-width: 46ch;
          font-size: max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #6e6e73;
        }

        .cts-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(22px,2.8vw,30px); }
        .cts-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 26px; border-radius: 999px; text-decoration: none;
          font-size: var(--f-14-5); font-weight: 700; letter-spacing: .01em;
          transition: transform .28s ${EASE}, box-shadow .28s ${EASE}, border-color .28s ${EASE}, color .28s ${EASE};
        }
        .cts-btn svg { width: 16px; height: 16px; }
        .cts-btn--primary {
          background: #1360ee; color: #fff;
          box-shadow: 0 12px 26px -10px rgba(19,96,238,.68);
        }
        .cts-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 20px 38px -12px rgba(19,96,238,.72); }
        .cts-btn--ghost { background: #fff; color: #1d1d1f; border: 1px solid #e2e8f2; }
        .cts-btn--ghost:hover { transform: translateY(-2px); border-color: #1360ee; color: #1360ee; box-shadow: 0 14px 28px -16px rgba(20,40,90,.4); }

        /* Trust strip — three plain facts under the buttons. Cheaper and more
           credible than a row of logos, and it fills the column's last line
           instead of leaving the buttons floating on white. */
        .cts-trust {
          display: flex; flex-wrap: wrap; gap: clamp(14px,2.4vw,30px);
          margin: clamp(30px,4vw,42px) 0 0; padding-top: clamp(20px,2.6vw,26px);
          border-top: 1px solid #eef1f7; list-style: none;
        }
        .cts-trust li {
          display: flex; align-items: center; gap: 8px;
          font-size: var(--f-13); font-weight: 600; color: #6e6e73;
        }
        .cts-trust svg { width: 15px; height: 15px; color: #1fbf5b; flex-shrink: 0; }

        /* ── Panel ───────────────────────────────────────────────────────────── */
        /* The artwork is a full-bleed blue plate, so it gets a rounded clip and a
           lifted shadow rather than the browser-chrome frame a screenshot needs. */
        .cts-panel {
          position: relative; border-radius: 22px; overflow: hidden; line-height: 0;
          box-shadow: 0 44px 84px -40px rgba(19,96,238,.6), 0 2px 8px rgba(20,40,90,.08);
        }
        .cts-panel img { display: block; width: 100%; height: auto; }

        @media (max-width: 520px) {
          .cts-actions .cts-btn { flex: 1 1 100%; justify-content: center; }
        }
      `}</style>

      <section className="cts-hero">
        <SoftwareNavbar />

        <div className="cts-hero-inner">
          {/* ── Copy ── */}
          <div>
            <nav className="cts-crumb cts-anim" style={{ '--d': '0ms' } as React.CSSProperties} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/service/fleet-telematics">Services</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Car Tracking System</span>
            </nav>

            <p className="cts-eyebrow cts-anim" style={{ '--d': '70ms' } as React.CSSProperties}>
              Car tracking · United Arab Emirates
            </p>

            <h1 className="cts-title cts-anim" style={{ '--d': '140ms' } as React.CSSProperties}>
              <em>Car Tracking System</em> for UAE Business Fleets
            </h1>

            <p className="cts-lead cts-anim" style={{ '--d': '210ms' } as React.CSSProperties}>
              Be in control of every vehicle you own. LOCATOR puts your whole fleet on one live
              map — wherever it is working, and whatever it is working on.
            </p>

            <div className="cts-actions cts-anim" style={{ '--d': '280ms' } as React.CSSProperties}>
              <Link href="/get-a-quote" className="cts-btn cts-btn--primary">
                Get a free quote
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link href="/get-a-free-demo" className="cts-btn cts-btn--ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" />
                </svg>
                Get a free demo
              </Link>
            </div>

            <ul className="cts-trust cts-anim" style={{ '--d': '350ms' } as React.CSSProperties}>
              {['No long-term lock-in', 'Installed across the UAE', '24/7 local support'].map(t => (
                <li key={t}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Live map panel ── */}
          <div className="cts-panel cts-anim" style={{ '--d': '260ms' } as React.CSSProperties}>
            <Image
              src="/services/car-tracking-system/hero.png"
              alt="A tracked car reporting its live location, speed and ignition status to a phone map"
              width={1200}
              height={1215}
              sizes="(max-width: 940px) 92vw, 46vw"
              priority
            />
          </div>
        </div>
      </section>
    </>
  )
}
