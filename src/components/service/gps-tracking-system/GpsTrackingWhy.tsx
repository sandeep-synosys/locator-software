import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const LEFT_ITEMS = [
  { title: 'Real-Time Tracking',    desc: 'The exact location of your cars will be provided, including all their activities.' },
  { title: 'Intuitive Interface',   desc: 'LOCATOR has been designed by some of the best hands in the industry.' },
  { title: 'Route Tracking',        desc: 'Review daily activities, trips, and parking with detailed route playback for a period of one year.' },
  { title: 'Geofencing Technology', desc: 'With this feature, you’ll know the moment a car enters or exits a pre-specified zone.' },
]

const RIGHT_ITEMS = [
  { title: 'Idle Alerts',              desc: 'If any vehicles are sitting idle, you’ll be notified right away.' },
  { title: 'After-Hours Notifications', desc: 'If any of your vehicles is used after official hours, you’ll be instantly notified.' },
  { title: 'Service Reminders',        desc: 'Get alerts about servicing and RTA renewals as per UAE regulations.' },
  { title: 'Report Scheduler',         desc: 'Easily schedule your own preferred time for reports to be delivered.' },
]

function PhoneMock() {
  return (
    <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
      {/* Ambient wash behind the cut-out device */}
      <div aria-hidden="true" style={{
        position: 'absolute', width: '128%', aspectRatio: '1 / 1', zIndex: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(19,96,238,.14), transparent 66%)',
        filter: 'blur(10px)',
      }} />
      <Image
        src="/services/gps-tracking-system/dashboard.png"
        alt="LOCATOR app dashboard — moving, idling, and stopped vehicle counts with live view, trips, reports, and summary"
        width={592}
        height={1024}
        sizes="(max-width: 900px) 58vw, 250px"
        style={{ position: 'relative', zIndex: 1, width: 'min(58vw, 250px)', height: 'auto', display: 'block' }}
      />
    </div>
  )
}

function ItemRow({ title, desc, align }: { title: string; desc: string; align: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'gtw-item-row gtw-item-row--reverse' : 'gtw-item-row'} style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', flexDirection: align === 'right' ? 'row-reverse' : 'row', textAlign: align }}>
      <span style={{
        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
        background: '#1360ee', color: '#fff', display: 'grid', placeItems: 'center',
        transition: `transform .24s ${EASE}`,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      </span>
      <div>
        <h3 style={{ margin: '0 0 5px', fontSize: 'var(--f-14-5)', fontWeight: 800, color: '#1d1d1f' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 'var(--f-12-5)', lineHeight: 1.65, color: '#6e6e73', maxWidth: '30ch' }}>{desc}</p>
      </div>
    </div>
  )
}

export default function GpsTrackingWhy() {
  return (
    <section style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#f7f9fc' }}>
      <div style={{ maxWidth: 'var(--w-1160)', margin: '0 auto' }}>
        <div data-reveal style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto clamp(40px,5vw,56px)' }}>
          <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
            <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px', margin: '0 auto' }} /></span>
            Why LOCATOR
          </span>
          <h2 style={{ margin: '0 0 14px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-.015em', color: '#1d1d1f' }}>
            Why You Need Our GPS Tracking System
          </h2>
          <p style={{ margin: 0, fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.75, color: '#6e6e73' }}>
            There are plenty of reasons to start using LOCATOR — its features are breathtaking and impressive,
            guaranteed to keep your cars secure while providing accurate tracking information. Here&apos;s why it&apos;s
            the best GPS vehicle tracking system:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'center' }} className="gtw-why-grid">
          <div data-reveal="left" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vw,34px)' }}>
            {LEFT_ITEMS.map(it => <ItemRow key={it.title} title={it.title} desc={it.desc} align="left" />)}
          </div>

          <div data-reveal="zoom" style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneMock />
          </div>

          <div data-reveal="right" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vw,34px)' }}>
            {RIGHT_ITEMS.map(it => <ItemRow key={it.title} title={it.title} desc={it.desc} align="right" />)}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .gtw-why-grid { grid-template-columns: 1fr !important; }
            .gtw-item-row--reverse { flex-direction: row !important; text-align: left !important; }
          }
        `}</style>
      </div>
    </section>
  )
}
