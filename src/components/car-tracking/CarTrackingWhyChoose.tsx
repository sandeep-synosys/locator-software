import Image from 'next/image'
import { REASONS } from './data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/**
 * Why this device rather than another one.
 *
 * A sticky heading beside a scrolling 2×2 of reasons: the question stays on
 * screen while the answers pass it, which is what makes four otherwise
 * independent claims read as a single argument. The stick is dropped below the
 * breakpoint, where there is no second column for it to hold still against.
 */
export default function CarTrackingWhyChoose() {
  return (
    <>
      <style>{`
        .ctw { background: #fff; padding: clamp(56px,7vw,96px) 28px; }
        .ctw-inner {
          max-width: var(--w-1180); margin: 0 auto;
          display: grid; grid-template-columns: .82fr 1.18fr; gap: clamp(36px,5vw,72px);
          align-items: start;
        }
        @media (max-width: 940px) { .ctw-inner { grid-template-columns: 1fr; gap: clamp(30px,4vw,42px); } }

        .ctw-head { position: sticky; top: clamp(96px,12vh,140px); }
        @media (max-width: 940px) { .ctw-head { position: static; } }

        .ctw-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: var(--f-12); font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #1360ee; margin: 0 0 18px;
        }
        .ctw-eyebrow::before { content: ''; width: 30px; height: 2px; background: #1360ee; border-radius: 2px; }

        .ctw-title {
          margin: 0; max-width: 16ch;
          font-size: max(clamp(25px,3.2vw,38px), min(2.639vw, 55.1px));
          font-weight: 800; line-height: 1.16; letter-spacing: -.028em; color: #1d1d1f;
        }
        .ctw-lead {
          margin: clamp(16px,2vw,22px) 0 0; max-width: 44ch;
          font-size: var(--f-15-5); line-height: 1.72; color: #6e6e73;
        }

        /* Sits under the sticky heading. Capped in height so the whole sticky
           block stays shorter than the viewport — otherwise it would stick by its
           top edge and leave the bottom permanently cut off. */
        .ctw-art { margin-top: clamp(24px,3vw,34px); max-width: 340px; }
        .ctw-art img { display: block; width: 100%; height: auto; }
        @media (max-width: 940px) { .ctw-art { display: none; } }
        @media (max-height: 760px) { .ctw-art { display: none; } }

        .ctw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px,2vw,22px); }
        @media (max-width: 620px) { .ctw-grid { grid-template-columns: 1fr; } }

        .ctw-card {
          position: relative; overflow: hidden;
          background: #fbfcfe; border: 1px solid #e8ecf4; border-radius: 18px;
          padding: clamp(24px,2.8vw,30px);
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE}, border-color .38s ${EASE}, background .38s ${EASE};
        }
        /* A rule that wipes across the top edge on hover — the smallest possible
           signal that the card is live, and it costs no layout. */
        .ctw-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,#1360ee,#0d4fd4);
          transform: scaleX(0); transform-origin: left center;
          transition: transform .45s ${EASE};
        }
        .ctw-card:hover {
          background: #fff; border-color: #d6e2fb; transform: translateY(-4px);
          box-shadow: 0 26px 50px -30px rgba(20,40,90,.4);
        }
        .ctw-card:hover::after { transform: scaleX(1); }

        .ctw-ico {
          width: 46px; height: 46px; border-radius: 13px; display: grid; place-items: center;
          background: #fff; border: 1px solid #dbe6fb; color: #1360ee; margin-bottom: 18px;
          transition: transform .38s ${EASE}, box-shadow .38s ${EASE};
        }
        .ctw-ico svg { width: 22px; height: 22px; }
        .ctw-card:hover .ctw-ico { transform: translateY(-2px) scale(1.05); box-shadow: 0 14px 24px -14px rgba(19,96,238,.6); }

        .ctw-card h3 {
          margin: 0 0 10px; font-size: max(clamp(16.5px,1.6vw,19px), min(1.319vw, 27.55px));
          font-weight: 800; letter-spacing: -.018em; color: #1d1d1f; line-height: 1.3;
        }
        .ctw-card p { margin: 0; font-size: var(--f-14); line-height: 1.72; color: #6e6e73; }
      `}</style>

      <section className="ctw">
        <div className="ctw-inner">
          <header className="ctw-head" data-reveal="right">
            <p className="ctw-eyebrow">Why LOCATOR</p>
            <h2 className="ctw-title">Why Choose LOCATOR’s Car Tracking System</h2>
            <p className="ctw-lead">
              Four things decide whether a tracking platform is still worth having in year
              three: what it can do, what it costs, who answers when it breaks, and whether
              it plays well with the rest of your stack.
            </p>

            <div className="ctw-art">
              <Image
                src="/services/car-tracking-system/why-choose.png"
                alt="LOCATOR reports, charts and live map running across laptop and phone"
                width={1200}
                height={987}
                sizes="340px"
              />
            </div>
          </header>

          <div className="ctw-grid">
            {REASONS.map((r, i) => (
              <article key={r.title} className="ctw-card" data-reveal data-reveal-delay={i * 100}>
                <span className="ctw-ico" aria-hidden="true">{r.icon}</span>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
