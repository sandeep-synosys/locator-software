import Link from 'next/link'
import { FEATURES } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * The three pillars.
 *
 * Each card drives its own accent through a --accent custom property set on the
 * element, so the icon, the hover rule and the link all pick up one value and a
 * fourth card only needs a colour in the data file — no new CSS.
 */
export default function VehicleTrackingFeatures() {
  return (
    <>
      <style>{`
        .vtf { background: #fff; padding: 0 28px clamp(56px,7vw,96px); }
        .vtf-inner { max-width: var(--w-1180); margin: 0 auto; }

        .vtf-head { max-width: 700px; margin: 0 auto clamp(40px,5vw,58px); text-align: center; }
        .vtf-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .vtf-eyebrow::before, .vtf-eyebrow::after {
          content: ''; width: 24px; height: 2px; background: #1360ee; border-radius: 2px;
        }
        .vtf-title {
          margin: 0; font-size: max(clamp(26px,3.4vw,40px), min(2.778vw, 58px));
          font-weight: 800; line-height: 1.14; letter-spacing: -.028em; color: #1d1d1f;
        }
        .vtf-lead {
          margin: clamp(18px,2.2vw,24px) auto 0; max-width: 62ch;
          font-size: var(--f-16); line-height: 1.74; color: #6e6e73;
        }

        .vtf-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(18px,2.2vw,26px); }
        @media (max-width: 940px) { .vtf-grid { grid-template-columns: 1fr; max-width: 620px; margin: 0 auto; } }

        .vtf-card {
          position: relative; overflow: hidden; display: flex; flex-direction: column;
          background: #fff; border: 1px solid #e8ecf4; border-radius: 20px;
          padding: clamp(26px,3vw,34px);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE}, border-color .38s ${EASE};
        }
        /* The accent only appears on approach — at rest the three cards are one
           calm row, which is what stops a tri-colour grid looking like a toy. */
        .vtf-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent); transform: scaleX(0); transform-origin: left center;
          transition: transform .45s ${EASE};
        }
        .vtf-card::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, var(--tint), transparent 55%);
          opacity: 0; transition: opacity .38s ${EASE};
        }
        .vtf-card:hover {
          transform: translateY(-5px); border-color: color-mix(in srgb, var(--accent) 32%, #e8ecf4);
          box-shadow: 0 28px 54px -30px color-mix(in srgb, var(--accent) 45%, transparent);
        }
        .vtf-card:hover::before { transform: scaleX(1); }
        .vtf-card:hover::after { opacity: 1; }

        .vtf-ico {
          position: relative; width: 56px; height: 56px; border-radius: 16px;
          display: grid; place-items: center; margin-bottom: clamp(20px,2.4vw,26px);
          background: var(--tint); color: var(--accent);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE};
        }
        .vtf-ico svg { width: 26px; height: 26px; }
        .vtf-card:hover .vtf-ico {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 16px 28px -14px color-mix(in srgb, var(--accent) 70%, transparent);
        }

        .vtf-card h3 {
          position: relative; margin: 0 0 12px;
          font-size: max(clamp(17px,1.7vw,20px), min(1.389vw, 29px));
          font-weight: 800; letter-spacing: -.018em; color: #1d1d1f; line-height: 1.28;
        }
        .vtf-card p {
          position: relative; margin: 0 0 clamp(22px,2.6vw,28px); flex: 1;
          font-size: var(--f-14-5); line-height: 1.72; color: #6e6e73;
        }

        .vtf-link {
          position: relative; align-self: flex-start;
          display: inline-flex; align-items: center; gap: 7px;
          font-size: var(--f-13-5); font-weight: 700; color: var(--accent); text-decoration: none;
        }
        .vtf-link svg { width: 15px; height: 15px; transition: transform .28s ${EASE}; }
        .vtf-card:hover .vtf-link svg { transform: translateX(4px); }
        .vtf-link::after {
          content: ''; position: absolute; left: 0; bottom: -3px; height: 1.5px; width: 100%;
          background: currentColor; transform: scaleX(0); transform-origin: left center;
          transition: transform .32s ${EASE};
        }
        .vtf-card:hover .vtf-link::after { transform: scaleX(1); }
      `}</style>

      <section className="vtf">
        <div className="vtf-inner">
          <header className="vtf-head" data-reveal>
            <p className="vtf-eyebrow">What it does</p>
            <h2 className="vtf-title">Three Things Every Vehicle Tracking System Should Get Right</h2>
            <p className="vtf-lead">
              Most vehicle tracking software can put a dot on a map. These are the parts that
              decide whether it is still earning its keep a year later.
            </p>
          </header>

          <div className="vtf-grid">
            {FEATURES.map((f, i) => (
              <article
                key={f.title}
                className="vtf-card"
                data-reveal
                data-reveal-delay={i * 110}
                style={{ '--accent': f.accent, '--tint': f.tint } as React.CSSProperties}
              >
                <span className="vtf-ico" aria-hidden="true">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <Link href={f.href} className="vtf-link">
                  Read details
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
