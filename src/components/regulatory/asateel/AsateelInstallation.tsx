import Image from 'next/image'

export default function AsateelInstallation() {
  return (
    <>
      <style>{`
        .asa-inst-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .asa-inst-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .asa-inst-grid > div:first-child { order: 2; } }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div className="asa-inst-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <Image
              src="/regulatory/asateel-certified/gps-tracker-installation.svg"
              alt="ASATEEL certified OBU installation — technician illustration"
              width={2889}
              height={2881}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div data-reveal="right">
            <h2 style={{ margin: '0 0 18px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              ASATEEL Certified OBU (On-Board Unit) Installation
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Installation of GPS tracking devices in vehicles and linking them to the electronic system is mandatory, provided that the devices used are <strong style={{ color: '#1d1d1f' }}>ASATEEL certified OBU</strong>.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                There are <strong style={{ color: '#1d1d1f' }}>ASATEEL</strong> certified OBU installation companies who will install, operate and maintain electronic system (GPS tracking devices) and issue a Certificate of Installation to be submitted in Asateel platform in order to get a permit.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
