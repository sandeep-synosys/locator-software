'use client'

import { useState } from 'react'
import Image from 'next/image'
import { NEWS_ITEMS, type NewsItem } from './newsroom-data'
import { timeAgo, youtubeEmbedUrl, type WatchRequest } from './video-link'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const VIDEOS = NEWS_ITEMS.filter((i) => i.category === 'videos')
const CHANNEL_NAME = 'LOCATOR Media'
const CHANNEL_URL = 'https://www.youtube.com/@locatormedia820'

const ageOf = (v: NewsItem) => (v.publishedAt ? timeAgo(v.publishedAt) : v.ago)

function findVideo(id?: string) {
  return (id && VIDEOS.find((v) => v.youtubeId === id)) || VIDEOS[0]
}

/**
 * YouTube watch-page layout: one large poster/player on the left with the
 * title, channel row, and description beneath it, and an "Up next" playlist
 * rail on the right. Selecting a row swaps the player rather than navigating,
 * so the whole tab behaves like a single player surface.
 *
 * The poster stays until a visitor presses play; only then is the YouTube
 * iframe mounted, so the tab costs no third-party requests until it is used.
 * `request` lets other sections (e.g. CustomerReviewVideos) open a specific
 * video — each new request object selects it and, when `play` is set, starts it.
 */
