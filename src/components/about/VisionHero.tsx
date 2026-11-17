import Image from 'next/image'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function VisionHero() {
  return (
    <>
      <style>{`
        .vsh-hero {
          position: relative;
          overflow: hidden;
          background: #f8f9fb;
          display: flex;
          flex-direction: column;
          min-height: clamp(340px, 24vw, 420px);
          margin-top: -1px;
        }

        /* inset:0, not -60px at the top. The box used to start 60px above the
           section, and since .vsh-hero clips its overflow those 60px of photo
           were simply cut away before anything else got a say. */
        .vsh-photo { position: absolute; inset: 0; z-index: 0; }
        /* cover, not contain. The photo is 3:1 (2173x724) while this box runs
           nearer 4:1, so contain scaled it down to fit the height and left a
           band of bare background beside it — the empty strip on the right.
           cover scales to the width instead, so the photo always spans the full
           section.
           Anchored to the top so the remaining vertical trim comes off the
           BOTTOM — the lower lid — and the brow and the city in the iris stay
           whole. object-position's X is inert while the crop is vertical; it is
           kept at 35% so framing still holds if the box ever turns portrait. */
        .vsh-photo img { object-fit: cover; object-position: 35% top; }

        /* Left-to-right scrim — solid section colour over the copy zone only,
           fades fully transparent well before the right edge so there is no
           visible colour boundary anywhere in the middle */
        .vsh-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(248,249,251,.96) 0%,
            rgba(248,249,251,.80) 24%,
            rgba(248,249,251,.20) 42%,
            rgba(248,249,251,0)   54%
          );
        }

        .vsh-navwrap { position: relative; z-index: 3; }

        .vsh-body {
          position: relative; z-index: 2;
          display: flex; align-items: flex-start;
          padding: clamp(40px,5.5vw,70px) 28px clamp(40px,5vw,60px);
        }
        .vsh-inner { max-width: var(--w-1280); width: 100%; margin: 0 auto; }
        .vsh-content { max-width: min(580px, 100%); }

        @keyframes vshRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .vsh-anim { opacity: 0; animation: vshRise .8s ${EASE} forwards; } }

        .vsh-kicker { display: block; margin-bottom: 18px; }
        .vsh-kicker span { display: inline-block; width: 38px; height: 3px; border-radius: 2px; background: linear-gradient(90deg,#1360ee,#06a4e2); }

        .vsh-eyebrow {
          margin: 0 0 clamp(10px,1.2vw,14px);
          font-size: var(--f-13, 13px); font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase; color: #1360ee;
        }
        .vsh-title {
          margin: 0;
          font-size: clamp(30px, calc(1.9vw + 16px), 46px);
          font-weight: 800; line-height: 1.08; letter-spacing: -.026em;
          background: linear-gradient(105deg, #1360ee 0%, #0d73e3 46%, #06a4e2 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }

        .vsh-divider { margin: clamp(18px,2vw,24px) 0; height: 4px; width: 76px; border-radius: 999px; background: linear-gradient(90deg,#1360ee,#06a4e2); }

        .vsh-tagline {
          margin: 0;
          font-size: clamp(15px, 1.05vw, 17px);
          font-weight: 400; line-height: 1.72;
          color: #3a4459; max-width: 46ch;
        }
        .vsh-tagline em { font-style: normal; color: #1360ee; }

        /* Tablet */
        @media (max-width: 1024px) {
          .vsh-scrim {
            background: linear-gradient(
              90deg,
              rgba(248,249,251,.97) 0%,
              rgba(248,249,251,.84) 28%,
              rgba(248,249,251,.20) 48%,
              rgba(248,249,251,0)   62%
            );
          }
          .vsh-content { max-width: min(520px, 100%); }
        }

        /* Mobile — eye visible at top, text pushed to bottom with scrim behind it */
        @media (max-width: 768px) {
          .vsh-hero {
            min-height: 0;
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            background-image: url('/about/vision/vision-second-hero.webp');
            background-size: cover;
            background-position: 80% center;
            background-repeat: no-repeat;
            padding-top: 52vw;
          }
          .vsh-photo { display: none; }
          /* Scrim at BOTTOM only — top stays clear so the eye is fully visible */
          .vsh-scrim {
            display: block;
            background: linear-gradient(
              180deg,
              rgba(248,249,251,0)   0%,
              rgba(248,249,251,0)   28%,
              rgba(248,249,251,.72) 62%,
              rgba(248,249,251,.94) 100%
            );
          }
          .vsh-navwrap { position: absolute; top: 0; left: 0; right: 0; }
          .vsh-body { padding: 12px 22px 36px; }
          .vsh-content { max-width: 100%; }
        }

        @media (max-width: 420px) {
          .vsh-hero { padding-top: 60vw; background-position: 85% center; }
          .vsh-title { font-size: clamp(30px, 9.6vw, 36px); }
        }
      `}</style>

      <section className="vsh-hero">

        {/* Full-bleed background — anchored to section root, covers every edge */}
        <div className="vsh-photo" aria-hidden="true">
          <Image
            src="/about/vision/vision-second-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="vsh-scrim" aria-hidden="true" />

        <div className="vsh-navwrap">
          <SoftwareNavbar />
        </div>

        <div className="vsh-body">
          <div className="vsh-inner">
            <div className="vsh-content">

              <span className="vsh-kicker vsh-anim" style={{ animationDelay: '0s' }} aria-hidden="true">
                <span />
              </span>

              <p className="vsh-eyebrow vsh-anim" style={{ animationDelay: '.03s' }}>Our vision</p>

              <h1 className="vsh-title vsh-anim" style={{ animationDelay: '.06s' }}>
                <span style={{ WebkitTextFillColor: '#0b1220', color: '#0b1220' }}>Shaping the Future of</span>{' '}
                Connected Mobility
              </h1>

              <div className="vsh-divider vsh-anim" style={{ animationDelay: '.14s' }} />

              <p className="vsh-tagline vsh-anim" style={{ animationDelay: '.2s' }}>
                From our roots in the UAE, LOCATOR envisions a <em>smarter, more connected future</em> across the GCC and beyond. Through GPS tracking, fleet management and intelligent IoT technologies, we aim to transform how businesses manage vehicles, assets and operations — enabling safer mobility, greater visibility and more efficient businesses.
              </p>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
