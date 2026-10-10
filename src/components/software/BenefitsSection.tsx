'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const ITEMS = [
  { label: 'Live GPS Tracking',          short: 'Track vehicles live, monitor drivers, improve road team control.' },
  { label: 'Dynamic Fleet Dashboard',    short: 'Central dashboard for trip insights, vehicle status, performance overview.' },
  { label: 'Instant Idle Alerts',        short: 'Detect long idle vehicles, reduce fuel waste, improve productivity.' },
  { label: 'After-Hours Vehicle Alerts', short: 'Get alerts for unauthorized movement, secure fleet beyond office hours.' },
  { label: 'Daily Route History',        short: 'Track routes, trip logs, driver activity, and delivery proof.' },
  { label: 'Fleet Service Reminders',    short: 'Automated maintenance alerts for oil, tires, and service schedules.' },
  { label: 'Field Tasks Manager',        short: 'Assign tasks to drivers, track progress, and monitor completion live.' },
  { label: 'Mobile Expense Manager',     short: 'Log road team expenses, validate costs, and track spending instantly.' },
  { label: 'Geofence & POI Monitoring',  short: 'Set virtual zones, get entry/exit alerts for office and customer sites.' },
  { label: 'AI Route Optimization',      short: 'Optimize fleet routes with AI, cut delays, save fuel, improve operations.' },
]

// index → screen recording. Two aspect ratios in the mix: the original three
// captures are 1726x1512, the newer Task Manager / Expense Manager / AI Route
// clips are a slightly narrower 1672x1512 — each is recorded here rather than
// assumed, since .bf-right--media below sizes itself exactly to whichever is active.
const VIDEO_MAP: Record<number, { src: string; aspect: string }> = {
  0: { src: '/software/fleet-telematics/live-gps.mp4',              aspect: '1726 / 1512' },
  1: { src: '/software/fleet-telematics/fleet-dashboard.mp4',       aspect: '1726 / 1512' },
  4: { src: '/software/fleet-telematics/daily-route.mp4',           aspect: '1726 / 1512' },
  6: { src: '/software/fleet-telematics/task-manager.mp4',          aspect: '1672 / 1512' },
  7: { src: '/software/fleet-telematics/expense-manager.mp4',       aspect: '1672 / 1512' },
  9: { src: '/software/fleet-telematics/ai-route-optimization.mp4', aspect: '1672 / 1512' },
}
// Flat list so every video can stay mounted + preloaded (no re-mount flash).
const VIDEO_LIST = Object.entries(VIDEO_MAP).map(([idx, v]) => ({ idx: Number(idx), ...v }))

// ── Composed (non-recorded) tabs ─────────────────────────────────────────────
// Four tabs have no screen recording; they're built here instead, as a cycling
// notification stack above a phone mockup. They used to be three hand-copied
// JSX blocks driven by three hand-copied effects, which had already drifted
// apart — differing header alignment, gap, body colour and mockup size — so no
// two looked quite alike. One shape, one renderer, one animation now drives all
// four, which is the only way they stay identical.

type IconKey = 'clock' | 'moon' | 'wrench' | 'document' | 'pin'

const ICONS: Record<IconKey, React.ReactNode> = {
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>,
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
}

type Notif = { title: string; body: string; time: string; icon: IconKey }

