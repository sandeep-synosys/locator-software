import Link from 'next/link'
import { REGULATORY_PRODUCTS } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function RegulatoryGrid() {
  return (
    <>
      <style>{`
        .reg-card {
          background: #fff;
          border: 1px solid #e4e4e8;
          border-radius: 18px;
          padding: clamp(18px, 2.2vw, 26px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,.04);
          text-decoration: none;
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        .reg-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(0,0,0,.10);
          border-color: transparent;
        }
        .reg-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--reg-accent, #1360ee);
          transition: height .22s ${EASE};
        }
        .reg-card:hover::before { height: 5px; }

        .reg-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          display: grid; place-items: center;
          flex-shrink: 0;
        }

        .reg-arrow {
          position: absolute; top: clamp(16px,2vw,22px); right: clamp(16px,2vw,22px);
          width: 30px; height: 30px; border-radius: 50%;
          display: grid; place-items: center;
          background: #f5f5f7; color: #9a9aa2;
          transition: background .22s ${EASE}, color .22s ${EASE}, transform .22s ${EASE};
        }
        .reg-card:hover .reg-arrow {
          background: var(--reg-accent, #1360ee); color: #fff;
          transform: translate(2px,-2px);
        }

        .reg-tagline {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Section heading over the cards, so the card H3s sit under an H2. */
        .reg-grid-title {
          margin: 0 0 clamp(14px,1.8vw,20px); text-align: center;
          font-size: max(clamp(17px,1.8vw,21px), min(1.458vw, 30.45px)); font-weight: 800;
          line-height: 1.2; letter-spacing: -.015em; color: #1d1d1f;
        }

        .reg-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: clamp(12px,1.6vw,18px); }
        @media (max-width: 900px) { .reg-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .reg-grid { grid-template-columns: 1fr; } }
      `}</style>

      <h2 className="reg-grid-title" data-reveal>Choose Your Regulatory GPS Certification</h2>
      <div className="reg-grid" data-reveal>
        {REGULATORY_PRODUCTS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="reg-card"
            style={{ '--reg-accent': p.accent } as React.CSSProperties}
            data-reveal
            data-reveal-delay={String(i * 70)}
          >
            <span className="reg-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5" /><polyline points="7 5 19 5 19 17" />
              </svg>
            </span>

            <div className="reg-icon-wrap" style={{ background: `${p.accent}15`, color: p.accent }}>
              {p.icon}
            </div>
            <h3 style={{ margin: 0, fontSize: 'max(clamp(15px,1.4vw,17px), min(1.181vw, 24.65px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              {p.name}
            </h3>
            <p className="reg-tagline" style={{ margin: 0, fontSize: 'max(clamp(12.5px,1.05vw,13.5px), min(0.938vw, 19.57px))', lineHeight: 1.5, color: '#6e6e73' }}>
              {p.tagline}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}
