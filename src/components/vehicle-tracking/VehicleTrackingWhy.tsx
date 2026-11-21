import Image from 'next/image'
import { WHY_POINTS } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * Why Locator, against the other GPS tracking companies in the UAE.
 *
 * The reference ran this as a plain tick list. Here each point is a numbered row
 * that lights up on hover — five short claims in a column need some structure or
 * they read as filler, and numbering them makes the set feel finite and
 * deliberate rather than like the first five of many.
 *
 * Image sits on the left, copy on the right, mirroring the benefits section
 * further down so the two alternate rather than stacking the same way twice.
 */
export default function VehicleTrackingWhy() {
  return (
    <>
      <style>{`
        .vtw { background: #f7f9fc; padding: clamp(56px,7vw,96px) 28px; }
        .vtw-inner {
          max-width: var(--w-1180); margin: 0 auto;
          display: grid; grid-template-columns: 1.02fr .98fr;
          gap: clamp(36px,5vw,72px); align-items: center;
        }
        @media (max-width: 940px) {
          .vtw-inner { grid-template-columns: 1fr; gap: clamp(34px,5vw,46px); }
          /* Copy first on narrow screens — the argument matters more than the art. */
          .vtw-visual { order: 2; }
          .vtw-copy { order: 1; }
        }

        .vtw-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .vtw-eyebrow::before { content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px; }

        .vtw-title {
          margin: 0; max-width: 17ch;
          font-size: max(clamp(25px,3.2vw,38px), min(2.639vw, 55.1px));
          font-weight: 800; line-height: 1.16; letter-spacing: -.028em; color: #1d1d1f;
        }
        .vtw-lead {
          margin: clamp(16px,2vw,22px) 0 clamp(26px,3.2vw,34px); max-width: 52ch;
          font-size: var(--f-15-5); line-height: 1.72; color: #6e6e73;
        }

        .vtw-list { list-style: none; margin: 0; padding: 0; }
        .vtw-item {
          display: flex; align-items: center; gap: 16px;
          padding: clamp(13px,1.6vw,17px) 16px; border-radius: 14px;
          background: transparent; border: 1px solid transparent;
          transition: background .3s ${EASE}, border-color .3s ${EASE}, transform .3s ${EASE};
        }
        .vtw-item + .vtw-item { margin-top: 4px; }
        .vtw-item:hover {
          background: #fff; border-color: #e3eafa; transform: translateX(4px);
          box-shadow: 0 14px 30px -20px rgba(20,40,90,.4);
        }

        .vtw-num {
          flex-shrink: 0; width: 34px; height: 34px; border-radius: 11px;
          display: grid; place-items: center;
          background: rgba(19,96,238,.09); color: #1360ee;
          font-size: var(--f-13); font-weight: 800; font-variant-numeric: tabular-nums;
          transition: background .3s ${EASE}, color .3s ${EASE};
        }
        .vtw-item:hover .vtw-num { background: #1360ee; color: #fff; }

        .vtw-item span {
          font-size: var(--f-15); font-weight: 600; line-height: 1.5; color: #35383f;
        }

        /* ── Visual ── */
        .vtw-visual { position: relative; }
        .vtw-frame {
          position: relative; border-radius: 22px; overflow: hidden;
          border: 1px solid #e3e9f3; background: #fff;
          box-shadow: 0 40px 80px -44px rgba(20,40,90,.45);
        }
        .vtw-frame img { display: block; width: 100%; height: auto; }

        .vtw-badge {
          position: absolute; right: clamp(-6px,-0.8vw,0px); top: clamp(20px,3vw,34px);
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1px solid #e7ebf3; border-radius: 15px;
          padding: 13px 17px; box-shadow: 0 22px 44px -22px rgba(20,40,90,.5);
        }
        .vtw-badge-ico {
          width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0;
          display: grid; place-items: center; background: rgba(19,96,238,.1); color: #1360ee;
        }
        .vtw-badge-ico svg { width: 18px; height: 18px; }
        .vtw-badge b {
          display: block; font-size: var(--f-15); font-weight: 800; color: #1d1d1f; line-height: 1.2;
        }
        .vtw-badge span { display: block; font-size: var(--f-11); color: #6e6e73; margin-top: 2px; }
        @media (max-width: 480px) { .vtw-badge { position: static; margin-top: 14px; } }
      `}</style>

      <section className="vtw">
        <div className="vtw-inner">
          <div className="vtw-visual" data-reveal="right">
            <div className="vtw-frame">
              <Image
                src="/shared/live-showcase.png"
                alt="The LOCATOR platform showing live vehicle positions and customisable reports"
                width={1200}
                height={860}
                sizes="(max-width: 940px) 92vw, 46vw"
              />
            </div>
            <div className="vtw-badge">
              <span className="vtw-badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div>
                <b>100% accurate</b>
                <span>Every report, every time</span>
              </div>
            </div>
          </div>

          <div className="vtw-copy" data-reveal="left" data-reveal-delay={100}>
            <p className="vtw-eyebrow">Why Locator</p>
            <h2 className="vtw-title">Why Choose LOCATOR Over Other Vehicle Tracking Companies</h2>
            <p className="vtw-lead">
              Compared against the other GPS tracking applications operating in the UAE,
              five things consistently decide it — and all five are things you feel every
              working day, not on the sales call.
            </p>

            <ul className="vtw-list">
              {WHY_POINTS.map((p, i) => (
                <li key={p} className="vtw-item">
                  <span className="vtw-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
