import Image from 'next/image'

export default function SecurepathPremiumImportance() {
  return (
    <>
      <style>{`
        .spp-imp-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .spp-imp-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .spp-imp-grid > div:first-child { order: 2; } }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div className="spp-imp-grid" style={{ marginBottom: '28px' }}>
            <div data-reveal="left">
              <Image
                src="/regulatory/securepath-premium/importance-of-securepath-premium.webp"
                alt="Importance of SecurePath Premium — fleet monitoring illustration"
                width={1587}
                height={1147}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div data-reveal="right">
              <h2 style={{ margin: '0 0 18px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
                Why SecurePath Premium Compliance Matters
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                  The Security Industry Regulatory Agency (SIRA) has implemented strict regulations to ensure the safety and protection of businesses. One of the key requirements set by SIRA is the Certificate of Installation for GPS Trackers. This certificate is mandatory for businesses to ensure compliance set by the authorities. SecurePath Premium offers a comprehensive solution that helps businesses meet these regulations and obtain the necessary certification.
                </p>
                <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                  By subscribing to SecurePath Premium, business owners can ensure that their GPS tracking systems are installed and maintained according to SIRA&apos;s guidelines. This not only helps them comply with regulations but also enhances the overall security of their operations.
                </p>
              </div>
            </div>
          </div>

          <p data-reveal style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
            Failure to comply can result in penalties, fines, or even legal consequences. By utilizing SecurePath Premium, business owners can have peace of mind knowing that they are operating within the legal framework and taking proactive measures to protect their assets.
          </p>

        </div>
      </section>
    </>
  )
}
