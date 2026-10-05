'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

type Market = {
  country: string
  flag: string
  live: boolean
  /** Live markets: where we are. Coming-soon markets: left empty. */
  place?: string
  phone?: string
  phoneHref?: string
  /** Trailing link — "View offices" for live markets, "Stay Tuned" otherwise. */
  cta: string
  href: string
}

const MARKETS: Market[] = [
  {
    country: 'Dubai',
    flag: '/flags/uae.svg',
    live: true,
    place: 'Sheikh Zayed Road, Trade Centre,\nTrade Centre 1, Dubai, United Arab Emirates',
    phone: '+971 4 354 7766',
    phoneHref: 'tel:+97143547766',
    cta: 'View offices',
    href: '#offices',
  },
  {
    country: 'Abu Dhabi',
    flag: '/flags/uae.svg',
    live: true,
    place: 'Capital Mall, Mohammed Bin Zayed City,\nAbu Dhabi, United Arab Emirates',
    phone: '+971 52 675 1880',
    phoneHref: 'tel:+971526751880',
    cta: 'View offices',
    href: '#offices',
  },
  {
    country: 'India',
    flag: '/flags/india.svg',
    live: true,
    place: 'UL CyberPark, Nellikode,\nKozhikode, Kerala',
    phone: '+91 73065 50767',
    phoneHref: 'tel:+917306550767',
    cta: 'Call this office',
    href: 'tel:+917306550767',
  },
  // { country: 'Saudi Arabia', flag: '/flags/saudi-arabia.svg', live: false, cta: 'Stay Tuned', href: '#contact-form' },
  // { country: 'Qatar',        flag: '/flags/qatar.svg',        live: false, cta: 'Stay Tuned', href: '#contact-form' },
  // { country: 'Oman',         flag: '/flags/oman.svg',         live: false, cta: 'Stay Tuned', href: '#contact-form' },
  // { country: 'Kuwait',       flag: '/flags/kuwait.svg',       live: false, cta: 'Stay Tuned', href: '#contact-form' },
  // { country: 'Bahrain',      flag: '/flags/bahrain.svg',      live: false, cta: 'Stay Tuned', href: '#contact-form' },
]

const AUTOPLAY_MS = 3600

// Rendered twice back-to-back so the rail always has more of itself to
// scroll into — that's what makes the loop endless instead of hitting a wall.
// const LOOP_MARKETS = [...MARKETS, ...MARKETS]
const LOOP_MARKETS = [...MARKETS]

