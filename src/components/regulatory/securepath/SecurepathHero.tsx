import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * SecurePath — hero.
 *
 * Same treatment as the SHAHIN, SecurePath Premium and ASATEEL heroes, so the
 * four regulatory pages open identically: a 3:1 (2172x724) dark banner run
 * full-bleed below the navbar strip, a left-to-right dark scrim, white copy in
 * a left column, the "Regulatory GPS Certifications" back link above the
 * headline, and the accent (#1360ee) on the product name. The banner is an
 * aerial night interchange whose left third is near-black — that is where the
 * copy sits. Type sizes, colours and spacing match the other three heroes.
 *
 * Class prefix is `spth-`, not the older `sph-`: the previous version of this
 * hero hoisted its `sph-` rules into <head> (a <style href precedence> sheet,
 * which React keeps for the whole session), and its fixed `.sph-photo` height
 * would cap this banner at 460px on large screens. A fresh prefix means no
 * stale rule can ever match.
 */
export default function SecurepathHero() {
  return (
    <>
      <style>{`
        .spth-hero {
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
        .spth-photo { position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 0; }
        .spth-photo img { object-fit: cover; object-position: 100% center; }

        /* Left-to-right dark fade. Stops short of opaque so the carriageway and
           tail lights still read through the copy rather than the text sitting
           on a flat black panel. */
        .spth-scrim {
          position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(90deg, rgba(7,12,22,.93) 0%, rgba(7,12,22,.86) 30%, rgba(7,12,22,.52) 56%, rgba(7,12,22,.12) 100%);
        }
        /* Separate top wash: the navbar is a translucent white fixed bar, and
           without this the photo's bright headlights can sit directly beneath it. */
        .spth-scrim-top {
          position: absolute; left: 0; right: 0; top: 64px; height: 150px; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(7,12,22,.55) 0%, rgba(7,12,22,0) 100%);
        }

        .spth-navwrap { position: relative; z-index: 3; }

        /* Same body padding on all four regulatory heroes (SecurePath, SecurePath
           Premium, SHAHIN, ASATEEL), so the back link never sits tight under the
           navbar when the copy outgrows the 3:1 banner height. */
        .spth-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(32px,3.2vw,52px) 28px clamp(36px,3.6vw,56px);
        }
        .spth-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .spth-content { max-width: min(660px, 100%); }

        @keyframes spthRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .spth-anim { opacity: 0; animation: spthRise .8s ${EASE} forwards; } }

        .spth-back {
          display: inline-flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,.66); font-size: var(--f-13); font-weight: 600;
          text-decoration: none; margin-bottom: 12px;
          transition: color .18s ease, gap .18s ease;
        }
        .spth-back:hover { color: #fff; gap: 10px; }

        .spth-title {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #ffffff;
          text-shadow: 0 2px 24px rgba(0,0,0,.4);
        }
        .spth-title em { display: block; font-style: normal; color: #1360ee; }

        .spth-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: rgba(255,255,255,.8);
        }


        .spth-cta-row { display: flex; gap: 12px; margin-top: clamp(14px,1.7vw,20px); flex-wrap: wrap; align-items: center; }
        .spth-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 12px 22px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
          white-space: nowrap;
        }
        .spth-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .spth-btn:hover svg { transform: translateX(3px); }
        .spth-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.4); }
        .spth-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.55); }
        .spth-btn-ghost {
          background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.34);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .spth-btn-ghost:hover { background: rgba(255,255,255,.18); border-color: #fff; transform: translateY(-1px); }


        /* ── Tablet: cover starts eating the dark left edge, pulling the lit
           carriageway in behind the copy — so the fade has to hold longer. ── */
        @media (max-width: 1024px) {
          .spth-scrim {
            background: linear-gradient(90deg, rgba(7,12,22,.95) 0%, rgba(7,12,22,.9) 42%, rgba(7,12,22,.62) 70%, rgba(7,12,22,.25) 100%);
          }
          .spth-content { max-width: min(560px, 100%); }
        }

        /* ── Mobile: a 3:1 photo at phone aspect crops to a narrow slice, so the
           left-column treatment stops making sense. The frame anchors on the
           traffic and the copy moves under it on a bottom-up scrim. ── */
        @media (max-width: 768px) {
          .spth-hero { min-height: clamp(500px, 74vh, 620px); }
          .spth-photo { top: 0; bottom: 0; height: auto; }
          .spth-photo img { object-fit: cover; object-position: 66% center; }
          .spth-scrim-top { display: block; }
          .spth-scrim {
            background: linear-gradient(180deg, rgba(7,12,22,.42) 0%, rgba(7,12,22,.28) 30%, rgba(7,12,22,.82) 64%, rgba(7,12,22,.95) 100%);
          }
          .spth-body { align-items: flex-end; padding: clamp(110px,24vw,180px) 22px clamp(36px,8vw,52px); }
          .spth-content { max-width: 100%; }
          .spth-lead { max-width: 100%; }
          .spth-btn { padding: 13px 20px; }
        }

        @media (max-width: 640px) {
          .spth-cta-row { flex-direction: column; align-items: stretch; }
          .spth-btn { justify-content: center; }
        }

        @media (max-width: 420px) {
          .spth-title { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
        }
      `}</style>

      <section className="spth-hero">
        <div className="spth-photo">
          <Image
            src="/regulatory/securepath/securepath-hero-banner.webp"
            alt="Aerial night view of a Dubai highway interchange, representing SecurePath's real-time GPS-tracked vehicle network"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="spth-scrim" aria-hidden="true" />
        <div className="spth-scrim-top" aria-hidden="true" />

        <div className="spth-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="spth-body">
          <div className="spth-inner">
            <div className="spth-content">
              <Link href="/regulatory" className="spth-back spth-anim" style={{ animationDelay: '.02s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Regulatory GPS Certifications
              </Link>

              <h1 className="spth-title spth-anim" style={{ animationDelay: '.05s' }}>
                <em>SecurePath</em>{' '}
                GPS Tracking for Dubai Rent a Car Companies
              </h1>

              <p className="spth-lead spth-anim" style={{ animationDelay: '.14s' }}>
                Try Out SecurePath GPS System from LOCATOR Today
              </p>

              <div className="spth-cta-row spth-anim" style={{ animationDelay: '.3s' }}>
                <Link href="/get-a-quote" className="spth-btn spth-btn-primary">
                  Get a Free Quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/get-a-free-demo" className="spth-btn spth-btn-ghost">
                  Get a Free Demo
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
