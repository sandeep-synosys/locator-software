'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GITEX_TEAM } from './gitex-2026-data'

/* "Meet Our Team at GITEX": the team's "I'm attending" posters in a carousel.
   Three across on desktop, two on tablets, one on phones. A native scroll-snap
   track, so touch swipe and trackpads work; arrows step one poster, dots jump
   between pages. Arrows and dots hide when every poster already fits. */
export default function GitexTeamCarousel() {
  const track = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  /* Width of one poster plus the gap, and how many posters fit in view. */
  const layout = useCallback(() => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>('.gxt-slide')
    if (!el || !card) return null
    const stride = card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)
    const perView = Math.max(1, Math.floor((el.clientWidth + 2) / stride + 0.05))
    return { el, stride, perView, max: el.scrollWidth - el.clientWidth }
  }, [])

  const measure = useCallback(() => {
    const l = layout()
    if (!l) return
    const { el, stride, perView, max } = l
    const count = max > 1 ? Math.ceil(GITEX_TEAM.length / perView) : 1
    const atEndNow = el.scrollLeft >= max - 1
    setPages(count)
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(atEndNow)
    setPage(atEndNow ? count - 1 : Math.min(count - 1, Math.round(el.scrollLeft / (stride * perView))))
  }, [layout])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const frame = requestAnimationFrame(measure)
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [measure])

  const step = (dir: 1 | -1) => {
    const l = layout()
    if (l) l.el.scrollBy({ left: dir * l.stride, behavior: 'smooth' })
  }
  /* Each dot opens the page that starts at its first poster (the last page
     stops at the end of the track). */
  const goTo = (i: number) => {
    const l = layout()
    if (l) l.el.scrollTo({ left: Math.min(l.max, i * l.perView * l.stride), behavior: 'smooth' })
  }
  const scrollable = pages > 1

  return (
    <section className="gxt" aria-labelledby="gxt-title">
      <style href="gitex-2026-team" precedence="medium">{`
        .gxt { background: #fff; padding: clamp(44px,5.6vw,88px) 0 clamp(48px,6vw,96px); }
        .gxt-head { text-align: center; padding: 0 28px; }
        .gxt-bar { display: block; width: 52px; height: 3px; border-radius: 3px; background: #1360ee; margin: 0 auto clamp(14px,1.6vw,20px); }
        .gxt-title { margin: 0; font-weight: 700; color: #0b1a4a; letter-spacing: -.015em; font-size: max(clamp(24px,2.6vw,38px), min(2.5vw, 52px)); line-height: 1.2; }
        .gxt-sub { margin: 8px 0 0; color: #3b4a6b; font-size: max(clamp(14px,1.2vw,17px), min(1.15vw, 24px)); }

        .gxt-stage { position: relative; max-width: var(--w-1180); margin: clamp(26px,3.2vw,44px) auto 0; padding: 0 clamp(20px,4vw,64px); }
        .gxt-track {
          display: flex; gap: clamp(16px,1.8vw,26px);
          overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth;
          padding: 10px 4px 26px; scroll-padding-inline: 4px; scrollbar-width: none; -ms-overflow-style: none;
        }
        .gxt-track::-webkit-scrollbar { display: none; }
        /* Fewer posters than slots: centre them instead of leaving a gap on the right. */
        .gxt-track[data-fits="true"] { justify-content: center; }
        .gxt-slide {
          flex: 0 0 calc((100% - 2 * clamp(16px,1.8vw,26px)) / 3);
          scroll-snap-align: start; border-radius: 16px; overflow: hidden; background: #fff;
          box-shadow: 0 16px 36px -18px rgba(11,18,32,.35); border: 1px solid #edf1f7;
        }
        @media (max-width: 980px) { .gxt-slide { flex-basis: calc((100% - clamp(16px,1.8vw,26px)) / 2); } }
        @media (max-width: 620px) { .gxt-slide { flex-basis: 86%; scroll-snap-align: center; } }
        .gxt-slide img { display: block; width: 100%; height: auto; }

        .gxt-arrow {
          position: absolute; top: calc(50% - 8px); transform: translateY(-50%); z-index: 2;
          width: 44px; height: 44px; border-radius: 50%; border: 0; cursor: pointer;
          display: grid; place-items: center; color: #0b1220; background: #fff;
          box-shadow: 0 8px 22px -8px rgba(11,18,32,.4);
          transition: opacity .2s, transform .2s;
        }
        .gxt-arrow:hover { transform: translateY(-50%) scale(1.06); }
        .gxt-arrow:disabled { opacity: .35; cursor: default; transform: translateY(-50%); }
        .gxt-arrow:focus-visible, .gxt-dot:focus-visible { outline: 2px solid #1360ee; outline-offset: 2px; }
        .gxt-prev { left: clamp(0px,1vw,14px); }
        .gxt-next { right: clamp(0px,1vw,14px); }
        @media (max-width: 620px) { .gxt-arrow { display: none; } }

        .gxt-dots { display: flex; justify-content: center; gap: 8px; margin-top: 4px; }
        .gxt-dot { width: 10px; height: 6px; border-radius: 6px; border: 0; padding: 0; cursor: pointer; background: #d3dbea; transition: width .25s, background .25s; }
        .gxt-dot[aria-current="true"] { width: 22px; background: #1360ee; }
      `}</style>

      <div className="gxt-head">
        <span className="gxt-bar" aria-hidden="true" />
        <h2 id="gxt-title" className="gxt-title">Meet Our Team at GITEX</h2>
        <p className="gxt-sub">Connect with our team at GITEX Global 2026.</p>
      </div>

      <div className="gxt-stage">
        {scrollable && (
          <button type="button" className="gxt-arrow gxt-prev" aria-label="Previous team members" onClick={() => step(-1)} disabled={atStart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}
        <div ref={track} className="gxt-track" data-fits={!scrollable} role="list">
          {GITEX_TEAM.map((m) => (
            <div key={m.id} className="gxt-slide" role="listitem">
              <Image
                src={m.image}
                alt={`${m.name}, ${m.role}, is attending GITEX GLOBAL 2026 with LOCATOR at Hall S15, Stand H15-5`}
                width={1081}
                height={1350}
                sizes="(max-width: 620px) 86vw, (max-width: 980px) 45vw, 360px"
              />
            </div>
          ))}
        </div>
        {scrollable && (
          <button type="button" className="gxt-arrow gxt-next" aria-label="Next team members" onClick={() => step(1)} disabled={atEnd}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>

      {scrollable && (
        <div className="gxt-dots">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" className="gxt-dot" aria-label={`Show page ${i + 1} of ${pages}`} aria-current={i === page} onClick={() => goTo(i)} />
          ))}
        </div>
      )}
    </section>
  )
}
