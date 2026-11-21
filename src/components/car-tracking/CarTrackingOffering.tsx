import Image from 'next/image'
import Link from 'next/link'
import { CAPABILITIES } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * What the system is for, in three cards.
 *
 * The cards carry a number rather than only an icon: the three are a sequence
 * (see the fleet → cut what it costs → prove it in a report), and numbering them
 * is what makes that argument visible instead of leaving three parallel boxes.
 */
export default function CarTrackingOffering() {
  return (
    <>
      <style>{`
        .cto { background: #fff; padding: clamp(56px,7vw,96px) 28px; }
        .cto-inner { max-width: var(--w-1180); margin: 0 auto; }

        .cto-head { max-width: 780px; margin: 0 auto clamp(40px,5vw,60px); text-align: center; }
        .cto-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .cto-eyebrow::before, .cto-eyebrow::after {
          content: ''; width: 24px; height: 2px; background: #1360ee; border-radius: 2px;
        }
        .cto-title {
          margin: 0; font-size: max(clamp(26px,3.4vw,40px), min(2.778vw, 58px));
          font-weight: 800; line-height: 1.14; letter-spacing: -.028em; color: #1d1d1f;
        }
        .cto-lead {
          margin: clamp(18px,2.2vw,24px) auto 0; max-width: 68ch;
          font-size: max(clamp(15px,1.4vw,17px), min(1.181vw, 24.65px)); line-height: 1.75; color: #6e6e73;
        }

        .cto-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(18px,2.2vw,26px);
        }
        @media (max-width: 940px) { .cto-grid { grid-template-columns: 1fr; max-width: 620px; margin: 0 auto; } }

        .cto-card {
          position: relative; display: flex; flex-direction: column; overflow: hidden;
          background: #fff; border: 1px solid #e8ecf4; border-radius: 20px;
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE}, border-color .38s ${EASE};
        }
        .cto-body { position: relative; display: flex; flex-direction: column; flex: 1; padding: clamp(26px,3vw,34px); }
        /* The tint washes in from the top on hover rather than the whole card
           changing colour — it keeps the body text on white, where it stays
           readable, and it is the same move the rest of the site's cards use. */
        .cto-card::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(180deg, rgba(19,96,238,.05), transparent 58%);
          opacity: 0; transition: opacity .38s ${EASE};
        }
        .cto-card:hover {
          transform: translateY(-4px); border-color: #d6e2fb;
          box-shadow: 0 26px 50px -28px rgba(20,40,90,.42);
        }
        .cto-card:hover::before { opacity: 1; }

        /* The three illustrations arrive at different aspect ratios, so the media
           box fixes one and letterboxes them into it — otherwise the cards start
           at three different heights and the row loses its baseline. */
        .cto-media {
          position: relative; aspect-ratio: 4 / 3; overflow: hidden;
          background: linear-gradient(160deg,#f2f7ff,#fbfcff);
          border-bottom: 1px solid #eef1f7;
        }
        .cto-media img {
          width: 100%; height: 100%; object-fit: contain; display: block;
          padding: clamp(14px,2vw,22px);
          transition: transform .45s ${EASE};
        }
        .cto-card:hover .cto-media img { transform: scale(1.04); }

        .cto-num {
          position: absolute; top: 14px; right: 16px; z-index: 1;
          font-size: var(--f-13); font-weight: 800; letter-spacing: .1em;
          color: #a9b6cc; font-variant-numeric: tabular-nums;
        }

        .cto-card h3 {
          position: relative; margin: 0 0 12px;
          font-size: max(clamp(17px,1.7vw,20px), min(1.389vw, 29px));
          font-weight: 800; letter-spacing: -.018em; color: #1d1d1f; line-height: 1.28;
        }
        .cto-card p {
          position: relative; margin: 0 0 clamp(20px,2.4vw,26px); flex: 1;
          font-size: var(--f-14-5); line-height: 1.72; color: #6e6e73;
        }

        .cto-link {
          position: relative; display: inline-flex; align-items: center; gap: 7px;
          font-size: var(--f-13-5); font-weight: 700; color: #1360ee; text-decoration: none;
          align-self: flex-start;
        }
        .cto-link svg { width: 15px; height: 15px; transition: transform .28s ${EASE}; }
        .cto-card:hover .cto-link svg { transform: translateX(4px); }
        /* Underline grows from the left on hover — drawn with a pseudo-element so
           it animates, which text-decoration cannot do. */
        .cto-link::after {
          content: ''; position: absolute; left: 0; bottom: -3px; height: 1.5px; width: 100%;
          background: currentColor; transform: scaleX(0); transform-origin: left center;
          transition: transform .32s ${EASE};
        }
        .cto-card:hover .cto-link::after { transform: scaleX(1); }
      `}</style>

      <section className="cto">
        <div className="cto-inner">
          <header className="cto-head" data-reveal>
            <p className="cto-eyebrow">What we offer</p>
            <h2 className="cto-title">A Car Tracking System That Makes Fleet Monitoring Simple</h2>
            <p className="cto-lead">
              With LOCATOR fitted, it does not matter what your vehicles are being used for or
              where they are working — you can see all of it. These are the three reasons it is
              regarded as the best car tracking device and software in the UAE.
            </p>
          </header>

          <div className="cto-grid">
            {CAPABILITIES.map((c, i) => (
              <article key={c.title} className="cto-card" data-reveal data-reveal-delay={i * 110}>
                <div className="cto-media">
                  <span className="cto-num">{String(i + 1).padStart(2, '0')}</span>
                  <Image src={c.img} alt={c.alt} width={1143} height={863} sizes="(max-width: 940px) 92vw, 360px" />
                </div>
                <div className="cto-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <Link href={c.href} className="cto-link">
                    Read details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
