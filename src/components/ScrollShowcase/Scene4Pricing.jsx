'use client';
import { forwardRef, useLayoutEffect, useRef, useEffect, useState } from 'react';
import Image from '@/components/common/ViewportImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrowserChrome from './BrowserChrome';
import { createSectionMachine } from './section-machine';

gsap.registerPlugin(ScrollTrigger);

// See Scene1Icons: a URL-bar resize is not a layout change worth reverting every pin
// on the page for. Idempotent and global — set in both scenes so neither depends on
// the other having mounted first.
ScrollTrigger.config({ ignoreMobileResize: true });

const W = 580, H = 400;
const FX = 48, FY = 18, FW = 500, FH = 355, FR = 13;
const FX2 = FX + FW, FY2 = FY + FH;
const SBW = 170;
const FRAME_PERIM = Math.round(2*(FW-FR*2) + 2*(FH-FR*2) + 2*Math.PI*FR);
const FRAME_PATH = `M${FX+FR} ${FY}H${FX2-FR}Q${FX2} ${FY} ${FX2} ${FY+FR}V${FY2-FR}Q${FX2} ${FY2} ${FX2-FR} ${FY2}H${FX+FR}Q${FX} ${FY2} ${FX} ${FY2-FR}V${FY+FR}Q${FX} ${FY} ${FX+FR} ${FY}Z`;

const CY = FY + 34;
const CW = FX2 - (FX + SBW);
const CH = FY2 - CY;
const CellW = Math.floor((CW - 6) / 2);
const CellH = Math.floor((CH - 6) / 2);

