'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { SKIP_HOST_ATTR } from '@/lib/skip-scroll'
import SupportChat from './SupportChat'

// ── Floating contact dock ────────────────────────────────────────────────────
//
// Three always-visible actions on the right edge, in TWO groups at opposite ends
// of the viewport: WhatsApp and Call ride under the navbar at the top, the
// support chat sits in the bottom-right corner.
//
// WHY SPLIT. The pair hands the visitor to an outside app; the chat keeps them
// on the page. Stacking all three together made the chat look like a third phone
// shortcut. Sending it to the opposite corner is also simply where a chat widget
// belongs — it is the one convention on this page worth borrowing, and it gives
// the pair the whole top edge to itself.
//
// DELIBERATELY NOT A TOGGLE. The usual pattern is one FAB that fans its channels
// out on tap, and with a long list that earns its keep. With two, it only puts an
// extra tap in front of the two things the page most wants a visitor to do.
//
// LAYOUT CONTRACT. Two position:fixed roots and nothing else — they add no
// height, shift no sibling, and are mounted once in the root layout rather than
// per page.
//
// Z-INDEX. 900, which is BELOW the navbars' overlays on purpose: the shutter
// mega-menu (1000/1001) and the mobile drawer (99999, portalled to body) must
// cover the dock while they are open, not fight it for the same corner.

type Action = {
  id: string
  label: string
  href: string
  /** tel: stays in this tab; wa.me is an external hand-off. */
  external?: boolean
  /** Resting gradient, and the colour its glow and hover shadow are mixed from. */
  from: string
  to: string
  glow: string
  icon: React.ReactNode
}

const ACTIONS: Action[] = [
  {
    id: 'whatsapp',
    label: 'Chat on WhatsApp',
    href: `https://wa.me/${siteConfig.whatsapp}`,
    external: true,
    from: '#25D366',
    to: '#128C7E',
    glow: 'rgba(37, 211, 102, 0.45)',
    // Official WhatsApp glyph, same path the contact page uses.
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: 'call',
    label: `Call ${siteConfig.phoneDisplay}`,
    href: `tel:${siteConfig.phone}`,
    // Same green family as WhatsApp — one shade lighter and one degree cooler, so
    // the two read as a single "talk to us now" pair rather than as two unrelated
    // brand badges. The page's own blue is reserved for the chat button below,
    // which is the one action that belongs to the site rather than to a phone app.
    from: '#3ddc72',
    to: '#1aa851',
    glow: 'rgba(37, 211, 102, 0.42)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.03-.24c1.12.37 2.33.57 3.56.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4.5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.44.57 3.56a1 1 0 0 1-.25 1.03z" />
      </svg>
    ),
  },
]

