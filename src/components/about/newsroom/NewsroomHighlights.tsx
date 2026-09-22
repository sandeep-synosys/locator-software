'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import SocialCard from './SocialCard'

import {
  MEDIA_MENTIONS,
  SOCIAL_POSTS,
  type MediaMention,
  type SocialPost,
} from './newsroom-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const SOCIAL_NETS: SocialPost['network'][] = [
  'linkedin',
  'instagram',
  'x',
]

/**
 * Round-robin the social posts so the mixed feed alternates
 * between LinkedIn, Instagram and X.
 */
const SOCIAL: SocialPost[] = (() => {
  const byNet = SOCIAL_NETS.map((network) =>
    SOCIAL_POSTS.filter((post) => post.network === network)
  )

  const result: SocialPost[] = []

  for (
    let i = 0;
    i < Math.max(...byNet.map((list) => list.length));
    i++
  ) {
    for (const list of byNet) {
      if (list[i]) {
        result.push(list[i])
      }
    }
  }

  return result
})()

const AUTOPLAY_MS = 3000

const TAB_LABEL: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X',
  facebook: 'Facebook',
  youtube: 'YouTube',
}

const TAB_ICON: Record<string, React.ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.7c0-1.36-.03-3.1-1.95-3.1-1.95 0-2.25 1.47-2.25 3v5.8H9z" />
  ),

  instagram: (
    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.56-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 5.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1zm5.99-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
  ),

  x: (
    <path d="M17.53 3h3.1l-6.77 7.74L21.8 21h-6.2l-4.86-6.35L5.18 21H2.07l7.24-8.28L2.2 3h6.36l4.4 5.82zm-1.09 16.1h1.72L7.63 4.8H5.79z" />
  ),

  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),

  youtube: (
    <path d="M23 12s0-3.8-.48-5.62a2.94 2.94 0 0 0-2.07-2.08C18.63 3.8 12 3.8 12 3.8s-6.63 0-8.45.5A2.94 2.94 0 0 0 1.48 6.4C1 8.2 1 12 1 12s0 3.8.48 5.62a2.94 2.94 0 0 0 2.07 2.08c1.82.5 8.45.5 8.45.5s6.63 0 8.45-.5a2.94 2.94 0 0 0 2.07-2.08C23 15.8 23 12 23 12zM9.8 15.4V8.6l5.9 3.4z" />
  ),
}

function chunk<T>(list: T[], size: number): T[][] {
  const result: T[][] = []

  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size))
  }

  return result
}