function rp(x, y, w, h, r = 0) {
  if (!r) return `M${x} ${y}H${x+w}V${y+h}H${x}Z`;
  return `M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
}

const WIRE = [
  rp(FX+1, CY, SBW-2, FY2-CY, 0),
  rp(FX+3, CY+2, SBW-6, 27, 3),
  rp(FX+3, CY+31, SBW-6, 52, 2),
  rp(FX+3, CY+85, SBW-6, 52, 2),
  rp(FX+3, CY+139, SBW-6, 52, 2),
  rp(FX+3, CY+193, SBW-6, 52, 2),
  rp(FX+3, CY+247, SBW-6, 52, 2),
  rp(FX+3, FY2-30, SBW-6, 24, 4),
  rp(FX+SBW+2, CY+2, CellW, CellH, 5),
  rp(FX+SBW+2+CellW+4, CY+2, CellW, CellH, 5),
  rp(FX+SBW+2, CY+2+CellH+4, CellW, CellH, 5),
  rp(FX+SBW+2+CellW+4, CY+2+CellH+4, CellW, CellH, 5),
];

// Tooltip pill background. One shared neutral grey for every icon — the colour in
// this scene belongs to the active icons and the connection lines; a coloured pill
// competes with them and makes the board read as five unrelated brands.
const TIP_BG = 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';

// `label` drives the hover tooltip. Where a label matches a feature card title in the
// text panel, hovering the icon names the same capability the copy describes; the two
// that do not (`play`, `alert`) name the intermediate steps of the flow, since there
// are five icons and only four feature cards.
// `flip` hangs the tooltip to the LEFT of the card — required for `ai`, which sits at
// x=480 in a 580-wide scene, so a right-hanging pill would run clean off the board.
const ICONS = [
  { id:'cam',    left:6,   top:60,  size:54, layer:'outer',  label:'Live HD Video' },           // 0
  { id:'shield', left:6,   top:266, size:54, layer:'outer',  label:'Collision Prevention' },    // 1
  { id:'ai',     left:480, top:50,  size:54, layer:'outer',  label:'Operational Efficiency', flip:true }, // 2
  { id:'play',   left:160, top:120, size:50, layer:'center', label:'On-Demand Footage' },       // 3 — inside frame
  { id:'alert',  left:340, top:160, size:50, layer:'center', label:'Instant Driver Alerts' },   // 4 — inside frame
];

// Card edges, DERIVED from ICONS. Every connection endpoint is read from here, so
// the lines track any change to a position or size and always land flush on the card
// they point at. These used to be hand-typed coordinates baked into the path strings,
// which silently drifted out of sync each time the layout moved — that drift is what
// left visible gaps between a line's end and the icon it was supposed to touch.
const E = Object.fromEntries(ICONS.map(ic => [ic.id, {
  cx: ic.left + ic.size / 2, cy: ic.top + ic.size / 2,
  l:  ic.left,               r:  ic.left + ic.size,
  t:  ic.top,                b:  ic.top  + ic.size,
}]));

const R = 12; // corner radius shared by every elbow

// Resting radius of the travelling dot. Visibility comes from a bright solid core
// rather than sheer size — the background is a very pale #f5f7fa, so a crisp white
// centre with a defined blue edge carries further than a large soft disc.
// Kept deliberately small so it reads as a current pulse rather than as a marker or
// a progress indicator being dragged along. Matches Scene1Icons.
const DOT_R = 4.2;

// How far BEHIND the line's leading edge the dot rides, in path units. Matches
// Scene1Icons exactly so both sections read identically. The line leads, the dot
// follows — which is what reads as current flowing along a wire that is already
// there. Sampling at exactly the wavefront put the dot on the very tip of the
// stroke, so it looked like it was dragging the line out behind it.
const DOT_TRAIL = 16;

// Elbow shapes, named for the axis order they travel. Each takes two points that
// already sit ON a card edge and routes between them with rounded corners.
// A leaves a vertical (left/right) edge, B enters a vertical edge.
const hvh = (ax, ay, bx, by) => {
  const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
  const bend = bx - dx * R;
  return `M ${ax} ${ay} H ${bend - dx * R} Q ${bend} ${ay} ${bend} ${ay + dy * R}`
       + ` V ${by - dy * R} Q ${bend} ${by} ${bx} ${by}`;
};
// A leaves a vertical edge, B enters a horizontal (top/bottom) edge.
const hv = (ax, ay, bx, by) => {
  const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
  return `M ${ax} ${ay} H ${bx - dx * R} Q ${bx} ${ay} ${bx} ${ay + dy * R} V ${by}`;
};

// ── The flow ──────────────────────────────────────────────────────────────────
// The board tells ONE connected story, played start to finish in this order:
//
//   Live HD Video ──▶ Footage Review ──▶ AI Analysis ──▶ Driver Alert ──▶ Collision
//                                                                        Prevented
//
// Same contract as Scene1Icons' FLOW, and it is load-bearing in the same two ways:
//
//   · every link's `from` is either the very first icon or the `to` of an EARLIER
//     link, so the signal is handed forward and no link ever starts from a cold card.
//   · order is meaningful — each step assumes its source is already lit, so FLOW
//     cannot be reordered without re-checking that invariant.
//
// ROUTING RULE: no two links may run parallel and adjacent, and a link must never
// enter a card on the same edge that the next link leaves it by — `play → ai` used to
// arrive at ai's left edge along y=77, which is exactly where `ai → alert` departs,
// so the two would have doubled back over each other. It now enters ai's BOTTOM edge.
//
// This replaces a 5-entry CONNECTIONS/PAIRS pair of arrays that had to be kept
// index-aligned by hand, of which only 3 were ever animated.
const link = (from, to, a, b, shape, c1, c2) => ({
  from, to, a, b, c1, c2,
  d: shape(a[0], a[1], b[0], b[1]),
});

const FLOW = [
  link('cam',   'play',   [E.cam.r,   E.cam.cy],   [E.play.cx,   E.play.t],   hv,  '#6366f1', '#3b82f6'),
  link('play',  'ai',     [E.play.r,  E.play.cy],  [E.ai.cx,     E.ai.b],     hv,  '#3b82f6', '#0d4fd4'),
  link('ai',    'alert',  [E.ai.l,    E.ai.cy],    [E.alert.cx,  E.alert.t],  hv,  '#0d4fd4', '#f59e0b'),
  link('alert', 'shield', [E.alert.l, E.alert.cy], [E.shield.r,  E.shield.cy], hvh, '#ef4444', '#0d4fd4'),
];

// id → index into ICONS, which is the same index activeRefs/iconRefs use.
const IDX = Object.fromEntries(ICONS.map((ic, i) => [ic.id, i]));

function GlobalDefs() {
  return (
    <svg width="0" height="0" style={{ position:'absolute' }}>
      <defs>
        <linearGradient id="s4ig_cam"    x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="s4ig_shield" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#0d4fd4"/></linearGradient>
        <linearGradient id="s4ig_ai"     x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#0d4fd4"/></linearGradient>
        <linearGradient id="s4ig_play"   x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
        <linearGradient id="s4ig_alert"  x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ef4444"/></linearGradient>
        {/* One gradient per link, generated FROM FLOW rather than hand-written beside
            it. userSpaceOnUse anchors each ramp to the exact two edge points its path
            runs between, so moving an icon moves the path and the colour together —
            the previous hand-maintained list stranded ramps on old geometry every
            time the layout shifted. */}
        {FLOW.map((f, i) => (
          <linearGradient key={i} id={`s4lg${i}`} gradientUnits="userSpaceOnUse"
            x1={f.a[0]} y1={f.a[1]} x2={f.b[0]} y2={f.b[1]}>
            <stop offset="0%" stopColor={f.c1}/><stop offset="100%" stopColor={f.c2}/>
          </linearGradient>
        ))}
        <linearGradient id="s4pg_w" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#0d4fd4"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function InactiveCard({ id, size }) {
  const r = Math.round(size * 0.24);
  const s = Math.round(size * 0.50);
  const c = '#c8d0dc';
  const shapes = {
    cam:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="15" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M17 9l5-3v12l-5-3V9z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    shield: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    ai:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    play:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.5"/><polygon points="10,8 10,16 18,12" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/></svg>,
    alert:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="17" r="0.8" fill={c}/></svg>,
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
    cam:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="15" height="14" rx="2" fill="url(#s4ig_cam)"/><path d="M17 9l5-3v12l-5-3V9z" fill="url(#s4ig_cam)"/></svg>,
    shield: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#s4ig_shield)"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    ai:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="url(#s4ig_ai)"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="url(#s4ig_ai)" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    play:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="s4p_play" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><circle cx="12" cy="12" r="10" fill="url(#s4p_play)"/><polygon points="10,7.5 10,16.5 18.5,12" fill="white"/></svg>,
    alert:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="s4p_alert" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="url(#s4p_alert)"/><line x1="12" y1="9" x2="12" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17.5" r="1.2" fill="white"/></svg>,
  };
  return (
    <div style={{ width:size, height:size, borderRadius:r, background:'#fff', boxShadow:'0 6px 24px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {inner[id]}
    </div>
  );
}

export default forwardRef(function Scene4Pricing(_props, ref) {
  const activeRefs   = useRef([]);
  const iconRefs     = useRef([]);
  const lineRefs     = useRef([]);
  const dotRefs      = useRef([]);   // lead pulse — rides the line as it draws
  const pulseRefs    = useRef([]);   // follow pulse — keeps the finished line live
  const hoverRefs    = useRef([]);
  const tipRefs      = useRef([]);
  const framePathRef = useRef(null);
  const wireRefs     = useRef([]);
  const wireGrpRef   = useRef(null);
  const videoImgRef  = useRef(null);
  const popupRef     = useRef(null);
  const allTweens    = useRef([]);
  const linesRef     = useRef(null);
  const outerRef     = useRef(null);
  const playedRef    = useRef(false);
  const inViewRef    = useRef(false);
  const [scale, setScale] = useState(1);

  // ── State machine ─────────────────────────────────────────────────────────
  // Same machine as Scene1Icons, one state shorter — this scene has only one
  // device to reveal, so there is no mobile step:
  //
  //     ST_ICONS  ⇄  ST_DESKTOP
  //
  // The ST_ prefix matters: `ICONS` is already the module-level array of icon
  // definitions, which hoverIcon and the JSX both read. An unprefixed state
  // constant would shadow it and turn `ICONS.map(...)` into a call on the number 0.
  //
  // Gating is on the trigger's OWN progress — a fixed fraction of the section's
  // scroll range. The previous gate measured pixels travelled from an anchor
  // stamped whenever the icon loop happened to finish a pass, and that anchor
  // landed wherever the user was at that instant, so the same gesture needed a
  // different amount of scroll every time.
  //
  // The machine itself lives in section-machine, shared with Scene1Icons; only the
  // state layout, runTransition and applyState are this scene's own. Its header is
  // where the reasoning about WHEN each of those may run lives.
  const ST_ICONS = 0, ST_DESKTOP = 1;
  const iconsTlRef   = useRef(null);
  const desktopTlRef = useRef(null);
  // Pin layout is tracked only to avoid unnecessary measurement refreshes.
  const pinnedRef    = useRef(false);

  // Per-state thresholds — the boundary that applies depends on which way you are
  // travelling, which is the hysteresis: there is no single point where a few
  // pixels of scroll jitter can flap the state in and out.
  const TO_DESKTOP = 0.34;  // icons   → desktop
  const TO_ICONS   = 0.26;  // desktop → icons

  const machineRef = useRef(null);

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
  }, []);

  // NOT refreshed on the pinned branch, and that omission is deliberate — see the
  // long note in Scene1Icons. Reverting every pin to remeasure deletes both rows'
  // spacers for a frame, which is what let the hero flicker back into view mid-page;
  // and up here the pin's start/end are anchored to the viewport, not to this scene's
  // scale, so there was never anything to remeasure. The unpinned branch below
  // 1024px does measure the row's real height, so it still asks — one frame late so
  // the new scale is laid out, and through ScrollTrigger's deferred scheduler, which
  // holds the work until scrolling stops.
  const measuredRef = useRef(false);
  useEffect(() => {
    if (!measuredRef.current) { measuredRef.current = true; return; }
    if (pinnedRef.current) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh(true));
    return () => cancelAnimationFrame(id);
  }, [scale]);

  // The scene is a one-shot per stage now, so leaving the viewport must NOT kill
  // anything — doing that left the dashboard stuck part-drawn on scroll-out.
  // Cleanup happens on unmount instead (see the effect above).
  const stop = () => { inViewRef.current = false; iconsTlRef.current?.pause(); };

  // Gentle curves, matching Scene1Icons. sine has the softest acceleration of the
  // standard eases, so the line draw reads as one continuous glide; power3/power2.in
  // were punchier at the ends and made the same motion look abrupt.
  const LINE_EASE = 'sine.inOut';
  const FADE_EASE = 'sine.inOut';

  const getLen = (p) => { try { return p.getTotalLength(); } catch { return 400; } };

  // ── Icon hover ────────────────────────────────────────────────────────────
  // Colours the card and slides its tooltip out. Only meaningful during stage 0 —
  // once the dashboard build starts the icons are on their way out, so hovering a
  // dissolving card would fight the fade.
  const hoverIcon = (i, on) => {
    const card = iconRefs.current[i];
    // The machine exists by the time any pointer can reach an icon — it is built in
    // the layout effect that creates the triggers — but a hover before that would
    // simply be the arrival board, which is hoverable.
    const machine = machineRef.current;
    if (!card || (machine && (machine.getState() !== ST_ICONS || machine.isBusy()))) return;

    // Lift the hovered card so its tooltip can cross over neighbouring icons, which
    // sit on their own z-layers. Restored to the resting layer on exit.
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
    gsap.set(iconRefs.current.filter(Boolean),   { opacity:1, pointerEvents:'auto' });
    gsap.set(activeRefs.current.filter(Boolean), { opacity:0, scale:0.9, transformOrigin:'50% 50%' });
    gsap.set(hoverRefs.current.filter(Boolean),  { opacity:0 });
    gsap.set(tipRefs.current.filter(Boolean),    { opacity:0, y:5 });
    gsap.set(wireGrpRef.current,   { opacity: 0 });
    gsap.set(framePathRef.current, { opacity: 0, strokeDashoffset: FRAME_PERIM });
    gsap.set(videoImgRef.current,  { opacity: 0 });
    gsap.set(popupRef.current,     { opacity: 0, x: -12, scale: 0.96 });
    lineRefs.current.filter(Boolean).forEach(p => {
      const len = getLen(p);
      gsap.set(p, { opacity:0, strokeDasharray:`${len} ${len+1}`, strokeDashoffset:len });
    });
    // Travelling dots back to their resting radius. `r` is animated as an ATTRIBUTE
    // rather than a transform: position is driven by cx/cy attrs during travel, and a
    // CSS transform would scale the dot about the SVG origin instead of its own
    // centre, throwing it off the line.
    [...dotRefs.current, ...pulseRefs.current].filter(Boolean).forEach(d => {
      gsap.set(d, { opacity: 0, attr: { r: DOT_R } });
    });
    wireRefs.current.forEach(el => {
      if (!el) return;
      const len = getLen(el);
      gsap.set(el, { strokeDasharray: `${len} ${len+1}`, strokeDashoffset: len, opacity: 0 });
    });
  };

  // ── STAGE 0 ───────────────────────────────────────────────────────────────
  // Icons and their connections, looping. All the user sees on arrival; the video
  // dashboard is not part of this timeline and cannot appear until they scroll.
  const play = () => {
    // Guarded: the row re-enters the viewport whenever the user scrolls back up,
    // and restarting would yank the scene back to stage 0 from wherever it got to.
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
    //
    // This loop no longer gates anything. It used to stamp a scroll anchor when a
    // pass completed, and the desktop could not appear until then — which meant the
    // scroll position that unlocked it differed on every visit, because the user was
    // still scrolling while the pass played. Where the states change is now decided
    // purely by how far down the section the user is.
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    iconsTlRef.current = tl;
    allTweens.current.push(tl);

    // ── PHASE 1: ICON LINES ONLY — no wireframe visible
    //
    // ONE LINK AT A TIME, matching Scene1Icons. Each beat owns the board outright:
    //
    //   clear the previous link  →  line leaves the source  →  dot rides its leading
    //   edge  →  dot LANDS on the target  →  target lights on impact  →  hold
    //
    // Nothing accumulates. Lines drawn by earlier beats are gone, and the ONLY icons
    // in colour are the two ends of the connection currently being made. Letting the
    // board build up merges the links into what looks like a single continuous run
    // through the icons, no matter how they are timed or grouped.
    //
    // The source is never re-lit from grey, because FLOW is a chain — each link's
    // source is the previous link's target, so it is simply the one icon that does
    // NOT get cleared at the start of the beat. That is what makes the sequence read
    // as one signal walking the board rather than four unrelated pairs blinking.
    const CHAIN_START = 0.10;
    const ACT_DUR     = 0.30;  // icon grey → colour
    const LINE_LEAD   = 0.25;  // line leaves the source once the last one has cleared
    // Deliberately unhurried — the draw IS the content of this scene, so it is paced
    // to be followed rather than merely noticed. Paired with sine.inOut (LINE_EASE),
    // the gentlest standard curve, so it eases away from the source and settles into
    // the target without a hard edge at either end.
    const DRAW_DUR    = 1.05;  // line draw / dot travel, per link
    const CLEAR_DUR   = 0.40;  // previous line + stale icons back to grey
    // ── Continuous flow ──────────────────────────────────────────────────────
    // The instant a line finishes drawing, a SECOND pulse sets off along it, so the
    // completed connection stays visibly live while the next one begins. The next
    // beat starts when that follow pulse is PULSE_HANDOFF of the way along — half is
    // enough for the eye to read "this line is flowing", and holding for the
    // remainder only reintroduces the dead pause this replaces.
    //
    // Same numbers as Scene1Icons so both sections flow identically.
    const PULSE_DUR     = 0.90;  // follow pulse, source → target on the finished line
    const PULSE_HANDOFF = 0.50;  // fraction of it before the next beat takes over
    // Comes out at exactly the old LINE_LEAD + DRAW_DUR + HOLD: the static hold has
    // been swapped for the first half of the follow pulse, so the sequence keeps its
    // pacing and only the dead time is gone.
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
      // source back to grey. Filtering by "not the source" rather than naming icons
      // to clear is what keeps this correct as FLOW changes: a source that appears in
      // two consecutive links must survive both hand-overs, while a target that is
      // never a source has to be cleared by the beat after it.
      if (i > 0) {
        const prevLine = lineRefs.current[i - 1];
        if (prevLine) tl.to(prevLine, { opacity:0, duration:CLEAR_DUR, ease:FADE_EASE }, at);

        // The previous link's follow pulse is mid-flight right now — exactly
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
                // This runs every frame of every link; gsap.set builds a fresh tween
                // and plugin instance per call, and that per-frame allocation shows
                // up as micro-stutter along the path.
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
    // board on every repeat. The icons ⇄ desktop transition owns their exit.
  };

  // ── The icons ⇄ desktop transition ────────────────────────────────────────
  // Dissolve the icon board — from wherever the loop happens to be — then draw the
  // wireframe and land the real dashboard. Played forward to reveal and reversed to
  // unwind, so the two directions are the same beats in opposite order.
  //
  // Built ONCE and deliberately `paused`. Every tween below records its start value
  // when the timeline is CREATED, so rebuilding it would capture whatever half-faded
  // state the board happened to be in and reverse to that rather than to the icons.
  const buildDesktop = () => {
    if (desktopTlRef.current) return desktopTlRef.current;

    // No completion callbacks baked in here — runTransition attaches them per run,
    // because the landing state depends on which direction the timeline was sent.
    const tl = gsap.timeline({ paused: true });
    desktopTlRef.current = tl;
    allTweens.current.push(tl);

    // Clear whatever the loop left lit, then the grey cards behind it. The dots are
    // included: pausing the loop mid-beat can leave one parked on a path, and it
    // would otherwise sit there glowing over the dashboard that replaces the icons.
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
    tl.to(wireGrpRef.current, { opacity:1, duration:0.25 }, wireAt);
    wireRefs.current.forEach((p, i) => {
      if (!p) return;
      tl.to(p, { opacity:1, strokeDashoffset:0, duration:0.32, ease:'power2.out' }, wireAt + 0.04 + i * 0.05);
    });

    const wireFullAt = wireAt + 0.04 + WIRE.length * 0.05 + 0.32;
    const pngAt = wireFullAt + 0.15;
    tl.to(videoImgRef.current, { opacity:1, duration:0.85, ease:'power2.out' }, pngAt);

    // Wireframe fades out as video PNG takes over
    tl.to(wireGrpRef.current, { opacity:0, duration:0.65, ease:FADE_EASE }, pngAt + 0.20);

    // Popup card appears together with the video PNG
    tl.to(popupRef.current, {
      opacity: 1, x: 0, scale: 1,
      duration: 0.55, ease: 'back.out(1.6)',
    }, pngAt);

    // Ends here — the dashboard holds. The old timeline faded it back out after a
    // ~4.5s hold so the whole scene could loop; with the stage gated on scroll that
    // teardown would just blank the section out while the user is still reading it.

    return tl;
  };

  // Unwinding runs a little quicker than building. A reveal earns its time — it is
  // showing the user something new — but replaying the same beats backwards at the
  // same pace feels like being held up, and the user is scrolling AWAY.
  const REVERSE_RATE = 2.8;

  // The ONLY place a timeline is started. Every entry point routes through here, so
  // there is exactly one owner per transition and two can never be pointed at once.
  // A function DECLARATION, not a const arrow: getMachine above holds a reference to
  // it, and only a hoisted binding is legitimately readable from code written earlier
  // in the body. Same for applyState below.
  function runTransition(from, to, done) {
    const tl = buildDesktop();

    // icons → desktop
    if (from === ST_ICONS && to === ST_DESKTOP) {
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
      tl.timeScale(REVERSE_RATE);
      tl.eventCallback('onReverseComplete', done);
      tl.reverse();
      return;
    }

    // Unreachable with only two states, but landing the transition rather than
    // silently holding it means a future pair cannot wedge the machine shut with the
    // page still locked.
    done();
  }

  // ── Place the scene on a state outright ───────────────────────────────────
  // The machine's RESOLVE path (see section-machine): no animation, no scroll
  // movement, no lock — just the frame that belongs to `state`. This runs when the
  // user flies past the section, drags the scrollbar through it, presses Skip, or the
  // page is remeasured under them, and it is what keeps a section that has been left
  // behind from carrying on over the top of the one they arrived at.
  //
  // Clearing the timeline's callbacks FIRST is load-bearing: it carries whatever
  // landing callback the last runTransition attached, and seeking fires them —
  // reporting a state the machine has already moved past.
  function applyState(state) {
    const tl = buildDesktop();
    tl.eventCallback('onComplete', null);
    tl.eventCallback('onReverseComplete', null);
    tl.timeScale(1);

    if (state === ST_ICONS) {
      tl.progress(0).pause();
      // ST_ICONS means the loop owns the board again — the same hand-over a normal
      // reverse performs when it lands here.
      if (inViewRef.current) {
        if (iconsTlRef.current) iconsTlRef.current.resume(); else play();
      } else iconsTlRef.current?.pause();
      return;
    }

    iconsTlRef.current?.pause();
    tl.progress(1).pause();
  }

  // Built on first use rather than during render, and defined HERE rather than up
  // with machineRef because it names runTransition and applyState above it. The
  // closures it hands the machine touch refs only, so the first render's are correct
  // for the life of the component.
  const getMachine = () => {
    if (!machineRef.current) {
      machineRef.current = createSectionMachine({
        states: 2,
        forward:  [0, TO_DESKTOP],
        backward: [TO_ICONS, 0],
        runTransition,
        applyState,
      });
    }
    return machineRef.current;
  };

  // Trigger is the parent .ss-row, not this element: the row is what actually
  // travels through the viewport, and it is the box that needs pinning.
  useLayoutEffect(() => {
    const el = outerRef.current;
    const row = el?.closest('.ss-row');
    if (!el || !row) return;
    const panel = el.closest('.ss-anim-panel') || el;
    const machine = getMachine();

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
        const trigger = ScrollTrigger.create({
          trigger: row,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 0.65,
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
        machine.setTrigger(null);
        machine.showStatic();
        return () => machine.reset();
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // ── Skip ──────────────────────────────────────────────────────────────────
  // Called by the section's Skip button just BEFORE the page starts moving. Jumps
  // the scene to the frame belonging to the edge the user is leaving by — the landed
  // dashboard going down, the looping icon board going up. Any active transition
  // settles immediately. That is the machine's RESOLVE path: a fast scroll past
  // this section does, only asked for deliberately.
  const skipToEnd = (direction = 'down') => getMachine().skip(direction);

  // Called once the skip's scroll has come to rest, so turning round and coming
  // straight back into the section runs normally instead of leaving it stuck on
  // the frame the skip left it on.
  const endSkip = () => getMachine().endSkip();

  return (
    <div
      ref={el => {
        outerRef.current = el;
        if (el) { el.__play = play; el.__stop = stop; el.__skip = skipToEnd; el.__endSkip = endSkip; }
        if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
      }}
      style={{ position: 'relative', width: '100%', height: H * scale, overflow: 'visible', display:'flex', justifyContent:'center', alignItems:'flex-start' }}
    >
    <div style={{
      position: 'relative',
      width: W * scale, height: H * scale,
      flexShrink: 0,
    }}>
    <div style={{
      position: 'absolute', top: 0, left: 0,
      width: W, height: H,
      transform: `scale(${scale})`, transformOrigin: 'top left',
    }}>
      <GlobalDefs/>

      {/* z=0 — connection lines */}
      <svg ref={linesRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'visible' }}>
        <defs>
          {/* filterUnits MUST be userSpaceOnUse. The default (objectBoundingBox) sizes
              the filter region from the path's own bbox, and a perfectly vertical or
              horizontal run has a ZERO-width/height bbox — the region collapses to no
              area and the browser renders nothing at all. Every path here currently
              has a bend, so this has not bitten yet, but a straight link would vanish
              silently the moment one is added. */}
          <filter id="s4line_glow" filterUnits="userSpaceOnUse"
            x={-40} y={-40} width={W + 80} height={H + 80}>
            <feGaussianBlur stdDeviation="0.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Halo for the travelling dot, drawn UNDER an untouched SourceGraphic —
              keeping the core out of the blur is what lets the glow grow without the
              centre ever losing its edge. */}
          <filter id="s4dot_glow" filterUnits="userSpaceOnUse"
            x={-40} y={-40} width={W + 80} height={H + 80}>
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
          {/* Solid white core out to 55%, then a fast fall-off to fully transparent.
              The flat core is what makes the dot punch; the transparent rim is what
              keeps the halo blending into the line instead of ending on a disc edge. */}
          <radialGradient id="s4dotGradient">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="55%"  stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="72%"  stopColor="#93c5fd" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {FLOW.map((f, i) => (
          <path key={`${f.from}-${f.to}`} ref={el=>(lineRefs.current[i]=el)} d={f.d}
            stroke={`url(#s4lg${i})`} strokeWidth="1.1" fill="none"
            strokeLinecap="round" strokeLinejoin="round" opacity="0"
            filter="url(#s4line_glow)"/>
        ))}
        {/* Lead pulses — one per link, drawn after the paths so a pulse always rides
            ON TOP of the stroke it is following. */}
        {FLOW.map((f, i) => (
          <circle key={`dot-${f.from}-${f.to}`} ref={el => (dotRefs.current[i] = el)}
            cx="0" cy="0" r={DOT_R} fill="url(#s4dotGradient)" opacity="0"
            filter="url(#s4dot_glow)"/>
        ))}
        {/* Follow pulses — a second one per link, sent along the finished stroke so
            the connection keeps carrying current while the next link is drawn. Same
            geometry and gradient as the lead pulse; only its timing differs. */}
        {FLOW.map((f, i) => (
          <circle key={`pulse-${f.from}-${f.to}`} ref={el => (pulseRefs.current[i] = el)}
            cx="0" cy="0" r={DOT_R} fill="url(#s4dotGradient)" opacity="0"
            filter="url(#s4dot_glow)"/>
        ))}
      </svg>

      {/* z=2 — frame outline + wireframe (persistent) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', overflow:'visible' }}>
        <defs>
          <filter id="s4pgl" x="-12%" y="-10%" width="124%" height="120%">
            <feGaussianBlur stdDeviation="3.0" result="glow"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="sharp"/>
            <feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="sharp"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="s4bgl" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur stdDeviation="1.4" result="glow"/>
            <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path ref={framePathRef} d={FRAME_PATH}
          stroke="none" fill="none" opacity="0"/>
        <g ref={wireGrpRef} opacity="0">
          {WIRE.map((d, i) => (
            <path key={i} ref={r=>(wireRefs.current[i]=r)} d={d}
              stroke="url(#s4pg_w)" strokeWidth="0.55" fill="rgba(99,102,241,0.03)"
              strokeLinecap="round" strokeLinejoin="round" opacity="0" filter="url(#s4bgl)"/>
          ))}
        </g>
      </svg>

      {/* z=5 — video dashboard browser window (Mac chrome + image) */}
      <div
        ref={videoImgRef}
        style={{
          position:'absolute',
          left:FX, top:FY,
          width:FW, height:FH,
          borderRadius:FR,
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
        {/* Keep every path under /public space-free. next/image expects an
            unencoded src and percent-encodes it itself when building the
            /_next/image?url=… request, so a pre-encoded path gets encoded twice —
            % becomes %25, giving %2520, which the optimizer decodes back to the
            literal characters "%20" and then looks for a file that does not exist.
            The dev server tolerates that; Vercel's optimizer 404s, which is why
            encoding these only ever broke in production. */}
        <div style={{ position:'relative', flex:1, background:'#fff' }}>
          {/* Start this hidden layer before the section reaches the viewport. */}
          <Image
            src="/showcase/video-telematics-dashboard.webp"
            alt="Video telematics dashboard"
            fill
            sizes={`${FW}px`}
            style={{ objectFit:'contain', objectPosition:'left top' }}
          />
        </div>
      </div>

      {/* z=50 — hover popup card over sidebar top-left empty area */}
      <div
        ref={popupRef}
        onMouseEnter={() => gsap.to(popupRef.current, { scale: 1.12, duration: 0.35, ease: 'power3.out', transformOrigin: 'left center' })}
        onMouseLeave={() => gsap.to(popupRef.current, { scale: 1, duration: 0.35, ease: 'power3.out', transformOrigin: 'left center' })}
        style={{
          position:'absolute',
          left: Math.max(0, FX - 32),
          top: FY + 91,
          // Width and height stay in the artwork's ~4.58:1 ratio. objectFit:'contain'
          // would letterbox rather than distort if they drift apart, so nudge both.
          width: 196,
          height: 43,
          opacity: 0,
          zIndex: 50,
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
          sizes="250px"
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
            zIndex:ic.layer === 'center' ? 4 : 7,
            // Hover needs hit-testing. The transition switches this back to 'none' once
            // the icons have faded, so invisible cards can't swallow pointer events
            // over the dashboard underneath them.
            pointerEvents:'auto',
            willChange:'opacity',
          }}
        >
          <InactiveCard id={ic.id} size={ic.size}/>
          <div ref={el=>(activeRefs.current[i]=el)}
            style={{ position:'absolute', inset:0, opacity:0, willChange:'opacity' }}>
            <ActiveCard id={ic.id} size={ic.size}/>
          </div>

          {/* Hover colour is a SECOND active layer rather than a reuse of the one
              above: the looping timeline owns that element's opacity, and driving the
              same property from two places makes them fight mid-beat. */}
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
