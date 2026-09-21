'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import type { SocialPost } from './newsroom-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/** Text longer than this collapses behind a "…see more" toggle, like the real feed. */
const CLAMP_AT = 210

const NETWORK: Record<SocialPost['network'], { label: string; color: string; icon: ReactNode }> = {
  linkedin: {
    label: 'LinkedIn',
    color: '#0b40b8',
    icon: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.44-.03-3.3-2-3.3-2 0-2.3 1.56-2.3 3.2V21h-4V9Z" />,
  },
  instagram: {
    label: 'Instagram',
    color: '#d6336c',
    icon: <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.3.07 1.69.07 4.9s0 3.6-.07 4.9c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.3.06-1.69.07-4.9.07s-3.6 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2Zm0 3.05a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5Zm0 11.13a4.38 4.38 0 1 1 0-8.76 4.38 4.38 0 0 1 0 8.76Zm8.6-11.4a1.58 1.58 0 1 1-3.15 0 1.58 1.58 0 0 1 3.15 0Z" />,
  },
  facebook: {
    label: 'Facebook',
    color: '#1877f2',
    icon: <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />,
  },
  x: {
    label: 'X',
    color: '#0b1220',
    icon: <path d="M17.53 3h3.05l-6.66 7.61L21.75 21h-5.9l-4.62-6.04L5.94 21H2.88l7.12-8.14L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.07 16.16h1.69L7.62 4.74H5.81l10.65 14.42Z" />,
  },
  youtube: {
    label: 'YouTube',
    color: '#e63946',
    icon: <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />,
  },
}

function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(n)
}

const ACTION_ICON = {
  like: <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm4 11V10l3.5-6.5A2 2 0 0 1 18 4.5V9h3.2a1.8 1.8 0 0 1 1.78 2.07l-1.1 7A2 2 0 0 1 19.9 20H11Z" />,
  comment: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.9L3 21l2-4.6A8.4 8.4 0 1 1 21 11.5Z" />,
  repost: <path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4m14-1v2a4 4 0 0 1-4 4H3" />,
  send: <path d="m22 2-7 20-4-9-9-4 20-7Z" />,
}

/**
 * `clampAt` lets a narrow host ask for a shorter excerpt. The highlights rail
 * runs these cards in a ~330px column where the default 210 characters spill
 * well past the space it has, so it passes a smaller number. Truncating here
 * rather than with a CSS line-clamp keeps the "see more" toggle meaningful —
 * a CSS clamp hides text the component still thinks it is showing.
 */
