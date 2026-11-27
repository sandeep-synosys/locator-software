import { INTRO } from './gitex-2026-content'
import { Rich } from './GitexText'
import { GitexIcon, type GitexIconId } from './GitexIcons'

/* Article introduction (the brief gives it no heading). The first paragraph is
   set as a large opening statement; beside it, a map card shows one known
   location branching into four different industry decisions. */
const NODES: { id: GitexIconId; x: number; y: number }[] = [
  { id: 'construction', x: 18, y: 22 },
  { id: 'rental', x: 82, y: 20 },
  { id: 'facility', x: 16, y: 78 },
  { id: 'trading', x: 84, y: 80 },
]

export default function GitexIntro() {
  const [lead, ...rest] = INTRO
  return (
    <section className="gxb-sec gxi">
      <style href="gitex-2026-intro" precedence="medium">{`
        .gxi { padding-top: clamp(48px,6vw,96px); }
        .gxi-grid { display: grid; grid-template-columns: minmax(0,1.12fr) minmax(0,.88fr); gap: clamp(36px,5vw,88px); align-items: center; }
        .gxi-lead {
          margin: 0 0 clamp(20px,2vw,30px); color: #0d1f4f; font-weight: 600;
          font-size: max(clamp(21px,2vw,30px), min(1.75vw, 42px)); line-height: 1.42; letter-spacing: -.01em;
        }
        .gxi-map {
          position: relative; aspect-ratio: 1 / 1; border-radius: 28px; overflow: hidden;
          background: radial-gradient(120% 90% at 50% 40%, #16357e 0%, #0b1a3f 70%);
          box-shadow: 0 30px 60px rgba(13,31,79,.22);
        }
        .gxi-map svg.gxi-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
        .gxi-pin { position: absolute; left: 50%; top: 50%; width: 22%; transform: translate(-50%,-62%); }
        .gxi-pulse { position: absolute; left: 50%; top: 50%; width: 30%; aspect-ratio: 1; border-radius: 50%; transform: translate(-50%,-50%); border: 2px solid rgba(91,151,255,.6); animation: gxiPulse 2.8s ease-out infinite; }
        .gxi-pulse + .gxi-pulse { animation-delay: 1.4s; }
        @keyframes gxiPulse { from { opacity: .9; transform: translate(-50%,-50%) scale(.6); } to { opacity: 0; transform: translate(-50%,-50%) scale(1.9); } }
        .gxi-node {
          position: absolute; width: 17%; aspect-ratio: 1; border-radius: 22%; transform: translate(-50%,-50%);
          display: grid; place-items: center; color: #1360ee; background: #fff;
          box-shadow: 0 12px 26px rgba(0,0,0,.28);
        }
        .gxi-node svg { width: 52%; height: 52%; }
        @media (prefers-reduced-motion: reduce) { .gxi-pulse { animation: none; opacity: .4; } }
        @media (max-width: 900px) {
          .gxi-grid { grid-template-columns: 1fr; }
          .gxi-map { max-width: 460px; width: 100%; margin: 0 auto; }
        }
      `}</style>

      <div className="gxb-wrap gxi-grid">
        <div data-reveal>
          <p className="gxi-lead">
            <Rich para={lead} />
          </p>
          {rest.map((p, i) => (
            <p key={i} className="gxb-p">
              <Rich para={p} />
            </p>
          ))}
        </div>

        <div className="gxi-map" data-reveal="zoom" data-reveal-delay="120" aria-hidden="true">
          <svg className="gxi-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g stroke="rgba(255,255,255,.07)" strokeWidth=".3">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(v => (
                <path key={v} d={`M${v} 0V100M0 ${v}H100`} />
              ))}
            </g>
            <path d="M0 64 C20 60 30 48 50 50 S82 36 100 30" stroke="rgba(255,255,255,.14)" strokeWidth="2.2" fill="none" />
            <path d="M38 100 C42 80 46 64 50 50 S60 18 66 0" stroke="rgba(255,255,255,.1)" strokeWidth="1.6" fill="none" />
            {NODES.map(n => (
              <path
                key={n.id}
                d={`M50 50 Q${(50 + n.x) / 2 + (n.y < 50 ? -6 : 6)} ${(50 + n.y) / 2} ${n.x} ${n.y}`}
                stroke="#5b97ff" strokeWidth=".6" strokeDasharray="1.6 1.4" fill="none"
              />
            ))}
          </svg>
          <span className="gxi-pulse" />
          <span className="gxi-pulse" />
          <svg className="gxi-pin" viewBox="0 0 68 86">
            <defs>
              <linearGradient id="gxiPinG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#4d8dff" />
                <stop offset="1" stopColor="#1250d6" />
              </linearGradient>
            </defs>
            <path d="M34 86C24 68 0 50 0 34a34 34 0 0 1 68 0c0 16-24 34-34 52Z" fill="url(#gxiPinG)" />
            <circle cx="34" cy="34" r="14" fill="#fff" />
            <circle cx="34" cy="34" r="6" fill="#1360ee" />
          </svg>
          {NODES.map(n => (
            <span key={n.id} className="gxi-node" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <GitexIcon id={n.id} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
