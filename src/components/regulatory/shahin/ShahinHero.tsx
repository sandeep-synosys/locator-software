import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * SHAHIN — hero.
 *
 * Built on the Who We Are hero's structure (photo behind, scrim for legibility,
 * left copy column, two-tone headline, staggered rise), but inverted: that hero
 * lays dark text over a white fade on a bright photo, and this banner is a dark
 * sunset. Light-on-dark is the only treatment that survives it, so the scrim
 * runs dark and the copy is white. The accent on the product name is the exact
 * brand #1360ee, chosen for consistency with the rest of the site over a lighter
 * tint — it sits around 3.2:1 on the scrim, which the display-size title carries.
 *
 * The photo is 3:1 (2172x724), far wider than any hero box, so it is full-bleed
 * rather than boxed to one side. Its left third is dark, empty causeway — that
 * is where the copy sits, so the scrim is doing less work than it looks.
 *
 * Two breakpoints move three things together: 1024px strengthens the scrim as
 * `cover` starts trimming the dark left edge and pulls the bright sunset in
 * behind the text; 768px turns the whole treatment vertical — the crop is far
 * too severe at phone aspect to keep a left column, so the copy drops to the
 * bottom over a bottom-up scrim and the frame anchors on the truck.
 */
export default function ShahinHero() {
  return (
    <>
      <style>{`
        .shh-hero {
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
        .shh-photo { position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 0; }
        /* cover with the section height pinned to 33.34vw — that IS the photo's 3:1,
           so the box and the image are the same shape: it fills every edge with
           nothing cropped and no letterbox. contain was the wrong tool here; it
           never cropped, but it left dark bars where the image did not reach.
           Where the box cannot be 3:1 — a narrow window, or copy tall enough to
           push the section past the clamp — the right edge is pinned so the trim
           comes off the dark, empty causeway on the left that the copy and scrim
           already cover, never off the sunset and port cranes on the right. */
        .shh-photo img { object-fit: cover; object-position: 100% center; }

        /* Left-to-right dark fade. Stops short of opaque on the left so the
           causeway and clouds still read through the copy rather than the text
           sitting on a flat black panel. */
        .shh-scrim {
          position: absolute; top: 64px; left: 0; right: 0; bottom: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(90deg, rgba(7,12,22,.93) 0%, rgba(7,12,22,.86) 30%, rgba(7,12,22,.52) 56%, rgba(7,12,22,.12) 100%);
        }
        /* Separate top wash: the navbar is a translucent white fixed bar, and
           without this the photo's bright sunset can sit directly beneath it. */
        .shh-scrim-top {
          position: absolute; left: 0; right: 0; top: 64px; height: 150px; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(7,12,22,.55) 0%, rgba(7,12,22,0) 100%);
        }

        .shh-navwrap { position: relative; z-index: 3; }

        /* Same body padding on all four regulatory heroes (SecurePath, SecurePath
           Premium, SHAHIN, ASATEEL), so the back link never sits tight under the
           navbar when the copy outgrows the 3:1 banner height. */
        .shh-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center;
          padding: clamp(32px,3.2vw,52px) 28px clamp(36px,3.6vw,56px);
        }
        .shh-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .shh-content { max-width: min(660px, 100%); }

        @keyframes shhRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .shh-anim { opacity: 0; animation: shhRise .8s ${EASE} forwards; } }

        .shh-back {
          display: inline-flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,.66); font-size: var(--f-13); font-weight: 600;
          text-decoration: none; margin-bottom: 12px;
          transition: color .18s ease, gap .18s ease;
        }
        .shh-back:hover { color: #fff; gap: 10px; }

        .shh-title {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #ffffff;
          text-shadow: 0 2px 24px rgba(0,0,0,.4);
        }
        /* The Who We Are hero breaks its second half onto its own line in the
           accent colour; here the product name leads instead of trailing. */
        .shh-title em { display: block; font-style: normal; color: #1360ee; }

        /* Margin, measure and leading all match .wwa-lead on /about/purpose so
           the two heroes set type identically; only the colour differs, since
           this one sits on a dark photo rather than white. */
        .shh-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: rgba(255,255,255,.8);
        }

        .shh-badge {
          display: inline-flex; align-items: center; gap: 9px;
          margin-top: clamp(12px,1.4vw,15px);
          padding: 6px 13px 6px 9px; border-radius: 999px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.18);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .shh-badge-mark {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: #1360ee; color: #fff;
          display: grid; place-items: center;
        }
        .shh-badge-text { font-size: var(--f-13); color: rgba(255,255,255,.9); }
        .shh-badge-text b { font-weight: 800; color: #fff; }

        .shh-cta-row { display: flex; gap: 12px; margin-top: clamp(14px,1.7vw,20px); flex-wrap: wrap; align-items: center; }
        .shh-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 12px 22px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
          white-space: nowrap;
        }
        .shh-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .shh-btn:hover svg { transform: translateX(3px); }
        .shh-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.4); }
        .shh-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.55); }
        .shh-btn-ghost {
          background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.34);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .shh-btn-ghost:hover { background: rgba(255,255,255,.18); border-color: #fff; transform: translateY(-1px); }

        .shh-phone {
          display: inline-flex; align-items: center; gap: 8px;
          margin-left: 6px;
          color: rgba(255,255,255,.72); font-size: var(--f-13-5);
          text-decoration: none; transition: color .18s ease;
        }
        .shh-phone b { font-weight: 800; color: #fff; font-size: var(--f-15); letter-spacing: .01em; }
        .shh-phone:hover { color: #fff; }

        /* ── Tablet: cover starts eating the dark left edge, pulling the lit
           sunset in behind the copy — so the fade has to hold longer. ── */
        @media (max-width: 1024px) {
          .shh-scrim {
            background: linear-gradient(90deg, rgba(7,12,22,.95) 0%, rgba(7,12,22,.9) 42%, rgba(7,12,22,.62) 70%, rgba(7,12,22,.25) 100%);
          }
          .shh-content { max-width: min(560px, 100%); }
        }

        /* ── Mobile: a 3:1 photo at phone aspect crops to a narrow slice, so the
           left-column treatment stops making sense. The frame anchors on the
           truck and the copy moves under it on a bottom-up scrim. ── */
        @media (max-width: 768px) {
          /* Phone aspect is nowhere near 3:1, so the box cannot match the photo
             here — the choice is a crop or dark dead space, and a crop is the
             right one: the photo fills the whole hero, anchored on the truck.
             The copy sits over it against a bottom-up scrim. */
          .shh-hero { min-height: clamp(500px, 74vh, 620px); }
          .shh-photo { top: 0; bottom: 0; height: auto; }
          .shh-photo img { object-fit: cover; object-position: 66% center; }
          .shh-scrim-top { display: block; }
          .shh-scrim {
            background: linear-gradient(180deg, rgba(7,12,22,.42) 0%, rgba(7,12,22,.28) 30%, rgba(7,12,22,.82) 64%, rgba(7,12,22,.95) 100%);
          }
          .shh-body { align-items: flex-end; padding: clamp(110px,24vw,180px) 22px clamp(36px,8vw,52px); }
          .shh-content { max-width: 100%; }
          .shh-lead { max-width: 100%; }
          .shh-btn { padding: 13px 20px; }
        }

        @media (max-width: 640px) {
          .shh-cta-row { flex-direction: column; align-items: stretch; }
          .shh-btn { justify-content: center; }
        }

        @media (max-width: 420px) {
          .shh-title { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
        }
      `}</style>

      <section className="shh-hero">
        <div className="shh-photo" aria-hidden="true">
          <Image
            src="/regulatory/shahin/shahin-banner.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="shh-scrim" aria-hidden="true" />
        <div className="shh-scrim-top" aria-hidden="true" />

        <div className="shh-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="shh-body">
          <div className="shh-inner">
            <div className="shh-content">
              <Link href="/regulatory" className="shh-back shh-anim" style={{ animationDelay: '.02s' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Regulatory GPS Certifications
              </Link>

              <h1 className="shh-title shh-anim" style={{ animationDelay: '.05s' }}>
                <em>SHAHIN</em>{' '}
                Registration, Handled End to End
              </h1>

              <p className="shh-lead shh-anim" style={{ animationDelay: '.14s' }}>
                SIRA&apos;s tracking mandate for cargo vehicles registered in Dubai or moving
                through its ports. We supply the approved hardware, install it, and take your
                fleet through registration.
              </p>

              <div className="shh-badge shh-anim" style={{ animationDelay: '.22s' }}>
                <span className="shh-badge-mark">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="shh-badge-text">
                  Approved provider · <b>SIRA Dubai</b>
                </span>
              </div>

              <div className="shh-cta-row shh-anim" style={{ animationDelay: '.3s' }}>
                <Link href="/get-a-quote" className="shh-btn shh-btn-primary">
                  Get a Free Quote
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/contact" className="shh-btn shh-btn-ghost">
                  Get Expert Advice
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>

                {/* Sits in the CTA row rather than on its own line below it —
                    one less stacked block to fit inside the shortened hero. */}
                <a href="tel:+971508746688" className="shh-phone">
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
