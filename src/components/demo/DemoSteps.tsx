'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

const NODE = 56 // px — node diameter; connectors align to its vertical centre

type Step = { n: string; title: string; desc: string; icon: React.ReactNode }

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Request a Free Demo',
    desc: 'Tell us about your fleet and we’ll prepare a tailored quote.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="3" fill="currentColor" opacity=".16" />
        <path d="M9 8h6M9 12h6M9 16h3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 3.5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Schedule a Free Demo',
    desc: 'Pick a date and time that works for you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="17" rx="2.5" fill="currentColor" opacity=".16" />
        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 13h3v3H8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Installation at Your Location',
    desc: 'Our engineers install and configure everything at your location.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" fill="currentColor" opacity=".16" />
        <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Manage & Grow',
    desc: 'Start managing your fleet and teams — and grow your business.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="6" y="12" width="3" height="6" rx="1" fill="currentColor" opacity=".35" />
        <rect x="10.5" y="8" width="3" height="10" rx="1" fill="currentColor" opacity=".6" />
        <rect x="15" y="4" width="3" height="14" rx="1" fill="currentColor" />
      </svg>
    ),
  },
]

// Particle stream — mirrors the get-a-quote timeline: each dot emits at one
// node, swells + drifts mid-flight, and sinks into the next. Fixed (not random)
// so server and client markup match. c: 0 = bright blue, 1 = light blue.
const STREAM = [
  { d: 0.0, dur: 2.3, y: 4, s: 4, o: 0.9, c: 0 },
  { d: 0.3, dur: 2.7, y: -5, s: 2.5, o: 0.6, c: 1 },
  { d: 0.55, dur: 2.0, y: 3, s: 3.5, o: 0.85, c: 0 },
  { d: 0.85, dur: 2.5, y: -3, s: 2.5, o: 0.55, c: 1 },
  { d: 1.1, dur: 2.3, y: 5, s: 3, o: 0.8, c: 0 },
  { d: 1.4, dur: 2.6, y: -4, s: 2.5, o: 0.6, c: 1 },
]

const STEP_STAGGER = 0.6
const STEP_DELAY_CHILDREN = 0.12

