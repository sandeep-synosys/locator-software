'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SocialCard from './SocialCard'
import {
  MEDIA_MENTIONS,
  NEWS_ITEMS,
  SOCIAL_POSTS,
  type MediaMention,
  type NewsItem,
  type SocialPost,
} from './newsroom-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const VIDEOS = NEWS_ITEMS.filter((i) => i.category === 'videos')

const SOCIAL_NETS: SocialPost['network'][] = ['linkedin', 'instagram', 'x']

/**
 * Every post from the three networks, round-robined so the unfiltered rotation
 * alternates platforms instead of running all the LinkedIn posts and then all
 * the Instagram ones. Data order is preserved within each network.
 */
const SOCIAL: SocialPost[] = (() => {
  const byNet = SOCIAL_NETS.map((n) => SOCIAL_POSTS.filter((p) => p.network === n))
  const out: SocialPost[] = []
  for (let i = 0; i < Math.max(...byNet.map((l) => l.length)); i++) {
    for (const list of byNet) if (list[i]) out.push(list[i])
  }
  return out
})()

/** How long each social post holds before the rail advances itself. */
const AUTOPLAY_MS = 3000

const TAB_LABEL: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X',
  facebook: 'Facebook',
  youtube: 'YouTube',
}

const TAB_ICON: Record<string, React.ReactNode> = {
  linkedin: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.7c0-1.36-.03-3.1-1.95-3.1-1.95 0-2.25 1.47-2.25 3v5.8H9z" />,
  instagram: <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 5.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1zm5.99-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />,
  x: <path d="M17.53 3h3.1l-6.77 7.74L21.8 21h-6.2l-4.86-6.35L5.18 21H2.07l7.24-8.28L2.2 3h6.36l4.4 5.82zm-1.09 16.1h1.72L7.63 4.8H5.79z" />,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  youtube: <path d="M23 12s0-3.8-.48-5.62a2.94 2.94 0 0 0-2.07-2.08C18.63 3.8 12 3.8 12 3.8s-6.63 0-8.45.5A2.94 2.94 0 0 0 1.48 6.4C1 8.2 1 12 1 12s0 3.8.48 5.62a2.94 2.94 0 0 0 2.07 2.08c1.82.5 8.45.5 8.45.5s6.63 0 8.45-.5a2.94 2.94 0 0 0 2.07-2.08C23 15.8 23 12 23 12zM9.8 15.4V8.6l5.9 3.4z" />,
}

/** Split a list into fixed-size pages. */
function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

const VIDEO_PAGES = chunk(VIDEOS, 3)
const MEDIA_PAGES = chunk(MEDIA_MENTIONS, 3)

/**
 * A titled column that pages through its content. The three columns differ only
 * in what they render inside, so the header rule, the edge arrows and the dot
 * row live here once rather than three times over.
 */