export default function NewsroomWatch({ request }: { request?: WatchRequest | null } = {}) {
  const [active, setActive] = useState<NewsItem>(() => findVideo(request?.id))
  const [playing, setPlaying] = useState(() => Boolean(request?.id && request.play))

  // Adjust state while rendering when a new request arrives (React's
  // "storing information from previous renders" pattern — no effect needed).
  const [handled, setHandled] = useState(request)
  if (request !== handled) {
    setHandled(request)
    if (request) {
      setActive(findVideo(request.id))
      setPlaying(Boolean(request.id && request.play))
    }
  }

  const queue = VIDEOS.filter((v) => v.id !== active.id)
  const activeAge = ageOf(active)

  return (
    <div className="nyw">
      <style href="nr-newsroomwatch" precedence="medium">{`
        .nyw { display: grid; grid-template-columns: minmax(0,1fr) clamp(276px,26vw,348px); gap: clamp(16px,2.4vw,26px); align-items: start; }
        @media (max-width: 860px) { .nyw { grid-template-columns: 1fr; } }

        /* ── Player ── */
        .nyw-stage {
          position: relative; aspect-ratio: 16 / 9; border-radius: 14px; overflow: hidden;
          background: #000; width: 100%; display: block;
        }
        .nyw-poster {
          position: absolute; inset: 0; width: 100%; height: 100%; display: block;
          border: 0; padding: 0; margin: 0; background: transparent; cursor: pointer;
        }
        .nyw-stage img { object-fit: cover; }
        .nyw-stage::after {
          content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(0deg, rgba(0,0,0,.55) 0%, transparent 28%);
        }
        .nyw-stage[data-playing='true']::after { display: none; }
        .nyw-frame { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; z-index: 2; }

        .nyw-bigplay {
          position: absolute; inset: 0; margin: auto; z-index: 3;
          width: 78px; height: 54px; border-radius: 14px; display: grid; place-items: center;
          background: rgba(230,57,70,.94); color: #fff; box-shadow: 0 12px 34px rgba(0,0,0,.5);
          transition: transform .22s ${EASE}, background .22s ${EASE};
        }
        .nyw-poster:hover .nyw-bigplay, .nyw-poster:focus-visible .nyw-bigplay { transform: scale(1.08); background: #e63946; }

        /* Static scrub bar on the poster so the stage reads as a player, not a hero image. */
        .nyw-bar { position: absolute; left: 14px; right: 14px; bottom: 12px; z-index: 4; }
        .nyw-bar-track { height: 4px; border-radius: 3px; background: rgba(255,255,255,.32); overflow: hidden; }
        .nyw-bar-fill { display: block; height: 100%; background: #e63946; width: 0; }
        .nyw-bar-meta { display: flex; justify-content: space-between; margin-top: 6px; font-size: var(--f-11); color: rgba(255,255,255,.8); font-variant-numeric: tabular-nums; }

        /* ── Title block ── */
        .nyw-title { margin: 16px 0 10px; font-size: max(clamp(17px,2vw,21px), min(1.458vw, 30.45px)); font-weight: 800; letter-spacing: -.02em; line-height: 1.3; color: #0b1220; }

        .nyw-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .nyw-channel { display: flex; align-items: center; gap: 11px; }
        .nyw-avatar { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: #1360ee; color: #fff; font-size: var(--f-16); font-weight: 800; }
        .nyw-cname { margin: 0; display: flex; align-items: center; gap: 4px; font-size: var(--f-14); font-weight: 700; color: #0b1220; }
        .nyw-cname a { color: inherit; text-decoration: none; }
        .nyw-cname a:hover { text-decoration: underline; }
        .nyw-cname svg { color: #9aa2b1; }

        /* ── Description ── */
        .nyw-desc { margin: 14px 0 0; padding: 14px 16px; border-radius: 12px; background: #f0f2f5; }
        .nyw-desc-stats { margin: 0 0 6px; font-size: var(--f-13-5); font-weight: 700; color: #0b1220; }
        .nyw-desc-text { margin: 0; font-size: var(--f-13-5); line-height: 1.6; color: #3d4657; white-space: pre-line; }

        /* ── Playlist rail ── */
        .nyw-rail { display: flex; flex-direction: column; gap: 6px; }
        .nyw-rail-head {
          border: 1px solid #e3e6ea; border-radius: 12px; padding: 14px 16px; margin-bottom: 6px;
          display: flex; align-items: start; justify-content: space-between; gap: 12px;
        }
        .nyw-rail-head h3 { margin: 0 0 3px; font-size: var(--f-15); font-weight: 800; letter-spacing: -.015em; color: #0b1220; }
        .nyw-rail-head p { margin: 0; font-size: var(--f-12); color: #6b7484; }
        .nyw-rail-count { font-size: var(--f-12); color: #8b93a3; white-space: nowrap; }

        .nyw-row {
          display: grid; grid-template-columns: minmax(112px,150px) minmax(0,1fr); gap: 10px; align-items: start;
          padding: 6px; border-radius: 10px; border: 0; background: transparent; cursor: pointer;
          font-family: inherit; text-align: left; width: 100%;
          transition: background .16s ${EASE};
        }
        .nyw-row:hover { background: #f0f2f5; }
        .nyw-row[data-active='true'] { background: #f2f6ff; }

        .nyw-thumb { position: relative; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; background: #0b1220; }
        .nyw-thumb img { object-fit: cover; }
        .nyw-thumb-dur {
          position: absolute; right: 4px; bottom: 4px; z-index: 2;
          font-size: var(--f-10-5); font-weight: 600; color: #fff;
          background: rgba(0,0,0,.8); padding: 1px 4px; border-radius: 3px;
          font-variant-numeric: tabular-nums;
        }
        .nyw-nowplaying {
          position: absolute; inset: 0; z-index: 2; display: grid; place-items: center;
          background: rgba(0,0,0,.5); color: #fff; font-size: var(--f-10); font-weight: 800;
          letter-spacing: .1em; text-transform: uppercase;
        }

        .nyw-row-title {
          margin: 0 0 4px; font-size: var(--f-12-8); font-weight: 700; line-height: 1.36; color: #0b1220;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .nyw-row-meta { margin: 0; font-size: var(--f-11-5); color: #6b7484; line-height: 1.45; }
      `}</style>

      <div>
        <div className="nyw-stage" data-playing={playing}>
          {playing && active.youtubeId ? (
            <iframe
              key={active.youtubeId}
              className="nyw-frame"
              src={youtubeEmbedUrl(active.youtubeId, true)}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="nyw-poster"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${active.title}`}
            >
              <Image
                src={active.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1040px) 100vw, 860px"
              />
              <span className="nyw-bigplay">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>
              </span>
              <span className="nyw-bar">
                <span className="nyw-bar-track"><span className="nyw-bar-fill" /></span>
                <span className="nyw-bar-meta">
                  <span>0:00</span>
                  <span>{active.duration}</span>
                </span>
              </span>
            </button>
          )}
        </div>

        <h2 className="nyw-title">{active.title}</h2>

        <div className="nyw-meta">
          <div className="nyw-channel">
            <span className="nyw-avatar">L</span>
            <div>
              <p className="nyw-cname">
                <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">{CHANNEL_NAME}</a>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.3 14.5-4-4 1.6-1.6 2.4 2.4 5.4-5.4 1.6 1.6-7 7Z" />
                </svg>
              </p>
            </div>
          </div>
        </div>

        <div className="nyw-desc">
          {(active.views || active.date) && (
            <p className="nyw-desc-stats" suppressHydrationWarning>
              {[active.views, activeAge, active.date].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="nyw-desc-text">{active.excerpt}</p>
        </div>
      </div>

      <aside className="nyw-rail">
        <div className="nyw-rail-head">
          <div>
            <h3>Mix — Locator Fleet Intelligence</h3>
            <p>Videos from the {CHANNEL_NAME} YouTube channel</p>
          </div>
          <span className="nyw-rail-count">1 / {VIDEOS.length}</span>
        </div>

        <button type="button" className="nyw-row" data-active="true" onClick={() => setPlaying(true)} aria-label={`Play ${active.title}`}>
          <span className="nyw-thumb">
            <Image src={active.image} alt="" fill sizes="158px" />
            <span className="nyw-nowplaying">Now playing</span>
          </span>
          <span>
            <span className="nyw-row-title" style={{ display: 'block' }}>{active.title}</span>
            <span className="nyw-row-meta" style={{ display: 'block' }}>{CHANNEL_NAME}</span>
          </span>
        </button>

        {queue.map((v) => (
          <button
            key={v.id}
            type="button"
            className="nyw-row"
            onClick={() => {
              setActive(v)
              setPlaying(false)
            }}
          >
            <span className="nyw-thumb">
              <Image src={v.image} alt="" fill sizes="158px" />
              {v.duration && <span className="nyw-thumb-dur">{v.duration}</span>}
            </span>
            <span>
              <span className="nyw-row-title" style={{ display: 'block' }}>{v.title}</span>
              <span className="nyw-row-meta" style={{ display: 'block' }} suppressHydrationWarning>
                {CHANNEL_NAME} · {[v.views, ageOf(v)].filter(Boolean).join(' · ')}
              </span>
            </span>
          </button>
        ))}
      </aside>
    </div>
  )
}
