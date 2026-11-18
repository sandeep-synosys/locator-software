'use client'

import { useState } from 'react'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// `title` lets the Newsroom use its SEO heading while other pages (the blog
// listing) keep the original wording.
export default function NewsroomSubscribe({ title = 'Stay in the loop' }: { title?: string }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <>
      <style href="nr-newsroomsubscribe" precedence="medium">{`
        .nrs { padding: clamp(40px,5vw,64px) 28px clamp(56px,7vw,80px); background: #f7f9fc; }
        .nrs-card {
          max-width: var(--w-1240); margin: 0 auto;
          display: grid; grid-template-columns: 56px minmax(0,1fr) minmax(0,420px); gap: clamp(16px,2.4vw,28px);
          align-items: center;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 18px;
          padding: clamp(22px,3vw,34px) clamp(20px,3vw,36px);
          box-shadow: 0 2px 12px rgba(11,18,32,.04);
        }
        @media (max-width: 900px) { .nrs-card { grid-template-columns: 1fr; text-align: left; } }

        .nrs-ico { width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center; background: rgba(19,96,238,.1); color: #1360ee; }

        .nrs-title { margin: 0 0 6px; font-size: max(clamp(18px,2.1vw,24px), min(1.667vw, 34.8px)); font-weight: 800; letter-spacing: -.02em; color: #0b1220; }
        .nrs-sub { margin: 0; font-size: var(--f-13-5); line-height: 1.6; color: #6b7484; max-width: 52ch; }

        .nrs-form { display: flex; gap: 10px; }
        @media (max-width: 460px) { .nrs-form { flex-direction: column; } }
        .nrs-input {
          flex: 1; min-width: 0; padding: 13px 16px; border-radius: 11px;
          border: 1.5px solid #e0e6f0; background: #fbfcfe;
          font-family: inherit; font-size: var(--f-14); color: #0b1220; outline: 0;
          transition: border-color .18s ${EASE}, box-shadow .18s ${EASE}, background .18s ${EASE};
        }
        .nrs-input::placeholder { color: #aab0bd; }
        .nrs-input:focus { border-color: #1360ee; background: #fff; box-shadow: 0 0 0 4px rgba(19,96,238,.12); }

        .nrs-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 24px; border-radius: 11px; border: 0; cursor: pointer;
          font-family: inherit; font-size: var(--f-13-5); font-weight: 700; color: #fff;
          background: #1360ee; box-shadow: 0 12px 26px -12px rgba(19,96,238,.85);
          transition: background .18s ${EASE}, transform .18s ${EASE};
        }
        .nrs-btn:hover { background: #0d4fd4; transform: translateY(-1px); }
        .nrs-btn:disabled { background: #22a06b; cursor: default; transform: none; box-shadow: none; }

        .nrs-note { margin: 9px 0 0; font-size: var(--f-11-5); color: #a7b0c0; }
      `}</style>

      <section id="newsroom-subscribe" className="nrs">
        <div className="nrs-card" data-reveal>
          <div className="nrs-ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <div>
            <h2 className="nrs-title">{title}</h2>
            <p className="nrs-sub">
              Subscribe to get the latest product releases, events, customer stories, and company news
              delivered to your inbox.
            </p>
          </div>

          <div>
            <form
              className="nrs-form"
              onSubmit={(e) => {
                e.preventDefault()
                // No backend yet — acknowledge locally so the control never
                // looks inert, and wire this to the mailing list when it exists.
                if (email.trim()) setSent(true)
              }}
            >
              <input
                className="nrs-input"
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sent}
              />
              <button className="nrs-btn" type="submit" disabled={sent}>
                {sent ? 'Subscribed' : 'Subscribe'}
                {!sent && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>
            </form>
            <p className="nrs-note">No spam. Unsubscribe any time.</p>
          </div>
        </div>
      </section>
    </>
  )
}
