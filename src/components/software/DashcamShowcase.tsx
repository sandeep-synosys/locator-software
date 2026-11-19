'use client'

import { useState } from 'react'
import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// Same expanding-rail pattern as the Industries section on
// /service/video-telematics — real AI-camera frames with their REC/HUD overlay
// baked in, so images use object-fit: contain and never get cropped.
const CARDS = [
  {
    title: 'LIVE HD Video',
    desc: 'Stream real-time HD road and driver footage to improve driver behaviour, retrieve video on-demand, and enforce safer driving across your fleet.',
    // A dark AI-camera frame like the other three — the light dashboard-UI
    // screenshot that was here read as a bright slab against the panel.
    image: '/services/industries-we-serve/transportation-and-logistics.webp',
  },
  {
    title: 'Collision Prevention',
    desc: 'Analyse incidents with video evidence and deploy AI audible alerts to warn drivers instantly, reducing future collision risks.',
    image: '/services/industries-we-serve/field-services-and-recovery-vehicles.webp',
  },
  {
    title: 'Driver Monitoring',
    desc: 'AI driver monitoring detects drowsiness and distraction — yawning, eye closure, phone use, looking away — helping managers take proactive safety actions.',
    image: '/services/industries-we-serve/school-districtse.webp',
  },
  {
    title: 'Cargo & Cost Savings',
    desc: 'Cut costs from accidents, insurance claims, vehicle damage, and fraud disputes with undeniable recorded proof that protects your business.',
    image: '/services/industries-we-serve/warehouse.webp',
  },
]

const STATS = [
  { v: '4K', l: 'Camera resolution' },
  { v: '24/7', l: 'Live monitoring' },
  { v: 'AI', l: 'Driver detection' },
]

