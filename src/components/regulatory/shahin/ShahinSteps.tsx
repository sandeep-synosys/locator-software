import Image from 'next/image'

export default function ShahinSteps() {
  return (
    <>
      <style>{`
        .shn-reg-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .shn-reg-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .shn-reg-grid > div:first-child { order: 2; } }
        .shn-portal-link {
          color: #1360ee; font-weight: 600; text-decoration: none;
          word-break: break-all;
        }
        .shn-portal-link:hover { text-decoration: underline; }
      `}</style>

      <section id="register" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div className="shn-reg-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <Image
              src="/regulatory/shahin/shahin-third-how-to-section.webp"
              alt="How to register your business to SHAHIN — meeting illustration"
              width={1400}
              height={1078}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div data-reveal="right">
            <h2 style={{ margin: '0 0 18px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
              How to Register Your Business in SHAHIN
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                If you are looking to register your company in SHAHIN for freight transport and cargo vehicles in Dubai, it is important to understand the process and requirements involved. Registering your company in SHAHIN is mandatory for operating transport vehicles in Dubai, ensuring compliance with local regulations and promoting safety on the roads.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                To begin the registration process, you will need to gather all necessary documentation and meet specific criteria set by SHAHIN. Go to{' '}
                <a href="https://shahin.securepath.ae/" target="_blank" rel="noopener noreferrer" className="shn-portal-link">
                  https://shahin.securepath.ae/
                </a>{' '}
                and submit all the required documents for approval.
              </p>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                It is important for businesses operating in Dubai&apos;s transport industry to familiarize themselves with SHAHIN requirements and take necessary steps towards timely registration. By doing so, they can ensure seamless operations while contributing towards a safer and more secure business environment in Dubai.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