export default function ContactPresence() {
  const trackRef = useRef<HTMLDivElement>(null)
  // Paused whenever the rail is being read or touched — autoplay should never
  // yank a card out from under someone.
  const [paused, setPaused] = useState(false)
  // Distance from a card to its clone one set later — subtracting it once the
  // clone is reached snaps back to the equivalent real position invisibly.
  const loopWidthRef = useRef(0)

  const measureLoopWidth = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('.ctp-card')
    if (cards.length < MARKETS.length * 2) return
    loopWidthRef.current = cards[MARKETS.length].offsetLeft - cards[0].offsetLeft
  }, [])

  useEffect(() => {
    measureLoopWidth()
    window.addEventListener('resize', measureLoopWidth)
    return () => window.removeEventListener('resize', measureLoopWidth)
  }, [measureLoopWidth])

  // Once a scroll (smooth or dragged) settles past the first copy, snap back
  // by one loop-width so there's always another copy ahead to scroll into.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onSettle = () => {
      const loopWidth = loopWidthRef.current
      if (loopWidth && el.scrollLeft >= loopWidth) el.scrollLeft -= loopWidth
    }
    el.addEventListener('scrollend', onSettle)
    return () => el.removeEventListener('scrollend', onSettle)
  }, [])

  // Step by one card + gap, so a nudge always lands on a snap point.
  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.ctp-card')
    const step = card ? card.offsetWidth + 18 : el.clientWidth * 0.8
    // Stepping back past the start? Jump to the equivalent spot in the
    // second copy first, so "previous" also loops forever.
    const loopWidth = loopWidthRef.current
    if (dir === -1 && loopWidth && el.scrollLeft - step < 0) el.scrollLeft += loopWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }, [])

  // Autoplay: advance a card at a time, forever — the loop wrap above keeps
  // there from ever being a "last" card to stop at.
  // Skipped entirely for reduced-motion users and while the tab is hidden.
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      if (document.hidden) return
      scrollBy(1)
    }, AUTOPLAY_MS)

    return () => clearInterval(id)
  }, [paused, scrollBy])

  return (
    <section className="ctp" id="presence">
      <style href="ct-contactpresence" precedence="medium">{`
        .ctp {
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #f6f9fe 42%, #ffffff 100%);
          padding: clamp(48px,6.5vw,86px) 0 clamp(52px,7vw,90px);
        }
        .ctp-inner { max-width: var(--w-1180); margin: 0 auto; padding: 0 28px; }

        .ctp-head { margin-bottom: clamp(26px,3.4vw,40px); }
        /* Eyebrow / title / sub share one scale across every contact section —
           the eyebrow sits close enough to the headline to read as its kicker. */
        .ctp-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: max(clamp(12px,1.05vw,13.5px), min(0.938vw, 19.57px)); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; }
        .ctp-eyebrow i { display: block; width: 28px; height: 2.5px; background: #1360ee; border-radius: 2px; }
        .ctp-title { margin: 10px 0 0; font-size: max(clamp(25px,2.7vw,33px), min(2.292vw, 47.85px)); font-weight: 800; letter-spacing: -.028em; line-height: 1.16; color: #1d1d1f; }
        .ctp-sub { margin: 12px 0 0; max-width: 56ch; font-size: max(clamp(14px,1.2vw,15.5px), min(1.076vw, 22.47px)); line-height: 1.7; color: #6e6e73; }

        /* ── Arrows: floating on the rail, vertically centred ── */
        .ctp-arrow {
          position: absolute; top: 50%; z-index: 3;
          width: clamp(46px,4.4vw,56px); aspect-ratio: 1; border-radius: 50%; cursor: pointer;
          display: grid; place-items: center; isolation: isolate; overflow: hidden;
          border: 3px solid #fff; color: #fff;
          background: linear-gradient(135deg, #3d8bff 0%, #1360ee 52%, #0b40b8 100%);
          /* Coloured drop shadow + a soft halo ring, so the button reads as a
             lit object on the pale rail instead of dissolving into it. */
          box-shadow:
            0 16px 30px -10px rgba(19,96,238,.62),
            0 0 0 7px rgba(19,96,238,.10),
            inset 0 1px 0 rgba(255,255,255,.4);
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, opacity .22s ${EASE}, filter .22s ${EASE};
        }
        /* Light sweep across the face on hover — same gesture as the nav CTA. */
        .ctp-arrow::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(110deg, transparent 22%, rgba(255,255,255,.5) 50%, transparent 78%);
          transform: translateX(-130%); transition: transform .65s ${EASE};
        }
        .ctp-arrow:hover:not(:disabled)::before { transform: translateX(130%); }

        .ctp-arrow.l { left: clamp(10px,2.5vw,30px); transform: translateY(-50%); }
        .ctp-arrow.r { right: clamp(10px,2.5vw,30px); transform: translateY(-50%); }
        .ctp-arrow:hover:not(:disabled) {
          filter: brightness(1.06);
          box-shadow:
            0 22px 40px -10px rgba(19,96,238,.75),
            0 0 0 11px rgba(19,96,238,.14),
            inset 0 1px 0 rgba(255,255,255,.5);
        }
        .ctp-arrow.l:hover:not(:disabled) { transform: translateY(-50%) translateX(-3px) scale(1.06); }
        .ctp-arrow.r:hover:not(:disabled) { transform: translateY(-50%) translateX(3px) scale(1.06); }
        .ctp-arrow:active:not(:disabled) { transform: translateY(-50%) scale(.94); }
        .ctp-arrow:focus-visible { outline: none; box-shadow: 0 0 0 4px #fff, 0 0 0 7px #1360ee; }
        .ctp-arrow svg { transition: transform .2s ${EASE}; }
        .ctp-arrow:hover:not(:disabled) svg { transform: scale(1.14); }

        /* ── Track ──
           Full-bleed on purpose: cards run to the viewport edge so the row
           reads as a rail that continues, not a boxed-in list. The inner
           padding keeps the first/last card aligned with the header. */
        .ctp-track-wrap { position: relative; }
        .ctp-track {
          display: flex; gap: 18px;
          overflow-x: auto; overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory; scroll-padding-left: max(28px, calc((100vw - 1180px) / 2 + 28px));
          padding: 10px max(28px, calc((100vw - 1180px) / 2 + 28px)) 26px;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .ctp-track::-webkit-scrollbar { display: none; }

        /* Edge fades hint at more cards beyond the frame. */
        .ctp-fade {
          position: absolute; top: 0; bottom: 0; width: clamp(28px,6vw,90px); z-index: 2; pointer-events: none;
          transition: opacity .25s ${EASE};
        }
        .ctp-fade.l { left: 0; background: linear-gradient(90deg, #f8fafe 12%, rgba(248,250,254,0)); }
        .ctp-fade.r { right: 0; background: linear-gradient(270deg, #f8fafe 12%, rgba(248,250,254,0)); }

        .ctp-card {
          position: relative; overflow: hidden; flex: 0 0 auto;
          /* Three cards + their two gaps exactly fill the visible rail, at any
             desktop width — not pegged to the 1180px design width. */
          width: calc((100% - 36px) / 3); min-width: 230px; max-width: 340px;
          scroll-snap-align: start;
          display: flex; flex-direction: column;
          padding: clamp(22px,2.4vw,28px);
          background: #fff; border: 1px solid #e7ebf3; border-radius: 22px;
          box-shadow: 0 20px 44px -34px rgba(20,40,90,.55);
          transition: transform .28s ${EASE}, box-shadow .28s ${EASE}, border-color .28s ${EASE};
        }
        .ctp-card:hover { transform: translateY(-5px); border-color: #cfdcf6; box-shadow: 0 34px 60px -32px rgba(19,96,238,.5); }
        /* Soft brand bloom, stronger on the live markets. */
        .ctp-card::after {
          content: ''; position: absolute; right: -26%; top: -34%; width: 66%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(19,96,238,.13), transparent 72%);
          opacity: .55; transition: opacity .28s ${EASE}, transform .45s ${EASE}; pointer-events: none;
        }
        .ctp-card.soon::after { background: radial-gradient(closest-side, rgba(120,132,158,.12), transparent 72%); }
        .ctp-card:hover::after { opacity: 1; transform: scale(1.14); }
        .ctp-card > * { position: relative; z-index: 1; }

        .ctp-card-top { display: flex; align-items: center; gap: 13px; }
        .ctp-flag {
          width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
          box-shadow: 0 6px 16px -8px rgba(20,40,90,.65), inset 0 0 0 1px rgba(15,23,42,.08);
          transition: transform .28s ${EASE};
        }
        .ctp-card:hover .ctp-flag { transform: scale(1.07); }
        .ctp-flag img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ctp-country { margin: 0; font-size: var(--f-17); font-weight: 800; letter-spacing: -.025em; line-height: 1.2; color: #1d1d1f; }

        .ctp-status {
          display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
          margin-top: 18px; padding: 6px 12px; border-radius: 999px;
          font-size: var(--f-10-5); font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
        }
        .ctp-status.on { background: rgba(19,146,63,.1); color: #13923f; }
        .ctp-status.off { background: #f2f4f8; color: #7b8395; }
        .ctp-status i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        /* Live markets get a quiet pulse; it stops for reduced-motion users. */
        .ctp-status.on i { animation: ctpPulse 2.4s ease-in-out infinite; }
        @keyframes ctpPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(19,146,63,.5); }
          70% { box-shadow: 0 0 0 6px rgba(19,146,63,0); }
        }

        .ctp-place { margin: 14px 0 0; white-space: pre-line; font-size: var(--f-13-5); line-height: 1.65; color: #6e6e73; }
        .ctp-phone {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 10px;
          font-size: var(--f-13-5); font-weight: 700; color: #1d1d1f; text-decoration: none;
          transition: color .18s ${EASE};
        }
        .ctp-phone:hover { color: #1360ee; }

        /* Coming-soon cards carry no address, so this holds the card height. */
        .ctp-soon-copy { margin: 14px 0 0; font-size: var(--f-13-5); line-height: 1.65; color: #6e6e73; }

        .ctp-cta {
          display: inline-flex; align-items: center; gap: 7px; margin-top: auto; padding-top: 22px;
          font-size: var(--f-13-5); font-weight: 800; color: #1360ee; text-decoration: none;
        }
        .ctp-cta svg { transition: transform .2s ${EASE}; }
        .ctp-card:hover .ctp-cta svg { transform: translateX(4px); }

        @media (max-width: 760px) {
          .ctp-card { width: min(78vw, 300px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ctp-track { scroll-behavior: auto; }
          .ctp-status.on i { animation: none; }
          .ctp-card, .ctp-card::after, .ctp-flag, .ctp-arrow { transition: none; }
        }
      `}</style>

      <div className="ctp-inner">
        <div className="ctp-head" data-reveal>
          <div>
            <span className="ctp-eyebrow"><i />Global presence</span>
            <h2 className="ctp-title">Where Locator operates</h2>
            <p className="ctp-sub">
              Live in the UAE and India, with five more Gulf markets on the way.
              Tell us where you operate and we&rsquo;ll tell you when we land.
            </p>
          </div>
        </div>
      </div>

      <div
        className="ctp-track-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <div className="ctp-fade l" aria-hidden="true" />
        <div className="ctp-fade r" aria-hidden="true" />

        {/* <button
          type="button" className="ctp-arrow l" aria-label="Previous markets"
          onClick={() => scrollBy(-1)}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6 9 12l6 6" />
          </svg>
        </button>
        <button
          type="button" className="ctp-arrow r" aria-label="Next markets"
          onClick={() => scrollBy(1)}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button> */}

        <div className="ctp-track" ref={trackRef} tabIndex={0} role="region" aria-label="Markets Locator operates in">
          {LOOP_MARKETS.map((m, i) => {
            const isClone = i >= MARKETS.length
            return (
              <article
                className={`ctp-card${m.live ? '' : ' soon'}`}
                key={`${m.country}-${i}`}
                aria-hidden={isClone || undefined}
              >
                <div className="ctp-card-top">
                  <span className="ctp-flag">
                    <Image src={m.flag} alt={`Flag of ${m.country}`} width={46} height={46} />
                  </span>
                  <h3 className="ctp-country">{m.country}</h3>
                </div>

                <span className={`ctp-status ${m.live ? 'on' : 'off'}`}>
                  <i />{m.live ? 'Live' : 'Coming Soon'}
                </span>

                {m.live ? (
                  <>
                    <p className="ctp-place">{m.place}</p>
                    {m.phone && (
                      <a className="ctp-phone" href={m.phoneHref} tabIndex={isClone ? -1 : undefined}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1360ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.73 12 19.79 19.79 0 0 1 1.67 3.43 2 2 0 0 1 3.66 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 5.91 5.91l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {m.phone}
                      </a>
                    )}
                  </>
                ) : (
                  <p className="ctp-soon-copy">
                    We&rsquo;re preparing to launch here. Register your interest and we&rsquo;ll be in touch first.
                  </p>
                )}

                <a className="ctp-cta" href={m.href} tabIndex={isClone ? -1 : undefined}>
                  {m.cta}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
