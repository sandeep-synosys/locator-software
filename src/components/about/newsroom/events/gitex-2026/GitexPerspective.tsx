import { PERSPECTIVE } from './gitex-2026-content'
import { Bar, Paras } from './GitexText'
import { GitexIcon, type GitexIconId } from './GitexIcons'

/* "LOCATOR at GITEX GLOBAL 2026: A Different Perspective on Fleet Management".
   Beside the copy: one shared map, read by the four people the text names. */
const ROLES: { id: GitexIconId; role: string; pos: string }[] = [
  { id: 'construction', role: 'Plant manager', pos: 'gxp-r1' },
  { id: 'rental', role: 'Rental agent', pos: 'gxp-r2' },
  { id: 'facility', role: 'Service coordinator', pos: 'gxp-r3' },
  { id: 'trading', role: 'Sales representative', pos: 'gxp-r4' },
]

export default function GitexPerspective() {
  return (
    <section className="gxb-sec gxp">
      <style href="gitex-2026-perspective" precedence="medium">{`
        .gxp-grid { display: grid; grid-template-columns: minmax(0,.95fr) minmax(0,1.05fr); gap: clamp(36px,5vw,96px); align-items: center; }
        .gxp-visual { position: relative; aspect-ratio: 1.08 / 1; }
        .gxp-map {
          position: absolute; left: 18%; top: 18%; width: 64%; height: 64%; border-radius: 26px; overflow: hidden;
          background: #f1f6ff; border: 1px solid #dbe5f7; box-shadow: 0 26px 60px rgba(13,31,79,.14);
        }
        .gxp-map svg { width: 100%; height: 100%; display: block; }
        .gxp-role {
          position: absolute; display: flex; align-items: center; gap: 12px; padding: 10px 16px 10px 10px;
          border-radius: 18px; background: #fff; box-shadow: 0 14px 32px rgba(13,31,79,.14); white-space: nowrap;
          color: #0d1f4f; font-weight: 600; font-size: max(clamp(13px,1vw,16px), min(.92vw, 21px));
        }
        .gxp-role i { display: grid; place-items: center; width: 2.6em; height: 2.6em; border-radius: 12px; background: #eaf1ff; color: #1360ee; flex: none; }
        .gxp-role i svg { width: 60%; height: 60%; }
        .gxp-r1 { left: 0; top: 4%; }
        .gxp-r2 { right: 0; top: 12%; }
        .gxp-r3 { left: 2%; bottom: 10%; }
        .gxp-r4 { right: 0; bottom: 2%; }
        @media (max-width: 980px) {
          .gxp-grid { grid-template-columns: 1fr; }
          .gxp-visual { order: 2; max-width: 560px; width: 100%; margin: 0 auto; }
        }
        @media (max-width: 480px) {
          .gxp-visual { aspect-ratio: auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .gxp-map { position: relative; inset: auto; width: 100%; height: auto; aspect-ratio: 1.4 / 1; grid-column: 1 / 3; }
          .gxp-role { position: static; min-width: 0; white-space: normal; font-size: 13px; line-height: 1.3; padding: 8px 10px 8px 8px; }
        }
        /* Small phones: icon above the label so "Sales representative" fits. */
        @media (max-width: 400px) {
          .gxp-role { flex-direction: column; align-items: flex-start; gap: 8px; padding: 10px 12px; font-size: 12.5px; }
        }
      `}</style>

      <div className="gxb-wrap gxp-grid">
        <div className="gxp-visual" data-reveal="left" aria-hidden="true">
          <div className="gxp-map">
            <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
              <rect width="300" height="300" fill="#eef4ff" />
              <g fill="#dde8fb">
                <rect x="18" y="20" width="70" height="56" rx="8" />
                <rect x="108" y="18" width="84" height="40" rx="8" />
                <rect x="214" y="24" width="66" height="70" rx="8" />
                <rect x="20" y="104" width="54" height="80" rx="8" />
                <rect x="210" y="118" width="74" height="52" rx="8" />
                <rect x="24" y="214" width="80" height="62" rx="8" />
                <rect x="128" y="228" width="60" height="50" rx="8" />
                <rect x="208" y="196" width="76" height="84" rx="8" />
              </g>
              <path d="M0 92 H300 M0 196 H300 M96 0 V300 M200 0 V300" stroke="#fff" strokeWidth="14" />
              <path d="M40 270 C60 210 90 200 120 170 S170 120 150 96 S180 60 240 50" stroke="#1360ee" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="2 10" />
              <circle cx="150" cy="150" r="46" fill="#1360ee" opacity=".1" />
              <path d="M150 158c-6-11-20-21-20-36a20 20 0 0 1 40 0c0 15-14 25-20 36Z" fill="#1360ee" />
              <circle cx="150" cy="122" r="8" fill="#fff" />
            </svg>
          </div>
          {ROLES.map(r => (
            <span key={r.id} className={`gxp-role ${r.pos}`}>
              <i>
                <GitexIcon id={r.id} />
              </i>
              {r.role}
            </span>
          ))}
        </div>

        <div data-reveal data-reveal-delay="100">
          <Bar />
          <h2 className="gxb-h2" style={{ marginBottom: 'clamp(18px,2vw,28px)' }}>{PERSPECTIVE.heading}</h2>
          <Paras paras={PERSPECTIVE.paras} />
        </div>
      </div>
    </section>
  )
}
