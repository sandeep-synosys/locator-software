import Image from 'next/image'
import { INDUSTRIES, INDUSTRY_STORIES } from './gitex-2026-content'
import { GITEX_ASSETS } from './gitex-2026-data'
import { Bar, Paras } from './GitexText'
import { GitexIcon, type GitexIconId } from './GitexIcons'

/* "Beyond Tracking: Why Different Industries Need Different Answers": the
   intro, quick links to each industry, then one row per industry (H3, copy and
   its illustration), alternating sides on desktop. */
export default function GitexIndustries() {
  return (
    <section className="gxb-sec gxn" id="industries">
      <style href="gitex-2026-industries" precedence="medium">{`
        .gxn { background: #fff; }
        .gxn-head { max-width: 860px; margin: 0 auto; text-align: center; }
        .gxn-head .gxb-bar { justify-content: center; }
        .gxn-head .gxb-h2 { margin-bottom: clamp(16px,1.8vw,24px); }
        .gxn-jump { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: clamp(26px,3vw,40px) 0 clamp(48px,6vw,96px); }
        .gxn-jump a {
          display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px 9px 10px; border-radius: 999px;
          background: #f3f7ff; border: 1px solid #dbe5f7; color: #0d1f4f; text-decoration: none; font-weight: 600;
          font-size: max(clamp(13px,.95vw,15px), min(.9vw, 20px)); transition: background .2s, border-color .2s, color .2s;
        }
        .gxn-jump a:hover { background: #1360ee; border-color: #1360ee; color: #fff; }
        .gxn-jump a i { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #fff; color: #1360ee; }
        .gxn-jump a i svg { width: 18px; height: 18px; }

        .gxn-list { display: flex; flex-direction: column; gap: clamp(56px,7vw,120px); }
        .gxn-row { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,5vw,88px); align-items: center; scroll-margin-top: 96px; }
        .gxn-row:nth-child(even) .gxn-media { order: 2; }
        .gxn-media { position: relative; }
        .gxn-frame {
          position: relative; border-radius: 28px; overflow: hidden; aspect-ratio: 3 / 2;
          box-shadow: 0 30px 60px rgba(13,31,79,.14); background: #eaf1ff;
        }
        .gxn-frame img { object-fit: cover; }
        .gxn-media::before {
          content: ''; position: absolute; inset: auto -18px -18px auto; width: 46%; height: 52%; border-radius: 28px;
          background: repeating-linear-gradient(135deg, rgba(19,96,238,.14) 0 2px, transparent 2px 12px); z-index: -1;
        }
        .gxn-row:nth-child(even) .gxn-media::before { inset: auto auto -18px -18px; }
        .gxn-num {
          position: absolute; left: 18px; top: 18px; z-index: 1; display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 14px 7px 7px; border-radius: 999px; background: rgba(255,255,255,.94); backdrop-filter: blur(6px);
          color: #0d1f4f; font-weight: 600; font-size: max(clamp(12px,.9vw,14px), min(.85vw, 19px)); box-shadow: 0 8px 20px rgba(13,31,79,.12);
        }
        .gxn-num b { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #1360ee; color: #fff; font-size: 12px; }
        .gxn-copy .gxb-h3 { margin-bottom: clamp(14px,1.4vw,20px); }
        @media (max-width: 900px) {
          .gxn-row { grid-template-columns: 1fr; }
          .gxn-row:nth-child(even) .gxn-media { order: 0; }
          .gxn-media::before { display: none; }
        }
      `}</style>

      <div className="gxb-wrap">
        <div className="gxn-head" data-reveal>
          <Bar />
          <h2 className="gxb-h2">{INDUSTRIES.heading}</h2>
          <Paras paras={INDUSTRIES.intro} />
        </div>

        <nav className="gxn-jump" aria-label="Industries" data-reveal data-reveal-delay="80">
          {INDUSTRY_STORIES.map(s => (
            <a key={s.id} href={`#${s.id}`}>
              <i>
                <GitexIcon id={s.id as GitexIconId} />
              </i>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="gxn-list">
          {INDUSTRY_STORIES.map((s, i) => (
            <article key={s.id} id={s.id} className="gxn-row">
              <div className="gxn-media" data-reveal={i % 2 ? 'right' : 'left'}>
                <div className="gxn-frame">
                  <Image
                    src={`${GITEX_ASSETS}/${s.image}`}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <span className="gxn-num" aria-hidden="true">
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  {s.label}
                </span>
              </div>
              <div className="gxn-copy" data-reveal data-reveal-delay="100">
                <h3 className="gxb-h3">{s.heading}</h3>
                <Paras paras={s.paras} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
