import { MODULES, INDUSTRY_STORIES } from './gitex-2026-content'
import { Bar, Paras } from './GitexText'
import { GitexIcon, type GitexIconId } from './GitexIcons'

/* "Developing Industry-Specific Modules Around Real Business Decisions".
   The four starting points are marked "In development" (the brief: no launch
   dates or features), and the other sectors appear only as examples. The
   modules stay unlinked until they have pages. */
const OTHER: { id: GitexIconId; label: string }[] = [
  { id: 'coldchain', label: 'Cold chain' },
  { id: 'waste', label: 'Waste collection' },
  { id: 'school', label: 'School bus' },
]

export default function GitexModules() {
  return (
    <section className="gxb-sec gxm">
      <style href="gitex-2026-modules" precedence="medium">{`
        .gxm { background: radial-gradient(80% 120% at 85% 0%, #1d47b3 0%, #0d1f4f 46%, #091636 100%); color: #fff; overflow: hidden; }
        .gxm::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 56px 56px; mask-image: linear-gradient(180deg, #000, transparent 85%);
        }
        .gxm-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(36px,5vw,96px); align-items: center; }
        .gxm .gxb-h2 { color: #fff; margin-bottom: clamp(18px,2vw,28px); }
        .gxm .gxb-p { color: rgba(226,234,255,.82); }
        .gxm-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px,1.4vw,18px); }
        .gxm-tile {
          position: relative; border-radius: 22px; padding: clamp(18px,1.8vw,26px);
          background: linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04));
          border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(4px);
        }
        .gxm-tile i { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: #fff; color: #1360ee; margin-bottom: clamp(16px,2vw,28px); }
        .gxm-tile i svg { width: 28px; height: 28px; }
        .gxm-tile strong { display: block; font-weight: 600; font-size: max(clamp(15px,1.15vw,18px), min(1.05vw, 24px)); line-height: 1.3; }
        .gxm-status {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 4px 10px; border-radius: 999px;
          background: rgba(255,177,61,.14); color: #ffc670; font-size: max(clamp(11px,.78vw,12.5px), min(.72vw, 17px)); font-weight: 600;
        }
        .gxm-status::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #ffb13d; box-shadow: 0 0 0 0 rgba(255,177,61,.6); animation: gxmBlink 2s infinite; }
        @keyframes gxmBlink { 70% { box-shadow: 0 0 0 7px rgba(255,177,61,0); } 100% { box-shadow: 0 0 0 0 rgba(255,177,61,0); } }
        .gxm-other {
          grid-column: 1 / 3; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; padding: 16px 18px;
          border-radius: 18px; border: 1.5px dashed rgba(255,255,255,.22); color: rgba(226,234,255,.82);
          font-size: max(clamp(13px,.9vw,15px), min(.85vw, 19px));
        }
        .gxm-other em { font-style: normal; font-weight: 600; color: #fff; margin-right: 4px; }
        .gxm-other span { display: inline-flex; align-items: center; gap: 7px; }
        .gxm-other svg { width: 20px; height: 20px; color: #9dbcff; }
        @media (prefers-reduced-motion: reduce) { .gxm-status::before { animation: none; } }
        @media (max-width: 980px) { .gxm-grid { grid-template-columns: 1fr; } }
        @media (max-width: 420px) {
          .gxm-tile { padding: 14px; border-radius: 18px; }
          .gxm-tile i { width: 40px; height: 40px; margin-bottom: 14px; }
          .gxm-status { font-size: 10.5px; padding: 3px 8px; }
        }
      `}</style>

      <div className="gxb-wrap gxm-grid">
        <div data-reveal>
          <Bar light />
          <h2 className="gxb-h2">{MODULES.heading}</h2>
          <Paras paras={MODULES.paras} />
        </div>

        <div className="gxm-tiles" data-reveal="right" data-reveal-delay="120">
          {INDUSTRY_STORIES.map(s => (
            <div key={s.id} className="gxm-tile">
              <i aria-hidden="true">
                <GitexIcon id={s.id as GitexIconId} />
              </i>
              <strong>{s.label}</strong>
              <span className="gxm-status">In development</span>
            </div>
          ))}
          <div className="gxm-other">
            <em>Other sectors</em>
            {OTHER.map(o => (
              <span key={o.id}>
                <GitexIcon id={o.id} />
                {o.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
