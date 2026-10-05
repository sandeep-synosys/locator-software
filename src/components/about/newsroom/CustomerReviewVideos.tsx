'use client'

import { useState } from 'react'
import Image from 'next/image'
import { NEWS_ITEMS, type NewsItem } from './newsroom-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'
const VIDEOS = NEWS_ITEMS.filter((item) => item.category === 'videos')

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

const VIDEO_PAGES = chunk(VIDEOS, 3)

function DateLine({ date, small = false }: { date: string; small?: boolean }) {
  return (
    <span className="crv-date">
      <svg
        width={small ? 11 : 12}
        height={small ? 11 : 12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      {date}
    </span>
  )
}

function PlayButton({ small = false }: { small?: boolean }) {
  return (
    <span className={`crv-play ${small ? 'crv-play--sm' : ''}`} aria-hidden="true">
      <span>
        <svg
          width={small ? 11 : 15}
          height={small ? 11 : 15}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </span>
    </span>
  )
}

function FeaturedVideo({ v }: { v: NewsItem }) {
  return (
    <a href={v.href} className="crv-feat">
      <span className="crv-feat-media">
        <Image src={v.image} alt="" fill sizes="(max-width: 700px) 100vw, 520px" />
        {v.duration && <span className="crv-dur">{v.duration}</span>}
        <PlayButton />
      </span>

      <span className="crv-feat-body">
        <span className="crv-feat-title">{v.title}</span>
        <DateLine date={v.date} />
      </span>
    </a>
  )
}

function CompactVideo({ v }: { v: NewsItem }) {
  return (
    <a href={v.href} className="crv-vid">
      <span className="crv-vid-thumb">
        <Image src={v.image} alt="" fill sizes="112px" />
        {v.duration && <span className="crv-dur crv-dur--sm">{v.duration}</span>}
        <PlayButton small />
      </span>

      <span>
        <span className="crv-vid-title">{v.title}</span>
        <DateLine date={v.date} small />
      </span>
    </a>
  )
}

export default function CustomerReviewVideos() {
  const [pageIndex, setPageIndex] = useState(0)

  if (!VIDEOS.length) return null

  const pageCount = VIDEO_PAGES.length
  const currentPage = VIDEO_PAGES[pageIndex] ?? VIDEO_PAGES[0]
  const [featured, ...rest] = currentPage

  const go = (delta: number) => {
    setPageIndex((current) => (current + delta + pageCount) % pageCount)
  }

  return (
    <>
      <style>{`
        .crv {
          width: 100%;
          padding: clamp(44px, 6vw, 72px) 28px;
          background: #fff;
          border-top: 1px solid #eef2f8;
        }

        .crv-inner {
          width: min(100%, var(--w-1240));
          margin: 0 auto;
        }

        .crv-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 12px;
          margin-bottom: 24px;
          border-bottom: 2px solid #0b1220;
        }

        .crv-title {
          margin: 0;
          color: #0b1220;
          font-size: var(--f-20, 20px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -.02em;
        }

        .crv-view-all {
          color: #1360ee;
          font-size: var(--f-12-5, 12.5px);
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .crv-view-all:hover { text-decoration: underline; }

        .crv-stage {
          position: relative;
          width: 100%;
        }

        .crv-page {
          width: min(100%, 760px);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .crv-feat {
          display: block;
          width: 100%;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e7ecf6;
          border-radius: 14px;
          box-shadow: 0 10px 26px -22px rgba(11,18,32,.5);
          text-decoration: none;
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }

        .crv-feat:hover {
          transform: translateY(-3px);
          border-color: #d7e3f8;
          box-shadow: 0 18px 36px -22px rgba(11,18,32,.55);
        }

        .crv-feat-media {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0b1220;
        }

        .crv-feat-media img {
          object-fit: cover;
          transition: transform .4s ${EASE};
        }

        .crv-feat:hover .crv-feat-media img { transform: scale(1.05); }
        .crv-feat:hover .crv-play span { transform: scale(1.08); }

        .crv-feat-body {
          display: block;
          padding: 15px 16px 16px;
        }

        .crv-feat-title {
          display: block;
          margin-bottom: 8px;
          color: #0b1220;
          font-size: var(--f-15, 15px);
          font-weight: 800;
          line-height: 1.35;
          letter-spacing: -.015em;
        }

        .crv-vid {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          padding: 7px;
          border-radius: 12px;
          text-decoration: none;
          transition: background .18s ${EASE};
        }

        .crv-vid:hover { background: #f5f8fe; }

        .crv-vid-thumb {
          position: relative;
          display: block;
          width: 112px;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-radius: 10px;
          background: #0b1220;
        }

        .crv-vid-thumb img {
          object-fit: cover;
          transition: transform .35s ${EASE};
        }

        .crv-vid:hover .crv-vid-thumb img { transform: scale(1.06); }

        .crv-vid-title {
          display: block;
          margin-bottom: 5px;
          color: #0b1220;
          font-size: var(--f-13, 13px);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: -.01em;
        }

        .crv-date {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #97a1b3;
          font-size: var(--f-11-5, 11.5px);
        }

        .crv-date svg { flex-shrink: 0; opacity: .8; }

        .crv-dur {
          position: absolute;
          left: 8px;
          bottom: 8px;
          z-index: 3;
          padding: 3px 6px;
          border-radius: 5px;
          background: rgba(11,18,32,.82);
          color: #fff;
          font-size: var(--f-10-5, 10.5px);
          font-weight: 700;
        }

        .crv-dur--sm {
          left: 5px;
          bottom: 5px;
          padding: 2px 4px;
          font-size: var(--f-9-5, 9.5px);
        }

        .crv-play {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          place-items: center;
        }

        .crv-play span {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,.94);
          color: #0b1220;
          box-shadow: 0 6px 18px rgba(0,0,0,.34);
          transition: transform .22s ${EASE};
        }

        .crv-play--sm span {
          width: 28px;
          height: 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,.3);
        }

        .crv-arrow {
          position: absolute;
          top: 50%;
          z-index: 4;
          width: 36px;
          height: 36px;
          border: 1px solid #e6ebf4;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          background: #fff;
          color: #0b1220;
          box-shadow: 0 4px 14px rgba(11,18,32,.12);
          transition: background .18s ${EASE}, transform .18s ${EASE}, box-shadow .18s ${EASE};
        }

        .crv-arrow:hover {
          background: #f4f8ff;
          box-shadow: 0 8px 20px rgba(11,18,32,.18);
        }

        .crv-arrow:active { transform: translateY(-50%) scale(.94); }

        .crv-arrow--prev {
          left: max(0px, calc(50% - 430px));
          transform: translateY(-50%);
        }

        .crv-arrow--next {
          right: max(0px, calc(50% - 430px));
          transform: translateY(-50%);
        }

        .crv-dots {
          display: flex;
          justify-content: center;
          gap: 7px;
          padding-top: 18px;
        }

        .crv-dot {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          cursor: pointer;
          background: #d7dee9;
          transition: background .18s ${EASE}, width .18s ${EASE};
        }

        .crv-dot.is-on {
          width: 18px;
          border-radius: 999px;
          background: #1360ee;
        }

        @media (max-width: 700px) {
          .crv { padding-inline: 18px; }
          .crv-page { width: 100%; }

          .crv-arrow {
            width: 32px;
            height: 32px;
          }

          .crv-arrow--prev { left: -8px; }
          .crv-arrow--next { right: -8px; }

          .crv-vid {
            grid-template-columns: 96px minmax(0, 1fr);
            gap: 11px;
          }

          .crv-vid-thumb { width: 96px; }
        }

        @media (max-width: 420px) {
          .crv-head { align-items: flex-end; }
          .crv-title { font-size: var(--f-18, 18px); }
          .crv-feat-body { padding: 13px 14px 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .crv-feat,
          .crv-feat-media img,
          .crv-vid-thumb img,
          .crv-play span,
          .crv-arrow {
            transition: none;
          }
        }
      `}</style>

      <section className="crv" aria-labelledby="customer-review-videos-title">
        <div className="crv-inner">
          <div className="crv-head">
            <h2 id="customer-review-videos-title" className="crv-title">
              Customer Review Videos
            </h2>

            <a href="#newsroom-feed" className="crv-view-all">
              View All →
            </a>
          </div>

          <div className="crv-stage">
            {pageCount > 1 && (
              <button
                type="button"
                className="crv-arrow crv-arrow--prev"
                onClick={() => go(-1)}
                aria-label="Previous customer review videos"
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

            <div className="crv-page">
              {featured && <FeaturedVideo v={featured} />}
              {rest.map((video) => (
                <CompactVideo key={video.id} v={video} />
              ))}
            </div>

            {pageCount > 1 && (
              <button
                type="button"
                className="crv-arrow crv-arrow--next"
                onClick={() => go(1)}
                aria-label="Next customer review videos"
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

          {pageCount > 1 && (
            <div className="crv-dots">
              {VIDEO_PAGES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`crv-dot ${index === pageIndex ? 'is-on' : ''}`}
                  onClick={() => setPageIndex(index)}
                  aria-label={`Customer review videos, page ${index + 1}`}
                  aria-current={index === pageIndex}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
