import Image from 'next/image'

export default function SecurepathProcess() {
  return (
    <>
      <style>{`
        .sph-proc-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .sph-proc-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .sph-proc-grid > div:last-child { order: -1; } }
        .sph-proc-grid a { color: #1360ee; font-weight: 600; text-decoration: none; }
        .sph-proc-grid a:hover { text-decoration: underline; }
      `}</style>

      <section id="process" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div className="sph-proc-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              SecurePath Installation and Certification Process
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
              As one of the approved vendors in installing GPS Tracking Device, our technician will come and install the approved GPS Tracker with Data Sim Card. After the successful installation of the GPS Tracker, Certificate of Installation will be issued in order to register the vehicle in <a href="https://www.rta.ae" target="_blank" rel="noopener noreferrer">Road and Transport Authority (RTA)</a>. Log-in credentials will be provided and user can start tracking and monitoring the vehicles.
            </p>

            <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              Why Rent a Car Companies Choose LOCATOR for SecurePath
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                In a nutshell, <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> GPS Tracking Systems offer a high-end, reliable solution to a broad spectrum of tracking needs. Boasting a suite of robust features and a user-centric design, it enhances security and operational efficiency across a range of personal and business applications such as Rent A Car business.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Interested in installing a <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> in your Rent A Car business, as one of the leading GPS providers, LOCATOR offer the most aggressively priced and you&apos;ll be confident to trust us with your business ensuring that the GPS tracker installed flawlessly updates in the <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> software.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Experience for yourself the far-reaching benefits of installing <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> with LOCATOR team.
              </p>
            </div>
          </div>

          <div data-reveal="right">
            <Image
              src="/regulatory/securepath/secure-path-gps.webp"
              alt="SecurePath dashboard and reporting illustration"
              width={1200}
              height={1205}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

        </div>
      </section>
    </>
  )
}
