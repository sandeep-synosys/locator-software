'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { GITEX_TEAM, type TeamPoster } from './gitex-2026-data'

/* "Meet Our Team at GITEX": the team's "I'm attending" posters in an infinite
   carousel. Three across on desktop, two on tablets, one on phones. A native
   scroll-snap track, so touch swipe and trackpads work; a mouse can drag it too.
   Arrows step one poster, dots jump between pages. Arrows and dots hide when
   every poster already fits.

   Infinite loop: CLONES copies of the last posters sit before the list and of
   the first posters after it (hidden from screen readers). After the last
   poster the track slides on to the copy of the first; once that slide settles
   it jumps, without animation, to the real first poster, which looks the same.
   The same happens backwards before the first poster.

   Auto-slide: starts only once the posters are at least half on screen, then
   moves one poster every AUTO_MS. It stops while the carousel is off screen or
   the tab is hidden, and any swipe, drag, wheel or click restarts the countdown
   so it never jumps right after a manual move. Visitors who prefer reduced
   motion get an instant step instead of the smooth slide. */
const AUTO_MS = 1500
const CLONES = 4 // at least the most posters in view (3) plus one

// Runs before paint in the browser, so adding the clones never flickers.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const altFor = (m: TeamPoster) =>
  `${m.name}, ${m.role}, is attending GITEX GLOBAL 2026 with LOCATOR at Hall S15, Stand H15-5`

