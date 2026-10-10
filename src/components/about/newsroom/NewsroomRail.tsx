'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { LIVE_UPDATES, NEWS_ITEMS, formatAgo, type LiveUpdate } from './newsroom-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// Live Updates panel: shows ONE notification at a time. Each tick the settled
// card rises up and away while the next one rises up into place from below —
// the same push-notification queue used by the phone mockup in the software
// hero (HeroNotificationPhone.tsx), not a swap in place.
const VISIBLE = 1
const ROTATE_MS = 4000

/**
 * Notification-queue cursor — a monotonically increasing counter, not an
 * index into the array. Same mechanism as HeroNotificationPhone's `cursor`:
 * each render derives a small window from it (the settled card, plus for one
 * beat the card that just aged out), so every rotation mounts a genuinely new
 * node — with a unique key — for both the arriving and the leaving card,
 * which is what lets each play its own CSS animation rather than the DOM node
 * being reused in place. Pauses while the panel is hovered/focused so a link
 * is never a moving target.
 */
function useNotificationCursor(count: number) {
  const [cursor, setCursor] = useState(0)
  const pausedRef = useRef(false)
  useEffect(() => {
    if (count <= VISIBLE) return
    const id = setInterval(() => {
      if (!pausedRef.current) setCursor((c) => c + 1)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [count])
  return { cursor, pausedRef }
}

/**
 * Seconds elapsed since mount, ticking once per second.
 *
 * Starts at 0 so the server-rendered markup and the first client render agree
 * (a Date.now() seed would hydrate-mismatch); the clock only starts after
 * mount, which is also when the timestamps begin to age.
 */
function useElapsed() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return elapsed
}

// Each live-update kind gets its own glyph + brand tint so the panel scans
// like a notification feed rather than a list of identical rows.
// `linkedin` keeps LinkedIn's own blue — that one names a platform, and stripping
// its brand colour would make it unrecognisable. The rest are content kinds, not
// brands, so they take the site's blues.
const KIND_STYLE: Record<LiveUpdate['kind'], { bg: string; fg: string }> = {
  release: { bg: '#1360ee', fg: '#fff' },
  video: { bg: '#0d4fd4', fg: '#fff' },
  linkedin: { bg: '#0b40b8', fg: '#fff' },
  webinar: { bg: '#2d7ff9', fg: '#fff' },
  event: { bg: '#4d94ff', fg: '#fff' },
}

function KindIcon({ kind }: { kind: LiveUpdate['kind'] }) {
  const p = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'release':
      return <svg {...p}><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></svg>
    case 'video':
      return <svg {...p} fill="currentColor" stroke="none"><path d="M8 5v14l11-7L8 5Z" /></svg>
    case 'linkedin':
      return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.44-.03-3.3-2-3.3-2 0-2.3 1.56-2.3 3.2V21h-4V9Z" /></svg>
    case 'webinar':
      return <svg {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
    case 'event':
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
  }
}

const REVIEW_VIDEOS = NEWS_ITEMS.filter((i) => i.category === 'videos').slice(0, 3)

/**
 * The card's insides. Shared by the visible queue and by the invisible sizer
 * underneath it, so the two can never drift apart — if this markup changes,
 * the measured height changes with it automatically.
 *
 * `elapsed` is only passed for the live copies. The sizer renders the raw
 * seconds instead, because its job is to be the tallest possible box, not to
 * be correct — and a re-rendering timestamp inside a hidden element would be
 * wasted work every second.
 */
function LiveCardBody({ u, elapsed = 0 }: { u: LiveUpdate; elapsed?: number }) {
  const s = KIND_STYLE[u.kind]
  return (
    <>
      <span className="nrr-ico" style={{ background: s.bg, color: s.fg }}>
        <KindIcon kind={u.kind} />
      </span>
      <div>
        <div className="nrr-meta">
          <span className="nrr-src">Locator</span>
          <span className="nrr-time">{formatAgo(u.secondsAgo + elapsed)}</span>
        </div>
        <p className="nrr-title">{u.title}</p>
        <p className="nrr-body">{u.body}</p>
        <span className="nrr-cta">{u.cta} →</span>
      </div>
    </>
  )
}

export default function NewsroomRail() {
  const elapsed = useElapsed()
  const { cursor, pausedRef } = useNotificationCursor(LIVE_UPDATES.length)
  // "View all updates" expands the panel into the full scrollable list.
  const [expanded, setExpanded] = useState(false)

  // Rotating a card nobody is looking at is wasted, and worse, it would keep
  // re-animating behind the open list. Reuses the same pause ref the
  // hover/focus handlers drive, so the two cannot fight each other.
  useEffect(() => {
    pausedRef.current = expanded
  }, [expanded, pausedRef])

  // One settled slot, plus — for one beat, starting from the first rotation —
  // the slot that just aged out, so it has something to animate away on
  // instead of vanishing. Skipped entirely on the very first render (cursor
  // 0): with nothing having left yet there is no card to show leaving, and
  // rendering one anyway would flash a stray notification on load.
  const slots = (cursor === 0 ? [1] : [0, 1]).map((k) => {
    const seq = cursor + k - 1
    const idx = ((seq % LIVE_UPDATES.length) + LIVE_UPDATES.length) % LIVE_UPDATES.length
    return { seq, item: LIVE_UPDATES[idx], leaving: k === 0 }
  })

  return (
    <>
      <style href="nr-newsroomrail" precedence="medium">{`
        /* Deliberately no [data-reveal] on this rail. ScrollReveal's hidden
           state is opacity:0 until an IntersectionObserver fires, and it only
           scans the DOM once on mount — so any hydration or timing hiccup
           leaves the rail permanently invisible. It always renders. */
        .nrr { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 88px; }
        /* Must match the breakpoint where .nrb-cols stops being two columns. */
        @media (max-width: 820px) { .nrr { position: static; } }

        .nrr-card { border: 1px solid #e7ecf6; border-radius: 16px; background: #fff; box-shadow: 0 2px 10px rgba(11,18,32,.03); overflow: hidden; }
        .nrr-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 17px 18px 12px; }
        .nrr-head h3 { margin: 0; font-size: var(--f-15-5); font-weight: 800; letter-spacing: -.018em; color: #0b1220; white-space: nowrap; }

        .nrr-live-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: var(--f-10-5); font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
          color: #22a06b; background: rgba(34,160,107,.1); padding: 4px 9px; border-radius: 999px;
        }
        .nrr-live-pill i { width: 6px; height: 6px; border-radius: 50%; background: #22a06b; animation: nrr-blink 1.6s ease-in-out infinite; }
        @keyframes nrr-blink { 50% { opacity: .25; } }
        @media (prefers-reduced-motion: reduce) { .nrr-live-pill i { animation: none; } }

        .nrr-viewall { font-size: var(--f-12); font-weight: 700; color: #1360ee; text-decoration: none; white-space: nowrap; }
        .nrr-viewall:hover { text-decoration: underline; }

        .nrr-list { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 8px; }

        /* ── Live notification queue ──
           One card visible at a time. Each tick the settled card fades out as
           it drifts up and away, while the next fades in drifting up into its
           place — the same push-notification queue the software hero's phone
           mockup runs (HeroNotificationPhone.tsx).

           THE LAYOUT RULE, which is the whole design of this block: nothing
           here may change the panel's height, because the Customer Review
           Videos card sits directly underneath and would be shoved by it.
           So:
             · both cards are position:absolute — out of flow entirely, so two
               being mounted at once during a transition costs no height;
             · the height comes from .nrr-notif-sizer, an invisible copy of
               every update stacked in one grid cell, so the panel is always
               as tall as the TALLEST card and never resizes when a short
               update follows a long one;
             · the animations touch ONLY opacity and transform. Both are
               composited — no reflow, no repaint of anything around them.
           An earlier pass animated max-height and margin-bottom to collapse
           the outgoing row. That is what was pushing the sections below on
           every rotation; there is deliberately no layout property left in
           the keyframes now. */
        .nrr-notif { position: relative; padding: 8px 12px 14px; }

        .nrr-notif-sizer {
          display: grid;
          visibility: hidden;
          pointer-events: none;
        }
        /* All in one cell, so the row resolves to the tallest of them. */
        .nrr-notif-sizer > * { grid-area: 1 / 1; }

        /* Overlays the sizer exactly, inset by .nrr-notif's own padding. */
        .nrr-notif-stack { position: absolute; inset: 8px 12px 14px; }
        .nrr-notif-stack > .nrr-item {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          /* Promoted for the duration of the move so the two cross-fading
             cards composite on their own layers instead of forcing a paint. */
          will-change: transform, opacity;
        }

        /* Both directions travel the same way — upward — so the pair reads as
           one continuous movement rather than two separate effects. The
           distance is deliberately a real journey (34-38px, around a quarter
           of the card's own height) so it reads as a notification being
           replaced rather than a value blinking.
           Opacity finishes AHEAD of the travel in both: the outgoing card is
           fully transparent by 70%, so the last of its climb happens unseen
           and it never visibly crosses the "Live Updates" heading above; the
           incoming one is fully opaque by 55%, so its final approach is a
           clean glide with no fading left to distract from it.
           translate3d keeps both on the compositor. */
        @keyframes nrrNotifIn {
          0%   { opacity: 0; transform: translate3d(0, 38px, 0); }
          55%  { opacity: 1; }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes nrrNotifOut {
          0%   { opacity: 1; transform: translate3d(0, 0, 0); }
          70%  { opacity: 0; }
          100% { opacity: 0; transform: translate3d(0, -34px, 0); }
        }

        /* A HANDOFF, not a dissolve. Both cards occupy the same spot, so on a
           shared clock there would be a stretch in the middle where two
           different headlines sit on top of each other at half opacity each —
           legible enough to read as a smudge rather than as one notification
           replacing another.
           So the outgoing card leaves first on an ease-IN, accelerating away
           as it goes; the incoming one starts once that has cleared, on a long
           ease-OUT that decelerates into place. The 300ms offset is what keeps
           them from ever being bright at the same time.
           Unhurried on purpose: 520ms out, 780ms in, ~1.08s end to end. That
           is the pace that reads as considered rather than twitchy, and it
           still finishes with most of the 4s tick to spare. */
        .nrr-notif-stack > .nrr-item {
          /* fill-mode backwards, NOT both: the end state is the card's own
             resting state, so letting the animation keep hold of it after it
             finishes would out-rank the :hover transform below and kill the
             lift. backwards still applies the from-state through the delay,
             which is what holds this card invisible until its turn. */
          animation: nrrNotifIn .78s cubic-bezier(.16, 1, .3, 1) .3s backwards;
        }
        .nrr-notif-stack > .nrr-item.is-leaving {
          /* fill-mode forwards here — this one must hold its faded-out state
             until React unmounts it on the next tick, or it snaps back to
             full opacity for a frame. */
          animation: nrrNotifOut .52s cubic-bezier(.4, 0, .75, .45) forwards;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .nrr-notif-stack > .nrr-item { animation: none; }
          .nrr-notif-stack > .nrr-item.is-leaving { display: none; }
        }

        .nrr-item {
          display: grid; grid-template-columns: 32px minmax(0,1fr); gap: 11px;
          padding: 12px; border-radius: 14px; border: 1px solid #eef2f8; background: #fbfcfe;
          text-decoration: none; box-shadow: 0 1px 2px rgba(11,18,32,.03);
          transition: border-color .22s ${EASE}, background .22s ${EASE}, transform .22s ${EASE}, box-shadow .22s ${EASE};
        }
        .nrr-item:hover { border-color: #cfdcf5; background: #fff; transform: translateY(-2px); box-shadow: 0 10px 24px -12px rgba(19,96,238,.35); }

        .nrr-ico { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; }

        .nrr-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
        .nrr-src { font-size: var(--f-9-5); font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #97a1b3; }
        .nrr-time { font-size: var(--f-10-5); color: #a7b0c0; white-space: nowrap; }

        .nrr-title { margin: 0 0 3px; font-size: var(--f-13-5); font-weight: 750; letter-spacing: -.012em; color: #0b1220; line-height: 1.34; }
        .nrr-body { margin: 0 0 8px; font-size: var(--f-12); line-height: 1.52; color: #7a8394; }
        .nrr-cta { font-size: var(--f-12-5); font-weight: 700; color: #1360ee; }
        .nrr-item:hover .nrr-cta { text-decoration: underline; }

        /* ── Expanded "all updates" list ──
           0fr -> 1fr on a single grid row is the trick that makes this
           animate to its own natural height. max-height cannot: you have to
           guess a number, and the transition then either clips the content or
           spends most of its time crossing empty space at the wrong speed.
           min-height:0 on the child is required — grid items default to
           min-content, which would refuse to shrink to 0fr. */
        .nrr-all {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .42s ${EASE};
        }
        .nrr-all.is-open { grid-template-rows: 1fr; }
        .nrr-all-clip { overflow: hidden; min-height: 0; }

        .nrr-all-list {
          list-style: none; margin: 0;
          padding: 8px 12px 4px;
          display: flex; flex-direction: column; gap: 8px;
          /* The scroll itself. Capped in vh so it stays usable on short
             viewports instead of running the sticky rail off the screen. */
          max-height: min(46vh, 420px);
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: #cfd8e8 transparent;
        }
        .nrr-all-list::-webkit-scrollbar { width: 6px; }
        .nrr-all-list::-webkit-scrollbar-thumb { background: #cfd8e8; border-radius: 3px; }
        .nrr-all-list::-webkit-scrollbar-track { background: transparent; }
        /* Cards in the list must not lift on hover — inside a scroll container
           a translate just clips against the edge. Colour change only. */
        .nrr-all-list .nrr-item:hover { transform: none; box-shadow: 0 1px 2px rgba(11,18,32,.03); }

        .nrr-foot { padding: 0 12px 14px; }
        .nrr-foot button {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; font-family: inherit; border: none; cursor: pointer;
          text-align: center; padding: 11px; border-radius: 10px;
          font-size: var(--f-12-5); font-weight: 700; color: #1360ee;
          background: rgba(19,96,238,.06); transition: background .18s ${EASE};
        }
        .nrr-foot button:hover { background: rgba(19,96,238,.12); }
        .nrr-foot-chev { display: inline-flex; transition: transform .32s ${EASE}; }
        .nrr-foot-chev.is-up { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
          .nrr-all, .nrr-foot-chev { transition: none; }
        }

        /* ── Customer review videos ── */
        .nrr-vid {
          display: grid; grid-template-columns: 100px minmax(0,1fr); gap: 11px; align-items: center;
          padding: 10px; border-radius: 12px; text-decoration: none;
          transition: background .18s ${EASE};
        }
        .nrr-vid:hover { background: #f5f8fe; }
        .nrr-thumb { position: relative; aspect-ratio: 16 / 11; border-radius: 10px; overflow: hidden; background: #0b1220; }
        .nrr-thumb img { object-fit: cover; opacity: .88; transition: transform .3s ${EASE}, opacity .2s ${EASE}; }
        .nrr-vid:hover .nrr-thumb img { transform: scale(1.06); opacity: 1; }
        .nrr-play {
          position: absolute; inset: 0; display: grid; place-items: center; color: #fff;
        }
        .nrr-play span {
          width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
          background: rgba(255,255,255,.9); color: #0b1220; box-shadow: 0 4px 12px rgba(0,0,0,.3);
        }
        .nrr-dur {
          position: absolute; left: 5px; bottom: 5px; z-index: 2;
          font-size: var(--f-9-5); font-weight: 700; color: #fff;
          background: rgba(0,0,0,.72); padding: 2px 5px; border-radius: 4px;
        }
        .nrr-vid-title { margin: 0; font-size: var(--f-12-5); font-weight: 700; line-height: 1.4; color: #2b3446; }
      `}</style>

      <aside className="nrr">
        <div className="nrr-card">
          <div className="nrr-head">
            <h3>Live Updates</h3>
            <span className="nrr-live-pill"><i />Live</span>
          </div>
          {/* The rotating single-card view. Hidden outright while the full
              list is open — `hidden` rather than a CSS class so the cards are
              also out of the accessibility tree and the tab order, not merely
              invisible. */}
          <div
            className="nrr-notif"
            hidden={expanded}
            onMouseEnter={() => { if (!expanded) pausedRef.current = true }}
            onMouseLeave={() => { if (!expanded) pausedRef.current = false }}
            onFocusCapture={() => { if (!expanded) pausedRef.current = true }}
            onBlurCapture={() => { if (!expanded) pausedRef.current = false }}
          >
            {/* Sizer. Every update rendered at once, all stacked into a single
                grid cell, `visibility: hidden`. It takes up space but paints
                nothing, so the panel's height is always the height of the
                TALLEST card at the current width — which is what stops the
                Customer Review Videos card below from moving when a shorter
                update follows a taller one. Static markup, so it is correct on
                the server's first paint with no measuring and no JS. */}
            <div className="nrr-notif-sizer" aria-hidden="true">
              {LIVE_UPDATES.map((u) => (
                <div key={u.id} className="nrr-item">
                  <LiveCardBody u={u} />
                </div>
              ))}
            </div>

            <div className="nrr-notif-stack">
              {slots.map(({ seq, item: u, leaving }) => (
                <a
                  key={seq}
                  href={u.href}
                  className={`nrr-item${leaving ? ' is-leaving' : ''}`}
                  tabIndex={leaving ? -1 : undefined}
                  aria-hidden={leaving || undefined}
                >
                  <LiveCardBody u={u} elapsed={elapsed} />
                </a>
              ))}
            </div>
          </div>
          {/* The full list. Always mounted so opening it is a pure CSS
              transition with nothing to lay out first; `grid-template-rows:
              0fr -> 1fr` is what lets it animate to its OWN height without a
              hard-coded max-height that would either clip long content or
              leave the panel short. The inner element carries the scroll. */}
          <div className={`nrr-all${expanded ? ' is-open' : ''}`}>
            <div className="nrr-all-clip">
              <ul className="nrr-all-list">
                {LIVE_UPDATES.map((u) => (
                  <li key={u.id}>
                    <a
                      href={u.href}
                      className="nrr-item"
                      tabIndex={expanded ? undefined : -1}
                    >
                      <LiveCardBody u={u} elapsed={elapsed} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="nrr-foot">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : `View all updates (${LIVE_UPDATES.length})`}
              <span className={`nrr-foot-chev${expanded ? ' is-up' : ''}`} aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* <div className="nrr-card">
          <div className="nrr-head">
            <h3>Customer Review Videos</h3>
            <a className="nrr-viewall" href="#newsroom-feed">View All →</a>
          </div>
          <div className="nrr-list">
            {REVIEW_VIDEOS.map((v) => (
              <a key={v.id} href={v.href} className="nrr-vid">
                <div className="nrr-thumb">
                  <Image src={v.image} alt="" fill sizes="100px" />
                  <span className="nrr-play"><span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>
                  </span></span>
                  {v.duration && <span className="nrr-dur">{v.duration}</span>}
                </div>
                <p className="nrr-vid-title">{v.title}</p>
              </a>
            ))}
          </div>
        </div> */}
      </aside>
    </>
  )
}
