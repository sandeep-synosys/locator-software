'use client';
import { forwardRef, useLayoutEffect, useRef, useState, useEffect } from 'react';
import Image from '@/components/common/ViewportImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import BrowserChrome from './BrowserChrome';
import { createSectionMachine } from './section-machine';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Mobile browsers fire `resize` every time the URL bar slides in or out, and each one
// is a full revert-and-remeasure of every trigger on the page — mid-scroll, because
// scrolling is what moves the URL bar. A refresh is the most disruptive thing that can
// happen to a pinned layout (see the note on the scale effect below), so the one that
// is purely an artefact of the browser chrome is worth declining outright. Idempotent
// and global: Scene4Pricing sets the same thing, and whichever mounts first wins.
ScrollTrigger.config({ ignoreMobileResize: true });

const W = 580, H = 580;

// Composition: the browser window sits back-left, the phone overlaps it front-right
// and hangs below its bottom edge — both are on screen at the same time.

// Desktop (browser-style frame) — back layer
const DT_X = 4, DT_Y = 108, DT_W = 460, DT_H = 330, DT_R = 14;
const DTX2 = DT_X + DT_W, DTY2 = DT_Y + DT_H;
const DT_PERIM = 2 * (DT_W + DT_H);

// Phone — front layer, clipping only the browser's right edge (~19% of its width)
// so the dashboard's sidebar and map stay readable behind it.
// 168×370 is the native aspect of /showcase/mobile-app.webp (1535×3378 → 0.454). Matching
// it exactly means objectFit:cover shows the WHOLE screenshot with nothing cropped —
// any other ratio silently cuts the bottom rows off. Change width and height together.
const PHONE_X = 396, PHONE_Y = 125, PHONE_W = 168, PHONE_H = 370, PHONE_R = 24;

// The wireframe rects below were hand-calibrated against the source screenshots at
// the original frame sizes (phone 260×500, browser 550×380). Rather than re-measure
// every rect for the new composition, scale the calibrated coordinates.
const PSX = PHONE_W / 260, PSY = PHONE_H / 500;
const DSX = DT_W / 550,    DSY = DT_H / 380;

const DT_PATH =
  `M${DT_X+DT_R} ${DT_Y} H${DTX2-DT_R}` +
  ` Q${DTX2} ${DT_Y} ${DTX2} ${DT_Y+DT_R}` +
  ` V${DTY2-DT_R} Q${DTX2} ${DTY2} ${DTX2-DT_R} ${DTY2}` +
  ` H${DT_X+DT_R} Q${DT_X} ${DTY2} ${DT_X} ${DTY2-DT_R}` +
  ` V${DT_Y+DT_R} Q${DT_X} ${DT_Y} ${DT_X+DT_R} ${DT_Y} Z`;