export default function SocialCard({ post, clampAt = CLAMP_AT }: { post: SocialPost; clampAt?: number }) {
  const net = NETWORK[post.network]
  const [expanded, setExpanded] = useState(false)
  const long = post.text.length > clampAt
  const shown = long && !expanded ? `${post.text.slice(0, clampAt).trimEnd()}…` : post.text

  return (
    <article className="nsc">
      <style href="nr-socialcard" precedence="medium">{`
        .nsc {
          background: #fff; border: 1px solid #e3e6ea; border-radius: 12px; overflow: hidden;
          transition: box-shadow .2s ${EASE};
        }
        .nsc:hover { box-shadow: 0 4px 16px rgba(11,18,32,.08); }

        /* ── Byline ── */
        .nsc-head { display: grid; grid-template-columns: 48px minmax(0,1fr) minmax(0,auto); gap: 10px; padding: 14px 16px 0; align-items: start; }
        .nsc-avatar {
          width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
          color: #fff; flex-shrink: 0;
        }
        .nsc-name { margin: 0; display: flex; align-items: center; gap: 5px; font-size: var(--f-14); font-weight: 700; color: #0b1220; line-height: 1.25; }
        .nsc-verified { color: #1360ee; flex-shrink: 0; }
        .nsc-sub { margin: 1px 0 0; font-size: var(--f-12); color: #6b7484; line-height: 1.35; }
        .nsc-meta { margin: 1px 0 0; display: flex; align-items: center; gap: 4px; font-size: var(--f-12); color: #8b93a3; }
        .nsc-follow {
          border: 0; background: transparent; cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 5px;
          font-size: var(--f-13-5); font-weight: 700; color: #1360ee;
          padding: 5px 9px; border-radius: 6px; transition: background .16s ${EASE};
        }
        .nsc-follow:hover { background: rgba(19,96,238,.08); }

        /* ── Body ── */
        .nsc-text {
          margin: 11px 0 0; padding: 0 16px 12px;
          font-size: var(--f-14); line-height: 1.5; color: #1b2433; white-space: pre-line;
        }
        .nsc-more {
          border: 0; background: transparent; padding: 0; cursor: pointer; font-family: inherit;
          font-size: var(--f-14); color: #8b93a3;
        }
        .nsc-more:hover { color: #1360ee; text-decoration: underline; }

        .nsc-media {
          position: relative;
          display: block;
          width: 100%;
          overflow: hidden;
          background: #fff;
        }

        .nsc-image {
          display: block;
          width: 100%;
          height: auto;
        }
        .nsc-play {
          position: absolute; inset: 0; margin: auto; z-index: 2;
          width: 62px; height: 44px; border-radius: 11px; display: grid; place-items: center;
          background: rgba(230,57,70,.95); color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.4);
          transition: transform .2s ${EASE};
        }
        .nsc-media:hover .nsc-play { transform: scale(1.08); }

        /* ── Reaction counts ── */
        .nsc-counts {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; font-size: var(--f-12-5); color: #6b7484;
        }
        .nsc-reacts { display: inline-flex; align-items: center; }
        .nsc-react {
          width: 17px; height: 17px; border-radius: 50%; display: grid; place-items: center;
          border: 1.5px solid #fff; color: #fff; margin-left: -5px;
        }
        .nsc-react:first-child { margin-left: 0; }
        .nsc-counts b { font-weight: 500; }
        .nsc-counts-right { margin-left: auto; display: flex; gap: 10px; }

        /* ── Action bar ── */
        .nsc-actions {
          display: grid; grid-template-columns: repeat(4, minmax(0,1fr));
          border-top: 1px solid #eef0f3; padding: 4px 8px;
        }
        .nsc-action {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          border: 0; background: transparent; cursor: pointer; font-family: inherit;
          padding: 11px 6px; border-radius: 8px;
          font-size: var(--f-13); font-weight: 600; color: #6b7484;
          transition: background .16s ${EASE}, color .16s ${EASE};
        }
        .nsc-action:hover { background: #f2f4f7; color: #1b2433; }
        .nsc-action[data-on='true'] { color: #1360ee; }
        .nsc-action svg { flex-shrink: 0; }
        .nsc-action span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        @media (max-width: 560px) { .nsc-action span { display: none; } }
      `}</style>

      <header className="nsc-head">
        <span className="nsc-avatar" style={{ background: net.color }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">{net.icon}</svg>
        </span>
        <div>
          <p className="nsc-name">
            {post.handle}
            <svg className="nsc-verified" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5 14.6 4l3.6-.4 1.2 3.4 3.1 1.9-1.4 3.4 1.4 3.4-3.1 1.9-1.2 3.4-3.6-.4L12 22.5 9.4 20l-3.6.4-1.2-3.4-3.1-1.9L2.9 12 1.5 8.6l3.1-1.9L5.8 3.3 9.4 3.7 12 1.5Zm-1.3 14.2 6-6-1.6-1.6-4.4 4.4-2-2-1.6 1.6 3.6 3.6Z" />
            </svg>
          </p>
          <p className="nsc-sub">{post.subtitle}</p>
          <p className="nsc-meta">
            {post.time}
            <span aria-hidden="true">·</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
            </svg>
          </p>
        </div>
        <a className="nsc-follow" href={post.href} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Follow
        </a>
      </header>

      <p className="nsc-text">
        {shown}
        {long && !expanded && (
          <>
            {' '}
            <button type="button" className="nsc-more" onClick={() => setExpanded(true)}>
              see more
            </button>
          </>
        )}
      </p>

      <a className="nsc-media" href={post.href} target="_blank" rel="noopener noreferrer">
        {/* <Image src={post.image} alt="" fill sizes="(max-width: 1040px) 100vw, 700px" /> */}
          <img
            src={post.image}
            alt=""
            className="nsc-image"
          />
        {post.network === 'youtube' && (
          <span className="nsc-play">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>
          </span>
        )}
      </a>

      <div className="nsc-counts">
        <span className="nsc-reacts">
          <span className="nsc-react" style={{ background: '#1360ee' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">{ACTION_ICON.like}</svg>
          </span>
          <span className="nsc-react" style={{ background: '#e63946' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11Z" />
            </svg>
          </span>
          <span className="nsc-react" style={{ background: '#f0a202' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 21H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3l3-6a2 2 0 0 1 3 2l-1 4h5a2 2 0 0 1 2 2.4l-1.6 7A2 2 0 0 1 17 21h-6Z" />
            </svg>
          </span>
        </span>
        <b>{compact(post.likes)}</b>
        <span className="nsc-counts-right">
          <span>{post.comments} comments</span>
          <span>{post.reposts} reposts</span>
        </span>
      </div>

      <div className="nsc-actions">
        <a className="nsc-action" href={post.href} target="_blank" rel="noopener noreferrer">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">{ACTION_ICON.like}</svg>
          <span>Like</span>
        </a>
        <a className="nsc-action" href={post.href} target="_blank" rel="noopener noreferrer">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">{ACTION_ICON.comment}</svg>
          <span>Comment</span>
        </a>
        <a className="nsc-action" href={post.href} target="_blank" rel="noopener noreferrer">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ACTION_ICON.repost}</svg>
          <span>Repost</span>
        </a>
        <a className="nsc-action" data-on="true" href={post.href} target="_blank" rel="noopener noreferrer">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">{ACTION_ICON.send}</svg>
          <span>View on {net.label}</span>
        </a>
      </div>
    </article>
  )
}