function Rail({
  title,
  pages,
  index,
  onIndex,
  children,
}: {
  title: string
  pages: number
  index: number
  onIndex: (i: number) => void
  children: React.ReactNode
}) {
  const go = (delta: number) => onIndex((index + delta + pages) % pages)
  return (
    <div className="nrx-col" data-reveal>
      <div className="nrx-head">
        <h2>{title}</h2>
        <a href="#newsroom-feed">View All →</a>
      </div>

      <div className="nrx-stage">
        {pages > 1 && (
          <button className="nrx-arrow nrx-arrow--prev" onClick={() => go(-1)} aria-label={`Previous ${title}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div className="nrx-page">{children}</div>
        {pages > 1 && (
          <button className="nrx-arrow nrx-arrow--next" onClick={() => go(1)} aria-label={`Next ${title}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {pages > 1 && (
        <div className="nrx-dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={`nrx-dot ${i === index ? 'is-on' : ''}`}
              onClick={() => onIndex(i)}
              aria-label={`${title}, page ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FeaturedVideo({ v }: { v: NewsItem }) {
  return (
    <a href={v.href} className="nrx-feat">
      <span className="nrx-feat-media">
        <Image src={v.image} alt="" fill sizes="(max-width: 1000px) 100vw, 380px" />
        {v.duration && <span className="nrx-dur">{v.duration}</span>}
        <span className="nrx-play"><span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>
        </span></span>
      </span>
      <span className="nrx-feat-body">
        <span className="nrx-feat-title">{v.title}</span>
        <span className="nrx-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {v.date}
        </span>
      </span>
    </a>
  )
}

function CompactVideo({ v }: { v: NewsItem }) {
  return (
    <a href={v.href} className="nrx-vid">
      <span className="nrx-vid-thumb">
        <Image src={v.image} alt="" fill sizes="96px" />
        {v.duration && <span className="nrx-dur nrx-dur--sm">{v.duration}</span>}
        <span className="nrx-play nrx-play--sm"><span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>
        </span></span>
      </span>
      <span>
        <span className="nrx-vid-title">{v.title}</span>
        <span className="nrx-date">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {v.date}
        </span>
      </span>
    </a>
  )
}

function MediaRow({ m }: { m: MediaMention }) {
  return (
    <a href={m.href} className="nrx-media">
      <span className="nrx-media-text">
        <span className="nrx-pub">{m.publication}</span>
        <span className="nrx-media-title">{m.title}</span>
        <span className="nrx-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {m.date}
        </span>
      </span>
      <span className="nrx-media-thumb">
        <Image src={m.image} alt="" fill sizes="96px" />
      </span>
    </a>
  )
}

export default function NewsroomHighlights() {
  const [vi, setVi] = useState(0)
  const [si, setSi] = useState(0)
  const [mi, setMi] = useState(0)

  /** null = show everything, cycling across all three platforms. A network
   *  value = the viewer picked a tab, so only that platform's posts rotate. */
  const [lockedNet, setLockedNet] = useState<SocialPost['network'] | null>(null)
  const [paused, setPaused] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  // True while WE are scrolling the track, so onScroll ignores its own motion.
  const selfScrollRef = useRef(false)
  const scrollSyncRef = useRef(0)

  const pool = lockedNet ? SOCIAL.filter((p) => p.network === lockedNet) : SOCIAL
  // si is clamped rather than trusted: locking to a platform shrinks the pool,
  // and the old index can easily be past its end.
  const idx = si % Math.max(pool.length, 1)
  const post = pool[idx]

  // Self-advancing rotation. It stops while the pointer is over the column so a
  // post cannot slide away mid-read, and never starts at all for viewers who
  // asked for reduced motion.
  useEffect(() => {
    if (paused || pool.length < 2) return
    if (typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setSi((n) => (n + 1) % pool.length), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, pool.length, lockedNet])

  // Drive the strip to the active slide whenever the index changes — from the
  // timer, the arrows, the dots, or a tab switch.
  useEffect(() => {
    const track = trackRef.current
    const slide = track?.children[idx] as HTMLElement | undefined
    if (!track || !slide) return
    // Centre it rather than left-align, so an equal sliver of the previous and
    // next post shows on both sides.
    const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // Guard so the programmatic scroll does not feed itself back through
    // onScroll and fight the index it was told to go to.
    selfScrollRef.current = true
    track.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
    window.clearTimeout(scrollSyncRef.current)
    scrollSyncRef.current = window.setTimeout(() => { selfScrollRef.current = false }, 600)
  }, [idx, pool.length, lockedNet])

  // Swiping the strip by hand should move the dots and the tab highlight with
  // it, so the controls never disagree with what is on screen.
  const onTrackScroll = () => {
    if (selfScrollRef.current) return
    const track = trackRef.current
    if (!track) return
    window.clearTimeout(scrollSyncRef.current)
    scrollSyncRef.current = window.setTimeout(() => {
      const mid = track.scrollLeft + track.clientWidth / 2
      let nearest = 0
      let best = Infinity
      Array.from(track.children).forEach((c, i) => {
        const el = c as HTMLElement
        const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid)
        if (d < best) { best = d; nearest = i }
      })
      setSi(nearest)
    }, 120)
  }

  // Tapping the active platform again releases the lock and returns to the
  // mixed rotation, which is the only way back without a fourth "All" tab.
  const pickNet = (n: SocialPost['network']) => {
    setLockedNet((cur) => (cur === n ? null : n))
    setSi(0)
  }

  const videoPage = VIDEO_PAGES[vi] ?? []
  const [featured, ...rest] = videoPage

  return (
    <>
      <style href="nr-newsroomhighlights" precedence="medium">{`
        .nrx { padding: clamp(44px,6vw,72px) 28px; background: #fff; border-top: 1px solid #eef2f8; }
        .nrx-inner {
          max-width: var(--w-1240); margin: 0 auto;
          display: grid; grid-template-columns: minmax(0,0.87fr) minmax(0,1.26fr) minmax(0,0.87fr);
          gap: clamp(26px,3.4vw,46px);
        }
        @media (max-width: 1000px) { .nrx-inner { grid-template-columns: minmax(0,1fr); gap: 44px; } }

        /* Grid stretches these to a common height. Making each one a flex
           column lets the stage absorb the slack, which pins all three dot rows
           to the same baseline instead of leaving them wherever their own
           content happened to end.
           Bordered, padded and lightly shadowed so the three panels read as
           separate cards rather than one continuous block — same resting
           treatment as the cards in NewsroomRail. */
        .nrx-col {
          min-width: 0; display: flex; flex-direction: column;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 18px;
          padding: clamp(18px,2.2vw,26px);
          box-shadow: 0 2px 10px rgba(11,18,32,.04);
        }

        /* Header rule is the dark 2px line under the title row in the design. */
        .nrx-head {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding-bottom: 12px; margin-bottom: 18px; border-bottom: 2px solid #0b1220;
        }
        .nrx-head h2 { margin: 0; font-size: var(--f-16); font-weight: 800; letter-spacing: -.02em; color: #0b1220; }
        .nrx-head a { font-size: var(--f-12-5); font-weight: 700; color: #1360ee; text-decoration: none; white-space: nowrap; }
        .nrx-head a:hover { text-decoration: underline; }

        /* ── Paging shell ───────────────────────────────────────────────── */
        .nrx-stage { position: relative; flex: 1; }
        .nrx-page { display: flex; flex-direction: column; gap: 14px; }

        /* Arrows straddle the column edge exactly as in the design. They are
           hidden from the a11y tree's reading order only in the sense that the
           dots below carry the same navigation with clearer labels. */
        .nrx-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 4;
          width: 32px; height: 32px; border-radius: 50%;
          display: grid; place-items: center; cursor: pointer;
          background: #fff; border: 1px solid #e6ebf4; color: #0b1220;
          box-shadow: 0 4px 14px rgba(11,18,32,.12);
          transition: background .18s ${EASE}, transform .18s ${EASE}, box-shadow .18s ${EASE};
        }
        .nrx-arrow:hover { background: #f4f8ff; box-shadow: 0 8px 20px rgba(11,18,32,.18); }
        .nrx-arrow:active { transform: translateY(-50%) scale(.94); }
        .nrx-arrow--prev { left: -15px; }
        .nrx-arrow--next { right: -15px; }
        @media (max-width: 1000px) {
          .nrx-arrow--prev { left: -6px; }
          .nrx-arrow--next { right: -6px; }
        }

        /* margin-top:auto is what actually pushes the row to the bottom of the
           column once the stage above has taken the free space. */
        .nrx-dots { display: flex; justify-content: center; gap: 7px; margin-top: auto; padding-top: 18px; }
        .nrx-dot {
          width: 7px; height: 7px; padding: 0; border-radius: 50%; cursor: pointer;
          border: 0; background: #d7dee9; transition: background .18s ${EASE}, width .18s ${EASE};
        }
        .nrx-dot.is-on { background: #1360ee; width: 18px; border-radius: 999px; }

        /* ── Shared bits ────────────────────────────────────────────────── */
        .nrx-date {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: var(--f-11-5); color: #97a1b3;
        }
        .nrx-date svg { flex-shrink: 0; opacity: .8; }

        .nrx-dur {
          position: absolute; left: 8px; bottom: 8px; z-index: 3;
          font-size: var(--f-10-5); font-weight: 700; color: #fff;
          background: rgba(11,18,32,.82); padding: 3px 6px; border-radius: 5px;
        }
        .nrx-dur--sm { left: 5px; bottom: 5px; padding: 2px 4px; font-size: var(--f-9-5); }

        .nrx-play { position: absolute; inset: 0; display: grid; place-items: center; z-index: 2; }
        .nrx-play span {
          width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
          background: rgba(255,255,255,.94); color: #0b1220;
          box-shadow: 0 6px 18px rgba(0,0,0,.34);
          transition: transform .22s ${EASE};
        }
        .nrx-play--sm span { width: 26px; height: 26px; box-shadow: 0 4px 12px rgba(0,0,0,.3); }

        /* ── Featured video card ────────────────────────────────────────── */
        .nrx-feat {
          display: block; text-decoration: none; overflow: hidden;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 14px;
          box-shadow: 0 10px 26px -22px rgba(11,18,32,.5);
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        .nrx-feat:hover { transform: translateY(-3px); border-color: #d7e3f8; box-shadow: 0 18px 36px -22px rgba(11,18,32,.55); }
        .nrx-feat-media { position: relative; display: block; aspect-ratio: 16 / 11; background: #0b1220; overflow: hidden; }
        .nrx-feat-media img { object-fit: cover; transition: transform .4s ${EASE}; }
        .nrx-feat:hover .nrx-feat-media img { transform: scale(1.05); }
        .nrx-feat:hover .nrx-play span { transform: scale(1.08); }
        .nrx-feat-body { display: block; padding: 14px 15px 15px; }
        .nrx-feat-title {
          display: block; margin-bottom: 8px;
          font-size: var(--f-14); font-weight: 800; line-height: 1.35;
          letter-spacing: -.015em; color: #0b1220;
        }

        /* ── Compact video row ──────────────────────────────────────────── */
        .nrx-vid {
          display: grid; grid-template-columns: 96px minmax(0,1fr); gap: 12px; align-items: center;
          padding: 7px; border-radius: 12px; text-decoration: none;
          transition: background .18s ${EASE};
        }
        .nrx-vid:hover { background: #f5f8fe; }
        .nrx-vid-thumb { position: relative; display: block; aspect-ratio: 16 / 11; border-radius: 10px; overflow: hidden; background: #0b1220; }
        .nrx-vid-thumb img { object-fit: cover; }
        .nrx-vid-title {
          display: block; margin-bottom: 5px;
          font-size: var(--f-12-8); font-weight: 800; line-height: 1.35;
          letter-spacing: -.01em; color: #0b1220;
        }

        /* ── Social column ──────────────────────────────────────────────── */
        /* The card itself is SocialCard, the same component the feed uses, so
           the LinkedIn / Instagram / X chrome stays correct per network without
           this file duplicating any of it. */
        /* ── The sliding strip ──────────────────────────────────────────────
           A scroll-snap rail rather than a translated row. The browser owns the
           easing and the snapping, touch swipe comes free, and overflow-x keeps
           the peeking neighbours inside this column — they never reach across
           into Videos or Media.

           Slides are 84% wide, so 8% of the previous and next post shows at
           each edge. scroll-padding matches that inset, which is what makes a
           snapped card land centred rather than flush left. */
        .nrx-track {
          display: flex;
          gap: 3%;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 8%;
          padding-inline: 8%;
          /* The rail is the scroller, so its own scrollbar has to go. */
          scrollbar-width: none;
          -ms-overflow-style: none;
          /* Row of equal-height cards: the tallest post sets the height once,
             so the strip does not resize as it moves. */
          align-items: stretch;
        }
        .nrx-track::-webkit-scrollbar { display: none; }

        .nrx-slide {
          flex: 0 0 84%;
          scroll-snap-align: center;
          /* Off-centre posts sit back a little, which is what reads as depth
             rather than three cards in a row. */
          opacity: .42;
          transform: scale(.94);
          transition: opacity .6s ${EASE}, transform .6s ${EASE};
        }
        .nrx-slide.is-on { opacity: 1; transform: none; }
        // .nrx-slide > * { height: 100%; }
        .nrx-slide > * {
          height: auto;
        }

        @media (max-width: 1000px) {
          /* Stacked, the column is far wider, so a tighter slide keeps the
             neighbours from becoming half-cards. */
          .nrx-slide { flex-basis: 78%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nrx-track { scroll-behavior: auto; }
          .nrx-slide { transition: none; }
        }

        .nrx-tabs {
          display: flex; justify-content: center; gap: 4px;
          margin-top: 14px; border-top: 1px solid #eef2f8; padding-top: 4px;
        }
        .nrx-tab {
          border: 0; background: transparent; cursor: pointer; padding: 10px 18px;
          color: #9aa4b6; border-bottom: 2px solid transparent; margin-bottom: -1px;
          display: grid; place-items: center;
          transition: color .18s ${EASE}, border-color .18s ${EASE};
        }
        .nrx-tab:hover { color: #5b6474; }
        .nrx-tab.is-on { color: #1360ee; border-bottom-color: #1360ee; }
        /* Locked is deliberately heavier than "currently showing": one is a
           filter the viewer set, the other is just where the rotation is. */
        .nrx-tab.is-locked { background: rgba(19,96,238,.07); border-radius: 8px 8px 0 0; }

        /* ── Media coverage row ─────────────────────────────────────────── */
        .nrx-media {
          display: grid; grid-template-columns: minmax(0,1fr) clamp(104px,9vw,132px); gap: 16px; align-items: center;
          padding: 16px 8px; text-decoration: none;
          border-bottom: 1px solid #f0f3f9;
          transition: background .18s ${EASE};
        }
        .nrx-media:last-child { border-bottom: 0; }
        .nrx-media:hover { background: #f5f8fe; }
        .nrx-media-text { display: block; min-width: 0; }
        .nrx-pub {
          display: inline-block; margin-bottom: 9px;
          font-size: var(--f-10); font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
          color: #475569; background: #f4f7fc; border: 1px solid #e6ebf4;
          padding: 5px 9px; border-radius: 6px;
        }
        .nrx-media-title {
          display: block; margin-bottom: 7px;
          font-size: var(--f-13-5); font-weight: 800; line-height: 1.38;
          letter-spacing: -.015em; color: #0b1220;
        }
        /* 4:3 rather than square, and appreciably wider — press photos are
           landscape, and a square crop was cutting the subject out of them. */
        .nrx-media-thumb {
          position: relative; display: block; aspect-ratio: 4 / 3;
          border-radius: 12px; overflow: hidden; background: #0b1220;
          box-shadow: 0 6px 16px -12px rgba(11,18,32,.6);
        }
        .nrx-media-thumb img { object-fit: cover; transition: transform .35s ${EASE}; }
        .nrx-media:hover .nrx-media-thumb img { transform: scale(1.06); }

        @media (prefers-reduced-motion: reduce) {
          .nrx-feat, .nrx-feat-media img, .nrx-play span, .nrx-media-thumb img, .nrx-arrow { transition: none; }
        }
      `}</style>

      <section className="nrx">
        <div className="nrx-inner">

          {/* ── Customer review videos ── */}
          <Rail title="Customer Review Videos" pages={VIDEO_PAGES.length} index={vi} onIndex={setVi}>
            {featured && <FeaturedVideo v={featured} />}
            {rest.map((v) => <CompactVideo key={v.id} v={v} />)}
          </Rail>

          {/* ── Live from social ──
              Hovering holds the rotation: these posts are meant to be read, and
              a card sliding out mid-sentence is worse than a slow carousel. */}
          <div
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <Rail title="Live from Social" pages={pool.length} index={idx} onIndex={setSi}>
              {/* A real horizontal track, not a swap.
                  Every post is laid out side by side and the strip scrolls
                  between them, so neighbours genuinely slide in and out and a
                  sliver of the previous and next post shows at either edge.

                  Built on scroll-snap rather than a translated flex row: the
                  browser does the easing, it snaps to whole cards on its own,
                  and touch swipe works with no extra code. It also clips inside
                  the column, so the peeking neighbours never reach across into
                  the Videos or Media columns. */}
              <div
                className="nrx-track"
                ref={trackRef}
                onScroll={onTrackScroll}
                role="group"
                aria-label="Social posts"
              >
                {pool.map((p, i) => (
                  <div
                    key={p.id}
                    className={`nrx-slide ${i === idx ? 'is-on' : ''}`}
                    aria-hidden={i !== idx}
                  >
                    {/* Shorter than the feed's default 210: this column is about
                        a third the width, so the same string ran far longer. */}
                    <SocialCard post={p}/>
                  </div> 
                ))}
              </div>
              <div className="nrx-tabs">
                {SOCIAL_NETS.map((n) => {
                  // Lit when the viewer locked this platform, and also when the
                  // mixed rotation happens to be showing it — so the strip always
                  // says which network you are looking at.
                  const on = lockedNet ? lockedNet === n : post?.network === n
                  return (
                    <button
                      key={n}
                      className={`nrx-tab ${on ? 'is-on' : ''} ${lockedNet === n ? 'is-locked' : ''}`}
                      onClick={() => pickNet(n)}
                      aria-label={
                        lockedNet === n
                          ? `Showing ${TAB_LABEL[n]} only — tap to show all networks`
                          : `Show ${TAB_LABEL[n]} posts only`
                      }
                      aria-pressed={lockedNet === n}
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">{TAB_ICON[n]}</svg>
                    </button>
                  )
                })}
              </div>
            </Rail>
          </div>

          {/* ── Media coverage ── */}
          <Rail title="Media Coverage" pages={MEDIA_PAGES.length} index={mi} onIndex={setMi}>
            {(MEDIA_PAGES[mi] ?? []).map((m) => <MediaRow key={m.id} m={m} />)}
          </Rail>

        </div>
      </section>
    </>
  )
}
