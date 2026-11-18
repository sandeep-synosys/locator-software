import Link from 'next/link'
import { ABOUT_PAGES } from '@/components/about/data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function AboutPillarNav({ current }: { current: string }) {
  const others = ABOUT_PAGES.filter(p => p.slug !== current)

  return (
    <>
      <style>{`
        .apn-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 760px) { .apn-grid { grid-template-columns: 1fr; } }

        .apn-card {
          display: flex; align-items: center; gap: 14px;
          padding: 20px; border-radius: 18px;
          background: #fff; border: 1px solid #e8ecf4;
          text-decoration: none;
          transition: transform .24s ${EASE}, box-shadow .24s ${EASE}, border-color .24s ${EASE};
        }
        .apn-card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -20px rgba(20,40,90,.28); border-color: transparent; }
        .apn-icon { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; flex-shrink: 0; }
        .apn-go { margin-left: auto; color: #c4c4d0; transition: .2s ${EASE}; flex-shrink: 0; }
        .apn-card:hover .apn-go { color: var(--apn-accent); transform: translateX(3px); }
      `}</style>

      <section style={{ padding: 'clamp(32px,4vw,48px) 28px clamp(56px,7vw,88px)', background: '#f7f9fc' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>
          {/* Section H2 on every About page; styled as the small grey label it replaces. */}
          <h2 data-reveal style={{ margin: '0 0 20px', fontFamily: 'inherit', lineHeight: 'inherit', fontSize: 'var(--f-12)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9a9aa2' }}>
            Explore More About LOCATOR
          </h2>
          <div className="apn-grid">
            {others.map((p, i) => (
              <Link
                key={p.slug}
                href={`/about/${p.slug}`}
                className="apn-card"
                data-reveal
                data-reveal-delay={String(i * 70)}
                style={{ '--apn-accent': p.accent } as React.CSSProperties}
              >
                <span className="apn-icon" style={{ background: `${p.accent}14`, color: p.accent }}>{p.icon}</span>
                <span>
                  <span style={{ display: 'block', fontSize: 'var(--f-15)', fontWeight: 800, color: '#1d1d1f' }}>{p.name}</span>
                  <span style={{ display: 'block', fontSize: 'var(--f-12-5)', color: '#8e8e93', marginTop: '2px' }}>{p.tagline}</span>
                </span>
                <svg className="apn-go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