const listV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STEP_STAGGER, delayChildren: STEP_DELAY_CHILDREN } },
}
const stepV: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } },
}
const nodeV: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export default function DemoSteps() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.4 })

  // A connector's particle stream is rendered only AFTER the step it leads to
  // has appeared — so a connection never shows before both of its steps exist.
  // Children order is step, conn, step, conn … so the step following connector
  // i sits at child index 2(i+1); its reveal time drives the gate below.
  const [revealed, setRevealed] = useState(0)
  useEffect(() => {
    if (!inView) return
    const timers = STEPS.slice(0, -1).map((_, i) =>
      setTimeout(
        () => setRevealed((r) => Math.max(r, i + 1)),
        (STEP_DELAY_CHILDREN + (2 * i + 2) * STEP_STAGGER + 0.35) * 1000,
      ),
    )
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <section className="ds-sec">
      <style>{`
        .ds-sec { padding: clamp(8px,1.5vw,20px) 28px clamp(20px,3vw,32px); background: #fff; }
        .ds-card {
          max-width: var(--w-1180); margin: 0 auto;
          border: 1px solid #eaeef6; border-radius: 22px; background: #fff;
          box-shadow: 0 20px 46px -32px rgba(20,40,90,.18);
          padding: clamp(26px,3vw,40px) clamp(22px,2.6vw,38px);
        }

        .ds-row { display: flex; align-items: flex-start; }
        @media (max-width: 900px) { .ds-row { flex-wrap: wrap; gap: 24px 0; } }

        /* ── Step ── */
        .ds-step {
          flex: 1 1 0; min-width: 0;
          display: grid; grid-template-columns: ${NODE}px minmax(0,1fr); gap: 15px;
          align-items: start;
        }
        @media (max-width: 900px) { .ds-step { flex: 1 1 46%; } }
        @media (max-width: 560px) { .ds-step { flex: 1 1 100%; } }

        .ds-node-wrap { position: relative; width: ${NODE}px; height: ${NODE}px; }
        .ds-node {
          position: absolute; inset: 0; border-radius: 50%; z-index: 2;
          background: linear-gradient(155deg, #f4f8ff 0%, #e7efff 100%);
          color: #1360ee; display: grid; place-items: center;
          box-shadow: 0 10px 22px -10px rgba(19,96,238,.4), inset 0 0 0 1px rgba(19,96,238,.09);
        }
        .ds-node svg { width: 27px; height: 27px; }
        /* One-shot ripple when the node appears — a subtle "wow" ping. */
        .ds-ping { position: absolute; inset: 0; border-radius: 50%; z-index: 1; border: 2px solid rgba(19,96,238,.5); }
        .ds-badge {
          position: absolute; top: -6px; right: -6px; z-index: 3;
          min-width: 22px; height: 22px; padding: 0 5px; border-radius: 999px;
          background: #1360ee; color: #fff; font-size: var(--f-10-5); font-weight: 800;
          display: grid; place-items: center; box-shadow: 0 5px 12px -3px rgba(19,96,238,.55);
          border: 2px solid #fff;
        }

        .ds-text { padding-right: 12px; }
        .ds-step-title { margin: 5px 0 5px; font-size: max(clamp(14px,1.35vw,16px), min(1.111vw, 23.2px)); font-weight: 800; letter-spacing: -.015em; color: #1d1d1f; line-height: 1.25; }
        .ds-step-desc { margin: 0; font-size: var(--f-12-5); line-height: 1.55; color: #6e6e73; }

        /* ── Connector: an empty spacer until its stream is revealed. No solid
              line ever draws, so a connection can't show before its steps. ── */
        .ds-conn {
          flex: 0 0 clamp(28px,4.5vw,72px); align-self: flex-start;
          height: 12px; margin-top: ${NODE / 2 - 6}px; position: relative;
        }
        @media (max-width: 900px) { .ds-conn { display: none; } }

        .ds-stream { position: absolute; inset: 0; animation: dsFade .5s ease both; }
        @keyframes dsFade { from { opacity: 0 } to { opacity: 1 } }

        /* Track + flowing beam + particles — same recipe as the get-a-quote
           timeline, laid out horizontally. Track holds the base line; the beam
           is a shimmering gradient that streams along it; particles emit, swell
           and sink between the two nodes. */
        .ds-line {
          position: absolute; top: 50%; left: 0; right: 0; height: 3px; transform: translateY(-50%);
          border-radius: 3px; background: rgba(19,96,238,.14); overflow: visible;
        }
        .ds-beam {
          position: absolute; inset: 0; border-radius: 3px;
          background: linear-gradient(90deg, rgba(19,96,238,0) 0%, rgba(19,96,238,.85) 25%, rgba(150,190,255,.6) 55%, rgba(19,96,238,.85) 80%, rgba(19,96,238,0) 100%);
          background-size: 220% 100%;
          box-shadow: 0 0 10px rgba(19,96,238,.4);
          animation: dsFlow 1.8s linear infinite;
        }
        @keyframes dsFlow { from { background-position: 0 0 } to { background-position: -220% 0 } }

        .ds-particles { position: absolute; inset: 0; }
        .ds-p {
          position: absolute; top: 50%; left: 0;
          width: var(--s); height: var(--s); border-radius: 50%;
          background: var(--c); box-shadow: 0 0 9px 1px var(--c);
          opacity: 0;
          animation: dsStream var(--dur) linear infinite; animation-delay: var(--d);
          will-change: left, transform, opacity;
        }
        /* Emit small at one node, swell + drift mid-flight, sink into the next. */
        @keyframes dsStream {
          0%   { left: -5%;  opacity: 0;         transform: translateY(-50%) scale(.2); }
          12%  {             opacity: var(--o);  transform: translate(0, calc(-50% + var(--y))) scale(1); }
          50%  {                                 transform: translate(0, calc(-50% - var(--y))) scale(1.15); }
          88%  {             opacity: var(--o);  transform: translate(0, calc(-50% + var(--y))) scale(1); }
          100% { left: 105%; opacity: 0;         transform: translateY(-50%) scale(.2); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ds-beam, .ds-p { animation: none; }
          .ds-p { display: none; }
          .ds-beam { background: rgba(19,96,238,.4); }
          .ds-ping { display: none; }
        }
      `}</style>

      <div className="ds-card">
        <motion.div
          className="ds-row"
          ref={rootRef}
          variants={listV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
              <motion.div className="ds-step" variants={stepV}>
                <div className="ds-node-wrap">
                  <motion.span
                    className="ds-ping"
                    aria-hidden="true"
                    variants={{
                      hidden: { scale: 1, opacity: 0 },
                      show: { scale: [1, 1.9], opacity: [0.6, 0], transition: { duration: 0.9, ease: 'easeOut', delay: 0.1 } },
                    }}
                  />
                  <motion.div className="ds-node" variants={nodeV}>{s.icon}</motion.div>
                  <span className="ds-badge">{s.n}</span>
                </div>
                <div className="ds-text">
                  <h3 className="ds-step-title">{s.title}</h3>
                  <p className="ds-step-desc">{s.desc}</p>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div className="ds-conn" aria-hidden="true">
                  {revealed > i && (
                    <div className="ds-stream">
                      <div className="ds-line">
                        <div className="ds-beam" />
                        <div className="ds-particles">
                          {STREAM.map((p, pi) => (
                            <span
                              key={pi}
                              className="ds-p"
                              style={{
                                '--d': `${p.d}s`,
                                '--dur': `${p.dur}s`,
                                '--y': `${p.y}px`,
                                '--s': `${p.s}px`,
                                '--o': p.o,
                                '--c': p.c ? '#8cb4f6' : '#1360ee',
                              } as React.CSSProperties}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
