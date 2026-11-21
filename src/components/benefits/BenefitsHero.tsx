import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// The hero is deliberately typographic. The page's whole argument is a list of
// reasons, so the opening should read like the first page of an article rather
// than a product splash — one title, one line of context, and nothing competing
// with them. The only ornament is a fine dot grid, masked so it fades out before
// it reaches the text; it gives the white a texture without introducing a colour.
export default function BenefitsHero() {
  return (
    <>
      <style>{`
        .bgt-hero {
          position: relative; overflow: hidden; background: #fff;
          padding: clamp(16px,2vw,28px) 28px clamp(56px,7vw,88px);
        }
        .bgt-hero::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(15,17,23,.10) 1px, transparent 0);
          background-size: 24px 24px;
          /* Masked, not faded with a colour overlay — the dots simply stop
             existing before they can crowd the headline. */
          -webkit-mask-image: radial-gradient(ellipse 76% 68% at 50% -4%, #000 0%, transparent 72%);
          mask-image: radial-gradient(ellipse 76% 68% at 50% -4%, #000 0%, transparent 72%);
        }

        .bgt-hero-inner {
          position: relative; z-index: 1;
          max-width: var(--w-940); margin: 0 auto;
          padding-top: clamp(28px,5vw,56px);
        }

        /* Staggered entrance. Every child sets its own --d and they all share one
           keyframe, so adding a line to the hero costs one attribute. */
        @keyframes bgtRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) {
          .bgt-anim { opacity: 0; animation: bgtRise .8s ${EASE} var(--d, 0ms) forwards; }
        }

        .bgt-crumb {
          display: flex; align-items: center; gap: 9px;
          font-size: var(--f-13); font-weight: 500; color: #9aa1ad; margin-bottom: clamp(22px,3vw,34px);
        }
        .bgt-crumb a { color: #6e6e73; text-decoration: none; transition: color .2s ${EASE}; }
        .bgt-crumb a:hover { color: #1360ee; }
        .bgt-crumb span[aria-current] { color: #1d1d1f; font-weight: 600; }

        .bgt-eyebrow {
          display: flex; align-items: center; gap: 12px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin-bottom: 20px;
        }
        .bgt-eyebrow::before {
          content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px;
        }

        .bgt-title {
          margin: 0; max-width: 15ch;
          font-size: max(clamp(38px,6vw,74px), min(5.139vw, 107.3px)); font-weight: 800;
          line-height: 1.02; letter-spacing: -.035em; color: #1d1d1f;
        }
        /* The one word that carries the page. Weight and colour do the emphasis —
           no gradient fill, which at this size reads as decoration rather than
           as meaning.

           #1360ee, the theme blue, not the #0a89dd sky accent this used to use.
           The sky tone is an eyebrow/hairline colour: against white it only
           reaches 3.7:1, which is under AA and visibly washes out at display
           size. The theme blue reaches 5.3:1 and matches the emphasis colour
           every other hero on the site uses. */
        .bgt-title em { font-style: normal; color: #1360ee; }

        .bgt-lead {
          margin: clamp(22px,3vw,30px) 0 0; max-width: 62ch;
          font-size: max(clamp(16px,1.6vw,19px), min(1.319vw, 27.55px)); line-height: 1.72; color: #6e6e73;
        }

        .bgt-rule {
          margin-top: clamp(30px,4vw,44px); height: 1px; background: #e8ecf4;
          transform-origin: left center;
        }
        @media (prefers-reduced-motion: no-preference) {
          .bgt-rule { animation: bgtWipe 1.1s ${EASE} .45s both; }
          @keyframes bgtWipe { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        }
      `}</style>

      <section className="bgt-hero">
        <SoftwareNavbar />

        <div className="bgt-hero-inner">
          <nav className="bgt-crumb bgt-anim" style={{ '--d': '0ms' } as React.CSSProperties} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Benefits of GPS Tracking</span>
          </nav>

          <p className="bgt-eyebrow bgt-anim" style={{ '--d': '80ms' } as React.CSSProperties}>
            Why fleets switch
          </p>

          <h1 className="bgt-title bgt-anim" style={{ '--d': '150ms' } as React.CSSProperties}>
            11 Benefits of <em>GPS Tracking</em> for Your Fleet
          </h1>

          <p className="bgt-lead bgt-anim" style={{ '--d': '240ms' } as React.CSSProperties}>
            GPS tracking stopped being a dot on a map a long time ago. Used properly it
            settles disputes, ends guesswork about overtime, recovers stolen vehicles and
            takes a measurable bite out of every recurring cost a fleet carries. Here is
            what it actually changes, one line at a time.
          </p>

          <div className="bgt-rule" aria-hidden="true" />
        </div>
      </section>
    </>
  )
}
