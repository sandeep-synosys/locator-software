import Image from 'next/image'

const STEPS = [
  'Create an account and select based on your company registration (Abu Dhabi or Outside Abu Dhabi) and fill all the required information.',
  'Log in to your account and select the appropriate business category (e.g., passenger transport or freight transport).',
  'Upload the required documents then submit your application and wait for the approval from ITC.',
  'Once approved, you will receive a confirmation email with your registration details and operators can access various services, including permit, GPS vehicle tracking and more.',
]

export default function AsateelSteps() {
  return (
    <>
      <style>{`
        .asa-enroll-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .asa-enroll-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .asa-enroll-grid > div:last-child { order: 2; } }
        .asa-portal-link { color: #1360ee; font-weight: 600; text-decoration: none; word-break: break-all; }
        .asa-portal-link:hover { text-decoration: underline; }
      `}</style>

      <section id="enroll" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div className="asa-enroll-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              How to Enrol in the ASATEEL Platform
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
              Enrolling on the <strong style={{ color: '#1d1d1f' }}>ASATEEL</strong> platform is quite simple. Transport operators can apply online through the ASATEEL portal{' '}
              <a href="https://asateel.itc.gov.ae" target="_blank" rel="noopener noreferrer" className="asa-portal-link">
                https://asateel.itc.gov.ae
              </a>
            </p>
            <p style={{ margin: '18px 0 14px', fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.6, color: '#6e6e73' }}>
              Here is the process:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '6px', flexShrink: 0, marginTop: '2px',
                    background: 'rgba(19,96,238,.12)', color: '#1360ee',
                    display: 'grid', placeItems: 'center', fontSize: 'var(--f-11)', fontWeight: 800,
                  }}>✓</span>
                  <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.75, color: '#6e6e73' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="right">
            <Image
              src="/regulatory/asateel-certified/locator-itc.svg"
              alt="Enroll in the ASATEEL platform — city illustration"
              width={403}
              height={256}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

        </div>
      </section>
    </>
  )
}
