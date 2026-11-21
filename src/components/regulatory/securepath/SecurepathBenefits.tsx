import Image from 'next/image'

export default function SecurepathBenefits() {
  return (
    <>
      <style>{`
        .sph-ben-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .sph-ben-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .sph-ben-grid > div:first-child { order: 2; } }
        .sph-ben-grid a { color: #1360ee; font-weight: 600; text-decoration: none; }
        .sph-ben-grid a:hover { text-decoration: underline; }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#f7f9fc' }}>
        <div className="sph-ben-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <Image
              src="/regulatory/securepath/securepath-tracking.webp"
              alt="SecurePath laptop dashboard illustration"
              width={780}
              height={812}
              style={{ width: '100%', maxWidth: '420px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>

          <div data-reveal="right">
            <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              Benefits of SecurePath GPS Tracking for Rental Fleets
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Security takes center stage, as the system aids significantly in theft prevention and the recovery of lost assets in Dubai. The real-time tracking capability fosters operational efficiency, enabling companies to plan effectively.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> platform allows the businesses or authorities to immobilize the vehicles in case of theft or malpractice. The system&apos;s intuitive interface, coupled with <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a>&apos;s dedicated customer support, makes for a seamless user experience.
              </p>
            </div>

            <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              Use Cases of SecurePath GPS Tracking Systems
            </h2>
            <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
              The versatility of <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> GPS Tracking Systems has found application in myriad contexts. At a personal level, the system is used to track vehicles, monitor teen driving habits, and oversee the movement of elderly family members, enhancing their safety. In the commercial realm, Rent A Car businesses leverage <a href="https://securepath.ae" target="_blank" rel="noopener noreferrer">SecurePath</a> for effective tracking, thereby enhancing productivity and accountability.
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
