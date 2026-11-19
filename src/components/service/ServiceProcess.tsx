import Link from "next/link"

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const STEPS = [
  {
    num: '01',
    title: 'Free Site Visit',
    desc: 'Our team visits your site, assesses your fleet, and recommends the right GPS tracking solution. No commitment required.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 14h10M9 10h6M9 18h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    accent: '#1360ee',
  },
  {
    num: '02',
    title: 'Professional Installation',
    desc: (
      <>
        Certified technicians install{' '}
        <Link href="/service/tracking-devices" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>GPS tracking devices and accessories</Link>{' '}
        on all your vehicles, machines, and assets — typically 30–60 min per unit.
      </>
    ),
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 10v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 7l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    accent: '#1360ee',
  },
  {
    num: '03',
    title: 'Platform Configuration',
    desc: 'We set up your dashboard, configure alerts, create driver profiles, and connect to your existing CRM or ERP system if needed.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="5" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 12h10M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 20v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 23h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    accent: '#1360ee',
  },
  {
    num: '04',
    title: 'Training & Go Live',
    desc: 'Your admin team and drivers are trained on the web platform and mobile app. You start tracking your fleet live within 48 hours.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M8 20l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    accent: '#1360ee',
  },
]

export default function ServiceProcess() {
  return (
    <>
      <style>{`
        @keyframes srvProcRise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }

        .proc-card {
          background: #fff;
          border: 1px solid #e4e4e8;
          border-radius: 20px;
          padding: clamp(20px, 2.8vw, 32px);
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,.04);
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE};
        }
        .proc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,.09);
        }

        /* Subtle top accent line */
        .proc-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
          background: var(--proc-accent, #1360ee);
          opacity: 0;
          transition: opacity .22s ${EASE};
        }
        .proc-card:hover::before { opacity: 1; }

        /* Connector line between cards on desktop */
        .proc-grid { position: relative; }
        .proc-grid::before {
          content: '';
          position: absolute;
          top: clamp(20px,2.8vw,32px);
          /* vertically center on the icon */
          top: calc(clamp(20px,2.8vw,32px) + 20px);
          left: 12.5%;
          right: 12.5%;
          height: 1px;
          background: linear-gradient(90deg,
            rgba(19,96,238,.0) 0%,
            rgba(19,96,238,.18) 20%,
            rgba(19,96,238,.18) 80%,
            rgba(19,96,238,.0) 100%
          );
          z-index: 0;
          pointer-events: none;
        }
        @media (max-width: 800px) { .proc-grid::before { display: none; } }

        .proc-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          display: grid; place-items: center;
          flex-shrink: 0;
          position: relative; z-index: 1;
        }

        .proc-num {
          font-size: var(--f-11); font-weight: 800;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          letter-spacing: .06em;
          position: absolute; top: clamp(14px,2vw,20px); right: clamp(14px,2vw,20px);
          opacity: .35;
        }

        @media (max-width: 800px) {
          .proc-grid { display: flex !important; flex-direction: column !important; }
        }
      `}</style>

      <section id="process" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>

          {/* Header */}
          <div data-reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
              color: '#1360ee', textTransform: 'uppercase' as const,
              display: 'block', marginBottom: '16px',
            }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              How it works
            </span>
            <h2 style={{
              margin: '0 auto',
              fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))',
              fontWeight: 800, lineHeight: 1.08,
              letterSpacing: '-.015em', color: '#1d1d1f',
              maxWidth: '560px',
            }}>
              Up and Running in 4 Simple Steps
            </h2>
            <p style={{
              margin: '16px auto 0', maxWidth: '500px',
              fontSize: 'max(clamp(14px,1.35vw,16px), min(1.111vw, 23.2px))', color: '#6e6e73', lineHeight: 1.6,
            }}>
              From consultation to live fleet tracking — we handle everything so your team can focus on operations.
              {' '}Learn more <Link href="/about/who-we-are" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>about LOCATOR</Link>.
            </p>
          </div>

          {/* Steps grid */}
          <div
            className="proc-grid"
            data-reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 'clamp(12px,1.8vw,20px)',
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="proc-card"
                style={{ '--proc-accent': step.accent } as React.CSSProperties}
                data-reveal
                data-reveal-delay={String(i * 80)}
              >
                <span className="proc-num">{step.num}</span>

                <div
                  className="proc-icon-wrap"
                  style={{ background: `${step.accent}15`, color: step.accent }}
                >
                  {step.icon}
                </div>

                <h3 style={{
                  margin: 0,
                  fontSize: 'max(clamp(15px,1.5vw,18px), min(1.250vw, 26.1px))',
                  fontWeight: 800, lineHeight: 1.2,
                  letterSpacing: '-.018em', color: '#1d1d1f',
                }}>
                  {step.title}
                </h3>

                <p style={{
                  margin: 0,
                  fontSize: 'max(clamp(13px,1.2vw,14.5px), min(1.007vw, 21.02px))',
                  lineHeight: 1.65, color: '#6e6e73',
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA row */}
          <div data-reveal style={{ textAlign: 'center', marginTop: '44px' }}>
            <p style={{ fontSize: 'max(clamp(14px,1.35vw,16px), min(1.111vw, 23.2px))', color: '#6e6e73', margin: '0 0 20px' }}>
              Ready to get started? Most fleets go live in under 48 hours.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                fontFamily: 'inherit', fontSize: 'var(--f-14)', fontWeight: 700,
                padding: '12px 26px', borderRadius: '999px', border: 'none',
                background: '#1360ee', color: '#fff', cursor: 'pointer',
                transition: '.18s cubic-bezier(.22,.61,.36,1)',
              }}>
                <Link href="/get-a-quote">
                  Book a free site visit
                </Link>
              </button>
              {/* <button style={{
                fontFamily: 'inherit', fontSize: 'var(--f-14)', fontWeight: 700,
                padding: '12px 26px', borderRadius: '999px',
                border: '1.5px solid #e3e3e6', background: '#fff',
                color: '#1d1d1f', cursor: 'pointer',
                transition: '.18s cubic-bezier(.22,.61,.36,1)',
              }}>
                See pricing plans
              </button> */}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
