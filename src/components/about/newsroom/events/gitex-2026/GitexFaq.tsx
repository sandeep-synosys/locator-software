import { GITEX_FAQS } from './gitex-2026-content'
import { Bar } from './GitexText'

/* FAQ from the brief, as native disclosure widgets (no client JS; answers stay
   in the HTML). FAQPage JSON-LD is built from the same list. The brief notes
   Google no longer shows FAQ rich results, so it is markup only. */
export default function GitexFaq() {
  return (
    <section className="gxb-sec gxf" id="faq">
      <style href="gitex-2026-faq" precedence="medium">{`
        .gxf { padding-top: clamp(24px,3vw,48px); }
        .gxf-grid { display: grid; grid-template-columns: minmax(0,.7fr) minmax(0,1.3fr); gap: clamp(32px,5vw,88px); align-items: start; }
        .gxf-list { display: flex; flex-direction: column; gap: 12px; }
        .gxf-item { border-radius: 18px; background: #fff; border: 1px solid #e3e9f5; transition: border-color .2s, box-shadow .2s, background .2s; }
        .gxf-item[open] { border-color: #c9d9fb; background: #fafcff; box-shadow: 0 14px 34px rgba(19,96,238,.08); }
        .gxf-item summary {
          list-style: none; cursor: pointer; display: flex; align-items: center; gap: 16px; padding: clamp(16px,1.6vw,22px) clamp(18px,1.8vw,26px);
          color: #0d1f4f; font-weight: 600; font-size: max(clamp(15px,1.15vw,18px), min(1.05vw, 24px)); line-height: 1.45;
        }
        .gxf-item summary::-webkit-details-marker { display: none; }
        .gxf-item summary:focus-visible { outline: 2px solid #1360ee; outline-offset: 2px; border-radius: 18px; }
        .gxf-item summary span { flex: 1; }
        .gxf-icon { position: relative; flex: none; width: 30px; height: 30px; border-radius: 50%; background: #eef3ff; transition: background .2s, transform .3s; }
        .gxf-icon::before, .gxf-icon::after { content: ''; position: absolute; left: 50%; top: 50%; width: 12px; height: 2px; border-radius: 1px; background: #1360ee; transform: translate(-50%,-50%); }
        .gxf-icon::after { transform: translate(-50%,-50%) rotate(90deg); transition: transform .3s; }
        .gxf-item[open] .gxf-icon { background: #1360ee; }
        .gxf-item[open] .gxf-icon::before, .gxf-item[open] .gxf-icon::after { background: #fff; }
        .gxf-item[open] .gxf-icon::after { transform: translate(-50%,-50%) rotate(0deg); }
        .gxf-item p { margin: 0; padding: 0 clamp(18px,1.8vw,26px) clamp(18px,1.8vw,24px); color: #4a5168; font-size: max(clamp(14.5px,1.05vw,16.5px), min(1vw, 23px)); line-height: 1.75; }
        @media (max-width: 900px) { .gxf-grid { grid-template-columns: 1fr; } }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: GITEX_FAQS.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <div className="gxb-wrap gxf-grid">
        <div data-reveal>
          <Bar />
          <h2 className="gxb-h2">Frequently asked questions</h2>
        </div>
        <div className="gxf-list" data-reveal data-reveal-delay="100">
          {GITEX_FAQS.map((f, i) => (
            <details key={f.q} className="gxf-item" open={i === 0}>
              <summary>
                <span>{f.q}</span>
                <i className="gxf-icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