// Six per tab: the cycle wraps at six, so a shorter list would repeat visibly.
const NOTIF_MAP: Record<number, Notif[]> = {
  2: [
    { title: 'Idle Alert', body: 'Ahmed K. · #38291 · Al Quoz Industrial',   time: '09:12', icon: 'clock' },
    { title: 'Idle Alert', body: 'Fatima R. · #49357 · Dubai Marina',        time: '09:28', icon: 'clock' },
    { title: 'Idle Alert', body: 'Omar S. · #52104 · Jebel Ali Free Zone',   time: '09:35', icon: 'clock' },
    { title: 'Idle Alert', body: 'Hassan M. · #61847 · Business Bay',        time: '09:42', icon: 'clock' },
    { title: 'Idle Alert', body: 'Aisha T. · #73290 · Al Barsha',            time: '09:51', icon: 'clock' },
    { title: 'Idle Alert', body: 'Khalid A. · #84513 · Dubai Silicon Oasis', time: '10:03', icon: 'clock' },
  ],
  3: [
    { title: 'After-Hours Alert', body: 'James A. · #50925 · Al Khor Industrial Area', time: '22:47', icon: 'moon' },
    { title: 'After-Hours Alert', body: 'Khalid M. · #38104 · Dubai Marina Dock',      time: '23:15', icon: 'moon' },
    { title: 'After-Hours Alert', body: 'Saeed R. · #61287 · Jebel Ali Free Zone',     time: '01:32', icon: 'moon' },
    { title: 'After-Hours Alert', body: 'Tariq H. · #63827 · Business Bay Tower',      time: '02:18', icon: 'moon' },
    { title: 'After-Hours Alert', body: 'Layla K. · #74916 · DIFC Gate Avenue',        time: '02:55', icon: 'moon' },
    { title: 'After-Hours Alert', body: 'Rashid S. · #82054 · JLT Cluster Y',          time: '03:47', icon: 'moon' },
  ],
  5: [
    { title: 'Service Reminder',   body: 'Alexander Sales 30265 · Oil change overdue by 28,098 KM',    time: '08:17', icon: 'wrench' },
    { title: 'Service Reminder',   body: 'Thomas Sales 49357 · Tire rotation overdue by 10,990 KM',    time: '10:17', icon: 'wrench' },
    { title: 'Documents Reminder', body: 'Umer Sales 15833 · Registration expires 2026-09-06',         time: '11:30', icon: 'document' },
    { title: 'Service Reminder',   body: 'Hassan Fleet 62847 · Brake service due in 2,500 KM',         time: '13:45', icon: 'wrench' },
    { title: 'Documents Reminder', body: 'Fatima Transport 73921 · Insurance renewal due 2026-11-15',  time: '14:22', icon: 'document' },
    { title: 'Service Reminder',   body: 'Omar Logistics 84513 · Engine diagnostic recommended',       time: '15:08', icon: 'wrench' },
  ],
  8: [
    { title: 'Geofence Entry', body: 'Ahmed K. · #38291 · Entered Al Quoz Depot',        time: '07:48', icon: 'pin' },
    { title: 'Geofence Exit',  body: 'Fatima R. · #49357 · Left DIFC Client Site',       time: '08:26', icon: 'pin' },
    { title: 'POI Arrival',    body: 'Omar S. · #52104 · Arrived Jebel Ali Warehouse',   time: '09:14', icon: 'pin' },
    { title: 'Geofence Exit',  body: 'Hassan M. · #61847 · Left Business Bay Office',    time: '10:02', icon: 'pin' },
    { title: 'Geofence Entry', body: 'Aisha T. · #73290 · Entered Al Barsha Service Hub', time: '11:37', icon: 'pin' },
    { title: 'POI Arrival',    body: 'Khalid A. · #84513 · Arrived Silicon Oasis Yard',  time: '12:09', icon: 'pin' },
  ],
}

// index → static screen capture, for the four tabs that don't have a recording.
// All four are customLayout now: each is the phone mockup underneath its own
// notification stack, so none of them should size the panel from its own ratio.
const IMAGE_MAP: Record<number, { src: string; alt: string; w: number; h: number; objectFit?: 'contain' | 'cover'; objectPosition?: string; customLayout?: boolean }> = {
  2: { src: '/software/fleet-telematics/idle-alerts.png',          alt: 'LOCATOR mobile alert for a vehicle idling on site',          w: 1050, h: 1023, customLayout: true },
  3: { src: '/software/fleet-telematics/after-hours.png',       alt: 'LOCATOR mobile alert for a vehicle moving outside office hours', w: 435,  h: 366,  customLayout: true },
  5: { src: '/software/fleet-telematics/service-reminders.png', alt: 'LOCATOR notifications — service and document reminders due', w: 1116, h: 1578, customLayout: true },
  8: { src: '/software/fleet-telematics/geofence.png',       alt: 'LOCATOR live view with geofence and POI zones',              w: 725,  h: 698,  customLayout: true },
}

type Slot = { index: number; state: 'entering' | 'visible' | 'exiting' }