export default function ContactDock() {
  const [visible, setVisible] = useState(false)
  // A pinned showcase row is on screen, and its Skip control owns the corner the
  // chat launcher now sits in.
  const [shifted, setShifted] = useState(false)
  const pathname = usePathname()

  // ── Sharing the corner with the Skip control ────────────────────────────────
  // The pinned showcase rows each carry a Skip button, absolutely positioned
  // bottom-right of the row at clamp(16px, 2.5vw, 34px) — the same corner as the
  // chat launcher, at overlapping offsets. Rather than move either control's
  // resting position, the launcher steps up above the Skip pill for exactly as
  // long as one is on screen, so both stay reachable and neither is ever covered.
  //
  // Only the chat is lifted: the WhatsApp/Call pair is at the top edge and has
  // nothing to avoid.
  //
  // The threshold matches SkipButton's own reveal margin, so the two changes
  // happen on the same frame instead of the launcher jumping before the pill has
  // appeared.
  useEffect(() => {
    const hosts = document.querySelectorAll(`[${SKIP_HOST_ATTR}]`)
    // No skip hosts on this route, so there is nothing to step aside for. The reset
    // for "we just came FROM a route that had them" belongs in the cleanup below,
    // which has already run by this point.
    if (!hosts.length || typeof IntersectionObserver === 'undefined') return

    const onScreen = new Set<Element>()
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onScreen.add(e.target)
          else onScreen.delete(e.target)
        })
        setShifted(onScreen.size > 0)
      },
      { threshold: 0, rootMargin: '-12% 0px -12% 0px' },
    )
    hosts.forEach((h) => obs.observe(h))
    return () => {
      obs.disconnect()
      // Leaving a route that had skip hosts: drop the offset, or the launcher
      // would stay parked 58px up on a page with nothing there to avoid.
      setShifted(false)
    }
    // Re-scanned per route: the dock is mounted once in the root layout and does
    // not remount on a client-side navigation, so a page with skip hosts reached
    // from one without them would otherwise never be observed.
  }, [pathname])

  // ── A one-shot entrance, and then it stays ─────────────────────────────────
  // This was briefly gated on scrolling past the hero, on the reasoning that the
  // hero has its own calls to action and a second pair in the corner competes with
  // them. That was wrong, and visibly so: returning to the top made the buttons
  // vanish, and a control that comes and goes with scroll position reads as a
  // rendering fault rather than as a decision. WhatsApp and Call are the page's
  // primary contact channels — they are on screen from first paint and never leave.
  //
  // requestAnimationFrame rather than setting it true in the initial state: the
  // class has to land on a frame AFTER the one that painted the resting opacity:0,
  // or the browser has nothing to transition from and the dock simply appears.
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const state = `${visible ? ' is-visible' : ''}${shifted ? ' is-shifted' : ''}`

  return (
    <>
      <div className={`cdock${state}`}>
        {ACTIONS.map((a, i) => (
          <a
            key={a.id}
            href={a.href}
            aria-label={a.label}
            {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`cdock__btn cdock__btn--${a.id}`}
            style={
              {
                '--from': a.from,
                '--to': a.to,
                '--glow': a.glow,
                // Staggered top-down, so the stack assembles rather than appearing
                // all at once.
                '--delay': `${i * 80}ms`,
              } as React.CSSProperties
            }
          >
            {/* aria-hidden: the anchor's aria-label already names the action, and a
                screen reader announcing both would read it twice. */}
            <span className="cdock__label" aria-hidden="true">
              {a.label}
            </span>
            <span className="cdock__icon">{a.icon}</span>
          </a>
        ))}
      </div>

      {/* Opposite corner. Its own fixed root rather than a third item in the stack
          above — the two groups genuinely live at opposite ends of the viewport,
          and only this one has to dodge the Skip pill. */}
          
      {/* <div className={`cdock-chat${state}`}>
        <SupportChat />
      </div> */}

      <style jsx>{`
        /* Shared geometry, declared on both roots. SupportChat reads these same
           custom properties for its launcher size and panel anchor, so the two
           files can never drift into disagreeing about where the dock is or how
           big it is. */
        .cdock,
        .cdock-chat {
          position: fixed;
          --cd-edge: 20px;
          --cd-top: 100px;
          --cd-bottom: 22px;
          --cd-size: 48px;
          --cd-radius: 16px;
          /* env() keeps both roots clear of a landscape notch and of the iOS home
             indicator; the fallback in each calc is what non-iOS browsers use. */
          right: calc(var(--cd-edge) + env(safe-area-inset-right, 0px));
          z-index: 900;
          /* Nothing here should ever intercept a click meant for the page — only the
             buttons themselves take pointer events. */
          pointer-events: none;
        }

        .cdock {
          /* Clears the 80px navbar with room to spare, so the pair never collides
             with the logo row or the Get a Quote pill. */
          top: calc(var(--cd-top) + env(safe-area-inset-top, 0px));
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .cdock-chat {
          /* --cd-lift is 0 normally and clears the Skip pill while one is on screen
             — see the note on the observer above. Animated rather than switched so
             the launcher visibly steps aside instead of teleporting. */
          --cd-lift: 0px;
          bottom: calc(var(--cd-bottom) + var(--cd-lift) + env(safe-area-inset-bottom, 0px));
          /* Opacity only, never transform. A transform on this element would make
             it the containing block for the chat panel's position:fixed, and the
             panel would anchor to a 48px button instead of to the viewport. */
          opacity: 0;
          transition:
            bottom 0.42s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1) 160ms;
        }
        .cdock-chat.is-visible {
          opacity: 1;
        }
        /* The Skip pill's own bottom offset is clamp(16px, 2.5vw, 34px) and it
           stands about 40px tall, so this clears it with a gap left over at every
           width. */
        .cdock-chat.is-shifted {
          --cd-lift: 58px;
        }

        .cdock__btn {
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--cd-size);
          height: var(--cd-size);
          /* A squircle rather than a full circle: it matches the rounded-square
             language the icon cards use across the site, and reads as a control
             rather than as a chat bubble. */
          border-radius: var(--cd-radius);
          background: linear-gradient(140deg, var(--from) 0%, var(--to) 100%);
          color: #fff;
          text-decoration: none;
          /* Three layers doing three jobs: a coloured glow that ties the shadow to
             the button, a neutral shadow for depth against any background, and an
             inset highlight along the top edge that gives the surface its curvature. */
          box-shadow:
            0 10px 26px -8px var(--glow),
            0 4px 12px -4px rgba(15, 23, 42, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.28);
          opacity: 0;
          transform: translateY(-12px) scale(0.86);
          transition:
            opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1) var(--delay),
            transform 0.42s cubic-bezier(0.16, 1, 0.3, 1) var(--delay),
            box-shadow 0.3s ease;
        }
        .cdock.is-visible .cdock__btn {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .cdock__icon {
          display: block;
          width: 22px;
          height: 22px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cdock__icon :global(svg) {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Two quick beats, then a pause. Animate only the glyphs so the
           clickable buttons and their entrance/hover transforms stay stable. */
        .cdock.is-visible .cdock__icon {
          transform-origin: center;
          animation: cdockHeartbeat 3.2s ease-in-out calc(0.6s + var(--delay)) infinite;
        }
        @keyframes cdockHeartbeat {
          0%, 30%, 100% { transform: scale(1); }
          10% { transform: scale(1.22); }
          17% { transform: scale(1); }
          24% { transform: scale(1.14); }
        }
        .cdock.is-visible .cdock__btn:hover .cdock__icon,
        .cdock.is-visible .cdock__btn:focus-visible .cdock__icon {
          animation: none;
          transform: scale(1.08);
        }

        /* ── Label ────────────────────────────────────────────────────────────
           Sits to the LEFT of the button and slides out from underneath it, so it
           grows into the empty page rather than off the right edge of the screen. */
        .cdock__label {
          position: absolute;
          right: calc(100% + 12px);
          white-space: nowrap;
          padding: 7px 13px;
          border-radius: 11px;
          font-size: var(--f-13);
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #0f172a;
          background: rgba(255, 255, 255, 0.86);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          backdrop-filter: blur(14px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 12px 30px -12px rgba(15, 23, 42, 0.32),
            0 2px 6px -2px rgba(15, 23, 42, 0.12);
          opacity: 0;
          transform: translateX(10px) scale(0.94);
          transform-origin: right center;
          transition:
            opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        /* ── Hover / focus ────────────────────────────────────────────────────
           :focus-visible rather than :focus, so the label and lift appear for
           keyboard users without also firing on every mouse click. */
        .cdock__btn:hover,
        .cdock__btn:focus-visible {
          transform: translateY(-3px) scale(1.06);
          box-shadow:
            0 18px 38px -10px var(--glow),
            0 6px 16px -6px rgba(15, 23, 42, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
        }
        .cdock__btn:hover .cdock__icon,
        .cdock__btn:focus-visible .cdock__icon {
          transform: scale(1.08);
        }
        .cdock__btn:hover .cdock__label,
        .cdock__btn:focus-visible .cdock__label {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .cdock__btn:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
        /* Press reads as the button giving way — it lands just below its resting
           position, not above it. */
        .cdock__btn:active {
          transform: translateY(0) scale(0.95);
          transition-duration: 0.08s;
        }

        /* ── Touch ────────────────────────────────────────────────────────────
           No hover to reveal a label with, so the label never renders and the
           buttons take the edge alone. Slightly smaller, tucked closer in, and
           raised to sit under the shorter mobile navbar. */
        @media (hover: none), (max-width: 640px) {
          .cdock,
          .cdock-chat {
            --cd-edge: 12px;
            --cd-top: 88px;
            --cd-bottom: 16px;
            --cd-size: 44px;
            --cd-radius: 15px;
          }
          .cdock {
            gap: 10px;
          }
          .cdock__icon {
            width: 20px;
            height: 20px;
          }
          .cdock__label {
            display: none;
          }
        }

        /* Motion is decoration here — the dock must still appear, and every action
           must still work, with all of it switched off. */
        @media (prefers-reduced-motion: reduce) {
          .cdock-chat,
          .cdock__btn,
          .cdock__icon,
          .cdock__label {
            transition-duration: 0.01ms;
            transition-delay: 0ms;
          }
          .cdock.is-visible .cdock__icon {
            animation: none;
          }
          .cdock__btn:hover,
          .cdock__btn:focus-visible {
            transform: none;
          }
        }
      `}</style>
    </>
  )
}
