'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { DEVICES } from './devices-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'
const DRAG_THRESHOLD = 60

const AUTOPLAY_MS = 4200

// `title` lets each page set its own H2. `deviceHeadings` keeps the device names
// as H3s only where the page owns them (/service/tracking-devices); elsewhere the
// same names render as styled text, so the catalogue's headings aren't repeated
// across pages. The look is identical either way.
export default function DeviceCarousel({
  title = 'A great platform needs great hardware.',
  deviceHeadings = true,
}: { title?: string; deviceHeadings?: boolean } = {}) {
  const DeviceName = deviceHeadings ? 'h3' : 'p'
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const stageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<number | null>(null)
  const dragged = useRef(false)

  const device = DEVICES[active]
  const count = DEVICES.length

  const go = useCallback((next: number) => {
    setActive(((next % count) + count) % count)
  }, [count])

  const prev = useCallback(() => go(active - 1), [active, go])
  const next = useCallback(() => go(active + 1), [active, go])

  // Re-animate the in-card detail panel on every slide change.
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-anim]'),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.44, stagger: 0.05, ease: 'power3.out', overwrite: true },
      )
    }, el)
    return () => ctx.revert()
  }, [active])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [prev, next])

  // Autoplay — paused on hover/focus, while the lightbox is open, when the
  // section is off-screen, or when the user prefers reduced motion.
  useEffect(() => {
    if (paused || lightbox || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, lightbox, inView, count])

  // Don't burn cycles advancing a carousel nobody is looking at.
  useEffect(() => {
    const el = stageRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(false) }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX
    dragged.current = false
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const dx = e.clientX - dragStart.current
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      dx > 0 ? prev() : next()
      dragStart.current = null
      dragged.current = true
    }
  }
  const onPointerUp = () => { dragStart.current = null }

  return (
    <>
      <style>{`
        /* Keep the carousel visually attached to the hero image background instead of a gray divider. */
        .dv-wrap { position: relative; padding: clamp(44px,5.5vw,80px) 0 clamp(40px,5vw,64px); background: transparent; overflow: hidden; }

        .dv-head { max-width: var(--w-1240); margin: 0 auto clamp(24px,3vw,40px); padding: 0 28px; text-align: center; }
        .dv-eyebrow {
          display: block;
          font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px)); font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 16px;
        }
        /* Rule above the label — never stranded when the label wraps. */
        .dv-eyebrow::before {
          content: ''; display: block; width: 34px; height: 3px;
          background: #1360ee; border-radius: 2px; margin: 0 auto 12px;
        }
        .dv-h2 { margin: 0 0 10px; font-size: max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px)); font-weight: 800; line-height: 1.25; letter-spacing: -.015em; color: #1d1d1f; }
        .dv-sub { margin: 0 auto; max-width: 56ch; font-size: max(clamp(13.5px,1.25vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #52525e; }

        /* ── Full-width stage ────────────────────────────────── */
        .dv-stage {
          position: relative; width: 100%;
          height: clamp(430px,42vw,570px);
          perspective: 1800px; touch-action: pan-y;
          cursor: grab; outline: none;
        }
        .dv-stage:active { cursor: grabbing; }

        /* Card is deliberately portrait-ish: the products are square, so a wide
           card leaves the shot height-constrained and the product looks small. */
        .dv-item {
          position: absolute; top: 50%; left: 50%;
          width: clamp(280px,34vw,480px); height: clamp(390px,38vw,510px);
          transform-style: preserve-3d;
          transition: transform .66s ${EASE}, opacity .66s ${EASE};
          will-change: transform, opacity;
        }
        /* Column layout: the shot takes the space the panel doesn't, so the
           product is always fully visible no matter how tall the panel grows. */
        .dv-card {
          position: relative; width: 100%; height: 100%;
          border-radius: 26px; background: #fff;
          border: 1px solid #e3e9f4; overflow: hidden;
          display: flex; flex-direction: column;
        }
        .dv-item[data-pos="0"] .dv-card { box-shadow: 0 44px 88px -30px rgba(20,40,90,.5); border-color: #fff; }
        .dv-item:not([data-pos="0"]) { cursor: pointer; }
        .dv-item:not([data-pos="0"]) .dv-card { box-shadow: 0 28px 56px -26px rgba(20,40,90,.4); }
        .dv-item:not([data-pos="0"]):hover .dv-card { border-color: #c9d8f8; }
        .dv-item[data-hidden="true"] { opacity: 0; pointer-events: none; }

        /* Product fills the card; detail panel overlays the lower band. */
        .dv-shot {
          /* Floor the image area so a tall panel can never squeeze it away. */
          position: relative; flex: 1 1 auto; min-height: 55%;
          box-sizing: border-box; overflow: hidden;
        }
        /* Absolute positioning resolves the percentages against .dv-shot, which is
           definite once flex lays it out. As a static flex child, height:100% had
           an indefinite parent, so the image fell back to its intrinsic 600px and
           got clipped. Padding is inside the 100% thanks to global border-box. */
        .dv-shot img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          padding: clamp(8px,1.1vw,16px);
          object-fit: contain; object-position: center;
        }

        .dv-index {
          position: absolute; top: clamp(16px,2vw,26px); left: clamp(18px,2.2vw,30px);
          font-size: max(clamp(38px,5vw,68px), min(4.722vw, 98.6px)); font-weight: 800; line-height: 1;
          letter-spacing: -.04em; color: #f0f3f9; user-select: none; pointer-events: none;
        }

        .dv-eye {
          position: absolute; top: clamp(16px,2vw,24px); right: clamp(16px,2vw,24px); z-index: 3;
          width: 40px; height: 40px; border-radius: 12px;
          border: 1px solid #e2e8f4; background: rgba(255,255,255,.9);
          backdrop-filter: blur(6px);
          display: grid; place-items: center; cursor: pointer; color: #1360ee;
          transition: .2s ${EASE};
          animation: dv-blink 2.4s ${EASE} infinite;
        }
        /* Pulsing halo so the "view image" affordance is noticed. */
        .dv-eye::after {
          content: ''; position: absolute; inset: -1px; border-radius: 12px;
          border: 1.5px solid #1360ee; opacity: 0; pointer-events: none;
          animation: dv-ring 2.4s ${EASE} infinite;
        }
        @keyframes dv-blink {
          0%, 100% { box-shadow: 0 0 0 0 rgba(19,96,238,0); }
          45% { box-shadow: 0 0 0 6px rgba(19,96,238,.14); }
          70% { box-shadow: 0 0 0 0 rgba(19,96,238,0); }
        }
        @keyframes dv-ring {
          0% { opacity: 0; transform: scale(1); }
          45% { opacity: .85; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.22); }
        }
        .dv-eye:hover { background: #1360ee; color: #fff; border-color: #1360ee; transform: scale(1.08); animation: none; }
        .dv-eye:hover::after { animation: none; opacity: 0; }

        /* ── Detail panel, inside the card ───────────────────── */
        .dv-panel {
          position: relative; flex: 0 0 auto; z-index: 2;
          box-sizing: border-box;
          padding: clamp(16px,1.9vw,22px) clamp(18px,2.2vw,26px);
          background: #fff;
          border-top: 1px solid #eaeef6;
          /* Column, not row: the CTA gets its own line so it can never collide
             with the nowrap spec block. */
          display: flex; flex-direction: column;
          gap: clamp(12px,1.5vw,16px);
        }

        .dv-panel-l { min-width: 0; }
        /* Specs left, CTA right — both on one line, each free to size itself. */
        .dv-panel-b {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 14px; min-width: 0;
        }
        .dv-kicker { display: block; font-size: var(--f-10); font-weight: 700; letter-spacing: .09em; color: #1360ee; text-transform: uppercase; margin-bottom: 7px; }
        .dv-name {
          margin: 0 0 6px; font-size: max(clamp(18px,2vw,25px), min(1.736vw, 36.25px)); font-weight: 800;
          line-height: 1.14; letter-spacing: -.025em; color: #1d1d1f;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        /* Two lines max, so a long tagline can never push the panel past the card. */
        .dv-tag {
          margin: 0; max-width: 42ch; font-size: max(clamp(12.5px,1.05vw,13.5px), min(0.938vw, 19.57px));
          line-height: 1.5; color: #52525e;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .dv-specs { display: flex; gap: 0; min-width: 0; overflow: hidden; }
        .dv-spec { padding: 0 clamp(10px,1.2vw,16px); border-left: 1px solid #e2e8f4; white-space: nowrap; }
        .dv-spec:first-child { border-left: none; padding-left: 0; }
        .dv-spec-l { display: block; font-size: var(--f-9-5); font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #9aa2b1; margin-bottom: 3px; }
        .dv-spec-v { font-size: var(--f-12); font-weight: 700; color: #1d1d1f; }
        @media (max-width: 560px) { .dv-specs { display: none; } }

        .dv-cta {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 20px; border-radius: 11px; text-decoration: none;
          background: #1360ee; color: #fff; font-size: var(--f-13-5); font-weight: 700;
          box-shadow: 0 10px 24px rgba(19,96,238,.28); transition: .18s ${EASE};
          white-space: nowrap;
        }
        .dv-cta:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 12px 28px rgba(19,96,238,.38); }
        .dv-cta svg { transition: transform .2s ${EASE}; }
        .dv-cta:hover svg { transform: translateX(3px); }
        .dv-soon { flex-shrink: 0; font-size: var(--f-13-5); font-weight: 700; color: #9aa2b1; white-space: nowrap; padding: 14px 0; }

        /* Side cards show the product only — no competing text. */
        .dv-item:not([data-pos="0"]) .dv-panel,
        .dv-item:not([data-pos="0"]) .dv-eye { opacity: 0; pointer-events: none; }

        .dv-nav {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
          width: clamp(50px,4.6vw,62px); height: clamp(50px,4.6vw,62px);
          border-radius: 50%; border: 1px solid #e4eaf5; background: #fff;
          display: grid; place-items: center; cursor: pointer; color: #1d1d1f;
          /* Deep, tight shadow so the control reads as floating above the artwork. */
          box-shadow: 0 18px 40px -14px rgba(20,40,90,.45), 0 2px 6px rgba(20,40,90,.08);
          transition: .22s ${EASE};
        }
        .dv-nav:hover {
          background: #1360ee; border-color: #1360ee; color: #fff;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 20px 44px -12px rgba(19,96,238,.55);
        }
        .dv-nav:active { transform: translateY(-50%) scale(.96); }
        .dv-prev { left: clamp(14px,4vw,72px); }
        .dv-next { right: clamp(14px,4vw,72px); }

        /* ── Thumb rail ──────────────────────────────────────── */
        .dv-rail {
          display: flex; justify-content: center; align-items: center; gap: 10px;
          margin: clamp(28px,3.5vw,44px) auto 0; padding: 0 28px;
          flex-wrap: wrap; max-width: var(--w-900);
        }
        .dv-thumb {
          width: 56px; height: 56px; padding: 7px;
          border-radius: 13px; border: 1px solid #e7ebf3; background: #fff;
          cursor: pointer; display: grid; place-items: center; transition: .26s ${EASE};
        }
        .dv-thumb img { width: 100%; height: 100%; object-fit: contain; opacity: .45; transition: opacity .26s ${EASE}; }
        .dv-thumb:hover { border-color: #c9d8f8; transform: translateY(-2px); }
        .dv-thumb:hover img { opacity: .8; }
        .dv-thumb[aria-current="true"] { border-color: #1360ee; box-shadow: 0 8px 20px -8px rgba(19,96,238,.5); }
        .dv-thumb[aria-current="true"] img { opacity: 1; }

        .dv-meter { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: clamp(20px,2.5vw,28px); }
        .dv-count { font-size: var(--f-12-5); font-weight: 700; color: #6e6e73; font-variant-numeric: tabular-nums; }
        .dv-count b { color: #1d1d1f; }
        .dv-track { width: clamp(120px,18vw,220px); height: 2px; background: #e7ebf3; border-radius: 2px; overflow: hidden; }
        .dv-fill { height: 100%; background: #1360ee; border-radius: 2px; transition: width .5s ${EASE}; }

        /* ── Lightbox ────────────────────────────────────────── */
        .dv-lb {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(12,18,32,.72); backdrop-filter: blur(10px);
          display: grid; place-items: center; padding: 28px;
          animation: dv-fade .26s ${EASE};
        }
        @keyframes dv-fade { from { opacity: 0 } to { opacity: 1 } }
        .dv-lb-inner {
          position: relative; background: #fff; border-radius: 24px;
          width: min(680px, 92vw); padding: clamp(24px,4vw,44px);
          box-shadow: 0 60px 120px -40px rgba(0,0,0,.6);
          animation: dv-pop .34s ${EASE};
        }
        @keyframes dv-pop { from { opacity: 0; transform: translateY(16px) scale(.97) } to { opacity: 1; transform: none } }
        .dv-lb-inner img { width: 100%; height: auto; max-height: 62vh; object-fit: contain; display: block; }
        .dv-lb-cap { margin: 20px 0 0; text-align: center; font-size: var(--f-17); font-weight: 800; color: #1d1d1f; letter-spacing: -.015em; }
        .dv-lb-close {
          position: absolute; top: 14px; right: 14px;
          width: 38px; height: 38px; border-radius: 11px;
          border: 1px solid #e7ebf3; background: #fff; cursor: pointer;
          display: grid; place-items: center; color: #6e6e73; transition: .18s ${EASE};
        }
        .dv-lb-close:hover { color: #1d1d1f; border-color: #c9d8f8; }

        @media (prefers-reduced-motion: reduce) {
          .dv-item, .dv-fill, .dv-nav, .dv-thumb, .dv-lb, .dv-lb-inner { transition: none; animation: none; }
          .dv-eye, .dv-eye::after { animation: none; }
        }
      `}</style>

      <section className="dv-wrap">
        <div className="dv-head" data-reveal>
          <span className="dv-eyebrow">Tracking Devices &amp; Accessories</span>
          <h2 className="dv-h2">{title}</h2>
          <p className="dv-sub">
            Certified GPS terminals, driver-ID readers, and sensors — supplied, installed, and
            configured by our own engineers.
          </p>
        </div>

        <div
          className="dv-stage"
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Tracking devices and accessories"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { onPointerUp(); setPaused(false) }}
          onMouseEnter={() => setPaused(true)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <button className="dv-nav dv-prev" onClick={prev} aria-label="Previous device">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {DEVICES.map((d, i) => {
            // Shortest signed distance on the ring, so the loop never jumps.
            let offset = i - active
            if (offset > count / 2) offset -= count
            if (offset < -count / 2) offset += count

            const abs = Math.abs(offset)
            const hidden = abs > 2
            const isActive = offset === 0
            const x = offset * 62
            const scale = abs === 0 ? 1 : abs === 1 ? 0.84 : 0.7
            const rotate = isActive ? 0 : offset > 0 ? -16 : 16
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.92 : 0.6

            return (
              <div
                key={d.slug}
                className="dv-item"
                data-pos={offset}
                data-hidden={hidden}
                aria-hidden={!isActive}
                onClick={() => { if (!dragged.current && !isActive) go(i) }}
                style={{
                  transform: `translate(-50%,-50%) translateX(${x}%) translateZ(${isActive ? 0 : -abs * 110}px) rotateY(${rotate}deg) scale(${scale})`,
                  opacity: hidden ? 0 : opacity,
                  zIndex: 10 - abs,
                }}
              >
                <div className="dv-card">
                  <span className="dv-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>

                  <div className="dv-shot">
                    {d.image && (
                      <Image
                        src={d.image}
                        alt={d.name}
                        width={d.imageW ?? 600}
                        height={d.imageH ?? 600}
                        priority={i < 3}
                        draggable={false}
                      />
                    )}
                  </div>

                  {isActive && (
                    <button
                      className="dv-eye"
                      onClick={(e) => { e.stopPropagation(); setLightbox(true) }}
                      aria-label={`View ${d.name} image`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  )}

                  <div className="dv-panel" ref={isActive ? overlayRef : undefined}>
                    <div className="dv-panel-l">
                      <span className="dv-kicker" data-anim>
                        {d.group === 'trackers' ? 'GPS Tracker' : 'Sensor & Accessory'}
                      </span>
                      <DeviceName className="dv-name" data-anim>{d.name}</DeviceName>
                      <p className="dv-tag" data-anim>{d.tagline}</p>

                    </div>

                    <div className="dv-panel-b" data-anim>
                      {d.specs && d.specs.length > 0 ? (
                        <div className="dv-specs">
                          {d.specs.slice(0, 2).map((s) => (
                            <div key={s.label} className="dv-spec">
                              <span className="dv-spec-l">{s.label}</span>
                              <span className="dv-spec-v">{s.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span />
                      )}

                      {d.comingSoon ? (
                        <span className="dv-soon">Coming shortly</span>
                      ) : (
                        <Link href={`/service/tracking-devices/${d.slug}`} className="dv-cta">
                          View details
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <button className="dv-nav dv-next" onClick={next} aria-label="Next device">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="dv-rail">
          {DEVICES.map((d, i) => (
            <button
              key={d.slug}
              className="dv-thumb"
              aria-current={i === active}
              aria-label={d.name}
              onClick={() => go(i)}
            >
              {d.image && <Image src={d.image} alt="" width={64} height={64} draggable={false} />}
            </button>
          ))}
        </div>

        <div className="dv-meter">
          <span className="dv-count">
            <b>{String(active + 1).padStart(2, '0')}</b> / {String(count).padStart(2, '0')}
          </span>
          <div className="dv-track">
            <div className="dv-fill" style={{ width: `${((active + 1) / count) * 100}%` }} />
          </div>
        </div>
      </section>

      {lightbox && device.image && (
        <div
          className="dv-lb"
          role="dialog"
          aria-modal="true"
          aria-label={`${device.name} image`}
          onClick={() => setLightbox(false)}
        >
          <div className="dv-lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="dv-lb-close" onClick={() => setLightbox(false)} aria-label="Close">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={device.image}
              alt={device.name}
              width={device.imageW ?? 600}
              height={device.imageH ?? 600}
            />
            <p className="dv-lb-cap">{device.name}</p>
          </div>
        </div>
      )}
    </>
  )
}
