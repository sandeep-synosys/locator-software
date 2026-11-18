import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function MissionHero() {
  return (
    <>
      <style>{`
        .msh-hero {
          position: relative;
          /* Force true full viewport width regardless of any parent constraints */
          width: 100vw;
          margin-left: calc(50% - 50vw);
          background-color: #f8f9fb;
          display: flex;
          flex-direction: column;
          /* Increased height to show full image including windmills at top */
          min-height: clamp(480px, 54vh, 620px);
        }

        /* The artwork lives on its own layer inset below the fixed 64px navbar.
           Painting it as the section's own background instead sizes it against
           a box that starts at y=0 — so on wide screens the image fills the
           full height and its top (the windmills) ends up underneath the
           translucent nav bar, reading as cropped. Insetting the layer means
           the contain-fit is computed against the visible area only, so the
           whole image is always in the clear at every screen size. */
        .msh-photo {
          position: absolute;
          top: 64px; right: 0; bottom: 0; left: 0;
          z-index: 0;
          pointer-events: none;
          background-image: url('/about/mission/mission.webp');
          background-size: contain;
          background-position: right bottom;
          background-repeat: no-repeat;
        }

        /* Left-to-right scrim so dark text stays legible over the image */
        .msh-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(248,249,251,.96) 0%,
            rgba(248,249,251,.82) 32%,
            rgba(248,249,251,.30) 55%,
            rgba(248,249,251,0)   68%
          );
        }

        .msh-navwrap { position: relative; z-index: 2; }

        .msh-body {
          position: relative; z-index: 1;
          display: flex; align-items: flex-start;
          /* Top padding + .msh-content's own padding = VisionHero's
             clamp(40px,5vw,64px), so all About heroes open with the same gap. */
          padding: calc(clamp(40px,5vw,64px) - clamp(20px,2.4vw,28px)) 28px clamp(48px,6vw,72px);
        }
        .msh-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        /* Content column — left-aligned, never wider than ~half the section.
           Subtle backdrop behind the text only — no visible box, just enough
           white underneath to lift the text off the image naturally. */
        .msh-content {
          max-width: min(620px, 100%);
          background: linear-gradient(135deg, rgba(248,249,251,.72) 0%, rgba(248,249,251,0) 100%);
          border-radius: 16px;
          padding: clamp(20px,2.4vw,28px);
          margin: -clamp(20px,2.4vw,28px);
        }

        /* Animations */
        @keyframes mshRise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .msh-anim { opacity: 0; animation: mshRise .8s ${EASE} forwards; }
        }

        /* Accent bar */
        .msh-bar { display: none; }
        /* Eyebrow label — same treatment as the Who We Are and Vision heroes. */
        .msh-eyebrow {
          margin: 0 0 clamp(10px,1.2vw,14px);
          font-size: var(--f-13, 13px); font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase; color: #1360ee;
        }

        /* H1 — matches WhoWeAreHero title scale (sized for a multi-line headline) */
        .msh-h1 {
          margin: 0;
          font-size: clamp(28px, calc(1.6vw + 16px), 40px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #0b1220;
          /* Even line lengths: keeps "UAE Businesses" from being stranded alone. */
          text-wrap: balance;
        }
        .msh-h1 em { font-style: normal; color: #1360ee; }

        /* Lead paragraph — matches .wwa-lead */
        .msh-lead {
          margin: clamp(18px,2vw,24px) 0 0; max-width: 54ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: #55607a;
        }

        /* CTA row */
        .msh-cta-row {
          display: flex; gap: 14px; flex-wrap: wrap;
          margin-top: clamp(20px,2.4vw,28px);
        }
        .msh-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700;
          cursor: pointer; padding: 14px 24px; border-radius: 11px;
          border: 1.5px solid transparent; transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px;
          text-decoration: none; white-space: nowrap;
        }
        .msh-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .msh-btn:hover svg { transform: translateX(3px); }
        .msh-btn-primary {
          background: #1360ee; color: #fff;
          box-shadow: 0 10px 24px rgba(19,96,238,.26);
        }
        .msh-btn-primary:hover {
          background: #0d4fd4; transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(19,96,238,.4);
        }
        .msh-btn-ghost {
          background: rgba(255,255,255,.88); color: #14181f;
          border-color: #dfe3ea;
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        }
        .msh-btn-ghost:hover {
          border-color: #1360ee; color: #1360ee; transform: translateY(-1px);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .msh-photo { background-position: right bottom; }
          .msh-scrim {
            background: linear-gradient(
              90deg,
              rgba(248,249,251,.97) 0%,
              rgba(248,249,251,.86) 38%,
              rgba(248,249,251,.28) 62%,
              rgba(248,249,251,0)   76%
            );
          }
          .msh-content { max-width: min(500px, 100%); }
        }

        /* Mobile — full-width background with content overlaid, matching WhoWeAreHero pattern */
        @media (max-width: 768px) {
          .msh-hero {
            position: relative;
            min-height: clamp(600px, 95vh, 750px);
            padding-top: 80px;
            background-color: #f8f9fb;
            display: flex;
            flex-direction: column;
            width: 100vw;
            margin-left: calc(50% - 50vw);
          }
          /* Dedicated mobile crop (portrait, content already framed toward
             the top) instead of stretching the desktop landscape shot —
             same swap SmartIotHero does for its own mobile background. */
          .msh-photo {
            background-image: url('/about/mission/mission-hero.webp');
            background-position: center top;
          }
          /* Subtle gradient behind text for readability */
          .msh-scrim {
            display: block;
            background: linear-gradient(
              180deg,
              rgba(248,249,251,0) 0%,
              rgba(248,249,251,0) 45%,
              rgba(248,249,251,.88) 70%,
              rgba(248,249,251,.96) 100%
            );
          }
          .msh-navwrap { position: relative; z-index: 10; }
          .msh-body {
            position: relative;
            flex: 1;
            display: flex;
            align-items: flex-end;
            padding: clamp(140px,28vw,220px) 22px clamp(36px,8vw,52px);
            z-index: 5;
          }
          .msh-content {
            max-width: 100%;
            background: transparent;
            padding: clamp(16px,4vw,24px);
            margin: 0;
          }
          .msh-btn { padding: 13px 20px; }
        }

        @media (max-width: 420px) {
          .msh-h1 { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
          .msh-cta-row { flex-direction: column; }
          .msh-btn { justify-content: center; width: 100%; }
        }
      `}</style>

      <section className="msh-hero">
        {/* Artwork layer — inset below the fixed navbar so it is never clipped */}
        <div className="msh-photo" aria-hidden="true" />
        {/* Scrim over the background image for text legibility */}
        <div className="msh-scrim" aria-hidden="true" />

        {/* Navbar */}
        <div className="msh-navwrap">
          <SoftwareNavbar />
        </div>

        {/* Content — left side, fully inside the section */}
        <div className="msh-body">
          <div className="msh-inner">
            <div className="msh-content">

              <p className="msh-eyebrow msh-anim" style={{ animationDelay: '0s' }}>Our mission</p>

              <h1 className="msh-h1 msh-anim" style={{ animationDelay: '.04s' }}>
                Helping UAE Businesses Work Smarter with <em>Connected Technology</em>
              </h1>
              {/* <h1 className="msh-h1 msh-anim" style={{ animationDelay: '.04s' }}>
                Delivering GPS Tracking &amp; IoT Solutions <em>for UAE Businesses</em>
              </h1> */}

              <p className="msh-lead msh-anim" style={{ animationDelay: '.14s' }}>
                Our mission is to empower businesses with intelligent GPS tracking, AI-powered IoT and fleet management software that make everyday operations safer, smarter and more efficient.
              </p>

              <div className="msh-cta-row msh-anim" style={{ animationDelay: '.3s' }}>
                <Link href="/contact" className="msh-btn msh-btn-primary">
                  Talk to our team
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/software" className="msh-btn msh-btn-ghost">
                  Explore the platform
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
