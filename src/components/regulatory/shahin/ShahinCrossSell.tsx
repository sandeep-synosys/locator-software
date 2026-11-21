import Link from 'next/link'

const POINTS = [
  {
    title: 'Enhanced Security and Real-Time Tracking:',
    desc: 'The core feature of SecurePath Premium is its state-of-the-art GPS tracking technology. With location monitoring and real-time updates, businesses can ensure the safety of their valuable assets throughout their journey.',
  },
  {
    title: 'Compliance with Regulations:',
    desc: 'In the highly regulated industry of transportation and logistics, obtaining a certificate of installation for tracking devices is essential. This certification provides businesses with peace of mind knowing that they are using a reliable and approved solution.',
  },
]

export default function ShahinCrossSell() {
  return (
    <section style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#f7f9fc' }}>
      <div style={{ maxWidth: 'var(--w-900)', margin: '0 auto' }} data-reveal>

        <h2 style={{ margin: '0 0 18px', fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: '#1360ee' }}>
          <Link href="/securepath-premium" style={{ color: 'inherit', textDecoration: 'none' }}>
            How SHAHIN Works with SecurePath Premium
          </Link>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
            Securepath Premium, a GPS tracking solution, managed by <strong style={{ color: '#1d1d1f' }}>SIRA (Security Industry Regulatory Agency)</strong> in Dubai to enhance the security and monitoring of freight transport and cargo vehicles.
          </p>
          <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
            Securepath Premium offers advanced tracking capabilities, allowing real-time monitoring of vehicles through GPS technology. With this system in place, SIRA can effectively track and manage freight transport and cargo vehicles to ensure their safety and compliance with regulations.
          </p>
          <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
            The integration of SHAHIN with Securepath Premium further enhances the functionality of the system. It enables seamless access to vehicle registration data, providing valuable insights into ownership details and ensuring that only authorized vehicles are on the road.
          </p>
          <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
            Here is the importance of SHAHIN portal and how SecurePath Premium can contribute to the companies&apos; operations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {POINTS.map(p => (
            <div key={p.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '6px', flexShrink: 0, marginTop: '2px',
                background: 'rgba(19,96,238,.12)', color: '#1360ee',
                display: 'grid', placeItems: 'center', fontSize: 'var(--f-12)', fontWeight: 800,
              }}>✓</span>
              <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.8, color: '#6e6e73' }}>
                <strong style={{ color: '#1d1d1f' }}>{p.title}</strong>{' '}
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '28px' }}>
          <Link href="/securepath-premium" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: 'var(--f-14)', fontWeight: 700, color: '#fff',
            background: '#1360ee', borderRadius: '999px', padding: '13px 26px',
            textDecoration: 'none', transition: '.18s cubic-bezier(.22,.61,.36,1)',
          }}>
            Explore SecurePath Premium
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