// Optional overrides so a page can use its own SEO heading, intro (e.g. with a
// link) and card titles; without them the section is unchanged.
export default function DashcamShowcase({
  title = 'AI-Powered Dash Cameras & MDVR',
  intro,
  cardTitles,
}: { title?: string; intro?: React.ReactNode; cardTitles?: Partial<Record<number, string>> } = {}) {
  const [active, setActive] = useState(0)

  return (
    <>
      <style>{`
        .dc-rail {
          display: flex; gap: clamp(8px,1vw,12px);
          height: clamp(420px,46vw,560px);
        }

        /* Panel is a column: media zone on top, text zone below it in normal
           flow — never stacked/overlaid, so the text can't cover the photo. */
        .dc-panel {
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          flex: 1 1 0; min-width: 0;
          border: 0; padding: 0; cursor: pointer;
          border-radius: clamp(18px,2vw,24px);
          background: #0d1426;
          font-family: inherit; text-align: left;
          transition: flex-grow .62s ${EASE}, box-shadow .5s ${EASE};
          box-shadow: 0 18px 40px -26px rgba(13,20,38,.5);
        }
        /* The open panel takes the space; the rest stay as slim spines. */
        .dc-panel[aria-expanded="true"] {
          flex-grow: 5.4;
          box-shadow: 0 40px 80px -34px rgba(13,20,38,.62);
        }

        .dc-media {
          position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden;
          background: #0b1120;
        }
        /* 16:9 frames inside a tall panel leave letterbox bands — this soft
           glow behind them makes that space read as intentional depth. */
        .dc-media::before {
          content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(58% 58% at 50% 45%, rgba(19,96,238,.18), transparent 72%);
        }
        .dc-panel img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: contain;
          transition: transform .7s ${EASE}, filter .5s ${EASE};
        }
        .dc-veil {
          position: absolute; inset: 0;
          background: rgba(9,14,28,.55);
          transition: background .5s ${EASE};
        }
        .dc-panel[aria-expanded="true"] .dc-veil { background: rgba(9,14,28,.08); }
        .dc-panel[aria-expanded="false"]:hover img { transform: scale(1.06); }

        /* Accent bar marks the open panel. */
        .dc-panel::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 0;
          height: 3px; background: #1360ee;
          transform: scaleX(0); transform-origin: left;
          transition: transform .5s ${EASE}; z-index: 3;
        }
        .dc-panel[aria-expanded="true"]::after { transform: scaleX(1); }

        /* ── Collapsed: vertical spine label, over the media zone only ── */
        .dc-spine {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          writing-mode: vertical-rl; transform: rotate(180deg);
          padding: 26px 0;
          font-size: max(clamp(13px,1.25vw,16px), min(1.111vw, 23.2px)); font-weight: 800;
          letter-spacing: .1em; text-transform: uppercase; color: #fff;
          white-space: nowrap; overflow: hidden;
          text-shadow: 0 2px 12px rgba(9,14,28,.85), 0 1px 3px rgba(9,14,28,.7);
          transition: opacity .34s ${EASE};
        }
        .dc-panel[aria-expanded="true"] .dc-spine { opacity: 0; pointer-events: none; }

        /* ── Expanded: solid text row below the photo ── */
        .dc-body {
          flex: 0 0 auto; position: relative; z-index: 2;
          max-height: 0; opacity: 0; overflow: hidden;
          padding: 0 clamp(20px,2.2vw,28px);
          background: #0a0f1e;
          border-top: 1px solid rgba(255,255,255,.08);
          transition: max-height .5s ${EASE}, opacity .4s ${EASE}, padding .5s ${EASE};
        }
        .dc-panel[aria-expanded="true"] .dc-body {
          max-height: 280px; opacity: 1;
          padding: clamp(18px,2.2vw,26px) clamp(20px,2.2vw,28px);
        }
        .dc-body h3 {
          margin: 0 0 10px;
          font-size: max(clamp(20px,2.2vw,29px), min(2.014vw, 42.05px)); font-weight: 800;
          letter-spacing: -.02em; line-height: 1.12; color: #fff;
        }
        .dc-body p {
          margin: 0; max-width: 52ch;
          font-size: max(clamp(13px,1.1vw,14.5px), min(1.007vw, 21.02px)); line-height: 1.6;
          color: rgba(255,255,255,.9);
        }

        /* Stats sit under the rail as a quiet footer to the section. */
        .dc-stats {
          display: flex; flex-wrap: wrap; gap: clamp(20px,3vw,44px);
          justify-content: center;
          margin-top: clamp(28px,3.4vw,40px);
        }
        .dc-stat { border-left: 2px solid #d7e1f4; padding-left: 14px; }
        .dc-stat b { display: block; font-size: var(--f-19); font-weight: 800; letter-spacing: -.02em; color: #1d1d1f; }
        .dc-stat span { display: block; margin-top: 3px; font-size: var(--f-12); font-weight: 600; color: #8e97a8; }

        /* Stack on narrow screens — spines don't work at phone widths. */
        @media (max-width: 860px) {
          .dc-rail { flex-direction: column; height: auto; }
          .dc-panel { flex: 0 0 auto; height: 92px; transition: height .55s ${EASE}; }
          .dc-panel[aria-expanded="true"] { height: 430px; }
          .dc-panel[aria-expanded="true"] .dc-body { max-height: 210px; }
          .dc-spine {
            writing-mode: horizontal-tb; transform: none;
            justify-content: flex-start; padding: 0 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dc-panel, .dc-panel img, .dc-veil, .dc-body, .dc-spine, .dc-panel::after {
            transition: none;
          }
        }
      `}</style>

      <section id="dashcam" style={{ padding: 'clamp(56px,7vw,88px) 28px', background: '#fff', scrollMarginTop: '84px' }}>
        <div style={{ maxWidth: 'var(--w-1180)', margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto clamp(36px,5vw,52px)' }}>
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              AI Video Telematics
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              {title}
            </h2>
            <p style={{ margin: '16px 0 0', fontSize: 'max(clamp(14px,1.2vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.7, color: '#6e6e73' }}>
              {intro ?? (
                <>
                  Real-time driver monitoring, cargo surveillance, and multi-camera recording for trucks,
                  taxis, buses, delivery vehicles, and commercial fleets.
                </>
              )}
            </p>
          </div>

          <div className="dc-rail" data-reveal>
            {CARDS.map((card, i) => {
              const c = { ...card, title: cardTitles?.[i] ?? card.title }
              return (
              <button
                key={c.title}
                className="dc-panel"
                aria-expanded={i === active}
                aria-label={c.title}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <div className="dc-media">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 100vw, 60vw"
                    style={{ objectFit: 'contain' }}
                  />
                  <span className="dc-veil" />
                  <span className="dc-spine">{c.title}</span>
                </div>

                <div className="dc-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </button>
              )
            })}
          </div>

          <div className="dc-stats" data-reveal>
            {STATS.map(s => (
              <div className="dc-stat" key={s.l}>
                <b>{s.v}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