// Stack geometry, in one place so the four tabs can't drift apart.
// CARD_H is tall enough for a two-line body (Fleet Service Reminders wraps every
// one of its six), and it's a FIXED height rather than a minimum so that a tab
// with one-line bodies stacks on exactly the same rhythm as one with two — the
// cards are absolutely positioned, so a card that outgrew the pitch used to
// overlap the one below it instead of pushing it down.
// Shared by the visible mockup and the warm-up block below. They MUST stay
// identical: next/image picks a srcset candidate from `sizes`, so a warm-up
// using a different string would fetch and cache a different URL than the one
// the visible image later asks for — a wasted download and no cache hit.
const MOCKUP_SIZES = '(max-width: 600px) 250px, (max-width: 900px) 300px, 380px'

const CARD_H = 78
const CARD_GAP = 14
const PITCH = CARD_H + CARD_GAP
const STACK_H = PITCH * 2 + CARD_H

function NotificationCard({ item, position, state }: { item: Notif; position: number; state: Slot['state'] }) {
  return (
    <div
      className={`idle-notification ${state}`}
      style={{
        position: 'absolute',
        top: `${position * PITCH}px`,
        left: 0,
        right: 0,
        height: `${CARD_H}px`,
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[item.icon]}
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
          <strong style={{ fontSize: '13px', fontWeight: 700, color: '#1d1d1f' }}>{item.title}</strong>
          <span style={{ fontSize: '11px', color: '#86868b', marginLeft: '8px', flexShrink: 0 }}>{item.time}</span>
        </div>
        {/* Clamped at two lines: the fixed card height can't absorb a third, and
            a stray long string would otherwise spill over the card's edge. */}
        <p style={{
          fontSize: '12px', color: '#6e6e73', margin: 0, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.body}</p>
      </div>
    </div>
  )
}

// The whole composed panel: notification stack over phone mockup. The mockup box
// is a fixed 380x380 regardless of which PNG it holds, so the four tabs put the
// image in exactly the same place at exactly the same size — the four source
// PNGs have four different aspect ratios (from 1.03 to 0.71), so objectFit
// contain is what lets one shared box hold all of them without distortion.
function ComposedPanel({ items, image }: { items: Notif[]; image: { src: string; alt: string; w: number; h: number } }) {
  // Owned here, and the parent mounts this with key={active}, so switching tabs
  // remounts the panel and the queue simply starts empty — no reset pass, and no
  // chance of a card from the previous tab surviving the switch.
  const [visible, setVisible] = useState<Slot[]>([])

  // Shows three cards, then rolls them one at a time: the top card slides out
  // while a new one drops in at the bottom. Previously this existed three times
  // over, once per composed tab, with the timings retyped each time; one copy now
  // drives all four, so they animate on an identical rhythm.
  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>()
    let cycle: ReturnType<typeof setInterval> | undefined
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => { timers.delete(t); fn() }, ms)
      timers.add(t)
    }
    // Entry animation is 900ms; promoting the card to 'visible' at that mark
    // hands it back to the plain CSS resting state, so a later reflow of the
    // stack can't restart its keyframes.
    const settleLast = () => later(
      () => setVisible(prev => prev.map((s, i) => (i === prev.length - 1 ? { ...s, state: 'visible' } : s))),
      900,
    )

    // Fill the three slots, one every 2s. Guarded on prev.length so the fill is
    // idempotent: React runs mount effects twice in StrictMode, and a plain
    // append put slot 0 in the stack twice over.
    for (let k = 0; k < 3; k++) {
      later(() => {
        setVisible(prev => (prev.length > k ? prev : [...prev, { index: k, state: 'entering' }]))
        settleLast()
      }, 800 + k * 2000)
    }

    // Then roll continuously, starting once the third has settled.
    let cursor = 3
    later(() => {
      cycle = setInterval(() => {
        setVisible(prev => (prev.length ? [{ ...prev[0], state: 'exiting' }, ...prev.slice(1)] : prev))
        later(() => {
          setVisible(prev => [...prev.slice(1), { index: cursor % items.length, state: 'entering' }])
          settleLast()
          cursor++
        }, 800)
      }, 3500)
    }, 7500)

    return () => {
      timers.forEach(clearTimeout)
      if (cycle) clearInterval(cycle)
    }
  }, [items.length])

  return (
    <div className="idle-alerts-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      padding: '24px 24px 20px',
      gap: '20px',
      position: 'relative',
    }}>
      {/* Three slots, absolutely positioned so a card leaving can't reflow the
          two staying put. Height is fixed for the same reason. */}
      <div className="idle-alerts-notifications" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        height: `${STACK_H}px`,
        flexShrink: 0,
      }}>
        {visible.map((slot, position) => (
          <NotificationCard
            key={`${slot.index}-${position}`}
            item={items[slot.index]}
            position={position}
            state={slot.state}
          />
        ))}
      </div>

      <div className="idle-mobile-mockup" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        height: '380px',
        marginTop: '34px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.w}
          height={image.h}
          sizes={MOCKUP_SIZES}
          // next/image lazy-loads by default. This image only mounts at the
          // moment its tab is clicked, so lazy loading meant the browser first
          // had to mount it, then wait for an intersection callback, and only
          // then start the request — which is why it arrived after the whole
          // notification stack had finished animating in. It is on screen the
          // instant it exists, so there is nothing to defer.
          loading="eager"
          style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}

