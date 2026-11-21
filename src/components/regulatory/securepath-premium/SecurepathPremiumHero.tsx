import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * SecurePath Premium — hero.
 *
 * Same treatment as the SHAHIN hero next door: a 3:1 (2172x724) dark banner
 * run full-bleed with a left-to-right dark scrim and white copy. The banner
 * here is an aerial night highway whose left third is near-black — that is
 * where the copy sits, so the scrim is doing less work than it looks, exactly
 * as on SHAHIN. Type sizes, colours, spacing and the accent (#1360ee on the
 * product name) are carried over unchanged so the regulatory pages set their
 * heroes identically.
 */
export default function SecurepathPremiumHero() {
  return (
    <>
      <style>{`
        .spp-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: calc(64px + clamp(320px, 33.34vw, 1100px));
          background: #0b1220;
        }

        /* Top 64px is the fixed navbar's strip (SoftwareNavbar renders a 64px
           .swn-spacer with a white bar pinned over it). The photo starts below
           it rather than behind it — with the section min-height set to
           64px + 33.34vw, the photo's own box is precisely width/3, the
           image's own 3:1, so cover shows the whole frame, top edge included. */
        .spp-photo { position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 0; }
        .spp-photo img { object-fit: cover; object-position: 100% center; }

        /* Left-to-right dark fade. Stops short of opaque so the carriageway and
           tail lights still read through the copy rather than the text sitting
           on a flat black panel. */
        .spp-scrim {
          position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(90deg, rgba(7,12,22,.93) 0%, rgba(7,12,22,.86) 30%, rgba(7,12,22,.52) 56%, rgba(7,12,22,.12) 100%);
        }
        /* Separate top wash: the navbar is a translucent white fixed bar, and
           without this the photo's bright headlights can sit directly beneath it. */
        .spp-scrim-top {
          position: absolute; left: 0; right: 0; top: 64px; height: 150px; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(7,12,22,.55) 0%, rgba(7,12,22,0) 100%);
        }

        .spp-navwrap { position: relative; z-index: 3; }

        /* Same body padding on all four regulatory heroes (SecurePath, SecurePath
           Premium, SHAHIN, ASATEEL), so the back link never sits tight under the
           navbar when the copy outgrows the 3:1 banner height. */
        .spp-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(32px,3.2vw,52px) 28px clamp(36px,3.6vw,56px);
        }
        .spp-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .spp-content { max-width: min(660px, 100%); }

        @keyframes sppRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .spp-anim { opacity: 0; animation: sppRise .8s ${EASE} forwards; } }

        .spp-back {
          display: inline-flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,.66); font-size: var(--f-13); font-weight: 600;
          text-decoration: none; margin-bottom: 12px;
          transition: color .18s ease, gap .18s ease;
        }
        .spp-back:hover { color: #fff; gap: 10px; }

        .spp-title {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #ffffff;
          text-shadow: 0 2px 24px rgba(0,0,0,.4);
        }
        .spp-title em { display: block; font-style: normal; color: #1360ee; }

        .spp-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: rgba(255,255,255,.8);
        }

        .spp-badge {
          display: inline-flex; align-items: center; gap: 9px;
          margin-top: clamp(12px,1.4vw,15px);
          padding: 6px 13px 6px 9px; border-radius: 999px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.18);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .spp-badge-mark {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: #1360ee; color: #fff;
          display: grid; place-items: center;
        }
        .spp-badge-text { font-size: var(--f-13); color: rgba(255,255,255,.9); }
        .spp-badge-text b { font-weight: 800; color: #fff; }

        .spp-cta-row { display: flex; gap: 12px; margin-top: clamp(14px,1.7vw,20px); flex-wrap: wrap; align-items: center; }
        .spp-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 12px 22px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
          white-space: nowrap;
        }
        .spp-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .spp-btn:hover svg { transform: translateX(3px); }
        .spp-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.4); }
        .spp-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.55); }
        .spp-btn-ghost {
          background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.34);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .spp-btn-ghost:hover { background: rgba(255,255,255,.18); border-color: #fff; transform: translateY(-1px); }

        .spp-phone {
          display: inline-flex; align-items: center; gap: 8px;
          margin-left: 6px;
          color: rgba(255,255,255,.72); font-size: var(--f-13-5);
          text-decoration: none; transition: color .18s ease;
        }
        .spp-phone b { font-weight: 800; color: #fff; font-size: var(--f-15); letter-spacing: .01em; }
        .spp-phone:hover { color: #fff; }

        /* ── Tablet: cover starts eating the dark left edge, pulling the lit
           carriageway in behind the copy — so the fade has to hold longer. ── */
        @media (max-width: 1024px) {
          .spp-scrim {
            background: linear-gradient(90deg, rgba(7,12,22,.95) 0%, rgba(7,12,22,.9) 42%, rgba(7,12,22,.62) 70%, rgba(7,12,22,.25) 100%);
          }
          .spp-content { max-width: min(560px, 100%); }
        }

        /* ── Mobile: a 3:1 photo at phone aspect crops to a narrow slice, so the
           left-column treatment stops making sense. The frame anchors on the
           traffic and the copy moves under it on a bottom-up scrim. ── */
        @media (max-width: 768px) {
          .spp-hero { min-height: clamp(500px, 74vh, 620px); }
          .spp-photo { top: 0; bottom: 0; height: auto; }
          .spp-photo img { object-fit: cover; object-position: 66% center; }
          .spp-scrim-top { display: block; }
          .spp-scrim {
            background: linear-gradient(180deg, rgba(7,12,22,.42) 0%, rgba(7,12,22,.28) 30%, rgba(7,12,22,.82) 64%, rgba(7,12,22,.95) 100%);
          }
          .spp-body { align-items: flex-end; padding: clamp(110px,24vw,180px) 22px clamp(36px,8vw,52px); }
          .spp-content { max-width: 100%; }
          .spp-lead { max-width: 100%; }
          .spp-btn { padding: 13px 20px; }
        }

        @media (max-width: 640px) {
          .spp-cta-row { flex-direction: column; align-items: stretch; }
          .spp-btn { justify-content: center; }
        }

        @media (max-width: 420px) {
          .spp-title { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
        }
      `}</style>

      <section className="spp-hero">
        <div className="spp-photo" aria-hidden="true">
          <Image
            src="/regulatory/securepath-premium/securepath-premium-hero-banner.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="spp-scrim" aria-hidden="true" />
        <div className="spp-scrim-top" aria-hidden="true" />

        <div className="spp-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="spp-body">
          <div className="spp-inner">
            <div className="spp-content">
              <Link href="/regulatory" className="spp-back spp-anim" style={{ animationDelay: '.02s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Regulatory GPS Certifications
              </Link>

              <h1 className="spp-title spp-anim" style={{ animationDelay: '.05s' }}>
                <em>SecurePath Premium:</em>{' '}
                GPS Certification for Dubai Businesses
              </h1>

              <p className="spp-lead spp-anim" style={{ animationDelay: '.14s' }}>
                SIRA&apos;s mandatory GPS tracking registration for selected businesses operating
                in Dubai. We supply the approved device, install and certify it, and take your
                vehicles through registration end to end.
              </p>

              <div className="spp-badge spp-anim" style={{ animationDelay: '.22s' }}>
                <span className="spp-badge-mark">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="spp-badge-text">
                  Approved provider · <b>SIRA Dubai</b>
                </span>
              </div>

              <div className="spp-cta-row spp-anim" style={{ animationDelay: '.3s' }}>
                <Link href="/get-a-quote" className="spp-btn spp-btn-primary">
                  Get a Free Quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/contact" className="spp-btn spp-btn-ghost">
                  Get Expert Advice
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>

                <a href="tel:+971508746688" className="spp-phone">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1360ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.73 12 19.79 19.79 0 0 1 1.67 3.43 2 2 0 0 1 3.66 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 5.91 5.91l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Or call <b>050 874 66 88</b>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
