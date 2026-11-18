const EASE = 'cubic-bezier(.22,.61,.36,1)'

const PILLARS = [
  {
    num: '01',
    title: 'Safer Operations',
    desc: 'AI-powered IoT solutions that reduce risk and give teams real-time visibility into every vehicle, asset, and field operation.',
    accent: '#1360ee',
  },
  {
    num: '02',
    title: 'Smarter Decisions',
    desc: 'Turning complexity into clarity — actionable insight that helps businesses act faster and with more confidence.',
    accent: '#1360ee',
  },
  {
    num: '03',
    title: 'Efficient Growth',
    desc: 'Empowering businesses worldwide to run leaner operations while scaling profitably and sustainably.',
    accent: '#1360ee',
  },
]

export default function MissionPillars() {
  return (
    <>
      <style>{`
        .mp-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; border-radius: 24px; overflow: hidden; border: 1px solid #e8ecf4; }
        @media (max-width: 820px) { .mp-grid { grid-template-columns: 1fr; } }

        .mp-cell {
          position: relative; padding: clamp(28px,3.2vw,40px);
          background: #fff; transition: background .24s ${EASE};
        }
        .mp-cell + .mp-cell { border-left: 1px solid #e8ecf4; }
        @media (max-width: 820px) { .mp-cell + .mp-cell { border-left: none; border-top: 1px solid #e8ecf4; } }
        .mp-cell:hover { background: #f7f9fc; }

        .mp-num {
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: var(--f-13); font-weight: 800; letter-spacing: .04em;
        }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,88px) 28px', background: '#f7f9fc' }}>
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', maxWidth: '920px', margin: '0 auto clamp(36px,5vw,52px)' }}>
            {/* Section H2 — keeps the look of the uppercase blue label it replaces. */}
            <h2 style={{ display: 'block', margin: '0 0 20px', fontFamily: 'inherit', lineHeight: 'inherit', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase' }}>
              <span aria-hidden="true" style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              Technology Built for Smarter Business Operations
            </h2>
            <div style={{ margin: '24px auto', height: '4px', width: '80px', borderRadius: '999px', background: 'linear-gradient(90deg,#1360ee,#0d4fd4)' }} />
            <p style={{ margin: '0 auto', fontSize: 'max(clamp(15.5px,1.65vw,18px), min(1.25vw, 26px))', lineHeight: 1.72, color: '#52525e', maxWidth: '780px' }}>
              Our mission is to empower businesses worldwide with AI-powered IoT solutions that create safer, smarter, and more efficient operations — turning complexity into clarity and growth.
            </p>
          </div>

          <div className="mp-grid" data-reveal>
            {PILLARS.map(p => (
              <div key={p.num} className="mp-cell">
                <span className="mp-num" style={{ color: p.accent }}>{p.num}</span>
                <h3 style={{ margin: '14px 0 10px', fontSize: 'max(clamp(17px,1.7vw,20px), min(1.389vw, 29px))', fontWeight: 800, color: '#1d1d1f' }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: 'var(--f-14)', lineHeight: 1.75, color: '#6e6e73' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
