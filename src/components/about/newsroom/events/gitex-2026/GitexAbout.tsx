import Image from 'next/image'
import { ABOUT, GITEX_SUMMIT_HREF } from './gitex-2026-content'
import { GITEX_ASSETS } from './gitex-2026-data'
import { Bar, KeepDates, Paras } from './GitexText'

/* "GITEX GLOBAL 2026: Where Global Technology Meets Business": the event
   overview, a five-day strip (Summit on day one, Expo on days two to five) and
   one card per venue. The Summit heading links to the GITEX conference
   overview, as the brief asks. */
const DAYS = ['7', '8', '9', '10', '11']

export default function GitexAbout() {
  const summitLink = 'GITEX Summit'
  const [beforeLink, afterLink] = ABOUT.summit.heading.split(summitLink)
  return (
    <section className="gxb-sec gxa">
      <style href="gitex-2026-about" precedence="medium">{`
        .gxa { background: linear-gradient(180deg, #f3f7ff 0%, #eaf1ff 100%); overflow: hidden; }
        .gxa::before {
          content: ''; position: absolute; right: -10%; top: -30%; width: 60%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle, rgba(19,96,238,.12), rgba(19,96,238,0) 65%); pointer-events: none;
        }
        .gxa-top { display: grid; grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr); gap: clamp(28px,5vw,88px); align-items: start; }
        .gxa-days { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(8px,1vw,14px); margin-top: clamp(40px,5vw,72px); }
        .gxa-day {
          position: relative; border-radius: 16px; background: #fff; border: 1px solid #dbe5f7;
          padding: clamp(12px,1.2vw,18px) 0; text-align: center; color: #0d1f4f;
        }
        .gxa-day b { display: block; font-size: max(clamp(24px,2.6vw,40px), min(2.3vw, 54px)); line-height: 1.05; font-weight: 700; }
        .gxa-day small { display: block; font-size: max(clamp(11px,.8vw,13px), min(.75vw, 17px)); letter-spacing: .14em; color: #7b86a3; font-weight: 600; }
        .gxa-day--summit { background: #0d1f4f; border-color: #0d1f4f; color: #fff; }
        .gxa-day--summit small { color: #9db7ff; }
        .gxa-day--expo { background: #1360ee; border-color: #1360ee; color: #fff; }
        .gxa-day--expo small { color: #cfe0ff; }
        .gxa-span { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(8px,1vw,14px); margin: 10px 0 clamp(20px,2.2vw,30px); }
        .gxa-span span {
          display: flex; align-items: center; justify-content: center; gap: 10px; height: 30px; border-radius: 999px;
          font-size: max(clamp(10.5px,.78vw,13px), min(.72vw, 17px)); font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
        }
        .gxa-span span:first-child { background: rgba(13,31,79,.08); color: #0d1f4f; }
        .gxa-span span + span { grid-column: 2 / 6; background: rgba(19,96,238,.1); color: #1360ee; }
        .gxa-span span + span::before, .gxa-span span + span::after { content: ''; flex: 1; max-width: 32%; height: 1.5px; background: currentColor; opacity: .3; }
        .gxa-cards { display: grid; grid-template-columns: 1fr 1.6fr; gap: clamp(14px,1.6vw,24px); }
        .gxa-card { position: relative; border-radius: 24px; background: #fff; overflow: hidden; box-shadow: 0 18px 44px rgba(13,31,79,.10); display: flex; flex-direction: column; }
        .gxa-art { position: relative; height: clamp(150px,13vw,220px); overflow: hidden; }
        .gxa-art--summit { background: radial-gradient(90% 120% at 50% 110%, #2a5bd8 0%, #0d1f4f 62%); }
        .gxa-art--expo { background: #fff; }
        .gxa-art--expo img { width: 204% !important; height: auto !important; inset: auto 0 0 auto !important; object-fit: contain; }
        .gxa-stage { position: absolute; inset: 0; width: 100%; height: 100%; }
        .gxa-date {
          position: absolute; left: 18px; top: 18px; z-index: 1; border-radius: 12px; padding: 8px 12px; text-align: center;
          background: rgba(255,255,255,.95); color: #0d1f4f; box-shadow: 0 8px 18px rgba(13,31,79,.18);
        }
        .gxa-date b { display: block; font-size: max(clamp(18px,1.5vw,24px), min(1.4vw, 32px)); line-height: 1; font-weight: 700; }
        .gxa-date small { display: block; font-size: 11px; letter-spacing: .14em; font-weight: 600; color: #1360ee; margin-top: 3px; }
        .gxa-body { padding: clamp(22px,2.2vw,34px); }
        .gxa-body .gxb-h3 { margin-bottom: 14px; }
        .gxa-body .gxb-h3 a { color: inherit; text-decoration-color: rgba(19,96,238,.45); }
        .gxa-body .gxb-h3 a:hover { color: #1360ee; }
        .gxa-venue { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px; color: #1360ee; font-weight: 600; font-size: max(clamp(12px,.85vw,14px), min(.8vw, 18px)); }
        @media (max-width: 980px) {
          .gxa-top { grid-template-columns: 1fr; }
          .gxa-cards { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .gxa-day { border-radius: 12px; }
        }
      `}</style>

      <div className="gxb-wrap">
        <div className="gxa-top">
          <div data-reveal>
            <Bar />
            <h2 className="gxb-h2">{ABOUT.heading}</h2>
          </div>
          <div data-reveal data-reveal-delay="100">
            <Paras paras={ABOUT.paras} />
          </div>
        </div>

        <div className="gxa-days" data-reveal aria-hidden="true">
          {DAYS.map((d, i) => (
            <div key={d} className={`gxa-day ${i === 0 ? 'gxa-day--summit' : 'gxa-day--expo'}`}>
              <b>{d}</b>
              <small>DEC</small>
            </div>
          ))}
        </div>
        <div className="gxa-span" data-reveal aria-hidden="true">
          <span>Summit</span>
          <span>Expo</span>
        </div>

        <div className="gxa-cards">
          <article className="gxa-card" data-reveal>
            <div className="gxa-art gxa-art--summit" aria-hidden="true">
              <svg className="gxa-stage" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">
                <g fill="#fff">
                  <path d="M60 0 L120 150 L0 150 Z" opacity=".07" />
                  <path d="M200 0 L270 150 L130 150 Z" opacity=".09" />
                  <path d="M340 0 L400 150 L280 150 Z" opacity=".07" />
                </g>
                <rect x="70" y="60" width="260" height="78" rx="6" fill="#1b3f9c" stroke="#5b97ff" strokeOpacity=".5" />
                <rect x="84" y="72" width="232" height="54" rx="3" fill="#2453c9" />
                <path d="M92 112 C140 90 170 104 200 92 S260 80 308 88" stroke="#9dc0ff" strokeWidth="2.5" fill="none" />
                <rect x="40" y="150" width="320" height="16" rx="3" fill="#0a173b" />
                <g fill="#0a173b">
                  {[56, 92, 128, 164, 200, 236, 272, 308, 344].map(x => (
                    <circle key={x} cx={x} cy="190" r="12" />
                  ))}
                </g>
              </svg>
              <span className="gxa-date">
                <b>7</b>
                <small>DEC</small>
              </span>
            </div>
            <div className="gxa-body">
              <span className="gxa-venue">
                <PinIcon /> Dubai World Trade Centre (DWTC)
              </span>
              <h3 className="gxb-h3">
                {beforeLink}
                <a className="gxb-link" href={GITEX_SUMMIT_HREF} target="_blank" rel="noopener">
                  {summitLink}
                </a>
                {afterLink}
              </h3>
              <Paras paras={ABOUT.summit.paras} />
            </div>
          </article>

          <article className="gxa-card" data-reveal data-reveal-delay="120">
            <div className="gxa-art gxa-art--expo" aria-hidden="true">
              <Image src={`${GITEX_ASSETS}/hero-banner.webp`} alt="" fill sizes="(max-width: 980px) 200vw, 120vw" />
              <span className="gxa-date">
                <b>8–11</b>
                <small>DEC</small>
              </span>
            </div>
            <div className="gxa-body">
              <span className="gxa-venue">
                <PinIcon /> Dubai Exhibition Centre (DEC), Expo City Dubai
              </span>
              <h3 className="gxb-h3">
                <KeepDates text={ABOUT.expo.heading} />
              </h3>
              <Paras paras={ABOUT.expo.paras} />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <path d="M7 15s5-4.6 5-8.5A5 5 0 0 0 2 6.5C2 10.4 7 15 7 15Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7" cy="6.5" r="1.8" fill="currentColor" />
    </svg>
  )
}
