import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const LOCATOR_MAP_DUBAI =
  'https://www.google.com/maps/place/Locator+GPS+Tracker+for+Car+Dubai/@25.2194077,55.2798261,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f42d64d345f65:0xf2109013bb2bffd7!8m2!3d25.2194077!4d55.2798261!16s%2Fg%2F11h0gttlv?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D'
const LOCATOR_MAP_ABUDHABI =
  'https://www.google.com/maps/place/LOCATOR+GPS+-+ASATEEL+Certified+OBU+Installation+Company+-+Abu+Dhabi/@24.3732884,54.5353985,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5e4183e2f0d80d:0xc86366d346381d6f!8m2!3d24.3732835!4d54.5379734!16s%2Fg%2F11tsdk6y67?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D'

type Office = {
  n: string
  city: string
  emirate: string
  badge: string
  img: string
  imgAlt: string
  address: string
  phone: string
  phoneHref: string
  email: string
  hours: string
  maps: string
}

const OFFICES: Office[] = [
  {
    n: '01',
    city: 'Dubai',
    emirate: 'Emirate of Dubai',
    badge: 'Head Office',
    img: '/contact/dubai-office.webp',
    imgAlt: 'Locator Dubai — Sheikh Zayed Road and the Downtown skyline at sunset',
    address: 'Locator GPS Tracker for Car Dubai, City Tower 2, Sheikh Zayed Road, Trade Center First,\nDubai, United Arab Emirates',
    phone: '+971 4 354 7766',
    phoneHref: 'tel:+97143547766',
    email: 'info@locator.ae',
    hours: 'Mon – Sat · 9:00 AM – 6:00 PM',
    maps: LOCATOR_MAP_DUBAI,
  },
  {
    n: '02',
    city: 'Abu Dhabi',
    emirate: 'Emirate of Abu Dhabi',
    badge: 'Regional Office',
    img: '/contact/abu-dhabi-office.webp',
    imgAlt: 'Locator Abu Dhabi — Mazyad Mall office building in Mohammed Bin Zayed City',
    address: 'LOCATOR GPS - ASATEEL Certified OBU Installation Company, Mazyad Mall, Mohammed Bin Zayed City,\nAbu Dhabi, United Arab Emirates',
    phone: '+971 52 675 1880',
    phoneHref: 'tel:+971526751880',
    email: 'info@locator.ae',
    hours: 'Mon – Sat · 9:00 AM – 6:00 PM',
    maps: LOCATOR_MAP_ABUDHABI,
  },
]

const PinIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
)
const PhoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.73 12 19.79 19.79 0 0 1 1.67 3.43 2 2 0 0 1 3.66 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 5.91 5.91l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="m3.5 7.5 8.5 6 8.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ClockIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ContactOffices() {
  return (
    <section className="cto" id="offices">
      <style href="ct-contactoffices" precedence="medium">{`
        .cto {
          position: relative; overflow: hidden;
          background: radial-gradient(120% 80% at 50% -20%, #eff4ff 0%, #f7f9fd 45%, #ffffff 100%);
          padding: clamp(52px,7vw,92px) 28px clamp(48px,6vw,80px);
        }

        /* Faint road network behind everything — the same visual language as the
           map-led product, drawn once as SVG so it costs nothing. */
        .cto-roads { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .55; }
        .cto-roads svg { width: 100%; height: 100%; }

        .cto-inner { position: relative; z-index: 1; max-width: var(--w-1180); margin: 0 auto; }

        /* ── Header ── */
        .cto-head { text-align: center; margin-bottom: clamp(34px,4.6vw,58px); }
        .cto-pill {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 7px 16px 7px 8px; border-radius: 999px;
          background: #fff; border: 1px solid #e2e9f6;
          box-shadow: 0 10px 26px -16px rgba(20,40,90,.5);
          font-size: max(clamp(12px,1.05vw,13.5px), min(0.938vw, 19.57px)); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #1360ee;
        }
        .cto-pill img { border-radius: 50%; display: block; }

        .cto-title {
          margin: clamp(10px,1.2vw,14px) 0 0;
          font-size: max(clamp(30px,3.6vw,46px), min(3.194vw, 66.7px)); font-weight: 800;
          letter-spacing: -.035em; line-height: 1.05; color: #1d1d1f;
        }
        /* Brand-blue wash on the wordmark keeps it a graphic element, not a shout. */
        .cto-title span {
          background: linear-gradient(180deg, #1d1d1f 0%, #1d1d1f 48%, #1360ee 148%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .cto-sub { margin: clamp(12px,1.5vw,18px) auto 0; max-width: 54ch; font-size: max(clamp(14px,1.2vw,16px), min(1.111vw, 23.2px)); line-height: 1.7; color: #6e6e73; }

        /* ── Two office panels ── */
        .cto-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px,2vw,26px);
          align-items: stretch;
        }
        @media (max-width: 860px) { .cto-grid { grid-template-columns: 1fr; } }

        .cto-card {
          position: relative; overflow: hidden; display: flex; flex-direction: column;
          background: rgba(255,255,255,.9);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          border: 1px solid #e5eaf4; border-radius: 26px;
          box-shadow: 0 30px 64px -40px rgba(20,40,90,.55);
          transition: transform .3s ${EASE}, box-shadow .3s ${EASE}, border-color .3s ${EASE};
        }
        .cto-card:hover { transform: translateY(-5px); border-color: #cfdcf6; box-shadow: 0 44px 80px -40px rgba(19,96,238,.5); }

        /* ── Photo header: the city itself, with the identity overlaid on it.
           aspect-ratio matches the office photos' own 1676x938 shape (not a
           generic 16:9) and object-fit is contain, so the full frame always
           shows — no min-height floor either, since that would force a taller
           box than the photo and crop it to fill the gap. */
        .cto-media { position: relative; aspect-ratio: 1676 / 938; overflow: hidden; background: #0b1220; }
        .cto-media img {
          object-fit: contain;
          transition: transform .7s ${EASE};
        }
        .cto-card:hover .cto-media img { transform: scale(1.09); }
        .cto-media-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(0deg, rgba(4,8,18,.32) 0%, rgba(4,8,18,.18) 34%, rgba(4,8,18,.03) 66%, rgba(4,8,18,.09) 100%);
        }

        .cto-n {
          position: absolute; z-index: 2; top: clamp(14px,1.8vw,20px); left: clamp(18px,2.2vw,26px);
          font-size: var(--f-12); font-weight: 800; letter-spacing: .16em; color: rgba(255,255,255,.72);
          text-shadow: 0 2px 10px rgba(0,0,0,.5);
        }
        .cto-badge {
          position: absolute; z-index: 2; top: clamp(12px,1.6vw,17px); right: clamp(14px,1.8vw,20px);
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 999px;
          background: rgba(255,255,255,.16); color: #fff;
          border: 1px solid rgba(255,255,255,.3);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          font-size: var(--f-10-5); font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
          white-space: nowrap;
        }
        .cto-badge i { width: 6px; height: 6px; border-radius: 50%; background: #6fa8ff; box-shadow: 0 0 0 3px rgba(111,168,255,.28); }

        .cto-media-copy {
          position: absolute; z-index: 2; left: clamp(18px,2.2vw,26px); right: clamp(18px,2.2vw,26px);
          bottom: clamp(16px,2vw,22px);
        }
        .cto-city {
          margin: 0; font-size: max(clamp(26px,3.2vw,40px), min(2.778vw, 58px)); font-weight: 800;
          letter-spacing: -.035em; line-height: 1.05; color: #fff;
          text-shadow: 0 2px 4px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.35);
        }
        .cto-emirate { margin: 7px 0 0; font-size: var(--f-12-5); font-weight: 600; letter-spacing: .02em; color: rgba(255,255,255,.76); }

        .cto-body {
          position: relative; display: flex; flex-direction: column; flex: 1;
          padding: clamp(22px,2.6vw,32px) clamp(22px,2.6vw,34px) clamp(24px,2.8vw,34px);
        }
        /* Blue corner bloom that warms up on hover. */
        .cto-body::after {
          content: ''; position: absolute; z-index: 0; right: -20%; bottom: -34%;
          width: 60%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(19,96,238,.14), transparent 72%);
          opacity: .7; transition: opacity .3s ${EASE}, transform .45s ${EASE}; pointer-events: none;
        }
        .cto-card:hover .cto-body::after { opacity: 1; transform: scale(1.12); }
        .cto-body > * { position: relative; z-index: 1; }

        .cto-rows { display: flex; flex-direction: column; gap: clamp(14px,1.6vw,18px); }
        .cto-row { display: grid; grid-template-columns: 40px 1fr; gap: 13px; align-items: flex-start; }
        .cto-row-ic {
          width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center;
          background: #fff; border: 1px solid #e6ecf7; color: #1360ee;
          box-shadow: 0 8px 18px -14px rgba(20,40,90,.7);
          transition: background .22s ${EASE}, color .22s ${EASE}, transform .22s ${EASE};
        }
        .cto-card:hover .cto-row-ic { transform: translateY(-1px); }
        .cto-row-ic svg { width: 18px; height: 18px; }
        .cto-row-label { font-size: var(--f-10-5); font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: #9aa3b2; }
        .cto-row-value {
          display: block; margin-top: 4px; white-space: pre-line;
          font-size: var(--f-14-5); font-weight: 600; line-height: 1.6; color: #1d1d1f;
          text-decoration: none; transition: color .18s ${EASE};
        }
        a.cto-row-value:hover { color: #1360ee; }

        @media (prefers-reduced-motion: reduce) {
          .cto-card, .cto-body::after, .cto-media img, .cto-row-ic { transition: none; }
        }
      `}</style>

      {/* Stylised road network — decorative only. */}
      <div className="cto-roads" aria-hidden="true">
        <svg viewBox="0 0 1440 620" preserveAspectRatio="none" fill="none">
          <g stroke="#1360ee" strokeOpacity=".16" strokeWidth="1.6" strokeLinecap="round">
            <path d="M-20 118 C 260 96, 470 168, 720 150 S 1180 74, 1460 108" />
            <path d="M-20 300 C 300 268, 520 352, 760 330 S 1200 250, 1460 292" />
            <path d="M-20 492 C 240 470, 500 540, 742 512 S 1200 430, 1460 470" />
            <path d="M226 -20 C 250 160, 196 330, 240 640" />
            <path d="M700 -20 C 726 180, 668 380, 712 640" />
            <path d="M1168 -20 C 1196 170, 1138 360, 1182 640" />
          </g>
          <g stroke="#1360ee" strokeOpacity=".26" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="10 14">
            <path d="M-20 214 C 320 186, 560 254, 820 226 S 1220 158, 1460 196" />
          </g>
        </svg>
      </div>

      <div className="cto-inner">
        <div className="cto-head" data-reveal>
          <span className="cto-pill">
            <Image src="/flags/uae.svg" alt="" width={22} height={22} />
            Our offices
          </span>
          <h2 className="cto-title"><span>Visit Our UAE Offices</span></h2>
          <p className="cto-sub">
            Two teams on the ground — Dubai and Abu Dhabi — covering installation, support,
            and compliance across all seven emirates.
          </p>
        </div>

        <div className="cto-grid">
          {OFFICES.map((o, i) => (
            <article className="cto-card" key={o.city} data-reveal={i === 0 ? 'left' : 'right'}>
              <div className="cto-media">
                <Image src={o.img} alt={o.imgAlt} fill sizes="(max-width: 860px) 100vw, 50vw" />
                <div className="cto-media-scrim" />
                <span className="cto-n">{o.n}</span>
                <span className="cto-badge"><i />{o.badge}</span>
                <div className="cto-media-copy">
                  <h3 className="cto-city">{o.city} Office</h3>
                  <p className="cto-emirate">{o.emirate}</p>
                </div>
              </div>

              <div className="cto-body">
              <div className="cto-rows">
                <div className="cto-row">
                  <span className="cto-row-ic">{PinIcon}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="cto-row-label">Address</span>
                    <a className="cto-row-value" href={o.maps} target="_blank" rel="noopener noreferrer">{o.address}</a>
                  </div>
                </div>

                <div className="cto-row">
                  <span className="cto-row-ic">{PhoneIcon}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="cto-row-label">Phone</span>
                    <a className="cto-row-value" href={o.phoneHref}>{o.phone}</a>
                  </div>
                </div>

                <div className="cto-row">
                  <span className="cto-row-ic">{MailIcon}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="cto-row-label">Email</span>
                    <a className="cto-row-value" href={`mailto:${o.email}`}>{o.email}</a>
                  </div>
                </div>

                <div className="cto-row">
                  <span className="cto-row-ic">{ClockIcon}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="cto-row-label">Working hours</span>
                    <span className="cto-row-value">{o.hours}</span>
                  </div>
                </div>
              </div>

              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
