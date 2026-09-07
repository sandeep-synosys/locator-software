"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {  QuoteFormState, sendQuoteEmail } from "@/app/actions/send-quote-email";

const EASE = "cubic-bezier(.22,.61,.36,1)";
const NODE = 64; // px — node diameter; track aligns to its centre

type Step = { n: string; title: string; desc: string; icon: React.ReactNode };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Request a Free Quote",
    desc: "Tell us about your fleet and we’ll prepare a tailored quote — no obligation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="5"
          y="3"
          width="14"
          height="18"
          rx="3"
          fill="currentColor"
          opacity=".16"
        />
        <path
          d="M9 8h6M9 12h6M9 16h3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 3.5h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Schedule a Free Demo",
    desc: "Book an appointment and see LOCATOR running live on your own use case.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="4"
          width="18"
          height="12"
          rx="2.5"
          fill="currentColor"
          opacity=".16"
        />
        <path d="M10 9.2v3.6l3-1.8-3-1.8z" fill="currentColor" />
        <path
          d="M8.5 20h7M12 16v4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Installation at Your Location",
    desc: "Our engineers install and configure everything at a place of your choice.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"
          fill="currentColor"
          opacity=".16"
        />
        <path
          d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Manage & Grow",
    desc: "Start managing your vehicles and teams — and grow your business.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="6"
          y="12"
          width="3"
          height="6"
          rx="1"
          fill="currentColor"
          opacity=".35"
        />
        <rect
          x="10.5"
          y="8"
          width="3"
          height="10"
          rx="1"
          fill="currentColor"
          opacity=".6"
        />
        <rect x="15" y="4" width="3" height="14" rx="1" fill="currentColor" />
      </svg>
    ),
  },
];

// Fixed (not Math.random) so server and client markup match — each entry is
// one particle: delay, duration, x-drift, size, opacity, colour (0=white,1=blue).
const STREAM = [
  { d: 0.0, dur: 2.3, x: 6, s: 5, o: 0.95, c: 0 },
  { d: 0.3, dur: 2.7, x: -8, s: 3, o: 0.7, c: 1 },
  { d: 0.55, dur: 2.0, x: 3, s: 4, o: 0.9, c: 0 },
  { d: 0.8, dur: 3.0, x: -5, s: 2.5, o: 0.55, c: 1 },
  { d: 1.05, dur: 2.4, x: 9, s: 3.5, o: 0.8, c: 0 },
  { d: 1.3, dur: 2.6, x: -4, s: 5.5, o: 0.85, c: 0 },
  { d: 1.55, dur: 2.1, x: 6, s: 2.5, o: 0.6, c: 1 },
  { d: 1.8, dur: 2.9, x: -7, s: 3, o: 0.7, c: 0 },
  { d: 2.05, dur: 2.3, x: 4, s: 4.5, o: 0.9, c: 0 },
  { d: 2.3, dur: 2.6, x: -9, s: 2.5, o: 0.5, c: 1 },
  { d: 2.55, dur: 2.0, x: 7, s: 3.5, o: 0.75, c: 0 },
  { d: 2.8, dur: 2.8, x: -3, s: 3, o: 0.65, c: 1 },
  { d: 3.05, dur: 2.2, x: 8, s: 4, o: 0.8, c: 0 },
  { d: 3.3, dur: 2.5, x: -6, s: 2.5, o: 0.55, c: 1 },
];

// Ambient dots drifting in the panel background — subtle depth.
const AMBIENT = [
  { l: 12, t: 18, dur: 7, d: 0, s: 4, o: 0.4 },
  { l: 88, t: 30, dur: 9, d: 1.5, s: 3, o: 0.3 },
  { l: 70, t: 62, dur: 8, d: 0.7, s: 5, o: 0.35 },
  { l: 22, t: 74, dur: 10, d: 2.2, s: 3, o: 0.28 },
  { l: 92, t: 84, dur: 7.5, d: 1, s: 4, o: 0.32 },
  { l: 40, t: 12, dur: 8.5, d: 2.8, s: 3, o: 0.3 },
];

const FIELDS = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    required: true,
    half: true,
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    half: true,
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    required: false,
    half: true,
  },
  {
    name: "company",
    label: "Company",
    type: "text",
    required: false,
    half: true,
  },
  {
    name: "vehicles",
    label: "Number of vehicles",
    type: "text",
    required: false,
    half: false,
  },
] as const;

// Each step waits a full 1.5s after the previous one before it starts.
const STEP_STAGGER = 1.5;
const STEP_DELAY_CHILDREN = 0.15;

const listV: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STEP_STAGGER,
      delayChildren: STEP_DELAY_CHILDREN,
    },
  },
};
const stepV: Variants = {
  hidden: { opacity: 0, x: 26 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
  },
};
const nodeV: Variants = {
  hidden: { scale: 0, rotate: -25 },
  show: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};