const MEDIA_PAGES = chunk(MEDIA_MENTIONS, 3)

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
  onIndex: (index: number) => void
  children: React.ReactNode
}) {
  const go = (delta: number) => {
    if (!pages) return

    onIndex((index + delta + pages) % pages)
  }

  return (
    <div className="nrx-col" data-reveal>
      <div className="nrx-head">
        <h2>{title}</h2>

        <a href="#newsroom-feed">
          View All →
        </a>
      </div>

      <div className="nrx-stage">
        {pages > 1 && (
          <button
            className="nrx-arrow nrx-arrow--prev"
            onClick={() => go(-1)}
            aria-label={`Previous ${title}`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="nrx-page">
          {children}
        </div>

        {pages > 1 && (
          <button
            className="nrx-arrow nrx-arrow--next"
            onClick={() => go(1)}
            aria-label={`Next ${title}`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
              className={`nrx-dot ${
                i === index ? 'is-on' : ''
              }`}
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

function MediaRow({
  m,
}: {
  m: MediaMention
}) {
  return (
    <a
      href={m.href}
      className="nrx-media"
    >
      <span className="nrx-media-text">
        <span className="nrx-pub">
          {m.publication}
        </span>

        <span className="nrx-media-title">
          {m.title}
        </span>

        <span className="nrx-date">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
            />

            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>

          {m.date}
        </span>
      </span>

      <span className="nrx-media-thumb">
        <Image
          src={m.image}
          alt=""
          fill
          sizes="132px"
        />
      </span>
    </a>
  )
}

export default function NewsroomHighlights() {
  const [si, setSi] = useState(0)
  const [mi, setMi] = useState(0)

  const [lockedNet, setLockedNet] =
    useState<SocialPost['network'] | null>(null)

  const [paused, setPaused] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)

  const selfScrollRef = useRef(false)
  const scrollSyncRef = useRef(0)

  const pool = lockedNet
    ? SOCIAL.filter(
        (post) => post.network === lockedNet
      )
    : SOCIAL

  const idx =
    pool.length > 0
      ? si % pool.length
      : 0

  const post = pool[idx]

  /*
   * Automatic social rotation.
   */
  useEffect(() => {
    if (paused || pool.length < 2) {
      return
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return
    }

    const timer = setInterval(() => {
      setSi((current) => {
        return (current + 1) % pool.length
      })
    }, AUTOPLAY_MS)

    return () => clearInterval(timer)
  }, [
    paused,
    pool.length,
    lockedNet,
  ])

  /*
   * Move the active card into the center of the
   * variable-width carousel.
   *
   * Each SocialCard's width depends on its image's real aspect
   * ratio, which is only known after the <img> finishes loading —
   * so a card can change width slightly after it's already been
   * centered. A ResizeObserver on the active slide re-runs the
   * same centering logic whenever that happens, so wide landscape
   * cards and narrow portrait cards both end up properly centered
   * once their image has loaded, not just on the placeholder size.
   */
  useEffect(() => {
    const track = trackRef.current

    const slide =
      track?.children[idx] as HTMLElement | undefined

    if (!track || !slide) {
      return
    }

    const center = () => {
      const left =
        slide.offsetLeft -
        (track.clientWidth - slide.clientWidth) / 2

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.(
          '(prefers-reduced-motion: reduce)'
        ).matches

      selfScrollRef.current = true

      track.scrollTo({
        left,
        behavior: reduced ? 'auto' : 'smooth',
      })

      window.clearTimeout(
        scrollSyncRef.current
      )

      scrollSyncRef.current = window.setTimeout(
        () => {
          selfScrollRef.current = false
        },
        600
      )
    }

    center()

    const observer = new ResizeObserver(center)
    observer.observe(slide)

    return () => observer.disconnect()
  }, [
    idx,
    pool.length,
    lockedNet,
  ])

  /*
   * Update active index when the user manually
   * swipes the carousel.
   */
  const onTrackScroll = () => {
    if (selfScrollRef.current) {
      return
    }

    const track = trackRef.current

    if (!track) {
      return
    }

    window.clearTimeout(
      scrollSyncRef.current
    )

    scrollSyncRef.current = window.setTimeout(
      () => {
        const middle =
          track.scrollLeft +
          track.clientWidth / 2

        let nearest = 0
        let closestDistance = Infinity

        Array.from(track.children).forEach(
          (child, i) => {
            const slide =
              child as HTMLElement

            const slideMiddle =
              slide.offsetLeft +
              slide.clientWidth / 2

            const distance = Math.abs(
              slideMiddle - middle
            )

            if (
              distance <
              closestDistance
            ) {
              closestDistance = distance
              nearest = i
            }
          }
        )

        setSi(nearest)
      },
      120
    )
  }

  /*
   * Platform filter.
   *
   * Tap the currently selected platform again
   * to return to the mixed feed.
   */
  const pickNet = (
    network: SocialPost['network']
  ) => {
    setLockedNet((current) =>
      current === network
        ? null
        : network
    )

    setSi(0)
  }

  return (
    <>
      <style
        href="nr-newsroomhighlights"
        precedence="medium"
      >
        {`
          .nrx {
            padding: clamp(44px,6vw,72px) 28px;
            background: #fff;
            border-top: 1px solid #eef2f8;
          }

          /*
           * CUSTOMER REVIEW VIDEOS HAS BEEN REMOVED.
           *
           * Social gets the larger column.
           * Media stays as the smaller supporting column.
           */
          .nrx-inner {
            max-width: var(--w-1240);
            margin: 0 auto;

            display: grid;

            grid-template-columns:
              minmax(0, 1.5fr)
              minmax(300px, .8fr);

            gap: clamp(26px,3.4vw,46px);
          }

          @media (max-width: 1000px) {
            .nrx-inner {
              grid-template-columns: minmax(0,1fr);
              gap: 44px;
            }
          }

          /* ── Columns ── */

          .nrx-col {
            min-width: 0;

            display: flex;
            flex-direction: column;

            background: #fff;

            border: 1px solid #e7ecf6;
            border-radius: 18px;

            padding: clamp(18px,2.2vw,26px);

            box-shadow:
              0 2px 10px rgba(11,18,32,.04);
          }

          .nrx-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;

            padding-bottom: 12px;
            margin-bottom: 18px;

            border-bottom: 2px solid #0b1220;
          }

          .nrx-head h2 {
            margin: 0;

            font-size: var(--f-16);
            font-weight: 800;
            letter-spacing: -.02em;
            color: #0b1220;
          }

          .nrx-head a {
            font-size: var(--f-12-5);
            font-weight: 700;
            color: #1360ee;
            text-decoration: none;
            white-space: nowrap;
          }

          .nrx-head a:hover {
            text-decoration: underline;
          }

          /* ── Stage ── */

          .nrx-stage {
            position: relative;
            flex: 1;
            min-width: 0;
          }

          .nrx-page {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          /* ── Variable-width social carousel ── */

          .nrx-track {
            display: flex;
            align-items: flex-start;

            gap: 3%;

            width: 100%;

            overflow-x: auto;
            overflow-y: hidden;

            overscroll-behavior-x: contain;

            scroll-snap-type: x mandatory;

            /*
             * Keep enough room for the active card to
             * center even though every card has a
             * different width.
             */
            scroll-padding-inline: 8%;

            padding-inline: 8%;

            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .nrx-track::-webkit-scrollbar {
            display: none;
          }

          /*
           * DO NOT give this a fixed percentage width.
           *
           * SocialCard calculates its own width from
           * the image aspect ratio.
           */
          .nrx-slide {
            flex: 0 0 auto;

            width: max-content;
            max-width: 100%;

            scroll-snap-align: center;

            opacity: .42;

            transform: scale(.94);

            transition:
              opacity .6s ${EASE},
              transform .6s ${EASE};
          }

          .nrx-slide.is-on {
            opacity: 1;
            transform: none;
          }

          @media (max-width: 1000px) {
            .nrx-track {
              padding-inline: 5%;
              scroll-padding-inline: 5%;
            }

            .nrx-slide {
              max-width: 92%;
            }
          }

          /* ── Navigation arrows ── */

          .nrx-arrow {
            position: absolute;

            top: 50%;
            transform: translateY(-50%);

            z-index: 4;

            width: 32px;
            height: 32px;

            border-radius: 50%;

            display: grid;
            place-items: center;

            cursor: pointer;

            background: #fff;

            border: 1px solid #e6ebf4;

            color: #0b1220;

            box-shadow:
              0 4px 14px rgba(11,18,32,.12);

            transition:
              background .18s ${EASE},
              transform .18s ${EASE},
              box-shadow .18s ${EASE};
          }

          .nrx-arrow:hover {
            background: #f4f8ff;

            box-shadow:
              0 8px 20px rgba(11,18,32,.18);
          }

          .nrx-arrow:active {
            transform:
              translateY(-50%)
              scale(.94);
          }

          .nrx-arrow--prev {
            left: -15px;
          }

          .nrx-arrow--next {
            right: -15px;
          }

          @media (max-width: 1000px) {
            .nrx-arrow--prev {
              left: -6px;
            }

            .nrx-arrow--next {
              right: -6px;
            }
          }

          /* ── Dots ── */

          .nrx-dots {
            display: flex;
            justify-content: center;
            gap: 7px;

            margin-top: auto;
            padding-top: 18px;
          }

          .nrx-dot {
            width: 7px;
            height: 7px;

            padding: 0;

            border-radius: 50%;

            cursor: pointer;

            border: 0;

            background: #d7dee9;

            transition:
              background .18s ${EASE},
              width .18s ${EASE};
          }

          .nrx-dot.is-on {
            background: #1360ee;
            width: 18px;
            border-radius: 999px;
          }

          /* ── Social network tabs ── */

          .nrx-tabs {
            display: flex;
            justify-content: center;
            gap: 4px;

            margin-top: 14px;

            border-top: 1px solid #eef2f8;

            padding-top: 4px;
          }

          .nrx-tab {
            border: 0;
            background: transparent;

            cursor: pointer;

            padding: 10px 18px;

            color: #9aa4b6;

            border-bottom:
              2px solid transparent;

            margin-bottom: -1px;

            display: grid;
            place-items: center;

            transition:
              color .18s ${EASE},
              border-color .18s ${EASE};
          }

          .nrx-tab:hover {
            color: #5b6474;
          }

          .nrx-tab.is-on {
            color: #1360ee;
            border-bottom-color: #1360ee;
          }

          .nrx-tab.is-locked {
            background: rgba(19,96,238,.07);
            border-radius: 8px 8px 0 0;
          }

          /* ── Shared date ── */

          .nrx-date {
            display: inline-flex;
            align-items: center;
            gap: 5px;

            font-size: var(--f-11-5);
            color: #97a1b3;
          }

          .nrx-date svg {
            flex-shrink: 0;
            opacity: .8;
          }

          /* ── Media coverage ── */

          .nrx-media {
            display: grid;

            grid-template-columns:
              minmax(0,1fr)
              clamp(104px,9vw,132px);

            gap: 16px;

            align-items: center;

            padding: 16px 8px;

            text-decoration: none;

            border-bottom:
              1px solid #f0f3f9;

            transition:
              background .18s ${EASE};
          }

          .nrx-media:last-child {
            border-bottom: 0;
          }

          .nrx-media:hover {
            background: #f5f8fe;
          }

          .nrx-media-text {
            display: block;
            min-width: 0;
          }

          .nrx-pub {
            display: inline-block;

            margin-bottom: 9px;

            font-size: var(--f-10);
            font-weight: 800;

            letter-spacing: .1em;
            text-transform: uppercase;

            color: #475569;

            background: #f4f7fc;

            border: 1px solid #e6ebf4;

            padding: 5px 9px;

            border-radius: 6px;
          }

          .nrx-media-title {
            display: block;

            margin-bottom: 7px;

            font-size: var(--f-13-5);
            font-weight: 800;
            line-height: 1.38;

            letter-spacing: -.015em;

            color: #0b1220;
          }

          .nrx-media-thumb {
            position: relative;

            display: block;

            aspect-ratio: 4 / 3;

            border-radius: 12px;

            overflow: hidden;

            background: #0b1220;

            box-shadow:
              0 6px 16px -12px
              rgba(11,18,32,.6);
          }

          .nrx-media-thumb img {
            object-fit: cover;

            transition:
              transform .35s ${EASE};
          }

          .nrx-media:hover
          .nrx-media-thumb img {
            transform: scale(1.06);
          }

          @media (prefers-reduced-motion: reduce) {
            .nrx-track {
              scroll-behavior: auto;
            }

            .nrx-slide {
              transition: none;
            }

            .nrx-arrow {
              transition: none;
            }

            .nrx-media-thumb img {
              transition: none;
            }
          }
        `}
      </style>

      <section className="nrx">
        <div className="nrx-inner">

          {/* ─────────────────────────────────────────────
              LIVE FROM SOCIAL
             ───────────────────────────────────────────── */}

          <div
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <Rail
              title="Live from Social"
              pages={pool.length}
              index={idx}
              onIndex={setSi}
            >
              <div
                className="nrx-track"
                ref={trackRef}
                onScroll={onTrackScroll}
                role="group"
                aria-label="Social posts"
              >
                {pool.map((socialPost, i) => (
                  <div
                    key={socialPost.id}
                    className={`nrx-slide ${
                      i === idx ? 'is-on' : ''
                    }`}
                    aria-hidden={i !== idx}
                  >
                    <SocialCard
                      post={socialPost}
                    />
                  </div>
                ))}
              </div>

              <div className="nrx-tabs">
                {SOCIAL_NETS.map((network) => {
                  const isActive = lockedNet
                    ? lockedNet === network
                    : post?.network === network

                  return (
                    <button
                      key={network}
                      className={`nrx-tab ${
                        isActive
                          ? 'is-on'
                          : ''
                      } ${
                        lockedNet === network
                          ? 'is-locked'
                          : ''
                      }`}
                      onClick={() =>
                        pickNet(network)
                      }
                      aria-label={
                        lockedNet === network
                          ? `Showing ${TAB_LABEL[network]} only — tap to show all networks`
                          : `Show ${TAB_LABEL[network]} posts only`
                      }
                      aria-pressed={
                        lockedNet === network
                      }
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        {TAB_ICON[network]}
                      </svg>
                    </button>
                  )
                })}
              </div>
            </Rail>
          </div>

          {/* ─────────────────────────────────────────────
              MEDIA COVERAGE
             ───────────────────────────────────────────── */}

          <Rail
            title="Media Coverage"
            pages={MEDIA_PAGES.length}
            index={mi}
            onIndex={setMi}
          >
            {(MEDIA_PAGES[mi] ?? []).map(
              (media) => (
                <MediaRow
                  key={media.id}
                  m={media}
                />
              )
            )}
          </Rail>

        </div>
      </section>
    </>
  )
}