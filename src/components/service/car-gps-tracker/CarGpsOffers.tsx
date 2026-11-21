import Image from 'next/image'
import Link from 'next/link'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const OFFERS = [
  {
    title: 'Fuel Management',
    desc: 'Our vehicle GPS tracker helps ensure fuel is effectively managed, cutting waste and unnecessary consumption across your fleet.',
    tint: '#eef3ff',
    img: '/services/car-gps-tracker/fuel-management.svg',
    alt: 'Fuel pump and consumption analytics for a tracked fleet',
  },
  {
    title: 'Real-Time Location & GPS',
    desc: 'LOCATOR is the best GPS tracker for cars when it comes to helping you see the exact location of your vehicles, live.',
    tint: '#edfff4',
    img: '/services/car-gps-tracker/real-time-location.svg',
    alt: 'Vehicle tracked live on a phone map with driver, speed, and fuel readings',
  },
  {
    title: 'Customizable Notifications & Alerts',
    desc: 'LOCATOR has been developed to help ensure that you make the right decisions, backed by alerts tailored to your fleet.',
    tint: '#fff3e8',
    img: '/services/car-gps-tracker/notifications.svg',
    alt: 'Hand holding a phone receiving a LOCATOR alert about a parked car',
  },
]

export default function CarGpsOffers() {
  return (
    <>
      <style>{`
        .cgo-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; max-width: var(--w-1120); margin: clamp(40px,5vw,56px) auto 0; }
        @media (max-width: 820px) { .cgo-cards { grid-template-columns: 1fr; } }
        .cgo-card {
          background: #fff; border: 1px solid #e7ebf3; border-radius: 20px; overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform .26s ${EASE}, box-shadow .26s ${EASE}, border-color .26s ${EASE};
        }
        .cgo-card:hover { transform: translateY(-4px); box-shadow: 0 22px 44px -20px rgba(19,96,238,.22); border-color: #dbe6ff; }
        /* Tint fades to white at the edges so each illustration's own backdrop blends in */
        .cgo-media { padding: 22px 22px 4px; display: grid; place-items: center; }
        .cgo-media img { width: 100%; max-width: 260px; height: auto; display: block; transition: transform .3s ${EASE}; }
        .cgo-card:hover .cgo-media img { transform: translateY(-4px) scale(1.03); }
        .cgo-body { padding: 22px 26px 28px; }
        .cgo-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 13px; font-weight: 700; color: #1360ee; text-decoration: none; }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,88px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }} data-reveal>
          <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
            <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
            What This App Offers
          </span>
          <h2 style={{ margin: '0 0 16px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: '#1d1d1f' }}>
            What Our Car GPS Tracker Offers
          </h2>
          <p style={{ margin: 0, fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.8, color: '#6e6e73' }}>
            LOCATOR is an app that has been developed with one goal in mind — to give you greater control over
            your vehicles and team than ever before. You won&apos;t have to worry about the location of your fleet
            or what your team is being used for, because our Car Tracker app takes care of that.
          </p>
        </div>

        <div className="cgo-cards">
          {OFFERS.map(o => (
            <div key={o.title} className="cgo-card" data-reveal>
              <div className="cgo-media" style={{ background: `radial-gradient(circle at 50% 62%, ${o.tint}, #ffffff 74%)` }}>
                <Image src={o.img} alt={o.alt} width={1143} height={863} sizes="(max-width: 820px) 88vw, 320px" unoptimized />
              </div>
              <div className="cgo-body">
                <h3 style={{ margin: '0 0 8px', fontSize: 'var(--f-16)', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-.01em' }}>{o.title}</h3>
                <p style={{ margin: 0, fontSize: 'var(--f-13-5)', lineHeight: 1.65, color: '#6e6e73' }}>{o.desc}</p>
                <Link href="/contact" className="cgo-link">Read details →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
