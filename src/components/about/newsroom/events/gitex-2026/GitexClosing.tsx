import { CLOSING } from './gitex-2026-content'
import { Bar, Paras } from './GitexText'

/* "Looking Beyond Location": the closing thoughts in a blue band with a Dubai
   skyline, like the CTA band in the page design. */
export default function GitexClosing() {
  return (
    <section className="gxb-sec gxc">
      <style href="gitex-2026-closing" precedence="medium">{`
        .gxc { padding-top: 0; }
        .gxc-band {
          position: relative; overflow: hidden; border-radius: 32px; color: #fff;
          padding: clamp(36px,5vw,80px) clamp(26px,5vw,80px) clamp(120px,12vw,190px);
          background: linear-gradient(120deg, #0d2b7a 0%, #1360ee 55%, #3d8bff 100%);
          box-shadow: 0 30px 70px rgba(19,96,238,.28);
        }
        .gxc-band::before {
          content: ''; position: absolute; left: -10%; top: -40%; width: 55%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.16), rgba(255,255,255,0) 65%);
        }
        .gxc-copy { position: relative; max-width: 760px; }
        .gxc .gxb-h2 { color: #fff; margin-bottom: clamp(16px,1.8vw,24px); }
        .gxc .gxb-p { color: rgba(240,245,255,.9); }
        .gxc .gxb-link { color: #fff; text-decoration-color: rgba(255,255,255,.55); }
        .gxc .gxb-link:hover { text-decoration-color: #fff; }
        .gxc-sky { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: clamp(110px,11vw,180px); }
        @media (max-width: 560px) { .gxc-band { border-radius: 24px; } }
      `}</style>

      <div className="gxb-wrap">
        <div className="gxc-band" data-reveal>
          <div className="gxc-copy">
            <Bar light />
            <h2 className="gxb-h2">{CLOSING.heading}</h2>
            <Paras paras={CLOSING.paras} />
          </div>
          <svg className="gxc-sky" viewBox="0 0 1200 180" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
            <g fill="rgba(255,255,255,.10)">
              <rect x="40" y="110" width="50" height="70" /><rect x="100" y="80" width="38" height="100" /><rect x="150" y="120" width="60" height="60" />
              <rect x="260" y="70" width="44" height="110" /><rect x="320" y="100" width="70" height="80" /><rect x="420" y="60" width="40" height="120" />
              <rect x="480" y="96" width="56" height="84" /><rect x="560" y="76" width="46" height="104" />
            </g>
            <g fill="rgba(255,255,255,.18)">
              <rect x="640" y="90" width="54" height="90" rx="2" /><rect x="706" y="58" width="40" height="122" rx="2" />
              <path d="M760 180V70l22-18 22 18v110z" /><rect x="820" y="100" width="62" height="80" rx="2" />
              <path d="M900 180V40h10V10l8-10 8 10v30h10v140z" />
              <path d="M960 180V60c20-24 40-24 60 0v120z" /><rect x="1036" y="84" width="48" height="96" rx="2" />
              <rect x="1096" y="110" width="58" height="70" rx="2" /><rect x="1160" y="96" width="40" height="84" rx="2" />
            </g>
            <path d="M0 176h1200v4H0z" fill="rgba(255,255,255,.25)" />
          </svg>
        </div>
      </div>
    </section>
  )
}