// Beam draws down after its node has popped, before the next step reveals.
const beamV: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: 0.34, ease: [0.22, 0.61, 0.36, 1], delay: 0.18 },
  },
};

export default function QuoteForm() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stepsRef, { once: true, amount: 0.3 });

  const initialState: QuoteFormState = { success: false }

  const [showSuccess, setShowSuccess] = useState(false);
  const [state, formAction, isPending] = useActionState(
    sendQuoteEmail,
    initialState
  );

  // Particles for a connector only start once THAT segment's beam has drawn
  // in — otherwise, with a 1.5s gap between steps, you'd see step 3's
  // particles already flowing before step 3 has even appeared.
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timers = STEPS.map((_, i) =>
      setTimeout(
        () => setRevealed((r) => Math.max(r, i + 1)),
        (STEP_DELAY_CHILDREN + i * STEP_STAGGER + 0.5) * 1000
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  useEffect(() => {
    if (state.success) setShowSuccess(true);
  }, [state]);

  return (
    <section className="qf-section">
      <style>{`
        .qf-section { padding: clamp(20px,3vw,44px) 28px clamp(56px,7vw,88px); background: #fff; }
        .qf-shell {
          max-width: var(--w-1180); margin: 0 auto;
          display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(20px,2.4vw,32px);
          align-items: stretch;
        }
        @media (max-width: 900px) { .qf-shell { grid-template-columns: 1fr; } }

        /* ── Left: form ── */
        .qf-form-card {
          background: #fff; border: 1px solid #e7ebf3; border-radius: 22px;
          padding: clamp(24px,3vw,40px); box-shadow: 0 30px 60px -34px rgba(20,40,90,.22);
        }
        .qf-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: var(--f-11); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; margin-bottom: 12px; }
        .qf-eyebrow span { width: 22px; height: 2px; background: #1360ee; border-radius: 2px; }
        .qf-title { margin: 0 0 6px; font-size: max(clamp(21px,2.4vw,28px), min(1.944vw, 40.6px)); font-weight: 800; letter-spacing: -.025em; color: #1d1d1f; }
        .qf-sub { margin: 0 0 24px; font-size: var(--f-14); line-height: 1.6; color: #6e6e73; }

        .qf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .qf-grid { grid-template-columns: 1fr; } }
        .qf-field { display: flex; flex-direction: column; gap: 6px; }
        .qf-field.full { grid-column: 1 / -1; }
        .qf-label { font-size: var(--f-12); font-weight: 700; color: #52525e; }
        .qf-label b { color: #e5484d; }
        .qf-input, .qf-textarea {
          font-family: inherit; font-size: var(--f-14); color: #1d1d1f; width: 100%;
          padding: 13px 15px; border-radius: 11px;
          border: 1.5px solid #e4e8f0; background: #fbfcfe;
          transition: border-color .18s ${EASE}, box-shadow .18s ${EASE}, background .18s ${EASE};
        }
        .qf-input::placeholder, .qf-textarea::placeholder { color: #aab0bd; }
        .qf-input:focus, .qf-textarea:focus { outline: none; border-color: #1360ee; background: #fff; box-shadow: 0 0 0 4px rgba(19,96,238,.12); }
        .qf-textarea { resize: vertical; min-height: 96px; }

        .qf-submit {
          margin-top: 22px; width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 24px; border-radius: 12px; border: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-15); font-weight: 700; color: #fff;
          background: #1360ee; box-shadow: 0 12px 26px -10px rgba(19,96,238,.6); transition: .18s ${EASE};
        }
        .qf-submit:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 16px 32px -10px rgba(19,96,238,.7); }
        .qf-submit svg { transition: transform .2s ${EASE}; }
        .qf-submit:hover svg { transform: translateX(4px); }

        .qf-success { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-height: 460px; }
        .qf-check { width: 64px; height: 64px; border-radius: 50%; margin-bottom: 22px; background: rgba(19,146,63,.1); color: #13923f; display: grid; place-items: center; animation: qfPopIn .5s ${EASE} both; }
        @keyframes qfPopIn { 0% { transform: scale(.5); opacity: 0 } 60% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }

        /* ── Right: premium timeline ── */
        .qf-steps-card {
          position: relative; overflow: hidden; color: #fff;
          border-radius: 22px; padding: clamp(30px,3vw,46px) clamp(24px,2.6vw,40px);
          background: radial-gradient(130% 100% at 85% -10%, #2f6bff 0%, #1360ee 42%, #0e46c4 100%);
          box-shadow: 0 40px 80px -34px rgba(19,96,238,.6);
        }
        /* faint grid + glow for depth */
        .qf-steps-card::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size: 34px 34px;
          -webkit-mask-image: radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 75%);
          mask-image: radial-gradient(120% 90% at 70% 0%, #000 30%, transparent 75%);
        }

        /* Ambient floating dots for depth behind the timeline. */
        .qf-ambient { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .qf-amb {
          position: absolute; border-radius: 50%; background: #fff;
          box-shadow: 0 0 8px 1px rgba(255,255,255,.7);
          animation: qfDrift var(--dur) ease-in-out infinite; animation-delay: var(--d);
        }
        @keyframes qfDrift {
          0%,100% { transform: translateY(0) scale(1); opacity: var(--o) }
          50% { transform: translateY(-16px) scale(1.3); opacity: calc(var(--o) * .4) }
        }

        .qf-steps-h { position: relative; z-index: 2; margin: 0 0 clamp(26px,3vw,36px); font-size: var(--f-12); font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.75); }

        .qf-timeline { position: relative; z-index: 1; }

        .qf-step {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: ${NODE}px 1fr; gap: 20px;
          padding-bottom: clamp(46px,5.2vw,70px);
        }
        .qf-step:last-child { padding-bottom: 0; }

        /* Segment connector: node-bottom → next node-top. Self-correcting,
           so it never dangles regardless of how tall the text is. */
        .qf-conn {
          position: absolute; z-index: 0;
          left: ${NODE / 2}px; top: ${NODE}px; bottom: 0; width: 3px;
          transform: translateX(-50%); border-radius: 3px; overflow: hidden;
          background: rgba(255,255,255,.16);
        }
        .qf-step:last-child .qf-conn { display: none; }
        /* Flowing energy beam — a gradient that streams downward continuously. */
        .qf-conn-beam {
          position: absolute; inset: 0; transform-origin: top;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.85) 25%, rgba(188,212,255,.5) 55%, rgba(255,255,255,.85) 80%, rgba(255,255,255,0) 100%);
          background-size: 100% 220%;
          box-shadow: 0 0 14px rgba(255,255,255,.5);
          animation: qfFlow 1.8s linear infinite;
        }
        @keyframes qfFlow { from { background-position: 0 0 } to { background-position: 0 -220% } }

        /* particle stream — the .qf-conn is only 3px wide, so let particles
           overflow sideways to form a flowing cloud between the two nodes. */
        .qf-conn { overflow: visible; }
        .qf-stream { position: absolute; inset: 0; }
        .qf-p {
          position: absolute; left: 50%; top: 0;
          width: var(--s); height: var(--s); border-radius: 50%;
          background: var(--c); box-shadow: 0 0 10px 1px var(--c);
          opacity: 0;
          animation: qfStream var(--dur) linear infinite; animation-delay: var(--d);
          will-change: top, transform, opacity;
        }
        /* Emit small at the node, swell + drift mid-flight, sink into the next. */
        @keyframes qfStream {
          0%   { top: -5%;  opacity: 0;         transform: translateX(-50%) scale(.2); }
          12%  { opacity: var(--o);             transform: translateX(calc(-50% + var(--x))) scale(1); }
          50%  {                                transform: translateX(calc(-50% - var(--x))) scale(1.15); }
          88%  { opacity: var(--o);             transform: translateX(calc(-50% + var(--x))) scale(1); }
          100% { top: 105%; opacity: 0;         transform: translateX(-50%) scale(.2); }
        }

        .qf-node-wrap { position: relative; width: ${NODE}px; height: ${NODE}px; }
        /* soft pulsing halo */
        .qf-halo {
          position: absolute; inset: -8px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.5) 0%, transparent 68%);
          animation: qfHalo 2.8s ease-in-out infinite;
        }
        @keyframes qfHalo { 0%,100% { transform: scale(.85); opacity: .35 } 50% { transform: scale(1.08); opacity: .75 } }
        /* spinning arc of light around each node */
        .qf-ring {
          position: absolute; inset: -5px; border-radius: 50%; z-index: 2;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,.95) 55deg, transparent 130deg, transparent 360deg);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
          animation: qfSpin 3.4s linear infinite;
        }
        .qf-node-wrap:nth-child(1) .qf-ring { animation-direction: reverse; }
        @keyframes qfSpin { to { transform: rotate(360deg) } }
        .qf-node {
          position: absolute; inset: 0; border-radius: 50%;
          background: #fff; color: #1360ee; display: grid; place-items: center;
          box-shadow: 0 14px 30px -8px rgba(0,10,40,.5), inset 0 0 0 1px rgba(19,96,238,.08);
        }
        .qf-node svg { width: 30px; height: 30px; }
        .qf-badge {
          position: absolute; top: -3px; right: -3px; z-index: 3;
          min-width: 24px; height: 24px; padding: 0 6px; border-radius: 999px;
          background: #0a2a7a; color: #fff; font-size: var(--f-11); font-weight: 800;
          display: grid; place-items: center; box-shadow: 0 5px 12px rgba(0,10,40,.5);
          border: 2px solid rgba(255,255,255,.9);
        }

        .qf-step-title { margin: 6px 0 6px; font-size: max(clamp(16px,1.6vw,19px), min(1.319vw, 27.55px)); font-weight: 800; letter-spacing: -.015em; color: #fff; }
        .qf-step-desc { margin: 0; font-size: var(--f-13-5); line-height: 1.6; color: rgba(255,255,255,.8); max-width: 34ch; }

        @media (prefers-reduced-motion: reduce) {
          .qf-halo, .qf-check, .qf-ring, .qf-conn-beam, .qf-amb { animation: none; }
          .qf-stream, .qf-ambient { display: none; }
          .qf-conn-beam { transform: scaleY(1) !important; background: rgba(255,255,255,.4); }
        }
          .qf-submit:disabled {
          opacity: .75;
          cursor: not-allowed;
          transform: none !important;
        }
         .qf-submit:disabled:hover {
          background: #1360ee;
          box-shadow: 0 12px 26px -10px rgba(19,96,238,.6);
        }

         .qf-spinner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          animation: qfSpin 0.7s linear infinite;
        }
        @keyframes qfSpin {
        to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="qf-shell">
        {/* Left — form */}
        <div className="qf-form-card">
          {showSuccess ? (
            <div className="qf-success">
              <div className="qf-check">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="qf-title">Request received</h2>
              <p className="qf-sub">
                Thanks — our team will get back to you shortly with your
                tailored quote.
              </p>
              <button
                className="qf-submit"
                style={{ width: "auto" }}
                onClick={() => setShowSuccess(false)}
              >
                Submit another
              </button>
            </div>
          ) : (
            <>
              <span className="qf-eyebrow">
                <span />
                Request a quote
              </span>
              <h2 className="qf-title">Tell us about your fleet</h2>
              <p className="qf-sub">
                Share a few details and we’ll prepare a quote built around your
                operation.
              </p>

              <form action={formAction}>
                <div className="qf-grid">
                  {FIELDS.map((f) => (
                    <div
                      key={f.name}
                      className={`qf-field${f.half ? "" : " full"}`}
                    >
                      <label className="qf-label" htmlFor={`qf-${f.name}`}>
                        {f.label}
                        {f.required && <b> *</b>}
                      </label>
                      <input
                        id={`qf-${f.name}`}
                        className="qf-input"
                        type={f.type}
                        name={f.name}
                        required={f.required}
                        placeholder={f.label}
                      />
                    </div>
                  ))}
                  <div className="qf-field full">
                    <label className="qf-label" htmlFor="qf-message">
                      Message
                    </label>
                    <textarea
                      id="qf-message"
                      className="qf-textarea"
                      name="message"
                      placeholder="Anything specific we should know?"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="qf-submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="qf-spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Get a Quote
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right — animated timeline */}
        <div className="qf-steps-card">
          <div className="qf-ambient" aria-hidden="true">
            {AMBIENT.map((a, ai) => (
              <span
                key={ai}
                className="qf-amb"
                style={
                  {
                    left: `${a.l}%`,
                    top: `${a.t}%`,
                    width: a.s,
                    height: a.s,
                    "--dur": `${a.dur}s`,
                    "--d": `${a.d}s`,
                    "--o": a.o,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <p className="qf-steps-h">Four simple steps to get started</p>

          <motion.div
            className="qf-timeline"
            ref={stepsRef}
            variants={listV}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {STEPS.map((s, i) => (
              <motion.div className="qf-step" key={s.n} variants={stepV}>
                {i < STEPS.length - 1 && (
                  <div className="qf-conn" aria-hidden="true">
                    <motion.div className="qf-conn-beam" variants={beamV} />
                    {revealed > i && (
                      <div className="qf-stream">
                        {STREAM.map((p, pi) => (
                          <span
                            key={pi}
                            className="qf-p"
                            style={
                              {
                                "--d": `${p.d}s`,
                                "--dur": `${p.dur}s`,
                                "--x": `${p.x}px`,
                                "--s": `${p.s}px`,
                                "--o": p.o,
                                "--c": p.c ? "#bcd4ff" : "#ffffff",
                              } as React.CSSProperties
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="qf-node-wrap">
                  <span className="qf-halo" aria-hidden="true" />
                  <span className="qf-ring" aria-hidden="true" />
                  <motion.div className="qf-node" variants={nodeV}>
                    {s.icon}
                  </motion.div>
                  <span className="qf-badge">{s.n}</span>
                </div>
                <div>
                  <h3 className="qf-step-title">{s.title}</h3>
                  <p className="qf-step-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
