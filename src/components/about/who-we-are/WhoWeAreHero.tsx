import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'


const EASE = 'cubic-bezier(.22,.61,.36,1)'


/**
 * Who We Are — hero.
 *
 * A single photo (Earth at night, lit cities across the Gulf) anchored to
 * the right edge in a bounded-width box — not stretched full-bleed — so it
 * never has to be zoom-cropped to fill an ultra-wide section. Keeping the
 * box's aspect ratio close to the photo's own means the crop stays gentle
 * (mostly trimming the photo's blank left margin, not its content), and the
 * copy on the left sits on the section's plain white background rather than
 * on a stretched, foggy edge of the image.
 *
 * Three breakpoints (1024 / 768) shift three things together: how wide the
 * photo box is, where the photo is anchored (object-position), and how wide
 * the copy column is allowed to get — so text and photo stay balanced
 * instead of the photo just getting squeezed.
 */
export default function WhoWeAreHero() {
  return (
    <>
      <style>{`
        .wwa-hero {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: clamp(400px, 46vh, 520px);
        }


        .wwa-photo { position: absolute; top: 0; right: 0; bottom: 0; width: min(1180px, 62%); z-index: 0; }
        .wwa-photo img { object-fit: cover; object-position: 100% center; }
        .wwa-photo-mobile { display: none; }


        /* Left-to-right white fade so the copy always sits on a legible
           field, timed to meet the photo box's left edge (widened at each
           breakpoint below as the box narrows). No bottom fade — the photo
           box is inset from the section edges, so there's no hard seam to
           blend. */
        .wwa-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(90deg, #fff 0%, #fff 34%, rgba(255,255,255,0) 60%);
        }


        .wwa-navwrap { position: relative; z-index: 3; }


        .wwa-body { position: relative; z-index: 2; flex: 1; display: flex; align-items: center; padding: clamp(20px,3vw,36px) 28px clamp(40px,5vw,60px); }
        .wwa-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .wwa-content { max-width: min(660px, 100%); }


        @keyframes wwaRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .wwa-anim { opacity: 0; animation: wwaRise .8s ${EASE} forwards; } }


        .wwa-title {
          margin: 0;
          font-size: clamp(28px, calc(2.5vw + 16px), 46px);
          font-weight: 800; line-height: 1.16; letter-spacing: -.022em;
          color: #0b1220;
        }
        .wwa-title em { display: block; font-style: normal; color: #1360ee; }


        .wwa-lead {
          margin: clamp(14px,1.6vw,18px) 0 0; max-width: 48ch;
          font-size: clamp(15px, 1.05vw, 17px);
          line-height: 1.72; color: #55607a;
        }


        .wwa-badge { display: inline-flex; align-items: center; gap: 9px; margin-top: clamp(16px,2vw,20px); }
        .wwa-badge-mark { position: relative; width: 17px; height: 17px; border-radius: 50%; background: #1360ee; flex-shrink: 0; overflow: hidden; }
        .wwa-badge-mark::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,.85) 0%, transparent 55%); }
        .wwa-badge-label { font-size: var(--f-13-5); color: #6b7280; }
        .wwa-badge-name { font-size: var(--f-14-5); font-weight: 800; color: #0b1220; }
          /* Muted logo by default; reveal brand colors when the badge is hovered. */
          .wwa-badge-logo {
            display: inline-block;
            vertical-align: middle;
            filter: grayscale(1) opacity(.66);
            transition: filter .35s ${EASE};
          }
          .wwa-badge:hover .wwa-badge-logo {
            filter: grayscale(0) opacity(1);
          }
          @media (prefers-reduced-motion: reduce) {
            .wwa-badge-logo { transition: none; }
          }


        .wwa-cta-row { display: flex; gap: 14px; margin-top: clamp(20px,2.4vw,28px); flex-wrap: wrap; }
        .wwa-btn {
          font-family: inherit; font-size: var(--f-14); font-weight: 700; cursor: pointer;
          padding: 14px 24px; border-radius: 11px; border: 1.5px solid transparent;
          transition: .18s ${EASE};
          display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
        }
        .wwa-btn svg { transition: transform .18s ${EASE}; flex-shrink: 0; }
        .wwa-btn:hover svg { transform: translateX(3px); }
        .wwa-btn-primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.28); }
        .wwa-btn-primary:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(19,96,238,.4); }
        .wwa-btn-ghost { background: rgba(255,255,255,.85); color: #14181f; border-color: #dfe3ea; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
        .wwa-btn-ghost:hover { border-color: #1360ee; color: #1360ee; transform: translateY(-1px); }


        /* ── Tablet: photo box narrows, so the fade has to start sooner
           and the copy column has to give up some of its max-width. ── */
        @media (max-width: 1024px) {
          .wwa-photo { width: min(760px, 56%); }
          .wwa-scrim { background: linear-gradient(90deg, #fff 0%, #fff 42%, rgba(255,255,255,0) 68%); }
          .wwa-content { max-width: min(540px, 100%); }
        }


        /* ── Mobile: full-width background with content overlaid ── */
        @media (max-width: 768px) {
          .wwa-hero {
            position: relative;
            min-height: clamp(600px, 95vh, 750px);
            padding-top: 80px;
            background-image: url('/about/who-we-are/our-vision-mobile.webp');
            background-size: contain;
            background-position: center calc(15% + 40px);
            background-repeat: no-repeat;
            background-color: #f0f4ff;
            display: flex;
            flex-direction: column;
            width: 100vw;
            margin-left: calc(50% - 50vw);
          }
          .wwa-photo {
            display: none;
          }
          .wwa-photo-desktop {
            display: none;
          }
          .wwa-photo-mobile {
            display: none;
          }
          /* Subtle gradient behind text for readability */
          .wwa-scrim { 
            display: block;
            background: linear-gradient(
              180deg, 
              rgba(255,255,255,0) 0%, 
              rgba(255,255,255,0) 45%,
              rgba(255,255,255,.88) 70%,
              rgba(255,255,255,.96) 100%
            );
          }
          .wwa-navwrap { position: relative; z-index: 10; }
          .wwa-body { 
            position: relative;
            flex: 1;
            display: flex;
            align-items: flex-end;
            padding: clamp(140px,28vw,220px) 22px clamp(36px,8vw,52px); 
            z-index: 5;
            background: none;
          }
          .wwa-content { max-width: 100%; }
          .wwa-btn { padding: 13px 20px; }
        }


        @media (max-width: 420px) {
          .wwa-title { font-size: clamp(24px, 7.2vw, 29px); letter-spacing: -.016em; }
        }
      `}</style>


      <section className="wwa-hero">
        <div className="wwa-photo" aria-hidden="true">
          <Image
            src="/about/who-we-are/hero-about.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="wwa-photo-desktop"
          />
          <div className="wwa-photo-mobile">
            <Image
              src="/about/who-we-are/our-vision-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
        </div>
        <div className="wwa-scrim" aria-hidden="true" />


        <div className="wwa-navwrap">
          <SoftwareNavbar />
        </div>


        <div className="wwa-body">
          <div className="wwa-inner">
            <div className="wwa-content">
              <h1 className="wwa-title wwa-anim" style={{ animationDelay: '.05s' }}>
                <span style={{ color: '#0b1220' }}>Who</span>{' '}
                <span style={{ color: '#1360ee' }}>We Are</span>
              </h1>


              <p className="wwa-lead wwa-anim" style={{ animationDelay: '.14s' }}>
                LOCATOR is more than a GPS tracking provider — we're a technology company building intelligent fleet telematics and IoT solutions that connect vehicles and assets, and turn real-time data into actionable business intelligence.
              </p>


              <div className="wwa-badge wwa-anim" style={{ animationDelay: '.22s' }}>
                <span className="wwa-badge-label">Part of</span>
                <Image
                  src="/about/who-we-are/sysnonas.png"
                  alt="Synosys"
                  width={90}
                  height={28}
                  className="wwa-badge-logo"
                />
              </div>


              <div className="wwa-cta-row wwa-anim" style={{ animationDelay: '.3s' }}>
                <Link href="/contact" className="wwa-btn wwa-btn-primary">
                  Talk to our team
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/software" className="wwa-btn wwa-btn-ghost">
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
