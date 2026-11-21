import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const CHECKLIST = [
  'Unauthorized vehicle access',
  'Vehicles that are over-speeding',
  'Vehicles that have remained idle for hours',
  'Cars that are deviating from their pre-specified routes',
  'Geofencing',
]

const STATS = [
  { value: '15',     label: 'Years in Business' },
  { value: '6,000',  label: 'Happy Customers' },
  { value: '60,000', label: 'Tracked Devices' },
]

function LaptopMock() {
  return (
    <div style={{ position: 'relative', display: 'grid', placeItems: 'center', padding: '20px 0 40px' }}>
      {/* Ambient wash so the cut-out render sits on the white section */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '10% 4%', zIndex: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(19,96,238,.12), transparent 68%)',
        filter: 'blur(10px)',
      }} />
      <Image
        src="/services/gps-tracking-system/laptop.png"
        alt="LOCATOR fleet dashboard, live map, and report screens fanned out of a laptop"
        width={636}
        height={586}
        sizes="(max-width: 900px) 88vw, 460px"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '470px', height: 'auto', display: 'block' }}
      />
    </div>
  )
}

export default function GpsTrackingLaptop() {
  return (
    <>
      <style>{`
        .gtl-grid { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: clamp(32px,5vw,64px); align-items: center; max-width: var(--w-1160); margin: 0 auto; }
        @media (max-width: 900px) { .gtl-grid { grid-template-columns: 1fr; } }
        .gtl-check { width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; background: #eef3ff; color: #1360ee; display: grid; place-items: center; transition: transform .2s ${EASE}, background .2s ${EASE}; }
        .gtl-item:hover .gtl-check { background: #1360ee; color: #fff; transform: scale(1.08); }
        .gtl-stats { display: flex; gap: clamp(24px,4vw,48px); margin-top: 32px; flex-wrap: wrap; }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#fff' }}>
        <div className="gtl-grid">
          {/* Laptop visual */}
          <div data-reveal="left">
            <LaptopMock />
          </div>

          {/* Copy */}
          <div data-reveal="right">
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              Built To Keep Watch
            </span>
            <h2 style={{ margin: '0 0 16px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              The Best GPS Tracking System for the UAE
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.8, color: '#6e6e73', maxWidth: '48ch' }}>
              LOCATOR makes monitoring your vehicles a complete walk in the park. Thanks to its innovative
              features, the process stays seamless and accurate. For instance, you&apos;ll receive alerts on:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {CHECKLIST.map(item => (
                <div key={item} className="gtl-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
                  <span className="gtl-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span style={{ fontSize: 'var(--f-14)', color: '#3a3a3c', fontWeight: 600, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="gtl-stats">
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 'max(clamp(20px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, letterSpacing: '-.01em' }}>
                    <span style={{ color: '#f2600a' }}>{s.value}</span>
                    <span style={{ color: '#1360ee' }}>+</span>
                  </div>
                  <div style={{ fontSize: 'var(--f-12)', color: '#8a93a2', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
