import Image from 'next/image'
import { GITEX_ASSETS, GITEX_EVENT } from './gitex-2026-data'

/* GITEX GLOBAL 2026 hero: partner logos, the "Meet Us at GITEX Global 2026"
   headline, intro and the event facts (dates, stand, hall) over the Expo City
   banner. The banner is white on the left, so the copy sits there. Below
   1180px the copy no longer fits beside the art, so the banner moves under the
   copy as a strip cropped to the Expo City buildings (its bottom-right corner). */
export default function GitexHero() {
  return (
    <section className="gxh">
      <style href="gitex-2026-hero" precedence="medium">{`
        .gxh { position: relative; overflow: hidden; background: #fff; }
        .gxh-bg { position: absolute; inset: 0; z-index: 0; }
        .gxh-bg img { object-fit: cover; object-position: right bottom; }
        .gxh-inner {
          position: relative; z-index: 1;
          /* Full width with a small side padding, not the centred site container,
             so the copy sits near the left edge like the design on wide screens. */
          min-height: max(500px, calc(100vw * 1120 / 3058));
          padding: clamp(28px,3.2vw,52px) clamp(28px,4vw,96px) clamp(32px,3.6vw,56px);
          display: flex; flex-direction: column; justify-content: center;
        }
        .gxh-content { max-width: 62%; }

        .gxh-logos { display: flex; align-items: center; gap: clamp(28px,4.6vw,88px); margin-bottom: clamp(24px,3.4vw,52px); }
        .gxh-logos img { height: auto; display: block; }
        .gxh-logo-locator { width: clamp(104px,10vw,170px); }
        .gxh-logo-gitex { width: clamp(92px,8.8vw,150px); }
        .gxh-logo-synosys { width: clamp(110px,10.8vw,182px); }

        .gxh-title {
          margin: 0; color: #2b2b2b; font-weight: 600;
          font-size: max(clamp(34px,4.9vw,76px), min(4.6vw, 104px));
          line-height: 1.12; letter-spacing: -.01em;
        }
        .gxh-title-line { display: block; white-space: nowrap; }
        .gxh-title-gitex {
          display: inline-block; height: .74em; width: auto;
          vertical-align: baseline; margin-right: .26em;
        }
        .gxh-lead {
          margin: clamp(18px,2.4vw,36px) 0 0; max-width: 34em; color: #444;
          font-size: max(clamp(15px,1.45vw,22px), min(1.4vw, 30px)); line-height: 1.5;
        }

        .gxh-facts {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(16px,2.2vw,34px); margin-top: clamp(24px,3.4vw,52px);
        }
        .gxh-fact { display: flex; align-items: center; gap: clamp(10px,1vw,16px); }
        .gxh-fact img { width: auto; height: clamp(28px,2.6vw,42px); flex: none; }
        .gxh-fact-main { display: block; font-weight: 600; color: #1d1d1f; font-size: max(clamp(17px,1.6vw,25px), min(1.55vw, 34px)); line-height: 1.15; }
        .gxh-fact-sub { display: block; color: #555; font-size: max(clamp(11px,.9vw,13.5px), min(.86vw, 19px)); line-height: 1.35; }
        .gxh-fact-label { display: block; color: #333; font-size: max(clamp(11px,.85vw,13px), min(.8vw, 18px)); line-height: 1.2; margin-bottom: 2px; }
        .gxh-divider { width: 1px; align-self: stretch; min-height: 44px; background: #cfd5df; }
        .gxh-place { display: flex; align-items: center; gap: clamp(16px,2.4vw,40px); }
        /* One row on desktop, as in the design; it wraps only on narrow screens. */
        @media (min-width: 1181px) { .gxh-facts { flex-wrap: nowrap; } .gxh-fact > div { white-space: nowrap; } }

        @media (max-width: 1180px) {
          .gxh { display: flex; flex-direction: column; }
          /* The buildings fill the banner's right 49% and bottom ~40%: scale the
             image to ~2x the strip's width and pin it bottom-right so only they show. */
          .gxh-bg { position: relative; inset: auto; order: 2; aspect-ratio: 3.2 / 1; margin-top: clamp(16px,3vw,32px); overflow: hidden; }
          .gxh-bg img { width: 204% !important; height: auto !important; inset: auto 0 0 auto !important; object-fit: contain; }
          .gxh-inner { width: 100%; min-height: 0; padding-bottom: 0; justify-content: flex-start; }
          .gxh-content { max-width: 100%; }
        }
        @media (max-width: 560px) {
          .gxh-logos { gap: 18px; }
          .gxh-logo-locator { width: 92px; }
          .gxh-logo-gitex { width: 82px; }
          .gxh-logo-synosys { width: 98px; }
          .gxh-divider { display: none; }
          .gxh-facts { flex-direction: column; align-items: flex-start; }
          .gxh-title-line { white-space: normal; }
        }
      `}</style>

      <div className="gxh-bg" aria-hidden="true">
        <Image src={`${GITEX_ASSETS}/hero-banner.png`} alt="" fill priority sizes="100vw" />
      </div>

      <div className="gxh-inner">
        <div className="gxh-content">
          <div className="gxh-logos">
            <Image className="gxh-logo-locator" src={`${GITEX_ASSETS}/locator-logo.png`} alt="LOCATOR" width={615} height={189} />
            <Image className="gxh-logo-gitex" src={`${GITEX_ASSETS}/gitex-logo.png`} alt="GITEX GLOBAL" width={541} height={195} />
            <Image className="gxh-logo-synosys" src={`${GITEX_ASSETS}/synosys-logo.png`} alt="Synosys" width={649} height={111} />
          </div>

          <h1 className="gxh-title">
            <span className="gxh-title-line">Meet Us at</span>
            <span className="gxh-title-line">
              <Image className="gxh-title-gitex" src={`${GITEX_ASSETS}/gitex-wordmark.png`} alt="GITEX" width={1077} height={246} priority />
              Global 2026
            </span>
          </h1>

          <p className="gxh-lead">
            Discover how LOCATOR helps businesses overcome fleet management challenges, maximise
            utilisation, reduce costs, improve productivity and more.
          </p>

          <div className="gxh-facts">
            <div className="gxh-fact">
              <Image src={`${GITEX_ASSETS}/icon-calendar.png`} alt="" width={156} height={156} />
              <div>
                <span className="gxh-fact-main">{GITEX_EVENT.dates}</span>
                <span className="gxh-fact-sub">{GITEX_EVENT.venue}</span>
              </div>
            </div>
            <span className="gxh-divider" aria-hidden="true" />
            <div className="gxh-place">
              <div className="gxh-fact">
                <Image src={`${GITEX_ASSETS}/icon-stand.png`} alt="" width={148} height={129} />
                <div>
                  <span className="gxh-fact-label">Stand no.</span>
                  <span className="gxh-fact-main">{GITEX_EVENT.stand}</span>
                </div>
              </div>
              <div className="gxh-fact">
                <Image src={`${GITEX_ASSETS}/icon-location.png`} alt="" width={103} height={121} />
                <div>
                  <span className="gxh-fact-label">Hall no.</span>
                  <span className="gxh-fact-main">{GITEX_EVENT.hall}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