function rp(x, y, w, h, r = 0) {
  if (!r) return `M${x} ${y}H${x+w}V${y+h}H${x}Z`;
  return `M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
}

// Wireframe rect in the browser's calibrated 550×380 space.
// Only the browser has a wireframe stage — the phone simply fades in.
function dw(dx, dy, w, h, r = 0) {
  return rp(DT_X + dx * DSX, DT_Y + dy * DSY, w * DSX, h * DSY, r);
}

// Desktop wireframe — matches pro.mylocatorplus.com layout
// calibrated at 550×380: sidebar≈170px, map≈362px
const DT_WIRE = [
  // 1. Browser chrome / URL bar (full width)
  dw(8,   8,  534, 26, 5),

  // 2. Left sidebar container (full content height)
  dw(8,   42, 168, 330, 6),

  // 3. Right map container (full content height)
  dw(182, 42, 360, 330, 6),

  // Sidebar — tab pills: Vehicles | Drivers | Alerts
  dw(14,  50, 52, 18, 9),
  dw(72,  50, 44, 18, 9),
  dw(122, 50, 44, 18, 9),

  // Sidebar — stats row: 13 Vehicles | 3 Moving | 1 Idling | 8 Parking | 1 No Signal
  dw(14,  76, 28, 26, 4),
  dw(47,  76, 28, 26, 4),
  dw(80,  76, 28, 26, 4),
  dw(113, 76, 28, 26, 4),
  dw(146, 76, 20, 26, 4),

  // Sidebar — search bar
  dw(14,  110, 152, 14, 7),

  // Sidebar — vehicle list items (4 rows, each with icon + text lines)
  dw(14,  132, 152, 38, 4),
  dw(14,  178, 152, 38, 4),
  dw(14,  224, 152, 38, 4),
  dw(14,  270, 152, 38, 4),

  // Map — top toolbar (Zone / POI / Traffic filters)
  dw(188, 48, 350, 18, 4),

  // Map — bottom popup card ("Moinu Tech 68280")
  dw(188, 308, 130, 26, 6),
];

// Three columns on a UNIFORM grid, matching the reference composition:
//   · every card is the same size — no per-icon sizes
//   · the gap between column lefts and the gap between stacked cards are the SAME
//     pitch; that squareness is what makes the arrangement read as a lattice
//   · the centre column is dropped by OFFSET (≈0.45 of a pitch) against the outer
//     columns, which is what breaks the lattice into a network
//
// Cards are placed by CENTRE (cx/cy), not by top-left, so ICON_SIZE can change
// without dragging every card off the grid — left/top are derived below.
//
//   col x:  98              289             480          (pitch 191)
//   pin   cy  56             ·               ·
//          ·         bell   cy 143    route cy 143
//   moon  cy 247      grid   cy 334
//                    wrench cy 525
//
//   outer columns: cy 56, 247        centre column: cy 143, 334, 525
//   both step by the same 191 pitch; the centre column is offset by 87.
//
// Tooltip pill background. One shared neutral grey for every icon — the colour in
// this scene belongs to the active icons and the connection lines; a coloured pill
// competed with them and made the board read as six unrelated brands.
const TIP_BG = 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';

// `label` drives the hover tooltip. Labels mirror the feature card titles in the
// text panel so hovering an icon names the same capability the copy describes.
// `flip` hangs the tooltip to the LEFT of the card — needed for any icon close
// enough to the right edge that a right-hanging tooltip would run off the scene.
const ICON_SIZE = 76;
const ICONS = [
  { id:'pin',    cx:98,  cy:56,  layer:'outer',  label:'Live GPS Tracking' },
  { id:'bell',   cx:289, cy:143, layer:'center', label:'Instant Idle Alerts' },
  { id:'route',  cx:480, cy:143, layer:'outer',  label:'Daily Route History', flip:true },
  { id:'moon',   cx:98,  cy:247, layer:'outer',  label:'After-Hours Vehicle Alerts' },
  { id:'grid',   cx:289, cy:334, layer:'center', label:'Dynamic Fleet Dashboard' },
  { id:'wrench', cx:289, cy:525, layer:'center', label:'Fleet Service Reminders' },
].map(ic => ({
  ...ic,
  size: ICON_SIZE,
  left: ic.cx - ICON_SIZE / 2,
  top:  ic.cy - ICON_SIZE / 2,
}));

// Card edges, DERIVED from ICONS. Every connection endpoint is read from here, so
// the lines track any change to a position or to ICON_SIZE and always land flush on
// the card they point at. These used to be hand-typed coordinates, which silently
// drifted out of sync each time the layout moved — that drift is what left visible
// gaps between a line's end and the icon it was supposed to touch.
const E = Object.fromEntries(ICONS.map(ic => [ic.id, {
  cx: ic.cx,   cy: ic.cy,
  l:  ic.left, r:  ic.left + ic.size,
  t:  ic.top,  b:  ic.top  + ic.size,
}]));

const R = 12; // corner radius shared by every elbow

// Resting radius of the travelling dot. Visibility here comes from a bright, solid
// core rather than from sheer size — the background is a very pale #f5f7fa, so a
// crisp white centre with a defined blue edge carries much further than a large
// soft disc, and it stays readable without swamping the fine stroke it rides.
// Kept deliberately small so it reads as a current pulse rather than as a marker or
// a progress indicator being dragged along.
const DOT_R = 4.2;

// How far BEHIND the line's leading edge the dot rides, in path units. The line
// leads, the dot follows — which is what reads as current flowing along a wire that
// is already there. Sampling the dot at exactly the wavefront (which is what this
// did) put it on the very tip of the stroke, so it looked like the dot was dragging
// the line out behind it rather than travelling through it.
const DOT_TRAIL = 16;

// Three elbow shapes, named for the axis order they travel. Each takes two points
// that already sit ON a card edge and routes between them with rounded corners.
// A leaves a vertical (left/right) edge, B enters a vertical edge.
const hvh = (ax, ay, bx, by) => {
  const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
  const bend = bx - dx * R;
  return `M ${ax} ${ay} H ${bend - dx * R} Q ${bend} ${ay} ${bend} ${ay + dy * R}`
       + ` V ${by - dy * R} Q ${bend} ${by} ${bx} ${by}`;
};
// A leaves a horizontal (top/bottom) edge, B enters a vertical edge.
const vhv = (ax, ay, bx, by) => {
  const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
  const bend = by - dy * R;
  return `M ${ax} ${ay} V ${bend - dy * R} Q ${ax} ${bend} ${ax + dx * R} ${bend}`
       + ` H ${bx - dx * R} Q ${bx} ${bend} ${bx} ${by}`;
};
// A leaves a vertical edge, B enters a horizontal edge.
const hv = (ax, ay, bx, by) => {
  const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
  return `M ${ax} ${ay} H ${bx - dx * R} Q ${bx} ${ay} ${bx} ${ay + dy * R} V ${by}`;
};

// A run with no bend at all — used where two cards already share an axis.
const straight = (ax, ay, bx, by) => `M ${ax} ${ay} ${ax === bx ? `V ${by}` : `H ${bx}`}`;

// ── The flow ──────────────────────────────────────────────────────────────────
// The board tells ONE connected story, played start to finish in this order:
//
//     Live GPS ──▶ Idle Alerts ──▶ Route History
//                       │
//                       ▼
//                After-Hours ──▶ Fleet Dashboard ──▶ Service Reminders
//
// Two properties make this a chain rather than a pile of pairs, and both are load-
// bearing:
//
//   · every link's `from` is either the very first icon or the `to` of an EARLIER
//     link, so the signal is handed forward and no link ever starts from a cold
//     card. `bell` is the hub — it receives once and sends twice.
//   · order is meaningful. Each step assumes its source is already lit, so FLOW
//     cannot be reordered without re-checking that invariant.
//
// This replaces an older 7-entry CONNECTIONS/PAIRS pair of arrays that had to be
// kept index-aligned by hand, of which only 3 were ever animated. Endpoints live
// here once and feed the path, the gradient, and the timeline alike.
const link = (from, to, a, b, shape, c1, c2) => ({
  from, to, a, b, c1, c2,
  d: shape(a[0], a[1], b[0], b[1]),
});

// ROUTING RULE: no two links may run parallel and adjacent, and no two may share an
// axis over the same span. Adjacent parallel runs merge into what looks like a single
// doubled line, which destroys the whole point of separate connections — `pin→bell`
// used to leave pin's BOTTOM edge and turn right at y=131, running 12px above and
// alongside `bell→moon`'s return at y=143, with both verticals sitting on x=98. Two
// distinct links read as one racetrack. It now leaves pin's RIGHT edge and drops into
// bell's TOP edge instead, which keeps it clear of everything else on the board.
const FLOW = [
  link('pin',  'bell',   [E.pin.r,   E.pin.cy],  [E.bell.cx,  E.bell.t],    hv,       '#8b5cf6', '#3b82f6'),
  link('bell', 'route',  [E.bell.r,  E.bell.cy], [E.route.l,  E.route.cy],  straight, '#3b82f6', '#0d4fd4'),
  link('bell', 'moon',   [E.bell.l,  E.bell.cy], [E.moon.cx,  E.moon.t],    hv,       '#3b82f6', '#6d28d9'),
  link('moon', 'grid',   [E.moon.r,  E.moon.cy], [E.grid.l,   E.grid.cy],   hvh,      '#4c1d95', '#6366f1'),
  link('grid', 'wrench', [E.grid.cx, E.grid.b],  [E.wrench.cx, E.wrench.t], straight, '#6366f1', '#60a5fa'),
];

// id → index into ICONS, which is the same index activeRefs/iconRefs use.
const IDX = Object.fromEntries(ICONS.map((ic, i) => [ic.id, i]));

// FLOW is played ONE LINK AT A TIME. Exactly one connection is ever on screen: when
// a link begins, the previous link's line is cleared away, so the board never shows
// two lines at once and can never read as a single continuous run through the icons.

function GlobalDefs() {
  return (
    <svg width="0" height="0" style={{ position:'absolute' }}>
      <defs>
        <linearGradient id="ig_pin"    x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
        <linearGradient id="ig_bell"   x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#2563eb"/></linearGradient>
        <linearGradient id="ig_route"  x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#0d4fd4"/></linearGradient>
        <linearGradient id="ig_moon"   x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3730a3"/><stop offset="100%" stopColor="#6d28d9"/></linearGradient>
        <linearGradient id="ig_wrench" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#2563eb"/></linearGradient>
        {/* One gradient per link, generated FROM FLOW rather than hand-written beside
            it. userSpaceOnUse anchors each ramp to the exact two edge points its path
            runs between, so moving an icon moves the path and the colour together —
            the previous hand-maintained list silently stranded ramps on old geometry
            every time the layout shifted. */}
        {FLOW.map((f, i) => (
          <linearGradient key={i} id={`s1lg${i}`} gradientUnits="userSpaceOnUse"
            x1={f.a[0]} y1={f.a[1]} x2={f.b[0]} y2={f.b[1]}>
            <stop offset="0%" stopColor={f.c1}/><stop offset="100%" stopColor={f.c2}/>
          </linearGradient>
        ))}
        <linearGradient id="s1pg_w" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#0d4fd4"/>
        </linearGradient>
        {/* Shared by BOTH wireframes (phone + browser), so it lives here rather than
            in either one's local defs — deleting the owner SVG would strip the other. */}
        <filter id="s1bgl" x="-6%" y="-6%" width="112%" height="112%">
          <feGaussianBlur stdDeviation="0.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function InactiveCard({ id, size }) {
  const r = Math.round(size * 0.24);
  const s = Math.round(size * 0.50);
  const c = '#c8d0dc';
  const shapes = {
    pin: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={c} strokeWidth="1.5" fill="none"/><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.2" fill="none"/></svg>,
    bell: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke={c} strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg>,
    route: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="17" cy="5" r="2.5" stroke={c} strokeWidth="1.3" fill="none"/><circle cx="7" cy="19" r="2.5" stroke={c} strokeWidth="1.3" fill="none"/><path d="M7 16.5c0-3 3-3.5 5-5.5s5-2.5 5-6" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>,
    moon: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={c} strokeWidth="1.5" fill="none"/></svg>,
    grid: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8.5" height="8.5" rx="1.5" stroke={c} strokeWidth="1.2" fill="none"/><rect x="12.5" y="3" width="8.5" height="8.5" rx="1.5" stroke={c} strokeWidth="1.2" fill="none"/><rect x="3" y="12.5" width="8.5" height="8.5" rx="1.5" stroke={c} strokeWidth="1.2" fill="none"/><rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1.5" stroke={c} strokeWidth="1.2" fill="none"/></svg>,
    wrench: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg>,
  };
  return (
    <div style={{ width:size, height:size, borderRadius:r, background:'#f8fafc', border:'1.5px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {shapes[id]}
    </div>
  );
}

function ActiveCard({ id, size }) {
  const r = Math.round(size * 0.24);
  const s = Math.round(size * 0.52);
  const inner = {
    pin:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#ig_pin)"/><circle cx="12" cy="9" r="2.7" fill="white" opacity="0.9"/></svg>,
    bell:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="url(#ig_bell)"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="url(#ig_bell)" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>,
    route:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="17" cy="5" r="2.8" fill="url(#ig_route)"/><circle cx="7" cy="19" r="2.8" fill="url(#ig_route)"/><path d="M7 16.5c0-3 3-3.5 5-5.5s5-2.5 5-6" stroke="url(#ig_route)" strokeWidth="2.1" strokeLinecap="round" fill="none"/></svg>,
    moon:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="url(#ig_moon)"/></svg>,
    grid:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8.5" height="8.5" rx="1.5" fill="#f87171"/><rect x="12.5" y="3" width="8.5" height="8.5" rx="1.5" fill="#1360ee"/><rect x="3" y="12.5" width="8.5" height="8.5" rx="1.5" fill="#fb923c"/><rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1.5" fill="#a78bfa"/></svg>,
    wrench: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill="url(#ig_wrench)"/></svg>,
  };
  return (
    <div style={{ width:size, height:size, borderRadius:r, background:'#fff', boxShadow:'0 6px 24px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {inner[id]}
    </div>
  );
}

export default forwardRef(function Scene1Icons(_props, ref) {
  const activeRefs   = useRef([]);
  const iconRefs     = useRef([]);
  const lineRefs     = useRef([]);
  const dotRefs      = useRef([]);   // lead pulse — rides the line as it draws
  const pulseRefs    = useRef([]);   // follow pulse — keeps the finished line live
  const hoverRefs    = useRef([]);
  const tipRefs      = useRef([]);
  const mobileRef    = useRef(null);
  const desktopFrameRef = useRef(null);
  const desktopWireRefs = useRef([]);
  const desktopWireGrpRef = useRef(null);
  const desktopImgRef = useRef(null);
  const desktopPopupRef = useRef(null);
  const mobilePopupRef = useRef(null);
  const allTweens    = useRef([]);
  const linesRef     = useRef(null);
  const outerRef     = useRef(null);
  const playedRef    = useRef(false);
  const inViewRef    = useRef(false);
  const [scale, setScale] = useState(1);

  // ── Three scroll-gated stages ─────────────────────────────────────────────
  // The scene is a story the user advances, not one that runs itself:
  //
  //   STAGE 0  arrive        icons + connection lines, LOOPING. Nothing else is on
  //                          screen. This holds forever if the user never scrolls.
  //   STAGE 1  scroll        icons dissolve → browser wireframe draws → dashboard.
  //   STAGE 2  scroll again  phone rises over the dashboard.
  //
  // Both stages are gated on the trigger's OWN progress — a fixed fraction of the
  // section's scroll range — and nothing else. Forward and reverse read the same
  // two numbers, so a stage always flips at the same place on the page no matter
  // how the user got there.
  //
  // This replaces gates measured in pixels travelled from anchors that were stamped
  // whenever a time-based animation happened to finish. Those anchors landed
  // wherever the user was at that instant, so the SAME gesture needed wildly
  // different amounts of scroll depending on how fast they had been moving —
  // sometimes almost none, sometimes hundreds of pixels. That is the "extra scroll"
  // and the inconsistency; it was never a matter of picking better pixel values,
  // because the reference point itself moved.
  //
  // The timelines still run on their own clock once pointed. Scroll decides only
  // DIRECTION, never position, which is what keeps the motion smooth rather than
  // stuttering with each wheel delta.
  const iconsTlRef   = useRef(null);
  const desktopTlRef = useRef(null);
  const phoneTlRef   = useRef(null);

  // ── State machine ─────────────────────────────────────────────────────────
  // Three discrete states with exactly one transition between neighbours:
  //
  //     ST_ICONS  ⇄  ST_DESKTOP  ⇄  ST_MOBILE
  //
  // The ST_ prefix is not decoration: `ICONS` is already the module-level array of
  // icon definitions, which this component reads inside hoverIcon and in its JSX.
  // An unprefixed state constant would shadow it and turn `ICONS.map(...)` into a
  // call on the number 0.
  //
  // The machine itself lives in section-machine — both showcase scenes run the same
  // one — and only three things are supplied from here: where the states sit in the
  // pin, how to ANIMATE one adjacent step (runTransition), and how to place the scene
  // on any state OUTRIGHT (applyState). Everything about when each of those is
  // allowed to run is that module's business, and its header is where the reasoning
  // lives; the short version is that the scroll position decides, and this scene
  // never moves the page to suit its own animation.
  const ST_ICONS = 0, ST_DESKTOP = 1, ST_MOBILE = 2;

  // Thresholds are per-state, which IS the hysteresis: the boundary that matters
  // depends on which way you are travelling, so there is no single point where a
  // few pixels of jitter can flap a state in and out.
  const TO_DESKTOP   = 0.30;  // icons   → desktop
  const TO_ICONS     = 0.22;  // desktop → icons
  const TO_MOBILE    = 0.66;  // desktop → mobile
  const TO_DESK_BACK = 0.56;  // mobile  → desktop

  // The state machine. Built by getMachine, which is defined near the bottom of this
  // component because it points at runTransition and applyState — the two pieces of
  // this scene the machine drives. The ref is declared up here with the others so
  // everything above can reach the machine without reading a binding that does not
  // exist yet.
  const machineRef = useRef(null);
  const pinnedRef = useRef(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      if (!w) return;
      // Upscaling cap, so the scene fills a wide sticky panel instead of drawing at
      // its 580px canvas size in the middle of one. Two things bound it:
      //
      //   · the panel's WIDTH   — w / W below;
      //   · the VIEWPORT's HEIGHT — this panel is 100vh on the pinned branch, so a
      //     scene taller than the viewport is clipped by the pinned frame. The old
      //     flat 1.18 was that guard expressed as a guess about how tall screens
      //     are; measuring instead lets a tall display go further while a short one
      //     is protected properly.
      //
      // The 1.18 floor is the value this cap used to have unconditionally, so the
      // measurement can only ever raise the ceiling above what shipped, never lower
      // it — nothing that fits today can start being scaled down. And below 1024px
      // the layout is stacked rather than pinned, where the flat 1.18 still applies
      // and tablets are untouched.
      const isPinnedLayout = window.matchMedia('(min-width: 1024px)').matches;
      const cap = isPinnedLayout
        ? Math.max(1.18, Math.min(1.5, (window.innerHeight * 0.86) / H))
        : 1.18;
      setScale(Math.min(cap, w / W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // The cap reads window.innerHeight, which the ResizeObserver above cannot see:
    // it watches this element, and this element's height is derived from the scale
    // rather than from the viewport. A vertical-only resize would otherwise leave a
    // stale cap in place until something else forced a re-measure.
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useLayoutEffect(() => () => {
    allTweens.current.forEach(t => t?.kill());
    // Ignore stale callbacks and rebuild cleanly on development remounts.
    machineRef.current?.destroy();
    machineRef.current = null;
    playedRef.current = false;
    iconsTlRef.current = null;
    desktopTlRef.current = null;
    allTweens.current = [];
    phoneTlRef.current = null;
  }, []);

  // ── Why the scale change does NOT refresh ScrollTrigger ────────────────────
  // It used to, and that call was the single worst thing on this page.
  //
  // A refresh REVERTS every trigger first: all pins drop back into normal flow, which
  // deletes both rows' pin spacers — a little over four viewports of document height —
  // remeasures, then re-applies. For the frame in between, the document is far shorter
  // than the scroll position the user is at, so the browser clamps them upward, and
  // what paints is whatever now lives at that clamped position: the road, the hero, the
  // section after this one. THAT is the hero flickering back into view after a fast
  // scroll, and it is why two sections were momentarily on screen together.
  //
  // It was also self-inflicting. The ResizeObserver above watches an element inside the
  // pinned row, pinning writes inline sizing onto that row, and the refresh re-applies
  // the pin — so a refresh could feed the observer that asked for it.
  //
  // And on the pinned branch it bought nothing: `start: 'top top'` and
  // `end: '+=' + innerHeight * 2.2` against a row that is a fixed 100vh do not depend on
  // the scene's scale in any way. Only the unpinned branch below 1024px measures the
  // row's real height ('top 70%' / 'bottom 30%'), so only that branch asks — through
  // ScrollTrigger's own deferred scheduler, which holds the work until scrolling stops,
  // and one frame late so the new scale has actually been laid out.
  const measuredRef = useRef(false);
  useEffect(() => {
    if (!measuredRef.current) { measuredRef.current = true; return; }
    if (pinnedRef.current) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh(true));
    return () => cancelAnimationFrame(id);
  }, [scale]);

  // The intro is a one-shot that must be allowed to finish: killing it half-way
  // (which the IntersectionObserver used to do on every scroll-out) left the
  // dashboard stuck part-drawn. Cleanup happens on unmount instead.
  const stop = () => { inViewRef.current = false; iconsTlRef.current?.pause(); };

  // Premium cinematic easing. All three are deliberately gentle curves: sine has the
  // softest acceleration of the standard eases, which keeps the line draw reading as
  // one continuous glide rather than a snap. power3/power2.in were noticeably punchier
  // at the ends and made the same motion look abrupt.
  const LINE_EASE = 'sine.inOut';
  const FADE_EASE = 'sine.inOut';

  const getLen = (p) => { try { return p.getTotalLength(); } catch { return 400; } };

  // ── Icon hover ────────────────────────────────────────────────────────────
  // Colours the card and slides its tooltip out. Only meaningful while the board is
  // both the settled state AND not mid-transition — once a transition starts the
  // icons are on their way out, and hovering a dissolving card fights the fade.
  const hoverIcon = (i, on) => {
    const card = iconRefs.current[i];
    // The machine exists by the time any pointer can reach an icon — it is built in
    // the layout effect that creates the triggers — but a hover before that would
    // simply be the arrival board, which is hoverable.
    const machine = machineRef.current;
    if (!card || (machine && (machine.getState() !== ST_ICONS || machine.isBusy()))) return;

    // Lift the hovered card so its tooltip can cross over neighbouring icons,
    // which sit on their own z-layers. Restored to the resting layer on exit.
    card.style.zIndex = on ? 20 : (ICONS[i].layer === 'center' ? 4 : 7);

    gsap.to(hoverRefs.current[i], { opacity: on ? 1 : 0, duration: 0.28, ease: 'power2.out' });
    gsap.to(tipRefs.current[i], {
      opacity: on ? 1 : 0,
      y: on ? 0 : 5,
      duration: 0.28,
      ease: on ? 'back.out(1.8)' : 'power2.in',
    });
  };

  const resetAll = () => {
    gsap.set(iconRefs.current.filter(Boolean),   { opacity: 1, pointerEvents: 'auto' });
    gsap.set(activeRefs.current.filter(Boolean), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });
    gsap.set(hoverRefs.current.filter(Boolean),  { opacity: 0 });
    gsap.set(tipRefs.current.filter(Boolean),    { opacity: 0, y: 5 });
    lineRefs.current.filter(Boolean).forEach(p => {
      const len = getLen(p);
      gsap.set(p, { opacity: 0, strokeDasharray: `${len} ${len + 1}`, strokeDashoffset: len });
    });
    // Reset the travelling dots back to their resting radius. `r` is animated as an
    // attribute rather than a transform: the dot's position is driven by cx/cy attrs
    // during travel, and a CSS transform would scale it about the SVG origin instead
    // of its own centre, throwing it off the line.
    [...dotRefs.current, ...pulseRefs.current].filter(Boolean).forEach(d => {
      gsap.set(d, { opacity: 0, attr: { r: DOT_R } });
    });
    // NOTE: the phone (mobileRef / mobilePopupRef) is deliberately not reset here —
    // it is owned entirely by the pinned scroll timeline, and resetting it would
    // fight ScrollTrigger for the same properties.
    gsap.set(desktopFrameRef.current, { opacity: 0, strokeDashoffset: DT_PERIM });
    gsap.set(desktopWireGrpRef.current, { opacity: 0 });
    gsap.set(desktopImgRef.current, { opacity: 0 });
    gsap.set(desktopPopupRef.current, { opacity: 0, x: -12, scale: 0.96 });
    desktopWireRefs.current.forEach(p => {
      if (!p) return;
      const len = getLen(p);
      gsap.set(p, { strokeDasharray:`${len} ${len+1}`, strokeDashoffset:len, opacity:0 });
    });
  };

  // ── STAGE 0 ───────────────────────────────────────────────────────────────
  // Icons and their connections, looping. This is all the user sees on arrival and
  // it repeats indefinitely — the desktop is not part of this timeline and cannot
  // appear until they scroll (see startDesktop).
  const play = () => {
    // Guarded: the row re-enters the viewport every time the user scrolls back up,
    // and restarting would yank the scene back to stage 0 from wherever it had got to.
    inViewRef.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      getMachine().showStatic();
      return;
    }
    if (machineRef.current && machineRef.current.getState() !== ST_ICONS) return;
    if (playedRef.current) { iconsTlRef.current?.resume(); return; }
    playedRef.current = true;

    resetAll();

    // repeatDelay lands on an empty board — every beat clears itself, so the cycle
    // ends clean and the pause reads as a breath rather than a stall.
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    iconsTlRef.current = tl;
    allTweens.current.push(tl);

    // ── PHASE 1: ICON LINES ONLY — no wireframe visible
    //
    // ONE LINK AT A TIME. Each beat owns the board outright:
    //
    //   clear the previous link  →  line leaves the source  →  dot rides its leading
    //   edge  →  dot LANDS on the target  →  target lights on impact  →  hold
    //
    // Nothing accumulates. Lines drawn by earlier beats are gone, and the ONLY icons
    // in colour are the two ends of the connection currently being made. Letting the
    // board build up was the mistake: five links on screen at once merge into what
    // looks like a single continuous run through the icons, no matter how they were
    // timed or grouped.
    //
    // The source is never re-lit from grey, because FLOW is a chain — each link's
    // source is the previous link's target, so it is simply the one icon that does
    // NOT get cleared at the start of the beat. That is what makes the sequence read
    // as one signal walking the board rather than five unrelated pairs blinking.
    const CHAIN_START = 0.10;
    const ACT_DUR     = 0.30;  // icon grey → colour
    const LINE_LEAD   = 0.25;  // line leaves the source once the last one has cleared
    // Deliberately unhurried. The draw IS the content of this scene — the dot tracing
    // the route between two features is the thing worth watching — so it is paced to
    // be followed rather than merely noticed. Paired with sine.inOut (LINE_EASE), the
    // gentlest of the standard curves, so it eases away from the source and settles
    // into the target without a hard edge at either end.
    const DRAW_DUR    = 1.05;  // line draw / dot travel, per link
    const CLEAR_DUR   = 0.40;  // previous line + stale icons back to grey
    // ── Continuous flow ──────────────────────────────────────────────────────
    // The instant a line finishes drawing, a SECOND pulse sets off along it. The
    // beat no longer sits still waiting: the completed connection stays visibly
    // live, carrying current, while the next one begins.
    //
    // The next beat starts when that follow pulse is PULSE_HANDOFF of the way
    // along. Half is enough — by then the eye has read "this line is flowing" and
    // holding for the remainder only reintroduces the dead pause this replaces.
    const PULSE_DUR     = 0.90;  // follow pulse, source → target on the finished line
    const PULSE_HANDOFF = 0.50;  // fraction of it before the next beat takes over
    // Start-to-start between beats. Note this comes out at exactly the old
    // LINE_LEAD + DRAW_DUR + HOLD: the static hold has been swapped for the first
    // half of the follow pulse, so the sequence keeps its pacing and only the dead
    // time is gone.
    const STEP        = LINE_LEAD + DRAW_DUR + PULSE_DUR * PULSE_HANDOFF;
    const END_HOLD    = 0.45;  // after the last pulse hands off, before clearing
    // The instant the dot reaches the target card. Pulled 0.05 early so the icon is
    // already blooming as the dot touches it — landing exactly on the frame reads a
    // beat late to the eye.
    const ARRIVE_LEAD = 0.05;

    // Tracked so the final clear is measured from the moment the LAST follow pulse
    // sets off, rather than from a re-derived guess that drifts if timings change.
    let lastPulseAt = CHAIN_START;

    FLOW.forEach((f, i) => {
      const at       = CHAIN_START + i * STEP;
      const drawAt   = at + LINE_LEAD;
      const arriveAt = drawAt + DRAW_DUR - ARRIVE_LEAD;
      const pulseAt  = drawAt + DRAW_DUR;   // line complete → follow pulse departs
      lastPulseAt    = Math.max(lastPulseAt, pulseAt);

      const line  = lineRefs.current[i];
      const dot   = dotRefs.current[i];
      const pulse = pulseRefs.current[i];
      const src   = activeRefs.current[IDX[f.from]];
      const tgt   = activeRefs.current[IDX[f.to]];

      // ── Hand the board over ──────────────────────────────────────────────────
      // Retire the previous link's line, and drop every lit icon EXCEPT this beat's
      // source back to grey. Filtering by "not the source" rather than naming the
      // icons to clear is what keeps this correct as FLOW changes: `bell` is the
      // source of two consecutive links and must survive both hand-overs, while
      // `route` — a target that is never a source — has to be cleared by the beat
      // after it. A hand-written list would get one of those wrong.
      if (i > 0) {
        const prevLine = lineRefs.current[i - 1];
        if (prevLine) tl.to(prevLine, { opacity:0, duration:CLEAR_DUR, ease:FADE_EASE }, at);

        // The previous link's follow pulse is mid-flight right now — it is exactly
        // PULSE_HANDOFF along. Fade it WITH its line rather than stopping it: it
        // keeps travelling under the fade, so the old connection reads as dimming
        // out while still flowing, not as something switched off.
        const prevPulse = pulseRefs.current[i - 1];
        if (prevPulse) tl.to(prevPulse, { opacity:0, duration:CLEAR_DUR, ease:FADE_EASE }, at);

        const stale = activeRefs.current.filter((el, idx) => el && idx !== IDX[f.from]);
        if (stale.length) tl.to(stale, { opacity:0, scale:0.9, duration:CLEAR_DUR, ease:FADE_EASE }, at);
      }

      // Light the source. Beat 0 is the only one where this is a real transition —
      // afterwards the source is already lit and survived the clear above, so this
      // resolves to a no-op rather than a second pop.
      if (src) tl.to(src, { opacity:1, scale:1, duration:ACT_DUR, ease:'back.out(1.7)' }, at);

      if (line) {
        const len = getLen(line);

        tl.set(line, { strokeDasharray:`${len} ${len + 1}`, strokeDashoffset:len, opacity:1 }, drawAt);
        tl.to(line, { strokeDashoffset:0, duration:DRAW_DUR, ease:LINE_EASE }, drawAt);

        // The dot rides the stroke's leading edge. It shares DRAW_DUR and LINE_EASE
        // with the draw above, so the two stay locked for the whole trip — any
        // difference in either shows up as the dot drifting off the end of the line.
        if (dot) {
          tl.set(dot, { opacity: 1, attr: { r: DOT_R } }, drawAt);
          tl.to(dot, {
            duration: DRAW_DUR,
            ease: LINE_EASE,
            onUpdate: function () {
              try {
                // Sample DOT_TRAIL behind the wavefront, never ahead of it and never
                // before the start of the path. The clamp parks the dot on the source
                // edge for the first few frames, which reads as the pulse gathering
                // before it sets off rather than as a stall.
                const head = len * this.progress();
                const p = line.getPointAtLength(Math.max(0, head - DOT_TRAIL));
                // Written straight to the attributes rather than through gsap.set.
                // This runs on every frame of every link; gsap.set builds a fresh
                // tween and plugin instance per call, and that per-frame allocation
                // was the source of the micro-stutter along the path.
                dot.setAttribute('cx', p.x);
                dot.setAttribute('cy', p.y);
              } catch {
                // Path not measurable yet — skip this frame rather than break the beat.
              }
            },
          }, drawAt);

          // Landing: the dot blooms and discharges into the card instead of simply
          // stopping. This is what sells the line as having carried something.
          tl.to(dot, {
            opacity: 0,
            attr: { r: DOT_R * 2.6 },
            duration: 0.42,
            ease: 'power2.out',
          }, arriveAt);
        }

        // ── Follow pulse ────────────────────────────────────────────────────
        // Departs the source the moment the stroke is complete and runs the whole
        // path on its own. Two things set it apart from the lead dot: it travels a
        // line that already exists, so there is no wavefront to trail and no
        // DOT_TRAIL offset; and it moves at a CONSTANT rate. Linear is what reads
        // as current — the eased in-and-out of the lead dot belongs to the act of
        // drawing, and reusing it here would make the flow look like it were
        // starting and stopping rather than running steadily.
        if (pulse) {
          tl.set(pulse, { opacity: 1, attr: { r: DOT_R } }, pulseAt);
          tl.to(pulse, {
            duration: PULSE_DUR,
            ease: 'none',
            onUpdate: function () {
              try {
                const p = line.getPointAtLength(len * this.progress());
                pulse.setAttribute('cx', p.x);
                pulse.setAttribute('cy', p.y);
              } catch {
                // Path not measurable yet — skip this frame rather than break the beat.
              }
            },
          }, pulseAt);
        }
      }

      // Target lights ON IMPACT — never before.
      if (tgt) tl.to(tgt, { opacity:1, scale:1, duration:ACT_DUR, ease:'back.out(1.7)' }, arriveAt);
    });

    // NOTE: this loop no longer gates anything. It used to arm stage 1 when the last
    // link landed, which meant the dashboard could not appear until ~8.6s of
    // wall-clock animation had elapsed — and since the user is scrolling throughout
    // that time, the scroll position at which the gate opened was different on every
    // visit. The board simply loops now; where the stages fire is decided purely by
    // how far down the section the user is.
    //
    // ── Clear the last beat, so the cycle restarts from an empty board ───────────
    // Only the final link is still on screen at this point; every earlier one was
    // already retired by the beat that followed it.
    // Measured from the last follow pulse's departure and given the same handoff
    // share the other beats get, so the final link is held for exactly as long as
    // every other one before the board clears.
    const clearAt = lastPulseAt + PULSE_DUR * PULSE_HANDOFF + END_HOLD;
    tl.to(lineRefs.current.filter(Boolean),   { opacity:0, duration:CLEAR_DUR, ease:FADE_EASE }, clearAt);
    tl.to(activeRefs.current.filter(Boolean), { opacity:0, scale:0.9, duration:CLEAR_DUR, ease:FADE_EASE }, clearAt);
    tl.to(pulseRefs.current.filter(Boolean),  { opacity:0, duration:CLEAR_DUR, ease:FADE_EASE }, clearAt);
    tl.set(dotRefs.current.filter(Boolean),   { opacity:0, attr:{ r: DOT_R } }, clearAt);

    // NOTE: the grey outline cards are deliberately NOT faded at the end of a cycle.
    // They belong to the scene, not to one pass; fading them would blink the whole
    // board on every repeat. startDesktop owns their exit.
  };

  // ── STAGE 1 ───────────────────────────────────────────────────────────────
  // Dissolve the icon board — from wherever the loop happens to be — then draw the
  // wireframe and land the real dashboard. Scrolling back runs the whole thing in
  // reverse: dashboard fades, wireframe undraws, icons return.
  //
  // Built ONCE and then steered by scroll — play() to reveal, reverse() to unwind.
  // Deliberately `paused`, and deliberately not rebuilt: every tween below records
  // its start value when the timeline is CREATED, so a rebuilt timeline would
  // capture whatever half-faded state the board happened to be in and reverse to
  // that instead of to the icon board.
  const buildDesktop = () => {
    if (desktopTlRef.current) return desktopTlRef.current;

    // No completion callbacks baked in here. runTransition attaches them per run,
    // because a timeline's landing state depends on which direction it was sent —
    // two owners writing the same callback is how a reverse ends up reporting the
    // state a forward play was expecting.
    const tl = gsap.timeline({ paused: true });
    desktopTlRef.current = tl;
    allTweens.current.push(tl);

    // Clear whatever the loop left lit, plus any tooltip the user was hovering,
    // then the grey cards behind it all.
    tl.to(lineRefs.current.filter(Boolean),   { opacity:0, duration:0.45, ease:FADE_EASE }, 0);
    tl.to([...dotRefs.current, ...pulseRefs.current].filter(Boolean),
                                              { opacity:0, duration:0.45, ease:FADE_EASE }, 0);
    tl.to(activeRefs.current.filter(Boolean), { opacity:0, duration:0.45, ease:FADE_EASE }, 0);
    tl.to(hoverRefs.current.filter(Boolean),  { opacity:0, duration:0.30, ease:FADE_EASE }, 0);
    tl.to(tipRefs.current.filter(Boolean),    { opacity:0, y:5, duration:0.30, ease:FADE_EASE }, 0);
    tl.to(iconRefs.current.filter(Boolean),   { opacity:0, duration:0.55, ease:FADE_EASE }, 0.12);
    // Stop hit-testing once they are invisible, or the cards keep intercepting the
    // pointer over the dashboard that replaces them.
    tl.set(iconRefs.current.filter(Boolean),  { pointerEvents:'none' }, 0.70);

    // Gap must clear the icon-outline fade above (starts +0.12, runs 0.55) or the
    // wireframe starts drawing while grey cards are still dissolving over it.
    const wireAt = 0.80;

    tl.to(desktopWireGrpRef.current, { opacity:1, duration:0.25 }, wireAt);
    desktopWireRefs.current.forEach((p, i) => {
      if (!p) return;
      tl.to(p, { opacity:1, strokeDashoffset:0, duration:0.34, ease:'power2.out' }, wireAt + 0.04 + i * 0.035);
    });
    const wireFullAt = wireAt + 0.04 + DT_WIRE.length * 0.035 + 0.34;

    const revealAt = wireFullAt + 0.15;
    tl.to(desktopImgRef.current, { opacity:1, duration:0.80, ease:'power2.out' }, revealAt);
    tl.to(desktopWireGrpRef.current, { opacity:0, duration:0.60, ease:FADE_EASE }, revealAt + 0.20);
    tl.to(desktopPopupRef.current, {
      opacity: 1, x: 0, scale: 1,
      duration: 0.55, ease: 'back.out(1.6)',
    }, revealAt + 0.40);

    return tl;
  };

  // Unwinding runs a little quicker than building. A reveal earns its time — it is
  // showing the user something new — but replaying the same beats backwards at the
  // same pace feels like being held up, and the user is scrolling AWAY.
  const REVERSE_RATE = 2.8;

  // The ONLY place a timeline is started. Every entry point routes through here, so
  // there is exactly one owner per transition and no two can be pointed at once.
  //
  // Completion callbacks are attached per run rather than baked into the timelines:
  // the same phone timeline serves both DESKTOP→MOBILE and MOBILE→DESKTOP, and each
  // direction has to report a different landing state to the machine.
  // A function DECLARATION, not a const arrow: getMachine above holds a reference to
  // it, and only a hoisted binding is legitimately readable from code written earlier
  // in the body. Same for applyState below.
  function runTransition(from, to, done) {
    // icons → desktop
    if (from === ST_ICONS && to === ST_DESKTOP) {
      const tl = buildDesktop();
      // PAUSE the icon loop, never kill it. Reversing has to hand the board back to
      // this exact timeline, and a killed one cannot be resumed. Pausing also leaves
      // every element at its current opacity, so the fades take over from there and
      // the handover stays continuous whichever frame we interrupted.
      iconsTlRef.current?.pause();
      // Re-record start values when replaying from the top. GSAP caches a tween's
      // start value the first time it renders, but the icon loop has kept running
      // and been paused on a DIFFERENT frame since — without this a second forward
      // play snaps the board back to the first play's frame before fading.
      if (tl.progress() === 0) tl.invalidate();
      tl.timeScale(2.4);
      tl.eventCallback('onComplete', done);
      tl.play();
      return;
    }

    // desktop → icons
    if (from === ST_DESKTOP && to === ST_ICONS) {
      const tl = desktopTlRef.current;
      if (!tl) return done();
      tl.timeScale(REVERSE_RATE);
      tl.eventCallback('onReverseComplete', done);
      tl.reverse();
      return;
    }

    // desktop → mobile
    if (from === ST_DESKTOP && to === ST_MOBILE) {
      const tl = phoneTlRef.current;
      if (!tl) return done();
      tl.timeScale(2.4);
      tl.eventCallback('onComplete', done);
      tl.play();
      return;
    }

    // mobile → desktop
    if (from === ST_MOBILE && to === ST_DESKTOP) {
      const tl = phoneTlRef.current;
      if (!tl) return done();
      tl.timeScale(REVERSE_RATE);
      tl.eventCallback('onReverseComplete', done);
      tl.reverse();
      return;
    }

    // Unreachable while the machine only animates adjacent states, but landing the
    // transition rather than silently holding it means a future non-adjacent pair
    // cannot leave the machine waiting for a missing completion.
    done();
  }

  // ── Place the scene on a state outright ───────────────────────────────────
  // The machine's RESOLVE path (see section-machine): no animation, no scroll
  // movement, no lock — just the frame that belongs to `state`. This is what runs
  // when the user flies past the section, drags the scrollbar through it, presses
  // Skip, or the page is remeasured under them.
  //
  // Clearing the timelines' callbacks FIRST is load-bearing. Both carry whatever
  // landing callback the last runTransition attached, and seeking a timeline fires
  // them — reporting a state the machine has already moved past, which would put the
  // committed state and the visible frame permanently out of step.
  //
  // Only timelines that already exist are touched, except where the target state
  // needs one: a scene that has never left the icon board has nothing to unwind.
  function applyState(state) {
    const desktopTl = desktopTlRef.current;
    const phoneTl   = phoneTlRef.current;

    for (const tl of [desktopTl, phoneTl]) {
      if (!tl) continue;
      tl.eventCallback('onComplete', null);
      tl.eventCallback('onReverseComplete', null);
      tl.timeScale(1);
    }

    if (state === ST_ICONS) {
      // Unwound in reverse order, so the board is uncovered from the top down: the
      // phone lifts off the dashboard, then the dashboard gives the icons back. Both
      // are instant seeks, but keeping the order honest costs nothing and means the
      // frame is never momentarily inconsistent.
      phoneTl?.progress(0).pause();
      desktopTl?.progress(0).pause();
      // ST_ICONS means the loop owns the board again — the same hand-over a normal
      // reverse performs when it lands here.
      if (inViewRef.current) {
        if (iconsTlRef.current) iconsTlRef.current.resume(); else play();
      } else iconsTlRef.current?.pause();
      return;
    }

    iconsTlRef.current?.pause();

    if (state === ST_DESKTOP) {
      phoneTl?.progress(0).pause();
      buildDesktop().progress(1).pause();
      return;
    }

    buildDesktop().progress(1).pause();
    phoneTl?.progress(1).pause();
  }

  // Built on first use rather than during render, and defined HERE rather than up
  // with machineRef because it names runTransition and applyState above it. The
  // closures it hands the machine touch refs only, so the first render's are correct
  // for the life of the component.
  const getMachine = () => {
    if (!machineRef.current) {
      machineRef.current = createSectionMachine({
        states: 3,
        forward:  [0, TO_DESKTOP, TO_MOBILE],
        backward: [TO_ICONS, TO_DESK_BACK, 0],
        runTransition,
        applyState,
      });
    }
    return machineRef.current;
  };

  // ── Pinned phone reveal ───────────────────────────────────────────────────
  // The desktop dashboard lands via the intro timeline and stays. Scrolling into the
  // section then pins the whole row and plays the phone in over the top of it.
  //
  // Trigger is the parent .ss-row, not this element: the row is what actually travels
  // through the viewport, and it is the box that needs pinning.
  useLayoutEffect(() => {
    const el = outerRef.current;
    const row = el?.closest('.ss-row');
    if (!el || !row) return;
    const panel = el.closest('.ss-anim-panel') || el;
    const machine = getMachine();
    const buildPhoneTl = () => {
      gsap.set(mobileRef.current, { opacity: 0, yPercent: 4 });
      gsap.set(mobilePopupRef.current, { opacity: 0, x: -10 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
      tl.to(mobileRef.current, { opacity: 1, yPercent: 0, duration: 0.9 }, 0);
      tl.to(mobilePopupRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'back.out(1.6)' }, 0.65);
      phoneTlRef.current = tl;
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const callbacks = {
        onUpdate: self => machine.onScroll(self),
        onRefresh: self => machine.onRefresh(self),
        onLeave: () => machine.onLeave(),
        onLeaveBack: () => machine.onLeaveBack(),
      };

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        pinnedRef.current = true;
        buildPhoneTl();
        const trigger = ScrollTrigger.create({
          trigger: row,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.0,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          ...callbacks,
        });
        machine.setTrigger(trigger);
        if (inViewRef.current) play();
        return () => { pinnedRef.current = false; machine.setTrigger(null); };
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        buildPhoneTl();
        const trigger = ScrollTrigger.create({
          // Measure the artwork, not the long text column above it.
          trigger: panel,
          start: 'top 85%',
          end: 'bottom 20%',
          invalidateOnRefresh: true,
          ...callbacks,
        });
        machine.setTrigger(trigger);
        if (inViewRef.current) play();
        return () => machine.setTrigger(null);
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        buildPhoneTl();
        machine.setTrigger(null);
        machine.showStatic();
        return () => machine.reset();
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // ── Skip ──────────────────────────────────────────────────────────────────
  // Called by the section's Skip button just BEFORE the page starts moving.
  //
  // The scene is jumped to the frame that belongs to the EDGE the user is leaving
  // by, not torn down: they are about to watch this section slide off screen, and
  // it should look settled as it goes. Going down that is the finished frame —
  // dashboard and phone landed. Going up it is the arrival frame — the icon board,
  // looping, exactly as someone scrolling down into the section would first meet
  // it. Playing the remaining transitions out is not an option either way: they
  // run on wall-clock time and the page is already moving.
  //
  // Resolve the visual immediately so a skip never waits for a transition.
  const skipToEnd = (direction = 'down') => getMachine().skip(direction);

  // Called once the skip's scroll has come to rest. Re-evaluating against the
  // landing position is what lets a user turn round and come straight back into
  // the section, and have it run normally rather than be stuck on the frame the
  // skip left it on.
  const endSkip = () => getMachine().endSkip();

  return (
    <div
      ref={el => {
        outerRef.current = el;
        if (el) { el.__play = play; el.__stop = stop; el.__skip = skipToEnd; el.__endSkip = endSkip; }
        if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
      }}
      style={{ position:'relative', width:'100%', height: H * scale, overflow:'visible', display:'flex', justifyContent:'center', alignItems:'flex-start' }}
    >
      <div style={{
        position:'relative',
        width: W * scale, height: H * scale,
        flexShrink: 0,
      }}>
      <div style={{
        position:'absolute', top:0, left:0,
        width:W, height:H,
        transform:`scale(${scale})`, transformOrigin:'top left',
      }}>
      <GlobalDefs/>

      {/* z=0 — connection lines */}
      <svg ref={linesRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'visible' }}>
        <defs>
          {/* filterUnits MUST be userSpaceOnUse. The default (objectBoundingBox)
              sizes the filter region from the path's own bbox, and a perfectly
              vertical or horizontal line has a ZERO-width/height bbox — the region
              collapses to zero area and the browser renders nothing at all. That is
              why the straight grid→wrench drop and route→bell run were invisible
              while every elbowed line drew fine. */}
          <filter id="s1line_glow" filterUnits="userSpaceOnUse"
            x={-40} y={-40} width={W + 80} height={H + 80}>
            <feGaussianBlur stdDeviation="0.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Halo for the travelling dot. Deliberately tight — a single soft pass at
              low deviation. The previous version blurred at 4 and merged the result
              twice, which stacked into an opaque bloom roughly three times the dot's
              own size and buried the fine stroke it is supposed to be riding. */}
          <filter id="s1dot_glow" filterUnits="userSpaceOnUse"
            x={-40} y={-40} width={W + 80} height={H + 80}>
            {/* Halo only, drawn UNDER an untouched SourceGraphic. Blurring the source
                and merging it back is what previously softened the dot itself into a
                haze; keeping the core out of the blur is what lets the glow grow
                without the centre ever losing its edge. */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur"/>
            <feComponentTransfer in="blur" result="halo">
              <feFuncA type="linear" slope="1.25"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="halo"/>
              <feMergeNode in="halo"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Solid white core out to 55%, then a fast fall-off through blue to fully
              transparent. The flat core is what makes the dot punch; the transparent
              rim is what keeps the halo blending into the line instead of ending on
              a visible disc edge. */}
          <radialGradient id="dotGradient">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="55%"  stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="72%"  stopColor="#93c5fd" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {FLOW.map((f, i) => (
          <path key={`${f.from}-${f.to}`} ref={el => (lineRefs.current[i] = el)} d={f.d}
            stroke={`url(#s1lg${i})`} strokeWidth="1.1" fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity="0"
            filter="url(#s1line_glow)"/>
        ))}
        {/* Lead pulses — one per link, drawn after the paths so a pulse always rides
            ON TOP of the stroke it is following. */}
        {FLOW.map((f, i) => (
          <circle key={`dot-${f.from}-${f.to}`} ref={el => (dotRefs.current[i] = el)}
            cx="0" cy="0" r={DOT_R} fill="url(#dotGradient)" opacity="0"
            filter="url(#s1dot_glow)"/>
        ))}
        {/* Follow pulses — a second one per link, sent along the finished stroke so
            the connection keeps carrying current while the next link is drawn. Same
            geometry and gradient as the lead pulse; only its timing differs. */}
        {FLOW.map((f, i) => (
          <circle key={`pulse-${f.from}-${f.to}`} ref={el => (pulseRefs.current[i] = el)}
            cx="0" cy="0" r={DOT_R} fill="url(#dotGradient)" opacity="0"
            filter="url(#s1dot_glow)"/>
        ))}
      </svg>

      {/* z=2 — desktop outline + wireframe (back layer, the only wireframe in the scene) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', overflow:'visible' }}>
        <path ref={desktopFrameRef} d={DT_PATH}
          stroke="none" fill="none" opacity="0"/>
        <g ref={desktopWireGrpRef} opacity="0">
          {DT_WIRE.map((d, i) => (
            <path key={i} ref={r => (desktopWireRefs.current[i] = r)} d={d}
              stroke="url(#s1pg_w)" strokeWidth="0.7" fill="rgba(59,130,246,0.02)"
              strokeLinecap="round" strokeLinejoin="round" opacity="0" filter="url(#s1bgl)"/>
          ))}
        </g>
      </svg>

      {/* z=6 — phone, front layer. White bezel + deeper shadow lift it off the browser. */}
      <div
        ref={mobileRef}
        style={{
          position:'absolute',
          left:PHONE_X, top:PHONE_Y,
          width:PHONE_W, height:PHONE_H,
          borderRadius:PHONE_R,
          overflow:'hidden',
          opacity:0,
          zIndex:6,
          pointerEvents:'none',
          willChange:'opacity',
          border:'5px solid #fff',
          boxShadow:'0 22px 50px rgba(15,23,42,0.22), 0 6px 16px rgba(15,23,42,0.12)',
          background:'#fff',
        }}
      >
        {/* ViewportImage loads all layers before the section arrives, including
            layers still hidden by the timeline, without document preloads. */}
        <Image
          src="/showcase/mobile-app.webp"
          alt="Mobile app interface"
          fill
          sizes={`${PHONE_W}px`}
          style={{ objectFit:'cover', objectPosition:'center top' }}
        />
      </div>

      {/* z=5 — desktop browser window (Mac chrome + image), back layer */}
      <div
        ref={desktopImgRef}
        style={{
          position:'absolute',
          left:DT_X, top:DT_Y,
          width:DT_W, height:DT_H,
          borderRadius:DT_R,
          overflow:'hidden',
          opacity:0,
          zIndex:5,
          pointerEvents:'none',
          willChange:'opacity',
          boxShadow:'0 18px 50px rgba(15,23,42,0.18), 0 4px 14px rgba(15,23,42,0.08)',
          background:'#fff',
          display:'flex',
          flexDirection:'column',
        }}
      >
        <BrowserChrome />
        <div style={{ position:'relative', flex:1, background:'#fff' }}>
          {/* The big one — this is the panel that was visibly empty at scrollY 1800. */}
          <Image
            src="/showcase/desktop-dashboard.webp"
            alt="Desktop dashboard interface"
            fill
            sizes={`${DT_W}px`}
            style={{ objectFit:'contain', objectPosition:'left top' }}
          />
        </div>
      </div>

      {/* z=7 — hover popup card over desktop sidebar empty area */}
      <div
        ref={desktopPopupRef}
        onMouseEnter={() => gsap.to(desktopPopupRef.current, { scale: 1.12, duration: 0.35, ease: 'power3.out', transformOrigin: 'left center' })}
        onMouseLeave={() => gsap.to(desktopPopupRef.current, { scale: 1, duration: 0.35, ease: 'power3.out', transformOrigin: 'left center' })}
        style={{
          position:'absolute',
          // Pushed further left of the desktop frame's own left edge (DT_X) than
          // before, and allowed to go negative — the outer canvas is
          // overflow:'visible' on the pinned (desktop) breakpoint this popup
          // actually matters on, so it sits just off the mockup's edge rather than
          // flush against it. Still expressed as an offset FROM DT_X, so it tracks
          // the desktop image if that ever moves.
          left: DT_X - 52,
          top: DT_Y + 130 * DSY,
          // *DSX/DSY throughout, same as before — sized relative to the desktop
          // image's own scale, just a smaller fraction of it (225/250 ≈ 90%).
          width: 225 * DSX,
          height: 54 * DSY,
          opacity: 0,
          zIndex: 7,
          pointerEvents: 'auto',
          cursor: 'pointer',
          willChange: 'opacity, transform',
          transformOrigin: 'left center',
        }}
      >
        <Image
          src="/showcase/vehicle-hover-popup.webp"
          alt="Vehicle hover popup"
          fill
          sizes="225px"
          style={{ objectFit:'contain', objectPosition:'left top' }}
        />
      </div>

      {/* z=50 — hover Map/Satellite bar over mobile top-left empty area */}
      <div
        ref={mobilePopupRef}
        onMouseEnter={() => gsap.to(mobilePopupRef.current, { scale: 1.18, duration: 0.35, ease: 'power3.out', transformOrigin: 'left center' })}
        onMouseLeave={() => gsap.to(mobilePopupRef.current, { scale: 1, duration: 0.35, ease: 'power3.out', transformOrigin: 'left center' })}
        style={{
          position:'absolute',
          left: PHONE_X - 22,
          top: PHONE_Y + 68 * PSY,
          width: 250 * PSX,
          height: 44 * PSY,
          opacity: 0,
          zIndex: 8,
          pointerEvents: 'auto',
          cursor: 'pointer',
          willChange: 'opacity, transform',
          transformOrigin: 'left center',
        }}
      >
        <Image
          src="/showcase/map-satellite-toggle.png"
          alt="Map/Satellite toggle"
          fill
          sizes="110px"
          style={{ objectFit:'contain', objectPosition:'left top' }}
        />
      </div>

      {/* Icons — outline always visible, active overlay GSAP-driven */}
      {ICONS.map((ic, i) => (
        <div key={ic.id}
          ref={el => (iconRefs.current[i] = el)}
          onMouseEnter={() => hoverIcon(i, true)}
          onMouseLeave={() => hoverIcon(i, false)}
          style={{
            position:'absolute', left:ic.left, top:ic.top,
            width:ic.size, height:ic.size,
            zIndex: ic.layer === 'center' ? 4 : 7,
            // Hover needs hit-testing. startDesktop switches this back to 'none'
            // once the icons have faded, so invisible cards can't swallow pointer
            // events over the dashboard underneath them.
            pointerEvents:'auto',
            willChange:'opacity',
          }}
        >
          <InactiveCard id={ic.id} size={ic.size}/>
          <div ref={el => (activeRefs.current[i] = el)}
            style={{ position:'absolute', inset:0, opacity:0, willChange:'opacity' }}>
            <ActiveCard id={ic.id} size={ic.size}/>
          </div>

          {/* Hover colour is a SECOND active layer rather than a reuse of the one
              above: the looping timeline owns that element's opacity, and driving
              the same property from two places makes them fight mid-beat. */}
          <div ref={el => (hoverRefs.current[i] = el)}
            style={{ position:'absolute', inset:0, opacity:0, pointerEvents:'none', willChange:'opacity' }}>
            <ActiveCard id={ic.id} size={ic.size}/>
          </div>

          <div ref={el => (tipRefs.current[i] = el)}
            style={{
              position:'absolute',
              // Hangs off the card's bottom corner, overlapping it slightly so the
              // label reads as attached to the icon rather than floating near it.
              top: ic.size - 12,
              ...(ic.flip
                ? { right: Math.round(ic.size * 0.45) }
                : { left:  Math.round(ic.size * 0.45) }),
              padding:'5px 10px',
              borderRadius:4,
              background: TIP_BG,
              color:'#ffffff',
              fontSize:12,
              fontWeight:700,
              lineHeight:1.3,
              whiteSpace:'nowrap',
              boxShadow:'0 6px 20px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.12)',
              opacity:0,
              transform:'translateY(5px)',
              pointerEvents:'none',
              willChange:'opacity, transform',
            }}
          >
            {ic.label}
          </div>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
});
