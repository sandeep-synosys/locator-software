import Image from 'next/image'

export default function ShahinExplainer() {
  return (
    <>
      <style>{`
        .shn-exp-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .shn-exp-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section style={{ paddingTop: 'clamp(36px,4vw,56px)', paddingBottom: 'clamp(56px,7vw,80px)', paddingLeft: 28, paddingRight: 28, background: '#fff' }}>
        <div className="shn-exp-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              display: 'grid', placeItems: 'center', marginBottom: '20px',
              background: 'rgba(19,96,238,.10)', color: '#1360ee',
            }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="5" fill="currentColor" opacity=".9" />
                <circle cx="19" cy="9" r="5" fill="currentColor" opacity=".65" />
                <circle cx="14" cy="18" r="5" fill="currentColor" opacity=".4" />
              </svg>
            </div>

            <h2 style={{ margin: '0 0 18px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              SHAHIN GPS Tracking and Why It Matters
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                In Dubai, the <a href="#" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>Security Industry Regulatory Agency (SIRA)</a> has implemented a mandatory regulation named as <strong style={{ color: '#1d1d1f' }}>SHAHIN</strong> where all trucks carrying cargo that are registered in Dubai and at any port (under the Dubai Port Authority, danata, ek, skycargo, etc.). Vehicles that fall under this category must have a registered GPS device installed with a certification.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                The implementation of <a href="#" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>SHAHIN</a> is an important step towards improving transportation security in Dubai. It allows authorities to effectively track and trace all trucks carrying cargo vehicles, helping to prevent theft, unauthorized use, and other unlawful activities.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Vehicles that fall under <a href="#" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>SHAHIN</a> are required to comply with this regulation by ensuring their vehicles are equipped with an approved GPS tracker that meets the specified standards set by <a href="#" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>SIRA</a>. Failure to comply may result in penalties or legal consequences.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                Overall, <a href="#" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>SHAHIN</a> is an essential regulation that enhances the safety and security measures for transport vehicles in Dubai. It provides authorities with tracking capabilities through GPS technology, ultimately contributing to a safer transportation environment.
              </p>
            </div>
          </div>

          <div data-reveal="right">
            <Image
              src="/regulatory/shahin/shahin-second-image-industrysection.webp"
              alt="SHAHIN cargo tracking — industrial and logistics facility illustration"
              width={1400}
              height={930}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

        </div>
      </section>
    </>
  )
}