export default function GitexTeamCarousel() {
  const N = GITEX_TEAM.length
  const K = Math.min(N, CLONES)
  const track = useRef<HTMLDivElement>(null)
  const [loop, setLoop] = useState(false)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)
  const loopRef = useRef(false)
  // Real poster at the start of the view when the clones are added.
  const startIndex = useRef(0)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const touching = useRef(false)
  // Restarts the auto-slide countdown; set while auto-slide is running.
  const restartAuto = useRef<(() => void) | null>(null)

  /* Distance between two posters (width plus gap) and how many fit in view. */
  const layout = useCallback(() => {
    const el = track.current
    const slides = el?.querySelectorAll<HTMLElement>('.gxt-slide')
    if (!el || !slides || slides.length === 0) return null
    const stride =
      slides.length > 1
        ? slides[1].offsetLeft - slides[0].offsetLeft
        : slides[0].offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)
    const perView = Math.max(1, Math.floor((el.clientWidth + 2) / stride + 0.05))
    return { el, stride, perView }
  }, [])

  const measure = useCallback(() => {
    const l = layout()
    if (!l) return
    const { el, stride, perView } = l
    const shouldLoop = N > perView
    if (shouldLoop !== loopRef.current) {
      // Remember which real poster is showing, so adding or removing the
      // clones keeps it in place.
      const idx = Math.round(el.scrollLeft / stride)
      startIndex.current = loopRef.current ? ((((idx - K) % N) + N) % N) : Math.min(N - 1, Math.max(0, idx))
      loopRef.current = shouldLoop
      setLoop(shouldLoop)
    }
    if (!shouldLoop) {
      setPages(1)
      setPage(0)
      return
    }
    const count = Math.ceil(N / perView)
    const idx = Math.round(el.scrollLeft / stride)
    const i = (((idx - K) % N) + N) % N // real poster at the start of the view
    setPages(count)
    setPage(Math.min(count - 1, Math.floor(i / perView)))
  }, [layout, N, K])

  /* Once a scroll has settled on a copy, jump by one full set (N posters) to
     the matching real poster. Instant, and the copy looks identical. */
  const settle = useCallback(() => {
    const l = layout()
    if (!l || !loopRef.current || drag.current || touching.current) return
    const { el, stride } = l
    const idx = Math.round(el.scrollLeft / stride)
    const set = N * stride
    if (idx < K) el.scrollTo({ left: el.scrollLeft + set, behavior: 'instant' })
    else if (idx >= K + N) el.scrollTo({ left: el.scrollLeft - set, behavior: 'instant' })
  }, [layout, N, K])

  // Clones were just added or removed: put the same real poster back in view.
  // An absolute position, because browsers may already have kept the view in
  // place when the clones went in.
  useIsoLayoutEffect(() => {
    const l = layout()
    if (!l) return
    const target = (loop ? K : 0) + startIndex.current
    l.el.scrollTo({ left: target * l.stride, behavior: 'instant' })
  }, [loop, layout, K])

  useEffect(() => {
    const el = track.current
    if (!el) return
    let settleTimer = 0
    const onScroll = () => {
      measure()
      // Fallback for browsers without the scrollend event.
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, 150)
    }
    const frame = requestAnimationFrame(measure)
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('scrollend', settle)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      resize.disconnect()
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', settle)
    }
  }, [measure, settle])

  const step = (dir: 1 | -1) => {
    settle()
    const l = layout()
    if (l) l.el.scrollBy({ left: dir * l.stride, behavior: 'smooth' })
  }

  /* Each dot opens the page that starts at its first poster. */
  const goTo = (p: number) => {
    settle()
    const l = layout()
    if (!l) return
    const idx = Math.round(l.el.scrollLeft / l.stride)
    l.el.scrollBy({ left: (K + p * l.perView - idx) * l.stride, behavior: 'smooth' })
  }

  /* Next poster; the loop takes care of the end. */
  const advance = useCallback(
    (instant: boolean) => {
      settle()
      const l = layout()
      // 'instant', not 'auto': the track's CSS scroll-behavior would make 'auto' smooth.
      if (l) l.el.scrollBy({ left: l.stride, behavior: instant ? 'instant' : 'smooth' })
    },
    [layout, settle],
  )

  const noteInteraction = () => {
    restartAuto.current?.()
  }

  // Auto-slide, running only while the posters are on screen.
  useEffect(() => {
    const el = track.current
    if (!el || !loop) return
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer = 0
    let onScreen = false
    const schedule = () => {
      window.clearTimeout(timer)
      if (!onScreen || document.hidden) return
      timer = window.setTimeout(() => {
        if (!drag.current && !touching.current) advance(instant)
        schedule()
      }, AUTO_MS)
    }
    restartAuto.current = schedule
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        schedule()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', schedule)
    return () => {
      window.clearTimeout(timer)
      io.disconnect()
      document.removeEventListener('visibilitychange', schedule)
      restartAuto.current = null
    }
  }, [loop, advance])

  /* Mouse drag (touch and trackpads already scroll natively). Snapping is off
     while dragging, then the track settles on the nearest poster. */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current
    if (!el || !loop || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
    el.dataset.drag = 'true'
    noteInteraction()
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current
    const d = drag.current
    if (!el || !d) return
    el.scrollLeft = d.left - (e.clientX - d.x)
  }
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current
    if (!el || !drag.current) return
    drag.current = null
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    const l = layout()
    if (l) el.scrollTo({ left: Math.round(el.scrollLeft / l.stride) * l.stride, behavior: 'smooth' })
    // Turn snapping back on once the settle animation ends, so it doesn't jump.
    let done = false
    const restore = () => {
      if (done) return
      done = true
      delete el.dataset.drag
      settle()
    }
    el.addEventListener('scrollend', restore, { once: true })
    window.setTimeout(restore, 700)
    noteInteraction()
  }

  const poster = (m: TeamPoster, key: string, clone: boolean) => (
    <div
      key={key}
      className="gxt-slide"
      role={clone ? undefined : 'listitem'}
      aria-hidden={clone ? true : undefined}
    >
      <Image
        src={m.image}
        alt={clone ? '' : altFor(m)}
        width={1081}
        height={1350}
        sizes="(max-width: 620px) 86vw, (max-width: 980px) 45vw, 360px"
        draggable={false}
      />
    </div>
  )

  return (
    <section
      className="gxt"
      aria-labelledby="gxt-title"
      aria-roledescription="carousel"
      onPointerDown={noteInteraction}
      onTouchStart={noteInteraction}
      onWheel={noteInteraction}
      onKeyDown={noteInteraction}
    >
      <style href="gitex-2026-team" precedence="medium">{`
        .gxt { background: #fff; padding: clamp(44px,5.6vw,88px) 0 clamp(48px,6vw,96px); }
        .gxt-head { text-align: center; padding: 0 28px; }
        .gxt-bar { display: block; width: 52px; height: 3px; border-radius: 3px; background: #1360ee; margin: 0 auto clamp(14px,1.6vw,20px); }
        .gxt-title { margin: 0; font-weight: 700; color: #0b1a4a; letter-spacing: -.015em; font-size: max(clamp(24px,2.6vw,38px), min(2.5vw, 52px)); line-height: 1.2; }
        .gxt-sub { margin: 8px 0 0; color: #3b4a6b; font-size: max(clamp(14px,1.2vw,17px), min(1.15vw, 24px)); }

        .gxt-stage { position: relative; max-width: var(--w-1180); margin: clamp(26px,3.2vw,44px) auto 0; padding: 0 clamp(20px,4vw,64px); }
        .gxt-track {
          display: flex; gap: clamp(16px,1.8vw,26px);
          overflow-x: auto; overflow-anchor: none; scroll-snap-type: x mandatory; scroll-behavior: smooth;
          padding: 10px 4px 26px; scroll-padding-inline: 4px; scrollbar-width: none; -ms-overflow-style: none;
        }
        .gxt-track::-webkit-scrollbar { display: none; }
        .gxt-track[data-fits="false"] { cursor: grab; }
        .gxt-track[data-drag="true"] { cursor: grabbing; scroll-snap-type: none; scroll-behavior: auto; user-select: none; }
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
        .gxt-arrow:focus-visible, .gxt-dot:focus-visible { outline: 2px solid #1360ee; outline-offset: 2px; }
        .gxt-prev { left: clamp(0px,1vw,14px); }
        .gxt-next { right: clamp(0px,1vw,14px); }
        @media (max-width: 620px) { .gxt-arrow { display: none; } }

        .gxt-dots { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 4px; padding: 0 20px; }
        .gxt-dot { width: 10px; height: 6px; border-radius: 6px; border: 0; padding: 0; cursor: pointer; background: #d3dbea; transition: width .25s, background .25s; }
        .gxt-dot[aria-current="true"] { width: 22px; background: #1360ee; }
        /* One poster per page on phones means one dot per poster: keep the row narrow. */
        @media (max-width: 620px) { .gxt-dots { gap: 6px; } .gxt-dot { width: 7px; } .gxt-dot[aria-current="true"] { width: 18px; } }
      `}</style>

      <div className="gxt-head">
        <span className="gxt-bar" aria-hidden="true" />
        <h2 id="gxt-title" className="gxt-title">Meet Our Team at GITEX</h2>
        <p className="gxt-sub">Connect with our team at GITEX Global 2026.</p>
      </div>

      <div className="gxt-stage">
        {loop && (
          <button type="button" className="gxt-arrow gxt-prev" aria-label="Previous team members" onClick={() => step(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}
        <div
          ref={track}
          className="gxt-track"
          data-fits={!loop}
          role="list"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
          onTouchStart={() => { touching.current = true }}
          onTouchEnd={() => { touching.current = false; window.setTimeout(settle, 150) }}
          onTouchCancel={() => { touching.current = false; window.setTimeout(settle, 150) }}
        >
          {loop && GITEX_TEAM.slice(N - K).map((m) => poster(m, `before-${m.id}`, true))}
          {GITEX_TEAM.map((m) => poster(m, m.id, false))}
          {loop && GITEX_TEAM.slice(0, K).map((m) => poster(m, `after-${m.id}`, true))}
        </div>
        {loop && (
          <button type="button" className="gxt-arrow gxt-next" aria-label="Next team members" onClick={() => step(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>

      {loop && (
        <div className="gxt-dots">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" className="gxt-dot" aria-label={`Show page ${i + 1} of ${pages}`} aria-current={i === page} onClick={() => goTo(i)} />
          ))}
        </div>
      )}
    </section>
  )
}
