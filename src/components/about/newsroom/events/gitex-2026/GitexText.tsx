import Link from 'next/link'
import type { Para } from './gitex-2026-content'

/* Shared pieces for the GITEX GLOBAL 2026 page sections: paragraph rendering
   with the brief's links, the heading accent bar and the base type styles.
   External links open in a new tab with rel="noopener", as the brief asks. */

export function Rich({ para }: { para: Para }) {
  return (
    <>
      {para.map((seg, i) =>
        typeof seg === 'string' ? (
          seg
        ) : seg.external ? (
          <a key={i} className="gxb-link" href={seg.href} target="_blank" rel="noopener">
            {seg.text}
          </a>
        ) : (
          <Link key={i} className="gxb-link" href={seg.href}>
            {seg.text}
          </Link>
        ),
      )}
    </>
  )
}

export function Paras({ paras, className = 'gxb-p' }: { paras: Para[]; className?: string }) {
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className={className}>
          <Rich para={p} />
        </p>
      ))}
    </>
  )
}

/* Keeps a date range such as "8–11 December" on one line. */
export function KeepDates({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d{1,2}–\d{1,2} [A-Z][a-z]+)/).map((part, i) =>
        i % 2 ? (
          <span key={i} style={{ whiteSpace: 'nowrap' }}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function Bar({ light = false }: { light?: boolean }) {
  return (
    <span className={`gxb-bar${light ? ' gxb-bar--light' : ''}`} aria-hidden="true">
      <i />
      <i />
    </span>
  )
}

export function GitexBaseStyles() {
  return (
    <style href="gitex-2026-base" precedence="medium">{`
      .gxb-sec { position: relative; padding: clamp(64px,8vw,124px) 28px; }
      .gxb-wrap { position: relative; max-width: var(--w-1180); margin: 0 auto; }
      .gxb-bar { display: flex; gap: 6px; margin-bottom: clamp(14px,1.4vw,22px); }
      .gxb-bar i { display: block; height: 4px; border-radius: 2px; background: #1360ee; width: clamp(34px,3vw,52px); }
      .gxb-bar i + i { width: 12px; background: #9dbcff; }
      .gxb-bar--light i { background: #fff; }
      .gxb-bar--light i + i { background: rgba(255,255,255,.5); }
      .gxb-h2 {
        margin: 0; color: #0d1f4f; font-weight: 700;
        font-size: max(clamp(26px,2.9vw,42px), min(2.4vw, 58px));
        line-height: 1.18; letter-spacing: -.015em; text-wrap: balance;
      }
      .gxb-h3 {
        margin: 0; color: #0d1f4f; font-weight: 700;
        font-size: max(clamp(19px,1.65vw,25px), min(1.45vw, 34px));
        line-height: 1.3; letter-spacing: -.01em; text-wrap: balance;
      }
      .gxb-p {
        margin: 0 0 1.05em; color: #4a5168;
        font-size: max(clamp(15px,1.1vw,17px), min(1.02vw, 24px)); line-height: 1.75;
      }
      .gxb-p:last-child { margin-bottom: 0; }
      .gxb-link {
        color: #1360ee; font-weight: 600; text-decoration: underline;
        text-decoration-color: rgba(19,96,238,.35); text-decoration-thickness: 1.5px;
        text-underline-offset: 3px; transition: text-decoration-color .2s, color .2s;
      }
      .gxb-link:hover { text-decoration-color: #1360ee; }
      .gxb-btn {
        display: inline-flex; align-items: center; gap: 10px; border-radius: 999px;
        padding: 14px 24px; font-weight: 600; text-decoration: none; white-space: nowrap;
        font-size: max(clamp(14px,1vw,16px), min(.92vw, 21px));
        transition: transform .2s, box-shadow .2s, background .2s, color .2s, border-color .2s;
      }
      .gxb-btn:hover { transform: translateY(-2px); }
      .gxb-btn svg { flex: none; }
      .gxb-btn--primary { background: #1360ee; color: #fff; box-shadow: 0 10px 24px rgba(19,96,238,.28); }
      .gxb-btn--primary:hover { box-shadow: 0 14px 30px rgba(19,96,238,.36); }
      .gxb-btn--ghost { background: #fff; color: #0d1f4f; border: 1.5px solid #d5e0f5; }
      .gxb-btn--ghost:hover { border-color: #1360ee; color: #1360ee; }
      .gxb-btn--white { background: #fff; color: #1360ee; }
    `}</style>
  )
}

/* Small inline icons shared by several sections. */
export function ArrowIcon({ external = false }: { external?: boolean }) {
  return external ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 2h7v7M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
