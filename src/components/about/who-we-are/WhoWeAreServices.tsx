'use client'

import { useEffect, useRef } from 'react'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const SERVICES = [
  {
    num: '01',
    label: 'Real Time Tracking',
    title: 'GPS Vehicle Tracking',
    body: 'Gain real-time visibility of vehicles with accurate location tracking, trip history, geofencing, and intelligent alerts.',
    accent: '#1360ee',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    num: '02',
    label: 'Fleet Telematics',
    title: 'Fleet Management',
    body: 'Improve fleet utilization, operational efficiency, maintenance planning, and overall business performance.',
    accent: '#1360ee',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M8 18v3M16 18v3M7 13h4" />
      </svg>
    ),
  },
  {
    num: '03',
    label: 'Video Telematics',
    title: 'AI Dashcams & Video Telematics',
    body: 'Enhance driver safety and operational visibility through AI-powered cameras and intelligent event detection.',
    accent: '#1360ee',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="7" width="14" height="11" rx="2" /><path d="M16.5 11l5-3v9l-5-3v-3z" />
      </svg>
    ),
  },
  {
    num: '04',
    label: 'Fuel Management',
    title: 'Fuel Monitoring',
    body: 'Track fuel consumption, identify inefficiencies, and reduce operational costs through advanced fuel analytics.',
    accent: '#1360ee',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12" /><path d="M14 9h3l2 2v6a2 2 0 0 1-4 0v-3h-1" /><path d="M7 8h4" />
      </svg>
    ),
  },
  {
    num: '05',
    label: 'Asset Monitoring',
    title: 'Asset Tracking',
    body: 'Monitor valuable assets, equipment, and machinery with reliable real-time location intelligence.',
    accent: '#1360ee',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
      </svg>
    ),
  },
  {
    num: '06',
    label: 'Smart IoT',
    title: 'IoT Solutions',
    body: 'Connect vehicles, assets, sensors, and field operations through intelligent IoT technologies.',
    accent: '#1360ee',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" /><circle cx="5" cy="6" r="1.8" /><circle cx="19" cy="6" r="1.8" /><circle cx="5" cy="18" r="1.8" /><circle cx="19" cy="18" r="1.8" />
        <path d="M6.5 7.2 10 10.5M17.5 7.2 14 10.5M6.5 16.8 10 13.5M17.5 16.8 14 13.5" />
      </svg>
    ),
  },
]

