import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * ASATEEL — hero.
 *
 * The same treatment as the SHAHIN hero, and for the same reasons: a wide dark
 * banner behind full-bleed, a left-to-right dark scrim carrying light copy, and
 * the product name accented in the exact brand #1360ee to match the rest of the
 * site.
 *
 * The banner is 1600x533 — 3:1, the same ratio as SHAHIN's. The photo fills its
 * box with object-fit: cover, so there is never dead space beneath it.
 *
 * Showing the complete frame is then a matter of that box being the same shape
 * as the photo, and the box is NOT the whole section — it starts 64px down,
 * below the fixed white navbar, because anything behind that bar is hidden and
 * reads as a crop off the top. So the section is sized 64px + 33.34vw, where
 * 33.34vw IS width / 3, leaving the photo's own box at exactly 3:1.
 *
 * What can still pull it off that ratio: the clamp's floor/cap at the extremes,
 * and copy tall enough to push the section past it. That second one is why the
 * lead is two lines, the badge shares the back link's row, and the paddings are
 * tight — content height is what decides whether the whole banner shows.
 *
 * The photo is anchored right, so any crop that does occur is taken off the
 * dark, empty sea on the left that the copy and scrim already cover — never off
 * the sunset and skyline on the right.
 *
 * At 768px the box is nowhere near 3:1 and a crop is unavoidable, so the frame
 * anchors on the highway and the copy drops to the bottom over a bottom-up scrim.
 */
