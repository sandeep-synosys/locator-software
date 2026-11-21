import Image from 'next/image'

export default function AsateelExplainer() {
  return (
    <>
      <style>{`
        .asa-exp-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .asa-exp-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .asa-exp-grid > div:first-child { order: 2; } }
      `}</style>

      <section style={{ paddingTop: 'clamp(36px,4vw,56px)', paddingBottom: 'clamp(56px,7vw,80px)', paddingLeft: 28, paddingRight: 28, background: '#fff' }}>
        <div className="asa-exp-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <Image
              src="/regulatory/asateel-certified/locator-asateel.webp"
              alt="ASATEEL fleet management dashboard illustration"
              width={636}
              height={649}
              style={{ width: '100%', maxWidth: '480px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>

          <div data-reveal="right">
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              display: 'grid', placeItems: 'center', marginBottom: '18px',
              background: 'rgba(19,96,238,.10)', color: '#1360ee',
            }}>
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="5" fill="currentColor" opacity=".9" />
                <circle cx="19" cy="9" r="5" fill="currentColor" opacity=".65" />
                <circle cx="14" cy="18" r="5" fill="currentColor" opacity=".4" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 18px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              ASATEEL Certification and Why It Matters
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Asateel platform, the fleet management system, has been developed by Integrated Transport Center (ITC) to enhance the accountability, productivity and safety of all commercial transport activities in Abu Dhabi Emirate; such as freight, passenger bus and school bus transport. This involves the registration of all such services on the <strong style={{ color: '#1d1d1f' }}>ASATEEL</strong> platform in order to get Asateel Certificate and permits.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                The <strong style={{ color: '#1d1d1f' }}>ASATEEL</strong> platform is a comprehensive tool to manage and monitor all commercial fleets and operators in Abu Dhabi. By tracking driver behavior and adherence to transport rules and regulations using the approved GPS Tracking Device, the platform aims to promote increased safety for passengers and clarify the responsibilities and duties of all entities involved in this sector.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                The <strong style={{ color: '#1d1d1f' }}>ASATEEL</strong> certification is mandatory for any transport company operating within the Emirate of Abu Dhabi.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
