import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import { ABOUT_PAGES } from '@/components/about/data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * Shared hero for the About pillar pages — Vision, Mission, Core Values.
 *
 * Same concept as the Who We Are hero (WhoWeAreHero.tsx), deliberately: these
 * four pages are siblings and a visitor moves between them through the
 * "Explore more about" grid, so they need to read as one system rather than
 * four separately-decorated pages. A signal originates from a point above the
 * headline and propagates outward as evenly-spaced arcs, everything built on
 * the same centre axis as the type.
 *
 * The rules that keep it drawn rather than scattered are the same three:
 *   1. preserveAspectRatio="xMidYMin slice" so circles stay CIRCLES at every
 *      viewport instead of stretching into ellipses.
 *   2. Radii on one constant 130-unit rhythm, opacity falling off with them.
 *   3. Everything masked so it dissolves before it reaches the type.
 *
 * What differs from Who We Are is what the composition resolves TO: there the
 * signal lands on a horizon carrying the sector chips, here it lands on the
 * full-bleed lead band, which is this layout's own anchor. The page icon sits
 * at the origin of the arcs, so each pillar's mark is literally the source of
 * its signal.
 *
 * Server component — pure CSS and inline SVG, no client JS.
 */
export default function AboutPillarHero({
  slug,
  title,
  lead,
}: {
  slug: string
  title: string
  lead: string
}) {
  const active = ABOUT_PAGES.find(p => p.slug === slug)!

  if (slug === 'core-values') {
    return (
      <>
        <style>{`
          .cv-hero {
            position: relative;
            overflow: hidden;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            min-height: clamp(480px, 52vh, 680px);
            margin-top: -1px;
          }

          .cv-photo {
            position: absolute;
            top: 64px;
            right: 0;
            bottom: 0;
            width: min(1180px, 62%);
            z-index: 0;
          }
          .cv-photo img {
            object-fit: cover;
            object-position: right center;
          }

          .cv-scrim {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            background: linear-gradient(90deg, #fff 0%, #fff 38%, rgba(255,255,255,0) 66%);
          }

          .cv-navwrap { position: relative; z-index: 3; }

          .cv-body {
            position: relative;
            z-index: 2;
            flex: 1;
            display: flex;
            /* Top-anchored with the same top padding as VisionHero, so the
               eyebrow sits the same distance below the navbar on every About
               hero (it was vertically centred, which left it tighter here). */
            align-items: flex-start;
            padding: clamp(40px, 5vw, 64px) 28px clamp(40px, 5vw, 60px);
          }

          .cv-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
          .cv-content { max-width: min(700px, 100%); }

          .cv-kicker {
            display: block;
            margin-bottom: 18px;
            font-size: clamp(13px, 1.1vw, 16px);
            font-weight: 800;
            letter-spacing: .08em;
            line-height: 1.2;
            color: #1360ee;
            text-transform: uppercase;
          }
          .cv-kicker::before {
            content: '';
            display: block;
            width: 34px;
            height: 3px;
            background: #1360ee;
            border-radius: 2px;
            margin-bottom: 12px;
          }

          /* Sized for a multi-line headline — matches the Mission hero H1. */
          .cv-title {
            margin: 0;
            max-width: 42ch;
            font-size: clamp(28px, calc(1.6vw + 16px), 40px);
            font-weight: 800;
            line-height: 1.16;
            letter-spacing: -.022em;
            color: #0b1220;
            text-wrap: balance;
          }
          .cv-title .cv-accent {
            color: #1360ee;
          }

          .cv-desc {
            margin: clamp(18px, 2vw, 24px) 0 0;
            max-width: 54ch;
            font-size: clamp(15px, 1.05vw, 17px);
            line-height: 1.72;
            color: #55607a;
          }

          .cv-cta-row {
            display: flex;
            gap: 14px;
            margin-top: clamp(20px, 2.4vw, 28px);
            flex-wrap: wrap;
          }

          .cv-btn {
            font-family: inherit;
            font-size: var(--f-14);
            font-weight: 700;
            cursor: pointer;
            padding: 16px 26px;
            border-radius: 11px;
            border: 1.5px solid transparent;
            transition: .18s ${EASE};
            display: inline-flex;
            align-items: center;
            gap: 9px;
            text-decoration: none;
          }

          .cv-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
          .cv-btn:hover svg { transform: translateX(3px); }

          .cv-btn-primary {
            background: #1360ee;
            color: #fff;
            box-shadow: 0 10px 24px rgba(19,96,238,.28);
          }
          .cv-btn-primary:hover {
            background: #0d4fd4;
            transform: translateY(-1px);
            box-shadow: 0 12px 30px rgba(19,96,238,.4);
          }

          .cv-btn-ghost {
            background: rgba(255,255,255,.82);
            color: #14181f;
            border-color: #dfe3ea;
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
          }
          .cv-btn-ghost:hover {
            border-color: #1360ee;
            color: #1360ee;
            transform: translateY(-1px);
          }

          .cv-float {
            position: absolute;
            right: 18px;
            top: 120px;
            z-index: 2;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .cv-float a {
            width: 66px;
            height: 66px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            color: #fff;
            text-decoration: none;
            box-shadow: 0 14px 34px rgba(19,96,238,.18);
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(180deg, #1ed48d 0%, #24bf7a 100%);
          }

          @media (max-width: 1024px) {
            .cv-photo { width: min(860px, 56%); }
            .cv-scrim { background: linear-gradient(90deg, #fff 0%, #fff 42%, rgba(255,255,255,0) 68%); }
            .cv-content { max-width: min(540px, 100%); }
          }

          @media (max-width: 768px) {
            .cv-hero {
              min-height: clamp(580px, 90vh, 720px);
              /* Dedicated mobile crop (portrait, content already framed
                 toward the top) instead of stretching the desktop landscape
                 shot — same swap MissionHero/SmartIotHero do for mobile. */
              background-image: url('/about/core-values/core-values-hero.webp');
              /* Bottom-anchored, not top: the hand sits right at this crop's
                 own top edge, and this section's fixed navbar sits over the
                 section's top 64px — a top anchor would put the hand right
                 behind it (the exact bug fixed earlier on this same page).
                 The crop's blank lower half gives enough clearance instead. */
              background-size: contain;
              background-position: center bottom;
              background-repeat: no-repeat;
              background-color: #e8eef5;
              width: 100vw;
              margin-left: calc(50% - 50vw);
              padding-top: 0;
            }
            .cv-photo { display: none; }
            .cv-scrim {
              background: linear-gradient(
                180deg, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0) 35%,
                rgba(255,255,255,.85) 65%,
                rgba(255,255,255,.96) 100%
              );
            }
            .cv-navwrap {
              position: relative;
              z-index: 10;
            }
            .cv-body {
              display: flex;
              align-items: flex-end;
              padding: clamp(180px, 35vw, 280px) 22px clamp(40px, 9vw, 60px);
            }
            .cv-content { max-width: 100%; }
            .cv-kicker { font-size: clamp(13px, 3.4vw, 15px); }
            .cv-title { font-size: clamp(26px, 7.4vw, 34px); line-height: 1.16; }
            .cv-btn { padding: 14px 20px; }
            .cv-float { display: none; }
          }

          @media (max-width: 420px) {
            .cv-title { letter-spacing: -.022em; }
          }
        `}</style>

        <section className="cv-hero">
          <div className="cv-photo" aria-hidden="true">
            <Image
              src="/about/core-values/core-values.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="cv-scrim" aria-hidden="true" />

          <div className="cv-navwrap">
            <SoftwareNavbar />
          </div>

          <div className="cv-body">
            <div className="cv-inner">
              <div className="cv-content">
                <span className="cv-kicker">Our core values</span>
                <h1 className="cv-title">
                  How Our Core Values Shape the Future of <span className="cv-accent">Fleet Technology</span>
                </h1>
                <p className="cv-desc">
                  At LOCATOR, our core values shape how we develop technology, support our customers and
                  build lasting partnerships.
                </p>
                {/* A shared system of values shapes how we build, collaborate, and deliver better outcomes for every customer, partner, and team member. */}

                <div className="cv-cta-row">
                  <a href="/contact" className="cv-btn cv-btn-primary">
                    Talk to our team
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                  <a href="/software" className="cv-btn cv-btn-ghost">
                    Explore the platform
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="cv-float" aria-label="Quick contact">
            <a href="https://wa.me/971000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">◌</a>
            <a href="https://wa.me/971000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">◌</a>
          </div> */}
        </section>
      </>
    )
  }

  return (
    <>
      <style>{`
        /* A mesh rather than one wash. The single near-white radial that was
           here left the section 95% flat white, which is the other half of why
           it read as empty — there was nothing for the eye to land on between
           the mark and the band. Three overlapping fields give the plate actual
           depth while still resolving to white behind the type. */
        .apx-hero {
          position: relative; overflow: hidden; isolation: isolate;
          background:
            radial-gradient(52% 42% at 18% 8%, rgba(6,164,226,.10) 0%, transparent 70%),
            radial-gradient(48% 40% at 84% 14%, rgba(19,96,238,.11) 0%, transparent 72%),
            radial-gradient(150% 105% at 50% -18%, #e6eeff 0%, #f3f7ff 30%, #ffffff 64%);
          padding: clamp(16px,2vw,28px) 28px 0;
        }

        /* Beam. The clip lives on the ::before and the blur on the parent —
           CSS applies filter BEFORE clip-path, so blurring a clipped element
           directly leaves the diagonals crisp and the whole thing reads as a
           grey triangle rather than as light. */
        .apx-beam {
          position: absolute; z-index: 0; pointer-events: none;
          top: -20%; left: 50%; transform: translateX(-50%);
          width: min(1280px, 104%); height: 92%;
          filter: blur(74px);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 24%, #000 76%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 24%, #000 76%, transparent 100%);
        }
        .apx-beam::before {
          content: ''; position: absolute; inset: 0;
          clip-path: polygon(41% 0%, 59% 0%, 100% 100%, 0% 100%);
          background: linear-gradient(180deg,
            rgba(19,96,238,.17) 0%,
            rgba(19,96,238,.08) 42%,
            rgba(6,164,226,.035) 70%,
            transparent 92%);
        }

        .apx-arcs {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%; pointer-events: none;
          -webkit-mask-image: radial-gradient(ellipse 66% 70% at 50% 2%, #000 12%, rgba(0,0,0,.55) 46%, transparent 80%);
          mask-image: radial-gradient(ellipse 66% 70% at 50% 2%, #000 12%, rgba(0,0,0,.55) 46%, transparent 80%);
        }
        @keyframes apxProp {
          0%   { opacity: 0;   transform: scale(.94); }
          18%  { opacity: 1; }
          70%  { opacity: .55; }
          100% { opacity: 0;   transform: scale(1.07); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .apx-arc { transform-origin: 800px 90px; animation: apxProp 12s ${EASE} infinite; }
          .apx-arc--2 { animation-delay: -2.4s; }
          .apx-arc--3 { animation-delay: -4.8s; }
          .apx-arc--4 { animation-delay: -7.2s; }
          .apx-arc--5 { animation-delay: -9.6s; }
        }
        @media (prefers-reduced-motion: reduce) { .apx-arc { opacity: .5; } }

        .apx-inner { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; text-align: center; padding-top: clamp(14px,2.4vw,30px); }

        @keyframes apxRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .apx-anim { opacity: 0; animation: apxRise .75s ${EASE} forwards; } }

        .apx-core {
          position: relative;
          width: clamp(230px, 27vw, 330px);
          aspect-ratio: 1;
          margin: 0 auto;
          display: grid; place-items: center;
        }
        .apx-core svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        @keyframes apxDial { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: no-preference) {
          .apx-dial { transform-origin: 200px 200px; animation: apxDial 90s linear infinite; }
        }
        .apx-core::before {
          content: ''; position: absolute; inset: 22%;
          border-radius: 50%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.20) 0%, rgba(6,164,226,.10) 45%, transparent 72%);
          filter: blur(14px);
        }

        .apx-icon {
          position: relative; z-index: 1;
          width: 74px; height: 74px; border-radius: 21px;
          display: grid; place-items: center;
          background: linear-gradient(150deg, #1360ee 0%, #0d73e3 100%);
          color: #fff;
          box-shadow:
            0 18px 38px -12px rgba(19,96,238,.55),
            0 0 0 1px rgba(19,96,238,.16),
            0 0 0 10px rgba(255,255,255,.72),
            0 0 0 11px rgba(19,96,238,.10);
        }

        .apx-eyebrow {
          display: inline-flex; align-items: center; gap: 13px;
          margin-top: clamp(-6px, -.6vw, 0px);
          font-size: clamp(13px, 1.15vw, 18px);
          font-weight: 800; letter-spacing: .2em; text-transform: uppercase;
          color: #1360ee;
        }
        .apx-eyebrow i {
          display: block; width: clamp(28px, 2.4vw, 40px); height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, transparent, #1360ee);
        }
        .apx-eyebrow i:last-child { background: linear-gradient(90deg, #1360ee, transparent); }

        .apx-title {
          margin: clamp(16px,1.8vw,22px) auto 0; max-width: 16ch;
          font-size: clamp(30px, calc(4vw + 14.4px), 72px);
          font-weight: 800; line-height: 1.05; letter-spacing: -.03em;
          background: linear-gradient(105deg, #1360ee 0%, #0d73e3 46%, #06a4e2 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          overflow-wrap: break-word;
        }
        @media (max-width: 420px) { .apx-title { max-width: 13ch; letter-spacing: -.022em; } }

        .apx-lead-band {
          position: relative; z-index: 1;
          margin-top: clamp(30px,3.8vw,48px);
          margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw);
          width: 100vw;
          background: linear-gradient(180deg, #f6f8fc 0%, #f2f5fa 100%);
          border-top: 1px solid #e9edf6; border-bottom: 1px solid #e9edf6;
          padding: clamp(28px,4vw,52px) 28px;
        }
        .apx-lead {
          margin: 0 auto; max-width: 820px;
          font-size: max(clamp(16px,1.7vw,20px), min(1.389vw, 29px)); line-height: 1.7;
          font-weight: 500; color: #2b3446; text-align: center;
        }
      `}</style>

      <section className="apx-hero">
        <div className="apx-beam" aria-hidden="true" />

        <svg
          className="apx-arcs"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="none" stroke="#1360ee" strokeWidth="1.1">
            <circle className="apx-arc apx-arc--1" cx="800" cy="90" r="300" strokeOpacity=".42" />
            <circle className="apx-arc apx-arc--2" cx="800" cy="90" r="430" strokeOpacity=".35" />
            <circle className="apx-arc apx-arc--3" cx="800" cy="90" r="560" strokeOpacity=".28" />
            <circle className="apx-arc apx-arc--4" cx="800" cy="90" r="690" strokeOpacity=".21" />
            <circle className="apx-arc apx-arc--5" cx="800" cy="90" r="820" strokeOpacity=".14" />
          </g>
        </svg>

        <SoftwareNavbar />

        <div className="apx-inner">
          <div className="apx-core apx-anim">
            <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
              <g fill="none" stroke="#1360ee">
                <circle cx="200" cy="200" r="196" strokeOpacity=".30" />
                <circle cx="200" cy="200" r="150" strokeOpacity=".22" strokeDasharray="2 7" />
                <circle cx="200" cy="200" r="104" strokeOpacity=".16" />
              </g>

              <g className="apx-dial" stroke="#1360ee" strokeLinecap="round">
                {Array.from({ length: 60 }, (_, i) => {
                  const major = i % 5 === 0
                  const a = (i * 6 * Math.PI) / 180
                  const outer = 196
                  const inner = major ? 178 : 187
                  return (
                    <line
                      key={i}
                      x1={200 + Math.sin(a) * inner}
                      y1={200 - Math.cos(a) * inner}
                      x2={200 + Math.sin(a) * outer}
                      y2={200 - Math.cos(a) * outer}
                      strokeWidth={major ? 1.8 : 1}
                      strokeOpacity={major ? 0.55 : 0.28}
                    />
                  )
                })}
              </g>
            </svg>

            <div className="apx-icon">{active.icon}</div>
          </div>

          <span className="apx-eyebrow apx-anim" style={{ animationDelay: '.08s' }}>
            <i /> {active.tagline} <i />
          </span>

          <h1 className="apx-anim apx-title" style={{ animationDelay: '.14s' }}>
            {title}
          </h1>

          {lead ? (
            <div className="apx-anim apx-lead-band" style={{ animationDelay: '.22s' }}>
              <p className="apx-lead">{lead}</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
