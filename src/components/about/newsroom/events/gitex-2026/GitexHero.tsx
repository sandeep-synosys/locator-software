import Image, { getImageProps } from 'next/image'
import { GITEX_ASSETS, GITEX_EVENT } from './gitex-2026-data'
import { GITEX_H1 } from './gitex-2026-content'

/* GITEX GLOBAL 2026 hero: partner logos, the page H1 from the SEO brief
   ("Beyond Tracking, Towards Smarter Decisions: LOCATOR Heads to GITEX GLOBAL
   2026"), intro and the event facts (dates, stand, hall) over the Expo City
   banner. The banner is white on the left, so the copy sits there. Below
   1180px the copy no longer fits beside the art, so the banner moves under the
   copy as a strip cropped to the Expo City buildings (its bottom-right corner).
   At 768px and below the banner is the mobile artwork, shown full width above
   the copy (as on the Who We Are page). A <picture> picks one file per screen,
   so phones never download the desktop banner. */
const MOBILE_HERO_MAX = 768

export default function GitexHero() {
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({
    src: `${GITEX_ASSETS}/hero-banner-mobile.webp`,
    alt: '',
    width: 1081,
    height: 452,
    sizes: '100vw',
  })
  const { props: bannerProps } = getImageProps({
    src: `${GITEX_ASSETS}/hero-banner.webp`,
    alt: '',
    fill: true,
    sizes: '100vw',
    loading: 'eager',
    fetchPriority: 'high',
  })
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
          /* The banner's own proportions, so cover never enlarges the art into the copy. */
          min-height: calc(100vw * 1120 / 3058);
          padding: clamp(24px,2.4vw,44px) clamp(28px,4vw,96px) clamp(24px,2.6vw,48px);
          display: flex; flex-direction: column; justify-content: center;
        }
        .gxh-content { max-width: 62%; }

        .gxh-logos { display: flex; align-items: center; gap: clamp(28px,4.6vw,88px); margin-bottom: clamp(18px,2vw,40px); }
        .gxh-logos img { height: auto; display: block; }
        .gxh-logo-locator { width: clamp(104px,10vw,170px); }
        .gxh-logo-gitex { width: clamp(92px,8.8vw,150px); }
        .gxh-logo-synosys { width: clamp(110px,10.8vw,182px); }

        .gxh-title {
          margin: 0; color: #2b2b2b; font-weight: 600;
          font-size: max(clamp(32px,4.3vw,66px), min(4vw, 92px));
          line-height: 1.12; letter-spacing: -.01em;
        }
        .gxh-title-lead {
          display: block; margin-bottom: .5em; color: #1360ee; font-weight: 600;
          font-size: .4em; line-height: 1.3; letter-spacing: 0;
        }
        .gxh-title-line { display: block; white-space: nowrap; }
        .gxh-title-gitex {
          display: inline-block; height: .74em; width: auto;
          vertical-align: baseline; margin-right: .02em;
        }
        .gxh-lead {
          margin: clamp(14px,1.6vw,28px) 0 0; max-width: 34em; color: #444;
          font-size: max(clamp(15px,1.45vw,22px), min(1.4vw, 30px)); line-height: 1.5;
        }

        .gxh-facts {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(16px,2.2vw,34px); margin-top: clamp(18px,2.4vw,40px);
        }
        .gxh-fact { display: flex; align-items: center; gap: clamp(10px,1vw,16px); }
        .gxh-fact img { width: auto; height: clamp(28px,2.6vw,42px); flex: none; }
        .gxh-fact-main { display: block; font-weight: 600; color: #1d1d1f; font-size: max(clamp(17px,1.6vw,25px), min(1.55vw, 34px)); line-height: 1.15; }
        .gxh-fact-sub { display: block; color: #555; font-size: max(clamp(11px,.9vw,13.5px), min(.86vw, 19px)); line-height: 1.35; }
        .gxh-fact-label { display: block; color: #333; font-size: max(clamp(11px,.85vw,13px), min(.8vw, 18px)); line-height: 1.2; margin-bottom: 2px; }
        .gxh-divider { width: 1px; align-self: stretch; min-height: 44px; background: #cfd5df; }
        .gxh-place { display: flex; align-items: center; gap: clamp(16px,2.4vw,40px); }
        /* Two lines on large screens keep the hero within the banner's height. */
        @media (min-width: 1400px) { .gxh-lead { max-width: 40em; } }
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
          /* Scale with the screen so all three fit on small phones (320px);
             full size from about 384px up. Spread across the text column so the
             first and last logos line up with its edges and GITEX has room. */
          .gxh-logos { gap: min(18px, 4.2vw); justify-content: space-between; max-width: 360px; }
          .gxh-logo-locator { width: min(92px, 24vw); }
          .gxh-logo-gitex { width: min(82px, 21.4vw); }
          .gxh-logo-synosys { width: min(98px, 25.6vw); }
          .gxh-divider { display: none; }
          .gxh-facts { flex-direction: column; align-items: flex-start; }
          .gxh-title-line { white-space: normal; }
        }
        /* Mobile artwork: full width at the top, the copy below it on white. */
        @media (max-width: ${MOBILE_HERO_MAX}px) {
          .gxh-bg { order: 0; aspect-ratio: 1081 / 452; margin-top: 0; }
          .gxh-bg img { width: 100% !important; height: 100% !important; inset: 0 !important; object-fit: cover; object-position: center top; }
          .gxh-inner { order: 1; padding-top: clamp(18px,4vw,28px); padding-bottom: clamp(32px,8vw,48px); }
        }
      `}</style>

      <div className="gxh-bg" aria-hidden="true">
        <picture>
          <source media={`(max-width: ${MOBILE_HERO_MAX}px)`} srcSet={mobileSrcSet} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element -- art direction via getImageProps */}
          <img {...bannerProps} alt="" />
        </picture>
      </div>

      <div className="gxh-inner">
        <div className="gxh-content">
          <div className="gxh-logos">
            <Image className="gxh-logo-locator" src={`${GITEX_ASSETS}/locator-logo.png`} alt="LOCATOR" width={615} height={189} />
            <Image className="gxh-logo-gitex" src={`${GITEX_ASSETS}/gitex-logo.png`} alt="GITEX GLOBAL" width={541} height={195} />
            <Image className="gxh-logo-synosys" src={`${GITEX_ASSETS}/synosys-logo.png`} alt="Synosys" width={649} height={111} />
          </div>

          <h1 className="gxh-title">
            <span className="gxh-title-lead">{GITEX_H1.lead}</span>{' '}
            <span className="gxh-title-line">{GITEX_H1.main}</span>{' '}
            <span className="gxh-title-line">
              <Image className="gxh-title-gitex" src={`${GITEX_ASSETS}/gitex-wordmark.png`} alt="GITEX" width={1077} height={246} priority />{' '}
              {GITEX_H1.tail}
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
