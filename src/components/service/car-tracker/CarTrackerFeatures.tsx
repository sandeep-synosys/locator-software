import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const FEATURES = [
  {
    title: 'Live Tracking',
    desc: 'Track the exact live location of all your cars, anywhere in the UAE.',
    bg: '#1360ee', color: '#fff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
  {
    title: 'Instant Notifications',
    desc: 'Receive instant notifications about vehicles that have been idle for too long.',
    bg: '#0f1117', color: '#fff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
    ),
  },
  {
    title: 'Dynamic Dashboard',
    desc: 'Get access to a complete overview of your vehicles with a dynamic dashboard.',
    bg: '#eaf1ff', color: '#1360ee',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
    ),
  },
  {
    title: 'After-Hours Alerts',
    desc: 'Get instant notifications about vehicles moving after office hours.',
    bg: '#f2600a', color: '#fff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" /></svg>
    ),
  },
  {
    title: 'Route Tracking',
    desc: 'Track the routes of your cars, including their full daily activities.',
    bg: '#1360ee', color: '#fff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="M8.2 6h6.3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H9.5" /></svg>
    ),
  },
  {
    title: 'Service Reminders',
    desc: 'Receive service reminders like changing oil, tires, and much more.',
    bg: '#0f1117', color: '#fff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></svg>
    ),
  },
]

export default function CarTrackerFeatures() {
  return (
    <>
      <style>{`
        .ctf-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(36px,5vw,72px); align-items: center; max-width: var(--w-1200); margin: 0 auto; }
        @media (max-width: 940px) { .ctf-grid { grid-template-columns: 1fr; } .ctf-grid > div:last-child { order: -1; } }
        .ctf-items { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 20px; margin-top: 28px; }
        @media (max-width: 560px) { .ctf-items { grid-template-columns: 1fr; } }
        .ctf-item { display: flex; gap: 13px; align-items: flex-start; }
        .ctf-ic { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: grid; place-items: center; transition: transform .24s ${EASE}; }
        .ctf-item:hover .ctf-ic { transform: scale(1.08); }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#f7f9fc' }}>
        <div className="ctf-grid">
          {/* Copy + feature grid */}
          <div data-reveal="left">
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              Everything You Need
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              Car Tracker App Features
            </h2>

            <div className="ctf-items">
              {FEATURES.map(f => (
                <div key={f.title} className="ctf-item">
                  <span className="ctf-ic" style={{ background: f.bg, color: f.color }}>{f.icon}</span>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 'var(--f-14-5)', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.01em' }}>{f.title}</h3>
                    <p style={{ margin: 0, fontSize: 'var(--f-12-5)', lineHeight: 1.6, color: '#6e6e73' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real platform screens, fanned out of a laptop */}
          <div data-reveal="right" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Ambient wash so the cut-out render sits on the section rather than floating */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '8% 2%', zIndex: 0, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(19,96,238,.12), transparent 68%)',
              filter: 'blur(8px)',
            }} />
            <Image
              src="/services/car-tracker/best-gps.png"
              alt="LOCATOR fleet dashboard, reports, and map views fanned out of a laptop"
              width={526}
              height={485}
              sizes="(max-width: 940px) 88vw, 480px"
              style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '500px', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
