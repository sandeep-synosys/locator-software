import Image from 'next/image'
import Link from 'next/link'

// The six features are the same set the home page ScrollShowcase shows on its
// Fleet Telematics row (see components/ScrollShowcase/index.jsx → fleetFeatures);
// those cards link here, so the copy has to be the copy the reader just clicked.
// The icons are carried over verbatim — the two composed ones fill their badge
// with #f1f5f9, which is this card's icon tile colour, so the badge still cuts
// out of the shape behind it.
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" stroke="#374151" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Live GPS Tracking',
    desc: 'Track every vehicle live on one map, monitor driver activity in real time, and keep your road teams moving to plan.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="9.7" r="6.9" />
        <path d="M10 5.9v4l2.7 1.7" />
        <g transform="translate(11.9 11.6) scale(0.5)" fill="#f1f5f9">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" strokeWidth="3" />
          <path d="M10.3 20.6a1.94 1.94 0 0 0 3.4 0" strokeWidth="3" fill="none" />
        </g>
      </svg>
    ),
    title: 'Instant Idle Alerts',
    desc: 'Detect vehicles left idling for too long, cut the fuel they burn standing still, and recover the hours lost to it.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#374151" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Dynamic Fleet Dashboard',
    desc: (
      <>
        One central dashboard in{' '}
        <Link href="/software" style={{ color: '#1360ee', fontWeight: 600, textDecoration: 'none' }}>LOCATOR fleet management software</Link>{' '}
        for trip insights, live vehicle status, and a performance overview of the whole fleet.
      </>
    ),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(-0.6 3.2) scale(0.76)">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" strokeWidth="2" />
          <circle cx="7" cy="17" r="2" strokeWidth="2" />
          <circle cx="17" cy="17" r="2" strokeWidth="2" />
        </g>
        <g transform="translate(8.34 5.84) scale(0.64)" fill="#f1f5f9">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2.35" />
          <path d="M12 9.5v4.2" strokeWidth="2.35" />
          <path d="M12 17.4h.01" strokeWidth="2.35" />
        </g>
      </svg>
    ),
    title: 'After-Hours Vehicle Alerts',
    desc: 'Get notified the moment a vehicle moves outside working hours, so unauthorised trips are caught while they are happening.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5.9 20.5h4.6q3.4 0 3.4-3.4v-2.7q0-3.4 3.4-3.4h0.8"
          stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path
          fillRule="evenodd"
          fill="#374151"
          d="M9.9 14.4c0 3-4 6.1-4 6.1s-4-3.1-4-6.1a4 4 0 0 1 8 0z
             M5.9 12.7a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 1 0 0-3.4z"
        />
        <path
          fillRule="evenodd"
          fill="#374151"
          d="M22.1 4.9c0 3-4 6.1-4 6.1s-4-3.1-4-6.1a4 4 0 0 1 8 0z
             M18.1 3.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 1 0 0-3.4z"
        />
      </svg>
    ),
    title: 'Daily Route History',
    desc: 'Review full trip logs, stop reports, and route timelines for every vehicle, every day.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Fleet Service Reminders',
    desc: 'Automated maintenance alerts for oil changes, tyres, and service schedules, so nothing falls due unnoticed.',
  },
]

export default function ServiceFleetShowcase() {
  return (
    <>
      <style>{`
        .fts-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px,5vw,64px); align-items: center; }
        @media (max-width: 900px) { .fts-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .fts-grid > div:last-child { order: -1; } }
        /* One card per line, at every width — same reasoning as the Video
           Telematics showcase: two columns squeeze the body copy into a ~200px
           measure that breaks short sentences over five or six lines. */
        .fts-feature-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        /* The card carries the full feature copy here, not just a label — this is
           the destination page, so there is nowhere further to send the reader for
           the rest of the sentence. Icon aligns to the top of the text block
           rather than to the card's centre, which is where it belongs once the
           body runs to several lines. */
        .fts-fcard {
          background: #ffffff; border: 1px solid #e8edf3; border-radius: 16px;
          padding: 16px; display: flex; align-items: flex-start; gap: 12px;
        }
        .fts-fcard-icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .fts-fcard-body { min-width: 0; }
        .fts-fcard-title { display: block; font-size: var(--f-13); font-weight: 700; color: #1d1d1f; line-height: 1.3; }
        .fts-fcard-desc { margin: 6px 0 0; font-size: var(--f-12-5); line-height: 1.55; color: #6e6e73; }
        .fts-browser {
          border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;
          box-shadow: 0 30px 60px -24px rgba(20,40,90,.3);
        }
        .fts-browser-bar { height: 34px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; padding: 0 12px; gap: 6px; }
      `}</style>

      {/* id is the landing target for the Fleet Telematics feature cards on the
          home page — they link straight to this section, not just to the route.

          The offset CANCELS the section's own top padding rather than adding to
          it: a flat 88px would land the section's top edge below the navbar and
          the padding would then push the eyebrow another ~80px further down, so
          arriving here would open on a band of empty background with the cards
          below the fold. Subtracting the same padding back out lands the eyebrow
          a fixed 24px under the navbar at every width, whatever the clamp
          resolves to, and the section's normal in-flow spacing is untouched. */}
      <section
        id="fleet-telematics"
        style={{
          padding: 'clamp(56px,7vw,80px) 28px',
          background: '#f5f7fa',
          scrollMarginTop: 'calc(88px - clamp(56px,7vw,80px))',
        }}
      >
        <div className="fts-grid" style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>

          <div data-reveal="left">
            <span style={{ fontSize: 'var(--f-13)', fontWeight: 700, color: '#1360ee', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '18px', display: 'block' }}>
              Fleet Telematics
            </span>
            <h2 style={{ fontSize: 'max(clamp(24px,3vw,36px), min(2.500vw, 52.2px))', fontWeight: 800, lineHeight: 1.15, color: '#1d1d1f', margin: '0 0 16px' }}>
              Fleet Telematics for Every Industry
            </h2>
            <p style={{ fontSize: 'max(clamp(13px,1.2vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.65, color: '#6e6e73', margin: '0 0 28px', maxWidth: 440 }}>
              Real-time GPS tracking to manage drivers, routes, and road operations with ease.
            </p>

            <h3 style={{ fontSize: 'max(clamp(15px,1.4vw,18px), min(1.250vw, 26.1px))', fontWeight: 700, color: '#1d1d1f', margin: '0 0 10px' }}>
              Live Vehicle Visibility &amp; Fleet Intelligence
            </h3>
            <p style={{ fontSize: 'max(clamp(12px,1.1vw,14px), min(0.972vw, 20.3px))', lineHeight: 1.6, color: '#6e6e73', margin: '0 0 24px', maxWidth: 440 }}>
              Live tracking, idle and after-hours alerts, trip history, and maintenance reminders for vans, trucks, buses, and every vehicle in your fleet.
            </p>

            <div className="fts-feature-grid">
              {FEATURES.map(f => (
                <div key={f.title} className="fts-fcard">
                  <span className="fts-fcard-icon">{f.icon}</span>
                  <div className="fts-fcard-body">
                    <span className="fts-fcard-title">{f.title}</span>
                    <p className="fts-fcard-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="right">
            <div className="fts-browser">
              <div className="fts-browser-bar">
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />
                ))}
                <span style={{ marginLeft: 8, fontSize: 'var(--f-11)', color: '#94a3b8' }}>mylocatorplus.com/fleet</span>
              </div>
              <Image
                src="/showcase/desktop-dashboard.webp"
                alt="LOCATOR fleet dashboard — live vehicle map, trip insights, and vehicle status"
                width={1598}
                height={984}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
