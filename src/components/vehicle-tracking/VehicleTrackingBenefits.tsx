import Image from 'next/image'
import { BENEFIT_POINTS } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * What having a tracking system actually gets you.
 *
 * The reference listed five one-line claims. Each one here carries a sentence of
 * substance underneath it — "better customer response" means nothing on its own,
 * and a list of five bare assertions is the part of an old brochure page that
 * ages worst. The claims are unchanged; they are just given something to stand on.
 */
export default function VehicleTrackingBenefits() {
  return (
    <>
      <style>{`
        .vtb { background: #fff; padding: clamp(56px,7vw,96px) 28px; }
        .vtb-inner {
          max-width: var(--w-1180); margin: 0 auto;
          display: grid; grid-template-columns: 1.04fr .96fr;
          gap: clamp(36px,5vw,72px); align-items: center;
        }
        @media (max-width: 940px) { .vtb-inner { grid-template-columns: 1fr; gap: clamp(34px,5vw,46px); } }

        .vtb-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .vtb-eyebrow::before { content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px; }

        .vtb-title {
          margin: 0; max-width: 18ch;
          font-size: max(clamp(25px,3.2vw,38px), min(2.639vw, 55.1px));
          font-weight: 800; line-height: 1.16; letter-spacing: -.028em; color: #1d1d1f;
        }
        .vtb-lead {
          margin: clamp(16px,2vw,22px) 0 clamp(24px,3vw,32px); max-width: 50ch;
          font-size: var(--f-15-5); line-height: 1.72; color: #6e6e73;
        }

        .vtb-list { list-style: none; margin: 0; padding: 0; }
        /* A rail down the left with a tick at each stop — it ties five separate
           items into one run, which a stack of bordered rows never does. */
        .vtb-item {
          position: relative; display: flex; gap: 16px;
          padding: 0 0 clamp(20px,2.4vw,26px) 0;
        }
        .vtb-item:last-child { padding-bottom: 0; }
        .vtb-item::before {
          content: ''; position: absolute; left: 15px; top: 32px; bottom: 4px; width: 2px;
          background: linear-gradient(180deg,#dbe6fb,rgba(219,230,251,0));
        }
        .vtb-item:last-child::before { display: none; }

        .vtb-tick {
          position: relative; flex-shrink: 0; width: 32px; height: 32px; border-radius: 10px;
          display: grid; place-items: center;
          background: rgba(19,96,238,.1); color: #1360ee;
          transition: background .3s ${EASE}, color .3s ${EASE}, transform .3s ${EASE};
        }
        .vtb-tick svg { width: 15px; height: 15px; }
        .vtb-item:hover .vtb-tick { background: #1360ee; color: #fff; transform: scale(1.08); }

        .vtb-item b {
          display: block; margin-bottom: 5px;
          font-size: var(--f-15-5); font-weight: 800; letter-spacing: -.012em;
          color: #1d1d1f; line-height: 1.35;
        }
        .vtb-item p { margin: 0; font-size: var(--f-14); line-height: 1.68; color: #6e6e73; }

        /* ── Visual ── */
        .vtb-visual { position: relative; }
        /* No frame — the artwork is a cut-out on transparency, so a bordered card
           would only draw a box around its empty corners. */
        .vtb-frame { position: relative; }
        .vtb-frame img { display: block; width: 100%; height: auto; }

        .vtb-badge {
          position: absolute; left: clamp(-8px,-1vw,0px); bottom: clamp(18px,3vw,30px);
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1px solid #e7ebf3; border-radius: 15px;
          padding: 13px 17px; box-shadow: 0 22px 44px -22px rgba(20,40,90,.5);
        }
        .vtb-badge-ico {
          width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0;
          display: grid; place-items: center; background: rgba(31,191,91,.12); color: #1a9e4b;
        }
        .vtb-badge-ico svg { width: 18px; height: 18px; }
        .vtb-badge b { display: block; font-size: var(--f-15); font-weight: 800; color: #1d1d1f; line-height: 1.2; }
        .vtb-badge span { display: block; font-size: var(--f-11); color: #6e6e73; margin-top: 2px; }
        @media (max-width: 480px) { .vtb-badge { position: static; margin-top: 14px; } }
      `}</style>

      <section className="vtb">
        <div className="vtb-inner">
          <div data-reveal="right">
            <p className="vtb-eyebrow">The payoff</p>
            <h2 className="vtb-title">Benefits of a Vehicle Tracking System</h2>
            <p className="vtb-lead">
              Some of the changes operators notice first, in the order they usually notice them.
            </p>

            <ul className="vtb-list">
              {BENEFIT_POINTS.map(b => (
                <li key={b.title} className="vtb-item">
                  <span className="vtb-tick" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <b>{b.title}</b>
                    <p>{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="vtb-visual" data-reveal="left" data-reveal-delay={100}>
            <div className="vtb-frame">
              <Image
                src="/services/vehicle-tracking-system/benefits.png"
                alt="A driver at the wheel, surrounded by the reports, timings and location data a tracking system collects"
                width={1200}
                height={1300}
                sizes="(max-width: 940px) 92vw, 44vw"
              />
            </div>
            <div className="vtb-badge">
              <span className="vtb-badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 1.9" />
                </svg>
              </span>
              <div>
                <b>Departure & arrival</b>
                <span>Logged for every trip</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