export default function WhoWeAreServices() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const fill = fillRef.current
    if (!wrap || !fill) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fill.style.height = '100%'
      return
    }
    let raf = 0
    const apply = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(Math.max((vh * 0.78 - rect.top) / (rect.height - vh * 0.25), 0), 1)
      fill.style.height = `${progress * 100}%`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <style>{`
        .wws-section { position: relative; padding: clamp(56px,7vw,96px) 28px; background: #fff; overflow: hidden; }
        .wws-head { text-align: center; max-width: 640px; margin: 0 auto clamp(44px,6vw,72px); }
        .wws-wrap { position: relative; max-width: var(--w-1120); margin: 0 auto; }

        .wws-spine { position: absolute; top: 8px; bottom: 8px; left: 50%; width: 3px; transform: translateX(-50%); background: #e2e8f4; border-radius: 3px; z-index: 0; }
        /* Progress fill travels through the site's own hero blues instead of
           blue -> purple -> green, which read as three unrelated states. */
        .wws-fill { position: relative; width: 100%; height: 0; background: linear-gradient(180deg, #1360ee 0%, #0d4fd4 55%, #0a3aa0 100%); border-radius: 3px; transition: height .15s linear; }
        .wws-comet { position: absolute; left: 50%; bottom: 0; width: 15px; height: 15px; transform: translate(-50%, 50%); border-radius: 50%; background: #fff; box-shadow: 0 0 14px 3px rgba(19,96,238,.55), 0 0 0 5px rgba(19,96,238,.14); }

        .wws-row { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 88px 1fr; align-items: center; margin-bottom: clamp(24px,3.5vw,48px); }
        .wws-row:last-child { margin-bottom: 0; }
        .wws-empty { position: relative; display: grid; place-items: center; min-height: 100%; }
        .wws-ghost { font-family: ui-monospace, 'Cascadia Code', monospace; font-size: clamp(84px,11vw,170px); font-weight: 800; line-height: .9; letter-spacing: -.04em; opacity: .09; user-select: none; }

        .wws-node-cell { display: grid; place-items: center; }
        .wws-node { position: relative; width: 62px; height: 62px; border-radius: 50%; display: grid; place-items: center; color: #fff; box-shadow: 0 14px 30px -10px var(--wws-accent); }
        .wws-node::after { content: ''; position: absolute; inset: -7px; border-radius: 50%; border: 1.5px solid var(--wws-accent); opacity: .3; }
        @keyframes wwsPulse { 0% { box-shadow: 0 0 0 0 var(--wws-ring); } 70% { box-shadow: 0 0 0 16px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
        @media (prefers-reduced-motion: no-preference) { .wws-node { animation: wwsPulse 3.4s ${EASE} infinite; } }

        .wws-card { position: relative; background: #fff; border: 1px solid #e8ecf4; border-radius: 22px; padding: clamp(22px,2.6vw,32px); box-shadow: 0 2px 16px rgba(20,40,90,.05); transition: transform .28s ${EASE}, box-shadow .28s ${EASE}; }
        .wws-card:hover { transform: translateY(-5px); box-shadow: 0 26px 50px -22px rgba(20,40,90,.32); }
        .wws-card::before { content: ''; position: absolute; top: 50%; width: 15px; height: 15px; background: #fff; transform: translateY(-50%) rotate(45deg); }
        .wws-row[data-side="left"] .wws-card::before { right: -8px; border-top: 1px solid #e8ecf4; border-right: 1px solid #e8ecf4; }
        .wws-row[data-side="right"] .wws-card::before { left: -8px; border-bottom: 1px solid #e8ecf4; border-left: 1px solid #e8ecf4; }
        .wws-card::after { content: ''; position: absolute; top: 50%; width: clamp(20px,3vw,40px); height: 2px; transform: translateY(-50%); background: var(--wws-accent); opacity: .4; }
        .wws-row[data-side="left"] .wws-card::after { right: calc(-1 * clamp(20px,3vw,40px)); }
        .wws-row[data-side="right"] .wws-card::after { left: calc(-1 * clamp(20px,3vw,40px)); }

        .wws-kicker { display: inline-flex; align-items: center; gap: 9px; font-size: var(--f-12); font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 12px; }
        .wws-kicker-line { width: 26px; height: 2px; border-radius: 2px; }

        @media (max-width: 768px) {
          .wws-spine { left: 27px; }
          .wws-row { display: flex; align-items: flex-start; gap: 18px; grid-template-columns: none; }
          .wws-empty { display: none; }
          .wws-node-cell { order: 0; flex: 0 0 56px; }
          .wws-node { width: 54px; height: 54px; }
          .wws-card-cell { order: 1; flex: 1; min-width: 0; }
          .wws-card::before, .wws-card::after { display: none; }
        }
      `}</style>

      <section className="wws-section">
        <div className="wws-head" data-reveal>
          <h2 style={{ display: 'block', margin: '0 0 16px', fontFamily: 'inherit', lineHeight: 'inherit', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase' }}>
            <span aria-hidden="true" style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
            What We Do
          </h2>
          <p style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.015em', color: '#1d1d1f' }}>
            One connected platform for every part of your fleet
          </p>
          <p style={{ margin: '16px auto 0', fontSize: 'max(clamp(14px,1.35vw,16px), min(1.111vw, 23.2px))', color: '#6e6e73', lineHeight: 1.6 }}>
            Intelligent technologies to monitor, manage, and optimize every aspect of your operations.
          </p>
        </div>

        <div className="wws-wrap" ref={wrapRef}>
          <div className="wws-spine" aria-hidden="true">
            <div className="wws-fill" ref={fillRef}><span className="wws-comet" /></div>
          </div>

          {SERVICES.map((s, i) => {
            const side = i % 2 === 0 ? 'left' : 'right'
            const card = (
              <div className="wws-card-cell">
                <div className="wws-card" data-reveal={side === 'left' ? 'left' : 'right'} style={{ '--wws-accent': s.accent } as React.CSSProperties}>
                  <span className="wws-kicker" style={{ color: s.accent }}>
                    <span className="wws-kicker-line" style={{ background: s.accent }} />
                    {s.label}
                  </span>
                  <h3 style={{ margin: '0 0 10px', fontSize: 'max(clamp(18px,2vw,24px), min(1.667vw, 34.8px))', fontWeight: 800, letterSpacing: '-.02em', color: '#1d1d1f' }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: 'max(clamp(14px,1.25vw,15.5px), min(1.076vw, 22.47px))', lineHeight: 1.75, color: '#52525e' }}>{s.body}</p>
                </div>
              </div>
            )
            const ghost = (
              <div className="wws-empty" aria-hidden="true"><span className="wws-ghost" style={{ color: s.accent }}>{s.num}</span></div>
            )
            const node = (
              <div className="wws-node-cell">
                <div className="wws-node" data-reveal="zoom" style={{ background: s.accent, '--wws-accent': s.accent, '--wws-ring': `${s.accent}55` } as React.CSSProperties}>
                  {s.icon}
                </div>
              </div>
            )
            return (
              <div className="wws-row" data-side={side} key={s.num}>
                {side === 'left' ? card : ghost}
                {node}
                {side === 'right' ? card : ghost}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