// Fetches every composed tab's mockup up front, off-screen, so clicking one of
// those tabs paints an already-cached image instead of starting a request.
// The four PNGs total well under a megabyte — trivial next to the video budget
// — and this runs only once the section is near the viewport.
//
// Zero-sized overflow:hidden wrapper rather than display:none, because a
// display:none image is not guaranteed to be fetched at all. `loading="eager"`
// is what actually matters here: inside a zero-height box the lazy-load
// observer has nothing sensible to measure against.
function MockupPrefetch() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Object.values(IMAGE_MAP).map(img => (
        <Image
          key={img.src}
          src={img.src}
          alt=""
          width={img.w}
          height={img.h}
          sizes={MOCKUP_SIZES}
          loading="eager"
        />
      ))}
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function BenefitsSection() {
  const [active, setActive] = useState(0)
  const videoEntry = VIDEO_MAP[active] ?? null
  const videoSrc = videoEntry?.src ?? null
  const imageEntry = IMAGE_MAP[active] ?? null
  // Only real full-bleed captures drive the panel's shape. The three
  // customLayout tabs are composed UI (notification stack + phone mockup), not a
  // single screenshot — their PNG ratio says nothing about how tall the panel
  // should be, and tab 5's 1116x1578 portrait ratio was stretching the card to
  // ~1150px, which is what pushed the panel past the section bounds.
  const mediaAspect =
    videoEntry?.aspect ?? (imageEntry && !imageEntry.customLayout ? `${imageEntry.w} / ${imageEntry.h}` : null)

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const sectionRef = useRef<HTMLElement | null>(null)
  // Which videos actually have a frame decoded. Until a video is "ready" we keep
  // it transparent and show a light placeholder — so a not-yet-loaded video
  // (first load / mobile, where preload is ignored) never renders as black.
  const [ready, setReady] = useState<Record<string, boolean>>({})
  const markReady = (src: string) =>
    setReady(r => (r[src] ? r : { ...r, [src]: true }))

  // ── Video loading budget ───────────────────────────────────────────────────
  // These six captures total ~92MB. Every one of them used to mount with
  // preload="auto", so the browser opened six parallel downloads the moment the
  // page did — including for tabs the visitor may never click. They all fought
  // for the same pipe, so the one actually on screen got roughly a sixth of the
  // bandwidth and took six times longer to show its first frame.
  //
  // Instead, nothing loads until the section nears the viewport; then the open
  // tab loads alone with the full pipe to itself, and the rest queue up strictly
  // one at a time behind it — nearest tab first, as the likeliest next click.
  const [inView, setInView] = useState(false)
  const [prefetched, setPrefetched] = useState<Set<number>>(() => new Set())

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => { if (entries.some(e => e.isIntersecting)) { setInView(true); io.disconnect() } },
      // Start a screen early, so the first frame is usually decoded by the time
      // the section is actually scrolled to.
      { rootMargin: '100% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Derived, not stored: the open tab is always loading, so it needs no effect
  // to put it in a set — which also means clicking a tab starts its download in
  // the same render rather than one commit later.
  const isLoading = (idx: number) => inView && (idx === active || prefetched.has(idx))

  // Sequential prefetch: only reach for the next capture once everything already
  // downloading has a frame, so a background fetch can never slow down the one
  // the visitor is looking at.
  const allLoadedReady = VIDEO_LIST.every(v => !isLoading(v.idx) || ready[v.src])
  useEffect(() => {
    if (!inView || !allLoadedReady) return
    const next = VIDEO_LIST
      .map(v => v.idx)
      .filter(idx => idx !== active && !prefetched.has(idx))
      .sort((a, b) => Math.abs(a - active) - Math.abs(b - active))[0]
    if (next === undefined) return
    const t = setTimeout(() => setPrefetched(p => new Set(p).add(next)), 500)
    return () => clearTimeout(t)
  }, [inView, allLoadedReady, prefetched, active])

  // Only the active video plays; the others stay paused holding their frame,
  // so switching tabs reveals a frame instantly. Depends on `ready` as well as
  // `active`, because a tab clicked before its video has loaded would otherwise
  // have had its one and only play() call rejected and never retried.
  useEffect(() => {
    VIDEO_LIST.forEach(({ idx }, i) => {
      const v = videoRefs.current[i]
      if (!v) return
      if (idx === active) v.play().catch(() => {})
      else v.pause()
    })
  }, [active, ready])

  const activeReady = videoSrc ? !!ready[videoSrc] : true

  const goUp   = () => setActive(p => Math.max(0, p - 1))
  const goDown = () => setActive(p => Math.min(ITEMS.length - 1, p + 1))

  return (
    <>
      <style>{`
        /* Professional smooth notification animations with absolute positioning */
        @keyframes appleNotificationSlide {
          0% {
            opacity: 0;
            transform: translateY(-50px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Smooth slide up and fade out - no height change */
        @keyframes notificationSlideOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.92);
          }
        }
        
        .idle-notification {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: top 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        .idle-notification.entering {
          animation: appleNotificationSlide 0.9s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }
        
        .idle-notification.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .idle-notification.exiting {
          animation: notificationSlideOut 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }

        /* Responsive adjustments for idle alerts custom layout */
        .idle-alerts-container {
          overflow-y: auto;
          overflow-x: hidden;
        }
        @media (max-width: 900px) {
          .idle-alerts-container {
            padding: 20px 16px 20px !important;
            gap: 18px !important;
          }
          .idle-alerts-notifications {
            max-width: 100% !important;
          }
          .idle-notification {
            padding: 9px 12px !important;
          }
          /* Width and height move together — the box stays square so the mockup
             keeps the same framing it has on desktop, just smaller. */
          .idle-mobile-mockup {
            max-width: 300px !important;
            height: 300px !important;
            margin-top: 22px !important;
          }
        }
        @media (max-width: 600px) {
          .idle-alerts-container {
            padding: 16px 12px 16px !important;
            gap: 16px !important;
          }
          .idle-notification {
            padding: 8px 10px !important;
          }
          .idle-mobile-mockup {
            max-width: 250px !important;
            height: 250px !important;
            margin-top: 16px !important;
          }
        }

        /* Light loading placeholder for videos (never a black box) */
        @keyframes bfShimmer { 0% { background-position: -160% 0; } 100% { background-position: 160% 0; } }
        .bf-skeleton {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(100deg, #eef2f8 30%, #f7faff 50%, #eef2f8 70%);
          background-size: 200% 100%;
          animation: bfShimmer 1.4s ${EASE} infinite;
        }

        /* accordion item wrapper — persistent pill background, sized to its own content */
        .bf-item {
          border-radius: 18px;
          overflow: hidden;
          background: #f5f5f7;
          transition: background .15s ${EASE};
          align-self: flex-start;
          max-width: 100%;
        }
        .bf-item:hover { background: #ececf0; }
        .bf-item.on {
          background: #ececf0;
          align-self: stretch;
        }

        /* pill trigger row — inline-flex so it shrink-wraps to its label width */
        .bf-pill {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 19px 20px;
          background: none; border: none; border-radius: 18px;
          cursor: pointer; font-family: inherit; text-align: left;
          white-space: nowrap;
        }
        /* Active item shows only its description, no header row */
        .bf-item.on .bf-pill { display: none; }
        .bf-pill-icon {
          width: 26px; height: 26px; border-radius: 50%;
          border: 1.5px solid #c8c8d0;
          display: grid; place-items: center;
          flex-shrink: 0; color: #8888a0; font-size: var(--f-17); line-height: 1;
          transition: border-color .2s ${EASE}, color .2s ${EASE}, transform .35s cubic-bezier(.34,1.3,.64,1);
        }
        .bf-pill-lbl {
          font-size: var(--f-15); font-weight: 600; color: #3a3a3c;
          letter-spacing: -.01em; transition: color .15s;
        }

        /* accordion body — CSS grid-rows for smooth height */
        .bf-acc-body {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .32s ${EASE};
        }
        .bf-item.on .bf-acc-body { grid-template-rows: 1fr; }
        .bf-acc-inner { overflow: hidden; min-height: 0; }
        .bf-acc-desc {
          padding: 20px 22px;
          font-size: var(--f-15); line-height: 1.6; color: #6b6b70;
          opacity: 0; transform: translateY(-4px);
          transition: opacity .18s, transform .22s ${EASE};
        }
        .bf-item.on .bf-acc-desc {
          opacity: 1; transform: translateY(0);
          transition: opacity .26s .08s, transform .3s .06s ${EASE};
        }

        /* nav arrow buttons */
        .bf-arrow {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #e0e0e4; background: #fff;
          display: grid; place-items: center;
          cursor: pointer; color: #6e6e73;
          transition: border-color .15s, color .15s, background .15s;
        }
        .bf-arrow:hover:not(:disabled) { border-color: #1360ee; color: #1360ee; background: #f0f4ff; }
        .bf-arrow:disabled { opacity: .3; cursor: default; }

        /* Mirrors the arrow column on the other side of the card. The arrows are
           outside the card, so on their own they push it 48px (34px column +
           14px gap) to the right: the space left of the card ends up 48px wider
           than the space right of it, and the card stops sharing a centre line
           with the heading above it. Reserving the same width on the right
           centres the card again — at every width, since below 900px the arrows
           move above the card and this collapses with them. */
        .bf-arrows-mirror { width: 34px; flex-shrink: 0; }

        /* Every tab shows a real capture (video or screenshot) at its own aspect
           ratio (see mediaAspect above). A box can only be both uncropped and
           bar-free if the box itself already has the media's ratio — so the
           panel sizes itself from --media-ar rather than from whatever height
           the accordion list happens to be.

           The previous version stopped there, and that was the bug: in a flex
           row the TALLER item still wins, so the 10-item list (~740px) set the
           card height while the aspect-sized panel (~715px at 1440) stayed
           shorter and sat centred inside it — the white band above and below the
           video. Switching the video to cover would have filled that band by
           cropping the capture's top and bottom instead, which is the second
           half of the same problem.

           Fix: on desktop the list is taken out of the flow (absolutely
           positioned in the card's left rail) so it can no longer contribute
           height. The card's height then comes from exactly one place — the
           active capture's ratio — and the panel matches it to the pixel. No
           bars, no crop, and no growing past the section, because the height is
           always width ÷ ratio rather than list content. The rail scrolls
           internally on the rare tall-list/short-panel combination.
           Scoped to ≥901px: below that .bf-outer stacks to a column, where the
           list must be back in flow and full width. */
        @media (min-width: 901px) {
          .bf-outer { position: relative; }
          .bf-left {
            position: absolute;
            top: 0; bottom: 0; left: 0;
            width: var(--bf-left-w);
            overflow-y: auto;
            scrollbar-width: none;
            /* "safe" keeps the list centred in a tall rail but falls back to
               top-aligned when it overflows, instead of clipping its first
               items out of reach above the scroll origin. */
            justify-content: safe center;
          }
          .bf-left::-webkit-scrollbar { display: none; }
          .bf-right { margin-left: var(--bf-left-w); }
          /* The three composed tabs have no --media-ar to size from, and with the
             rail out of the flow there'd be nothing else holding the card open —
             it would collapse to the notification stack and snap the card to a
             different height every time you left a video tab. This floor keeps it
             in the same range the aspect-sized panels land in. */
          .bf-right:not(.bf-right--media) { min-height: 660px; }
        }

        /* Between 901px and 1300px the panel is at its narrowest while still
           sitting beside the rail, so its ratio-derived height is at its
           shortest. Tightening the pills here buys back enough list height that
           the rail still fits inside that shorter card rather than scrolling. */
        @media (min-width: 901px) and (max-width: 1300px) {
          .bf-pill { padding: 14px 16px; gap: 10px; }
          .bf-pill-icon { width: 23px; height: 23px; }
          .bf-acc-desc { padding: 15px 17px; line-height: 1.5; }
        }

        /* Unscoped: in the stacked layout the panel is full-width and free to be
           as tall as the ratio needs, so sizing from --media-ar there kills the
           letterbox the old fixed 360px min-height was creating on mobile. */
        .bf-right--media { aspect-ratio: var(--media-ar); }

        @media (max-width: 900px) {
          /* Stack the arrows above the full-width card instead of beside it,
             so the card no longer gets squeezed into a narrow column. */
          .bf-row   { flex-direction: column !important; gap: 0 !important; }
          .bf-arrows-mirror { display: none; }
          .bf-outer { flex-direction: column !important; }
          .bf-left  { position: static; width: 100% !important; border-right: none !important; border-bottom: 1px solid #e8e8eb; }
          .bf-right { margin-left: 0; }
          .bf-right:not(.bf-right--media) { min-height: 360px; }
          .bf-arrows { flex-direction: row !important; position: static !important; margin: 0 auto 14px !important; }
        }
      `}</style>

      <section ref={sectionRef} id="benefits" style={{ padding: 'clamp(56px,7vw,80px) 28px 24px', background: '#ffffff', position: 'relative' }}>
        {inView && <MockupPrefetch />}
        {/* Wider than the page's usual 1120px column, and matching ModulesSection's
            1440px. Both blocks are the same kind of thing — a big interactive
            showcase whose content is a screen, not prose — and at 1100px this one
            was leaving a broad empty margin either side while squeezing the list
            and the video it exists to show. Text sections keep the narrower column;
            a paragraph does not want a 1440px measure. */}
        <div style={{ maxWidth: 'var(--w-1440)', margin: '0 auto' }}>

          {/* ── Header — centered ── */}
          <div data-reveal style={{ marginBottom: '36px', textAlign: 'center' }}>
            <span style={{
              fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
              color: '#1360ee', textTransform: 'uppercase' as const,
              display: 'block', marginBottom: '16px',
            }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              Benefits
            </span>
            <h2 style={{
              margin: '0 auto',
              fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))',
              fontWeight: 800, lineHeight: 1.25,
              letterSpacing: '-.015em', color: '#1d1d1f',
              maxWidth: '600px',
            }}>
              AI-Driven GPS Tracking &amp; Fleet Telematics Benefits
            </h2>
          </div>

          {/* ── Main card + arrows row ── */}
          <div className="bf-row" style={{ display: 'flex', alignItems: 'stretch', gap: '14px' }}>

            {/* Up / Down arrows — left of card */}
            <div className="bf-arrows" style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', gap: '8px', flexShrink: 0,
            }}>
              <button className="bf-arrow" onClick={goUp} disabled={active === 0} aria-label="Previous">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
              <button className="bf-arrow" onClick={goDown} disabled={active === ITEMS.length - 1} aria-label="Next">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* ── Big card ── */}
            <div
              className="bf-outer"
              data-reveal
              style={{
                flex: 1,
                display: 'flex',
                border: '1px solid #e4e4e8',
                borderRadius: '22px',
                overflow: 'hidden',
                background: '#fff',
                // No min-height on desktop: the card's height is the active
                // capture's height, full stop. A floor here would re-introduce
                // the white band it used to have below the panel whenever the
                // floor exceeded width ÷ ratio.
                boxShadow: '0 2px 16px rgba(0,0,0,.05)',
                // Declared once and consumed by both the absolutely positioned
                // rail and the panel's matching margin-left, so the two can
                // never drift apart.
                // The rail and the panel split one fixed card width, so every
                // pixel the rail keeps is a pixel the panel loses — and since the
                // panel's height is its own width ÷ ~1.11, the rail's width is
                // also the card's height control. The vw term is trimmed from
                // 30.13 to 26.5 to hand the capture that width back and let it
                // stand taller. The 340px floor stops a 1000-1300px screen from
                // starving the panel into a strip the 10-item list towers over.
                '--bf-left-w': 'max(340px, min(26.5vw, 600px))',
              } as React.CSSProperties}
            >
              {/* Left — pill list + description */}
              <div
                className="bf-left"
                style={{
                  // Set on .bf-outer (see --bf-left-w). It has to be wide enough
                  // that the longest label ('After-Hours Vehicle Alerts') doesn't
                  // hit the pill edge — the trigger row is nowrap inside an
                  // overflow:hidden item, so a tight column starts clipping — and
                  // that the open item's description gets a real measure rather
                  // than a narrow ribbon. It also has to stay narrow enough to
                  // leave the panel the width it needs to reach the list's height
                  // at the ratio of the captures (~1.11), which is what sets the
                  // 1300px stacking breakpoint in the style block above.
                  width: 'var(--bf-left-w)',
                  flexShrink: 0,
                  borderRight: '1px solid #e4e4e8',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '22px 16px 18px',
                  gap: '10px',
                }}
              >
                {ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className={`bf-item${active === i ? ' on' : ''}`}
                  >
                    {/* Trigger row */}
                    <button
                      className="bf-pill"
                      onClick={() => setActive(i)}
                    >
                      <span className="bf-pill-icon">+</span>
                      <span className="bf-pill-lbl">{item.label}</span>
                    </button>

                    {/* Accordion body */}
                    <div className="bf-acc-body">
                      <div className="bf-acc-inner">
                        <p className="bf-acc-desc">
                          <strong style={{ color: '#1d1d1f', fontWeight: 700 }}>{item.label}.</strong>{' '}
                          {item.short}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — video or screenshot panel */}
              <div
                className={`bf-right${mediaAspect ? ' bf-right--media' : ''}`}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  overflow: imageEntry?.customLayout ? 'auto' : 'hidden',
                  position: 'relative',
                  ...(mediaAspect ? { '--media-ar': mediaAspect } as React.CSSProperties : {}),
                }}
              >
                {/* Light shimmer shown while the active video has no frame yet
                    (first load / mobile), instead of a black screen. */}
                {videoSrc && !activeReady && (
                  <div className="bf-skeleton" aria-hidden="true" />
                )}

                {/* All videos stay mounted and cross-fade; each only becomes
                    visible once it actually has a decoded frame. */}
                {VIDEO_LIST.map(({ idx, src }, i) => {
                  const load = isLoading(idx)
                  const show = active === idx && !!ready[src]
                  return (
                    <video
                      key={src}
                      ref={el => { videoRefs.current[i] = el }}
                      muted
                      loop
                      playsInline
                      // src arrives only when the scheduler above says so;
                      // setting the attribute is what kicks off the download.
                      src={load ? src : undefined}
                      preload={load ? 'auto' : 'none'}
                      onLoadedData={() => markReady(src)}
                      onCanPlay={() => markReady(src)}
                      // A failed capture must still count as settled, or the
                      // strictly-sequential queue above would stall on it and
                      // never fetch the remaining tabs.
                      onError={() => markReady(src)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        // cover, not contain — and it crops nothing, because the
                        // panel is sized from this very capture's ratio at every
                        // breakpoint now. The two fits are geometrically
                        // identical here; cover is the safer of the pair, since
                        // sub-pixel rounding of the aspect-ratio box makes
                        // contain show a hairline of card white along one edge
                        // where cover simply absorbs it.
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        opacity: show ? 1 : 0,
                        zIndex: active === idx ? 2 : 1,
                        pointerEvents: active === idx ? 'auto' : 'none',
                        transition: 'opacity .4s ' + EASE,
                      }}
                    />
                  )
                })}

                {/* Composed panel for the four tabs that have no recording.
                    All four render through one component, so the notification
                    stack and the mockup land on identical pixels in each. */}
                {!videoSrc && imageEntry && (
                  imageEntry.customLayout && NOTIF_MAP[active] ? (
                    <ComposedPanel key={active} items={NOTIF_MAP[active]} image={imageEntry} />
                  ) : (
                    <Image
                      key={imageEntry.src}
                      src={imageEntry.src}
                      alt={imageEntry.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 60vw"
                      style={{
                        objectFit: imageEntry.objectFit || 'contain',
                        objectPosition: imageEntry.objectPosition || 'center',
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Spacing, not content — see .bf-arrows-mirror. */}
            <div className="bf-arrows-mirror" aria-hidden="true" />
          </div>

        </div>
      </section>
    </>
  )
}
