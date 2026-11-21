import Link from 'next/link'
import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function TrackingDevicesHero() {
  return (
    <>
      <style>{`
        /*
         * Banner is dark navy (connected IoT/security glass-cube render), not
         * the pale studio shot this hero used to carry — so the treatment
         * flips to a dark scrim + white text, the same pairing SmartIotHero
         * uses for its own dark banner, instead of the old white-scrim/dark-
         * text pair built for a light image.
         */
        .td-hero {
          position: relative;
          overflow: hidden;
          background: #060b16;
          display: flex;
          flex-direction: column;
          /* Height tracks the banner's own 3:1 (2172x724) the same way the
             SHAHIN hero does, plus the 64px navbar strip above it. With the
             photo box then exactly width/3, cover has nothing to trim
             vertically — the whole frame shows, top edge included. A flat
             max-height cap here is what previously made the box wider than
             3:1 on large monitors, and cover paid for that by cutting the
             top and bottom off the image. */
          min-height: calc(64px + clamp(320px, 33.34vw, 1100px));
        }

        /* Photo starts below the navbar rather than behind it: spanning the
           full section put the top of the image underneath the fixed white
           bar, which read exactly like a crop. */
        .td-photo { position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 0; }
        /* cover, not contain: contain letterboxed a dark band under the image
           whenever the copy pushed the section past the banner's ratio. The
           box now matches the image's shape, so cover fills every edge with
           nothing cropped; where copy does force it taller, the trim comes
           off the left, which is empty dark space the scrim already covers. */
        .td-photo img {
          object-fit: cover;
          object-position: 100% center;
        }

        /* Dark left-to-right scrim so text stays legible over the banner */
        .td-scrim {
          position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(90deg,
            rgba(2,6,14,.82) 0%,
            rgba(2,6,14,.62) 30%,
            rgba(2,6,14,.2)  56%,
            rgba(2,6,14,0)   74%
          );
        }

        .td-navwrap { position: relative; z-index: 3; }

        .td-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(20px,3vw,36px) 28px clamp(40px,5vw,60px);
        }
        .td-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .td-content { max-width: min(560px, 100%); }

        @keyframes tdRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .td-anim { opacity: 0; animation: tdRise .8s ${EASE} forwards; } }

        .td-back {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 20px;
          color: rgba(255,255,255,.7); font-size: var(--f-13); font-weight: 600;
          text-decoration: none; transition: color .18s ease, gap .18s ease;
        }
        .td-back:hover { color: #fff; gap: 9px; }

        .td-eyebrow {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px));
          font-weight: 800; letter-spacing: .04em;
          color: #5b9fff; text-transform: uppercase; margin-bottom: 16px;
        }
        .td-eyebrow-bar {
          display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin-bottom: 12px;
        }

        .td-h1 {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.14; letter-spacing: -.024em;
          color: #ffffff;
        }
        .td-h1 em { font-style: normal; color: #5b9fff; }

        .td-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: rgba(255,255,255,.75);
        }

        .td-cta-row { display: flex; gap: 14px; margin-top: clamp(22px,2.6vw,32px); flex-wrap: wrap; }
        .td-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 14px 24px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
        }
        .td-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .td-btn:hover svg { transform: translateX(3px); }
        .td-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.4); }
        .td-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.55); }
        .td-btn-ghost {
          background: rgba(255,255,255,.12); color: #fff;
          border-color: rgba(255,255,255,.3);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .td-btn-ghost:hover { border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.2); transform: translateY(-1px); }

        @media (max-width: 1024px) {
          .td-scrim { background: linear-gradient(90deg,
            rgba(2,6,14,.9) 0%,
            rgba(2,6,14,.74) 38%,
            rgba(2,6,14,.22) 64%,
            rgba(2,6,14,0)   80%
          ); }
          .td-content { max-width: min(480px, 100%); }
        }

        /* Mobile: contain-fit on a narrow-but-tall box renders the wide
           banner as a thin strip through the middle of the section — below
           this width the photo becomes a normal, fixed-height block of its
           own instead (filled edge-to-edge via cover), with the copy flowing
           below it rather than layered on top. CSS "order" reflows the
           nav/photo/body stack without touching the DOM. */
        @media (max-width: 768px) {
          .td-hero { min-height: auto; }
          .td-navwrap { order: 1; }
          .td-photo {
            order: 2;
            position: relative; inset: auto;
            height: clamp(200px, 56vw, 300px);
          }
          .td-photo img { object-fit: cover; object-position: 68% center; }
          .td-scrim { display: none; }
          .td-body { order: 3; padding: clamp(28px,6vw,40px) 22px clamp(36px,8vw,52px); background: #060b16; }
          .td-content { max-width: 100%; }
        }

        @media (max-width: 420px) {
          .td-h1 { font-size: clamp(24px, 7.2vw, 30px); }
          .td-cta-row { flex-direction: column; }
          .td-btn { justify-content: center; }
        }
      `}</style>

      <section className="td-hero">

        <div className="td-photo" aria-hidden="true">
          <Image
            src="/services/tracking-devices-hero-banner.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="td-scrim" aria-hidden="true" />

        <div className="td-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="td-body">
          <div className="td-inner">
            <div className="td-content">

              <Link href="/service" className="td-back td-anim" style={{ animationDelay: '0s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Services
              </Link>

              <span className="td-eyebrow td-anim" style={{ animationDelay: '.04s' }}>
                <span className="td-eyebrow-bar" />
                GPS Tracking Devices
              </span>

              <h1 className="td-h1 td-anim" style={{ animationDelay: '.1s' }}>
                GPS Tracking Devices{' '}<br />
                Behind Every <em>LOCATOR</em> Install
              </h1>

              <p className="td-lead td-anim" style={{ animationDelay: '.18s' }}>
                A great platform always needs great hardware. Certified GPS terminals, driver-ID readers, and sensors — supplied, installed, and configured by our own engineers.
              </p>

              <div className="td-cta-row td-anim" style={{ animationDelay: '.26s' }}>
                <Link href="/contact" className="td-btn td-btn-primary">
                  Request device pricing
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/contact" className="td-btn td-btn-ghost">
                  Talk to an engineer
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