export default function AsateelHero() {
  return (
    <>
      <style>{`
        .asa-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: calc(64px + clamp(320px, 33.34vw, 1100px));
          background: #0b1220;
        }

        /* Top 64px is the fixed navbar's strip (SoftwareNavbar renders a 64px
           .swn-spacer and a white bar pinned over it). The photo starts below it
           rather than behind it: spanning the full section put the top of the
           image underneath an opaque bar, which looked exactly like a crop. With
           the section min-height set to 64px + 33.34vw above, the photo's own box
           is then precisely width/3 — the image's 3:1 — so cover shows the whole
           frame, top edge included. */
        .asa-photo { position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 0; }
        .asa-photo img { object-fit: cover; object-position: 100% center; }

        /* Left-to-right dark fade. Stops short of opaque so the sea and clouds
           still read through the copy rather than the text sitting on a flat
           black panel. */
        .asa-scrim {
          position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(90deg, rgba(7,12,22,.93) 0%, rgba(7,12,22,.86) 30%, rgba(7,12,22,.52) 56%, rgba(7,12,22,.12) 100%);
        }
        /* Separate top wash: the navbar is a translucent white fixed bar, and
           without this the photo's bright sunset can sit directly beneath it. */
        .asa-scrim-top {
          position: absolute; left: 0; right: 0; top: 64px; height: 150px; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(7,12,22,.55) 0%, rgba(7,12,22,0) 100%);
        }

        .asa-navwrap { position: relative; z-index: 3; }

        /* Same body padding on all four regulatory heroes (SecurePath, SecurePath
           Premium, SHAHIN, ASATEEL), so the back link never sits tight under the
           navbar when the copy outgrows the 3:1 banner height. */
        .asa-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(32px,3.2vw,52px) 28px clamp(36px,3.6vw,56px);
        }
        .asa-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .asa-content { max-width: min(660px, 100%); }

        @keyframes asaRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .asa-anim { opacity: 0; animation: asaRise .8s ${EASE} forwards; } }

        /* Back link and compliance badge share one line. As a stacked block the
           badge cost the section a whole row of height, and section height is
           exactly what decides whether the 3:1 banner shows in full: any height
           beyond width/3 makes cover trim the sides. */
        .asa-topline {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          margin-bottom: clamp(10px,1.2vw,14px);
        }

        .asa-back {
          display: inline-flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,.66); font-size: var(--f-13); font-weight: 600;
          text-decoration: none;
          transition: color .18s ease, gap .18s ease;
        }
        .asa-back:hover { color: #fff; gap: 10px; }

        /* Type scale matches the /about/purpose hero exactly — only the colours
           differ, since this sits on a dark photo rather than white. */
        .asa-title {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #ffffff;
          text-shadow: 0 2px 24px rgba(0,0,0,.4);
        }
        .asa-title em { display: block; font-style: normal; color: #1360ee; }

        .asa-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: rgba(255,255,255,.8);
        }

        .asa-badge {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 5px 12px 5px 8px; border-radius: 999px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.18);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .asa-badge-mark {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: #1360ee; color: #fff;
          display: grid; place-items: center;
        }
        .asa-badge-text { font-size: var(--f-13); color: rgba(255,255,255,.9); }
        .asa-badge-text b { font-weight: 800; color: #fff; }

        .asa-cta-row { display: flex; gap: 12px; margin-top: clamp(14px,1.7vw,20px); flex-wrap: wrap; align-items: center; }
        .asa-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 12px 22px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
          white-space: nowrap;
        }
        .asa-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .asa-btn:hover svg { transform: translateX(3px); }
        .asa-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.4); }
        .asa-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.55); }
        .asa-btn-ghost {
          background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.34);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .asa-btn-ghost:hover { background: rgba(255,255,255,.18); border-color: #fff; transform: translateY(-1px); }

        .asa-phone {
          display: inline-flex; align-items: center; gap: 8px;
          margin-left: 6px;
          color: rgba(255,255,255,.72); font-size: var(--f-13-5);
          text-decoration: none; transition: color .18s ease;
        }
        .asa-phone b { font-weight: 800; color: #fff; font-size: var(--f-15); letter-spacing: .01em; }
        .asa-phone:hover { color: #fff; }

        /* ── Tablet: the box drifts off 3:1, so the fade has to hold longer as
           the lit half of the photo comes in behind the copy. ── */
        @media (max-width: 1024px) {
          .asa-scrim {
            background: linear-gradient(90deg, rgba(7,12,22,.95) 0%, rgba(7,12,22,.9) 42%, rgba(7,12,22,.62) 70%, rgba(7,12,22,.25) 100%);
          }
          .asa-content { max-width: min(560px, 100%); }
        }

        /* ── Mobile: phone aspect is nowhere near 3:1, so the box cannot match
           the photo — the choice is a crop or dark dead space, and a crop is the
           right one. The photo fills the hero anchored on the highway, with the
           copy over a bottom-up scrim. ── */
        @media (max-width: 768px) {
          .asa-hero { min-height: clamp(500px, 74vh, 620px); }
          .asa-photo img { object-position: 62% center; }
          .asa-scrim {
            background: linear-gradient(180deg, rgba(7,12,22,.42) 0%, rgba(7,12,22,.28) 30%, rgba(7,12,22,.82) 64%, rgba(7,12,22,.95) 100%);
          }
          .asa-body { align-items: flex-end; padding: clamp(110px,24vw,180px) 22px clamp(36px,8vw,52px); }
          .asa-content { max-width: 100%; }
          .asa-lead { max-width: 100%; }
          .asa-btn { padding: 13px 20px; }
        }

        @media (max-width: 640px) {
          .asa-cta-row { flex-direction: column; align-items: stretch; }
          .asa-btn { justify-content: center; }
        }

        @media (max-width: 420px) {
          .asa-title { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
        }
      `}</style>

      <section className="asa-hero">
        <div className="asa-photo" aria-hidden="true">
          <Image
            src="/regulatory/asateel-certified/asteel.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="asa-scrim" aria-hidden="true" />
        <div className="asa-scrim-top" aria-hidden="true" />

        <div className="asa-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="asa-body">
          <div className="asa-inner">
            <div className="asa-content">
              <div className="asa-topline">
                <Link href="/regulatory" className="asa-back asa-anim" style={{ animationDelay: '.02s' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Regulatory GPS Certifications
                </Link>
                <div className="asa-badge asa-anim" style={{ animationDelay: '.22s' }}>
                  <span className="asa-badge-mark">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="asa-badge-text">
                    Approved installer · <b>ITC Abu Dhabi</b>
                  </span>
                </div>
              </div>

              <h1 className="asa-title asa-anim" style={{ animationDelay: '.05s' }}>
                <em>ASATEEL</em>{' '}
                Certified OBU Installation You Can Rely On
              </h1>

              <p className="asa-lead asa-anim" style={{ animationDelay: '.14s' }}>
                ITC&apos;s tracking mandate for commercial transport in Abu Dhabi — freight,
                passenger and school bus fleets. We supply the approved on-board unit, install
                it, and see your vehicles through certification.
              </p>

              <div className="asa-cta-row asa-anim" style={{ animationDelay: '.3s' }}>
                <Link href="/get-a-quote" className="asa-btn asa-btn-primary">
                  Get a Free Quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/contact" className="asa-btn asa-btn-ghost">
                  Get Expert Advice
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>

                {/* In the CTA row rather than on its own line below it — one less
                    stacked block to fit inside the ratio-pinned hero. */}
                <a href="tel:+971508746688" className="asa-phone">
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
