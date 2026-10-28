'use client';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Image from '@/components/common/ViewportImage';
import gsap from 'gsap';
import { WINDOW_DOT_COLORS } from '@/components/ScrollShowcase/BrowserChrome';

// Hook: returns a CSS scale factor so the scene canvas fits its container.
//
// Only SceneTaskManager uses this — it is the one scene built from a fixed-pixel
// canvas. The other three (Expense / Inspection / Fleet) are `position:absolute;
// inset:0` and therefore fill whatever box they are given.
//
// That difference is what made the four slides look like different sizes on a large
// display: the other three grew with the panel while this one stopped dead at its
// 560x420 canvas and sat marooned in the middle of an empty panel. The culprit was
// the leading `1` below — a "never upscale" rule that only ever binds once the panel
// is wider than the canvas, which is exactly what a large screen does.
function useCanvasScale(canvasW, canvasH) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      // Fit-to-box, matching what inset:0 does for the other three. It cannot
      // overflow: w / canvasW and h / canvasH are precisely the factors at which the
      // canvas meets each edge, so the smaller of the two always fits inside both.
      //
      // The cap is kept below 1024px, where the layout is stacked and the panel is
      // the container's full width — upscaling there would blow the scene up on
      // tablets. Between 1024px and ~1600px the two branches agree anyway: the panel
      // is under 560px wide there, so w / canvasW is below 1 and the cap was never
      // the binding term.
      const fit = Math.min(w / canvasW, h / canvasH);
      const fillsPanel = window.matchMedia('(min-width: 1024px)').matches;
      setScale(fillsPanel ? fit : Math.min(1, fit));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasW, canvasH]);
  return [containerRef, scale];
}



// ─── SVG wireframe helpers ────────────────────────────────────────────────────
const vb = { w: 620, h: 440 };
const r  = (x,y,w,h) => `M${x},${y} L${x+w},${y} L${x+w},${y+h} L${x},${y+h} Z`;
const l  = (x1,y1,x2,y2) => `M${x1},${y1} L${x2},${y2}`;
const ci = (cx,cy,rad) => {
  const k = rad * 0.5523;
  return `M${cx},${cy-rad} C${cx+k},${cy-rad} ${cx+rad},${cy-k} ${cx+rad},${cy} C${cx+rad},${cy+k} ${cx+k},${cy+rad} ${cx},${cy+rad} C${cx-k},${cy+rad} ${cx-rad},${cy+k} ${cx-rad},${cy} C${cx-rad},${cy-k} ${cx-k},${cy-rad} ${cx},${cy-rad} Z`;
};

function W({ d, s = '#8b5cf6', sw = 1, o = 1 }) {
  return <path data-w="1" d={d} fill="none" stroke={s} strokeWidth={sw} opacity={o} strokeLinecap="round" strokeLinejoin="round"/>;
}

// ─── Wireframe SVGs ───────────────────────────────────────────────────────────

function WireTask() {
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${vb.w} ${vb.h}`} preserveAspectRatio="xMidYMid meet"
      style={{ position:'absolute', inset:0 }}>
      <rect width={vb.w} height={vb.h} fill="#fafbff"/>
      <W d={r(3,3,564,384)} s="#7c3aed" sw={1.4} o={0.7}/>
      <W d={l(3,34,567,34)} s="#a78bfa" sw={0.9} o={0.6}/>
      <W d={ci(18,18,5)} s="#f87171" sw={0.9} o={0.65}/>
      <W d={ci(30,18,5)} s="#fbbf24" sw={0.9} o={0.65}/>
      <W d={ci(42,18,5)} s="#34d399" sw={0.9} o={0.65}/>
      <W d={r(60,10,430,18)} s="#c4b5fd" sw={0.8} o={0.45}/>
      <W d={l(3,60,567,60)} s="#a78bfa" sw={0.7} o={0.5}/>
      {[0,1,2,3].map(i=><W key={i} d={r(10+i*110,38,100,20)} s={i===0?'#7c3aed':'#c4b5fd'} sw={0.8} o={i===0?0.7:0.35}/>)}
      <W d={l(168,60,168,387)} s="#a78bfa" sw={0.8} o={0.45}/>
      <W d={r(6,68,154,16)} s="#7c3aed" sw={0.9} o={0.6}/>
      {Array.from({length:9},(_,i)=>(
        <g key={i}>
          <W d={ci(18,98+i*30,8)} s="#8b5cf6" sw={0.7} o={0.5}/>
          <W d={r(32,92+i*30,128,7)} s="#a78bfa" sw={0.6} o={0.4}/>
          <W d={r(32,103+i*30,88,5)} s="#c4b5fd" sw={0.5} o={0.3}/>
        </g>
      ))}
      <W d={r(176,68,382,18)} s="#8b5cf6" sw={0.9} o={0.6}/>
      {[176,278,358,438,510].map((x,i)=>(
        <W key={i} d={r(x,94,i<4?96:52,12)} s="#a78bfa" sw={0.7} o={0.45}/>
      ))}
      {[278,358,438,510].map(x=>(
        <W key={x} d={l(x,90,x,387)} s="#c4b5fd" sw={0.5} o={0.25}/>
      ))}
      {Array.from({length:8},(_,i)=>(
        <g key={i}>
          <W d={l(176,114+i*34,562,114+i*34)} s="#c4b5fd" sw={0.5} o={0.25}/>
          <W d={r(182,117+i*34,84,8)} s="#8b5cf6" sw={0.6} o={0.45}/>
          <W d={r(288,117+i*34,58,8)} s="#c4b5fd" sw={0.5} o={0.35}/>
          <W d={r(366,116+i*34,56,10)} s="#a78bfa" sw={0.6} o={0.4}/>
          <W d={r(448,116+i*34,48,10)} s={i%3===0?'#7c3aed':'#c4b5fd'} sw={0.6} o={i%3===0?0.6:0.35}/>
        </g>
      ))}
      <W d={l(3,372,567,372)} s="#a78bfa" sw={0.7} o={0.4}/>
      {[0,1,2].map(i=><W key={i} d={r(180+i*130,375,110,10)} s="#8b5cf6" sw={0.6} o={0.45}/>)}
    </svg>
  );
}

function WireExpense() {
  return (
    // viewBox is the CARD rect (3,3,564,384), not the whole 620x440 canvas, and the
    // aspect is deliberately NOT preserved: together those stretch the skeleton to
    // exactly the box the wrapper gives it, which is the box the picture fills. The
    // residual non-uniform scale is under 6%, which is nothing on a wireframe.
    <svg width="100%" height="100%" viewBox="3 3 564 384" preserveAspectRatio="none"
      style={{ position:'absolute', inset:0 }}>
      <rect x="3" y="3" width="564" height="384" fill="#fafbff"/>
      <W d={r(3,3,564,384)} s="#7c3aed" sw={1.4} o={0.7}/>
      <W d={l(3,34,567,34)} s="#a78bfa" sw={0.9} o={0.6}/>
      <W d={ci(18,18,5)} s="#f87171" sw={0.9} o={0.65}/>
      <W d={ci(30,18,5)} s="#fbbf24" sw={0.9} o={0.65}/>
      <W d={ci(42,18,5)} s="#34d399" sw={0.9} o={0.65}/>
      <W d={r(60,10,430,18)} s="#c4b5fd" sw={0.8} o={0.45}/>
      <W d={l(3,60,567,60)} s="#a78bfa" sw={0.7} o={0.5}/>

      {/* ── Top nav bar (full width): Main View · tabs · driver · data · menu ── */}
      <W d={r(8,63,552,25)} s="#7c3aed" sw={0.9} o={0.35}/>          {/* nav container */}
      <W d={r(12,67,40,17)} s="#3b82f6" sw={0.9} o={0.6}/>           {/* Main View button */}
      <W d={r(60,70,62,12)} s="#c4b5fd" sw={0.7} o={0.4}/>           {/* Installation Files */}
      <W d={r(130,70,50,12)} s="#c4b5fd" sw={0.7} o={0.4}/>          {/* Permissions */}
      <W d={ci(213,75,9)} s="#8b5cf6" sw={0.8} o={0.55}/>            {/* avatar */}
      <W d={r(228,69,64,7)} s="#8b5cf6" sw={0.6} o={0.5}/>           {/* Dokan 1 */}
      <W d={r(228,79,52,5)} s="#c4b5fd" sw={0.5} o={0.35}/>          {/* VIEWCOMP CORPORATION */}
      <W d={r(382,71,58,11)} s="#c4b5fd" sw={0.7} o={0.4}/>          {/* Data database - v1.3.0.46 */}
      <W d={r(446,69,16,15)} s="#a78bfa" sw={0.7} o={0.45}/>         {/* chart icon */}
      <W d={r(466,69,13,15)} s="#a78bfa" sw={0.7} o={0.4}/>          {/* dropdown */}
      <W d={r(491,68,44,17)} s="#c4b5fd" sw={0.7} o={0.45}/>         {/* PC-TECHVIEW */}
      <W d={r(539,68,18,17)} s="#3b82f6" sw={0.8} o={0.6}/>          {/* 3-dot menu */}

      {/* ── 3-column dividers (left empty area · table on the right) ── */}
      <W d={l(76,90,76,385)} s="#a78bfa" sw={0.6} o={0.3}/>
      <W d={l(207,90,207,385)} s="#a78bfa" sw={0.7} o={0.4}/>

      {/* ── Table header row (right column only) ── */}
      <W d={r(214,114,28,15)} s="#3b82f6" sw={0.8} o={0.6}/>         {/* SELECT ALL */}
      {[ {x:262,w:34},{x:311,w:60},{x:379,w:52},{x:450,w:64},{x:527,w:42} ].map((c,i)=>(
        <W key={i} d={r(c.x,117,c.w,9)} s="#8b5cf6" sw={0.7} o={0.5}/>
      ))}
      <W d={l(210,133,550,133)} s="#a78bfa" sw={0.6} o={0.3}/>

      {/* ── 4 data row cards (right column) ── */}
      {Array.from({length:4},(_,i)=>{
        const y = 137 + i*40.5;
        return (
          <g key={i}>
            <W d={r(210,y,340,34)} s="#a78bfa" sw={0.8} o={0.4}/>        {/* row card */}
            <W d={r(219,y+11,12,12)} s="#3b82f6" sw={0.9} o={0.65}/>     {/* blue checkbox */}
            <W d={r(258,y+13,40,7)} s="#8b5cf6" sw={0.6} o={0.45}/>      {/* Date */}
            <W d={r(311,y+13,46,7)} s="#c4b5fd" sw={0.5} o={0.4}/>       {/* Employee Name */}
            <W d={r(379,y+13,42,7)} s="#a78bfa" sw={0.6} o={0.4}/>       {/* Category */}
            <W d={r(450,y+13,64,7)} s="#c4b5fd" sw={0.5} o={0.4}/>       {/* Description */}
            <W d={r(522,y+12,30,9)} s="#10b981" sw={0.7} o={0.55}/>      {/* Account/Amount */}
          </g>
        );
      })}

      {/* ── Bottom action buttons ── */}
      <W d={r(337,354,64,18)} s="#3b82f6" sw={0.9} o={0.6}/>         {/* ADD DEVICE/EMPLOYEE */}
      <W d={r(510,354,40,18)} s="#c4b5fd" sw={0.7} o={0.45}/>        {/* RELEASE ALL */}
    </svg>
  );
}

function WireInspection() {
  return (
    // The viewBox is the IMAGE REGION of the canvas (the comment below records where
    // that is), not the whole 620x440, and the aspect is not preserved — so the
    // skeleton stretches to exactly the box its wrapper gives it, which is the box
    // the picture fills. Both are AR 2.19, so the residual distortion is 1.6%.
    // The browser chrome that used to be drawn here at y<34 is now the real
    // BrowserBar in the wrapper, which is why it is outside this viewBox.
    <svg width="100%" height="100%" viewBox="4 99 610 283" preserveAspectRatio="none"
      style={{ position:'absolute', inset:0 }}>
      {/* Calibrated to kjiuguy.png (3064×1400), objectFit:contain in 480×360.
          Image content occupies vb x 0→620, y 99→382  (WX=ix·0.2024, WY=98.9+iy·0.2023). */}
      <rect width={vb.w} height={vb.h} fill="#fafbff"/>
      {/* Browser chrome */}
      <W d={ci(18,18,5)} s="#f87171" sw={0.9} o={0.65}/>
      <W d={ci(30,18,5)} s="#fbbf24" sw={0.9} o={0.65}/>
      <W d={ci(42,18,5)} s="#34d399" sw={0.9} o={0.65}/>
      <W d={r(60,10,500,18)} s="#c4b5fd" sw={0.8} o={0.45}/>

      {/* App viewport frame + column dividers (sidebar 0→198 · center 198→401 · right 401→614) */}
      <W d={r(4,99,610,283)} s="#7c3aed" sw={1.2} o={0.55}/>
      <W d={l(198,99,198,382)} s="#a78bfa" sw={0.8} o={0.45}/>
      <W d={l(401,124,401,382)} s="#a78bfa" sw={0.7} o={0.4}/>

      {/* ── Top bar ── */}
      <W d={ci(212,109,6)} s="#8b5cf6" sw={0.8} o={0.5}/>            {/* car icon */}
      <W d={r(224,106,40,8)} s="#8b5cf6" sw={0.7} o={0.5}/>          {/* John */}
      <W d={r(556,101,48,16)} s="#f87171" sw={0.9} o={0.65}/>        {/* MOVE TO SERVICING */}
      <W d={ci(610,109,6)} s="#3b82f6" sw={0.8} o={0.55}/>          {/* settings gear */}

      {/* ── Sidebar ── */}
      <W d={r(8,124,184,15)} s="#3b82f6" sw={0.9} o={0.55}/>         {/* Vehicles tab */}
      <W d={r(8,143,60,22)} s="#3b82f6" sw={0.8} o={0.55}/>          {/* 173 All Vehicles */}
      <W d={r(70,143,60,22)} s="#34d399" sw={0.8} o={0.5}/>          {/* 173 Active */}
      <W d={r(132,143,60,22)} s="#f87171" sw={0.8} o={0.5}/>         {/* 0 In Service */}
      <W d={r(8,169,184,16)} s="#7c3aed" sw={0.8} o={0.5}/>          {/* Loom Transport 173 */}
      <W d={r(8,188,184,28)} s="#3b82f6" sw={0.9} o={0.6}/>          {/* John card (selected) */}
      <W d={ci(20,197,4)} s="#34d399" sw={0.9} o={0.6}/>             {/* online dot */}
      <W d={r(30,193,44,8)} s="#8b5cf6" sw={0.7} o={0.5}/>           {/* John */}
      <W d={r(30,205,110,6)} s="#c4b5fd" sw={0.6} o={0.4}/>          {/* Last Inspected */}
      <W d={r(150,191,34,12)} s="#3b82f6" sw={0.7} o={0.5}/>         {/* score badge */}
      <W d={r(0,220,198,162)} s="#1e293b" sw={0.8} o={0.35}/>        {/* black lower sidebar */}

      {/* ── Center: car panel ── */}
      <W d={r(210,124,182,128)} s="#a78bfa" sw={0.8} o={0.45}/>      {/* car card */}
      {/* realistic sedan side-view silhouette */}
      <W d="M234,197 L234,188 C234,184 237,182 243,181 L280,179 C286,179 289,177 293,172 L304,161 C307,158 310,157 315,157 L338,157 C345,157 348,160 351,165 L360,177 C362,180 365,181 369,181 L382,182 C386,182 388,184 388,189 L388,197 Z"
         s="#7c3aed" sw={1.1} o={0.6}/>
      <W d="M298,173 L307,163 L337,163 L350,173 Z" s="#a78bfa" sw={0.8} o={0.5}/>  {/* greenhouse glass */}
      <W d={l(322,163,322,173)} s="#a78bfa" sw={0.6} o={0.4}/>       {/* door pillar */}
      <W d={ci(264,198,14)} s="#8b5cf6" sw={1.1} o={0.6}/>           {/* front wheel */}
      <W d={ci(352,198,14)} s="#8b5cf6" sw={1.1} o={0.6}/>           {/* rear wheel */}
      <W d={ci(264,198,6)} s="#8b5cf6" sw={0.8} o={0.45}/>
      <W d={ci(352,198,6)} s="#8b5cf6" sw={0.8} o={0.45}/>
      <W d={ci(348,194,18)} s="#fbbf24" sw={1} o={0.55}/>            {/* inspection highlight */}
      <W d={ci(218,184,7)} s="#a78bfa" sw={0.8} o={0.45}/>           {/* prev arrow */}
      <W d={ci(384,184,7)} s="#a78bfa" sw={0.8} o={0.45}/>           {/* next arrow */}
      {[250,278,306,334,362].map((cx,i)=>(
        <W key={i} d={ci(cx,233,9)} s={i===4?'#7c3aed':'#a78bfa'} sw={0.8} o={i===4?0.6:0.4}/>
      ))}

      {/* ── Center: Inspection Logs ── */}
      <W d={r(210,262,182,118)} s="#a78bfa" sw={0.8} o={0.45}/>      {/* logs card */}
      <W d={r(216,267,86,9)} s="#7c3aed" sw={0.7} o={0.55}/>         {/* Inspection Logs */}
      <W d={r(216,287,60,7)} s="#8b5cf6" sw={0.6} o={0.45}/>         {/* Date,Time hdr */}
      <W d={r(312,287,52,7)} s="#8b5cf6" sw={0.6} o={0.45}/>         {/* Inspected By hdr */}
      <W d={r(372,287,18,7)} s="#8b5cf6" sw={0.6} o={0.45}/>         {/* Score hdr */}
      <W d={r(213,300,176,13)} s="#c4b5fd" sw={0.6} o={0.35}/>       {/* row 1 */}
      <W d={r(213,314,176,13)} s="#3b82f6" sw={0.7} o={0.4}/>        {/* row 2 (selected) */}

      {/* ── Right: Inspection Report ── */}
      <W d={r(407,131,100,11)} s="#7c3aed" sw={0.8} o={0.6}/>        {/* Inspection Report */}
      <W d={ci(606,134,5)} s="#3b82f6" sw={0.8} o={0.5}/>           {/* download */}
      <W d={r(407,150,52,9)} s="#7c3aed" sw={0.7} o={0.55}/>         {/* Mandatory */}
      <W d={r(520,151,22,6)} s="#c4b5fd" sw={0.6} o={0.4}/>          {/* Prev */}
      <W d={r(566,151,30,6)} s="#c4b5fd" sw={0.6} o={0.4}/>          {/* Current */}
      {[0,1,2].map(i=>{ const y=164+i*15; return (
        <g key={i}>
          <W d={r(407,y,40,7)} s="#8b5cf6" sw={0.6} o={0.45}/>
          <W d={ci(528,y+3,5)} s="#c4b5fd" sw={0.8} o={0.45}/>
          <W d={ci(578,y+3,5)} s="#34d399" sw={0.9} o={0.6}/>
        </g>
      );})}
      <W d={r(407,213,46,9)} s="#7c3aed" sw={0.7} o={0.55}/>         {/* Optional */}
      {[0,1].map(i=>{ const y=227+i*15; return (
        <g key={i}>
          <W d={r(407,y,44,7)} s="#8b5cf6" sw={0.6} o={0.45}/>
          <W d={ci(528,y+3,5)} s="#c4b5fd" sw={0.8} o={0.45}/>
          <W d={ci(578,y+3,5)} s="#34d399" sw={0.9} o={0.6}/>
        </g>
      );})}
      <W d={r(407,259,72,9)} s="#7c3aed" sw={0.7} o={0.55}/>         {/* Scratches/Dents */}
      <W d={r(407,272,200,28)} s="#3b82f6" sw={0.7} o={0.4}/>        {/* scratch card */}
      <W d={r(412,276,22,20)} s="#f87171" sw={0.8} o={0.55}/>        {/* scratch photo */}
      <W d={r(442,278,70,7)} s="#8b5cf6" sw={0.6} o={0.5}/>          {/* Scratch */}
      <W d={r(442,288,120,5)} s="#c4b5fd" sw={0.5} o={0.4}/>         {/* desc */}
      <W d={r(585,275,20,10)} s="#3b82f6" sw={0.7} o={0.5}/>         {/* Left badge */}
      <W d={r(407,312,82,9)} s="#7c3aed" sw={0.7} o={0.55}/>         {/* Inspector Details */}
      <W d="M430,345 C440,330 446,355 452,348 C458,340 466,360 478,332"
         s="#34d399" sw={1} o={0.6}/>                                {/* signature */}
      <W d={r(407,368,56,7)} s="#8b5cf6" sw={0.6} o={0.4}/>          {/* Inspected By: */}
    </svg>
  );
}

function WireFleet() {
  return (
    // viewBox is the card's BODY (below the chrome divider at y=34), stretched to the
    // box the wrapper gives it — which is the box the picture fills. The chrome that
    // used to be drawn here is now the real BrowserBar above, so the three dots stay
    // perfectly round; only the body linework takes the stretch.
    <svg width="100%" height="100%" viewBox="3 34 564 353" preserveAspectRatio="none"
      style={{ position:'absolute', inset:0 }}>
      <rect width={vb.w} height={vb.h} fill="#fafbff"/>
      <W d={r(3,3,564,384)} s="#7c3aed" sw={1.4} o={0.7}/>
      <W d={l(3,34,567,34)} s="#a78bfa" sw={0.9} o={0.6}/>
      <W d={ci(18,18,5)} s="#f87171" sw={0.9} o={0.65}/>
      <W d={ci(30,18,5)} s="#fbbf24" sw={0.9} o={0.65}/>
      <W d={ci(42,18,5)} s="#34d399" sw={0.9} o={0.65}/>
      <W d={r(60,10,430,18)} s="#c4b5fd" sw={0.8} o={0.45}/>
      <W d={l(3,60,567,60)} s="#a78bfa" sw={0.7} o={0.5}/>
      <W d={r(8,38,82,20)} s="#7c3aed" sw={1} o={0.7}/>
      <W d={r(98,38,100,20)} s="#c4b5fd" sw={0.7} o={0.4}/>
      <W d={l(153,60,153,387)} s="#a78bfa" sw={0.8} o={0.45}/>
      {Array.from({length:11},(_,i)=>(
        <g key={i}>
          <W d={ci(20,78+i*28,9)} s="#7c3aed" sw={0.7} o={0.5}/>
          <W d={r(36,72+i*28,108,7)} s="#a78bfa" sw={0.6} o={0.4}/>
          <W d={r(36,83+i*28,70,5)} s="#c4b5fd" sw={0.5} o={0.3}/>
        </g>
      ))}
      <W d={r(162,68,218,14)} s="#8b5cf6" sw={0.9} o={0.6}/>
      <W d={r(162,90,120,20)} s="#7c3aed" sw={1} o={0.7}/>
      <W d={r(288,90,120,20)} s="#c4b5fd" sw={0.7} o={0.35}/>
      {[0,1,2].map(i=><W key={i} d={r(162+i*108,118,100,36)} s="#a78bfa" sw={0.8} o={0.45}/>)}
      <W d={r(162,162,396,22)} s="#8b5cf6" sw={0.8} o={0.55}/>
      {[280,360,430,500].map(x=>(
        <W key={x} d={l(x,162,x,387)} s="#c4b5fd" sw={0.5} o={0.28}/>
      ))}
      {Array.from({length:7},(_,i)=>(
        <g key={i}>
          <W d={l(162,188+i*28,558,188+i*28)} s="#c4b5fd" sw={0.5} o={0.28}/>
          <W d={r(170,170+i*28,100,9)} s="#8b5cf6" sw={0.6} o={0.45}/>
          <W d={r(290,170+i*28,55,9)} s="#c4b5fd" sw={0.5} o={0.35}/>
          <W d={r(440,168+i*28,48,13)} s={i<2?'#f87171':'#a78bfa'} sw={0.6} o={i<2?0.6:0.4}/>
        </g>
      ))}
    </svg>
  );
}

// ─── Browser bar (shared) ─────────────────────────────────────────────────────

// The browser chrome's height, and the Expense Manager artwork's true aspect
// (the FILE is 1800x1076). Both are shared so the wireframe and the picture are
// laid out from the same two numbers instead of each guessing.
const BAR_H = 32;
const EXPENSE_AR = '1800 / 1076';
const INSPECTION_AR = '1800 / 822';
const FLEET_AR = '1600 / 858';

function BrowserBar() {
  return (
    <div style={{ height:BAR_H, background:'linear-gradient(180deg,#f3f5f9,#e6eaf2)', borderBottom:'1px solid rgba(15,23,42,0.06)', display:'flex', alignItems:'center', padding:'0 12px', gap:10, flexShrink:0 }}>
      <div style={{ display:'flex', gap:6 }}>
        {/* Same neutral ramp as the showcase frames on this page — see
            ScrollShowcase/BrowserChrome for why the traffic lights went. */}
        {WINDOW_DOT_COLORS.map(c=><div key={c} style={{ width:11,height:11,borderRadius:'50%',background:c }}/>)}
      </div>
      <div style={{ flex:1, height:18, background:'#fff', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', maxWidth:'62%', margin:'0 auto' }}>
        <span style={{ fontSize:9, color:'rgb(100, 116, 141)', fontWeight:600 }}>https://mylocatorplus.com/</span>
      </div>
    </div>
  );
}

function FullImage({ src, alt }) {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', background:'#fff', borderRadius:14, overflow:'hidden' }}>
      <BrowserBar/>
      <div style={{ position:'relative', flex:1 }}>
        <Image src={src} alt={alt} fill style={{ objectFit:'contain', objectPosition:'left top' }} sizes="700px"/>
      </div>
    </div>
  );
}

// ─── Task Manager icon-network scene ─────────────────────────────────────────

const TM_CW = 560, TM_CH = 420;

// Layout (centered, well inside 560×420 canvas — no edge clipping):
//
//   [0:task]────────────────────────[1:crm]
//      │                               │
//      │                          [2:mobile]
//      │                               │
//   [3:team]──[4:clock]──────────[5:done]
//
// icon center = left + size/2
const TM_ICONS = [
  { id:'task',   left:  48, top:  38, size: 64 },  // 0  center=(80,  70)
  { id:'crm',    left: 408, top:  38, size: 64 },  // 1  center=(440, 70)
  { id:'mobile', left: 272, top: 160, size: 64 },  // 2  center=(304, 192)
  { id:'team',   left:  50, top: 298, size: 60 },  // 3  center=(80,  328)
  { id:'clock',  left: 186, top: 298, size: 60 },  // 4  center=(216, 328)
  { id:'done',   left: 340, top: 298, size: 60 },  // 5  center=(370, 328)
];

// Smooth Q-curve paths derived exactly from icon edge midpoints above
const TM_CONNECTIONS = [
  // 0  task(right=112,70) → crm(left=408,70)   straight horizontal
  'M 112 70 H 408',
  // 1  crm(bottom=440,102) → mobile(right=336,192)  down then left, rounded corner
  'M 440 102 V 174 Q 440 192 422 192 H 336',
  // 2  task(bottom=80,102) → team(top=80,298)   straight vertical
  'M 80 102 V 298',
  // 3  team(right=110,328) → clock(left=186,328)  straight horizontal
  'M 110 328 H 186',
  // 4  clock(right=246,328) → done(left=340,328)  straight horizontal
  'M 246 328 H 340',
  // 5  mobile(bottom=304,224) → done(top=370,298)  down then right, rounded corner
  'M 304 224 V 310 Q 304 328 322 328 H 340',
];

// Gradient colours per connection
const TM_GRADS = [
  { id:'tg0', c1:'#f472b6', c2:'#818cf8', x1:'112', y1:'70',  x2:'408', y2:'70'  },
  { id:'tg1', c1:'#818cf8', c2:'#0d4fd4', x1:'440', y1:'102', x2:'336', y2:'192' },
  { id:'tg2', c1:'#8b5cf6', c2:'#4c1d95', x1:'80',  y1:'102', x2:'80',  y2:'298' },
  { id:'tg3', c1:'#4c1d95', c2:'#6366f1', x1:'110', y1:'328', x2:'186', y2:'328' },
  { id:'tg4', c1:'#6366f1', c2:'#60a5fa', x1:'246', y1:'328', x2:'340', y2:'328' },
  { id:'tg5', c1:'#0d4fd4', c2:'#10b981', x1:'304', y1:'224', x2:'340', y2:'328' },
];

// Desktop wireframe overlay
function rp(x, y, w, h, rr = 0) {
  if (!rr) return `M${x} ${y}H${x+w}V${y+h}H${x}Z`;
  return `M${x+rr} ${y}H${x+w-rr}Q${x+w} ${y} ${x+w} ${y+rr}V${y+h-rr}Q${x+w} ${y+h} ${x+w-rr} ${y+h}H${x+rr}Q${x} ${y+h} ${x} ${y+h-rr}V${y+rr}Q${x} ${y} ${x+rr} ${y}Z`;
}
const DT_X = 14, DT_Y = 28, DT_W = 532, DT_H = 360, DT_R = 14;

// Wireframe calibrated to /Task Manager/jkliului.png (4500×2428) rendered
// objectFit:contain in a 532-wide area below the 32px browser bar.
// Image content region (canvas px): x 14→546, y 60→347.
// Columns: sidebar 16→168 · center 174→418 · right panel 422→544.
const DT_WIRE = [
  // 0. Browser chrome / URL bar
  rp(DT_X+6, DT_Y+6, DT_W-12, 22, 4),

  // ── Left sidebar ──
  rp(16, 60, 152, 286, 6),          // 1. sidebar container
  rp(22, 64, 140, 18, 4),           // 2. tab row (Active Tasks / Map View)
  rp(22, 88, 140, 13, 3),           // 3. FIELD STAFF TEAM header
  rp(22, 105, 140, 22, 4),          // 4. Driver 1 row
  rp(22, 131, 140, 22, 4),          // 5. Driver 2 row
  rp(22, 159, 140, 13, 3),          // 6. SALES TEAM header
  rp(22, 176, 140, 22, 4),          // 7. Mohd row
  rp(22, 202, 140, 22, 4),          // 8. Ali row
  rp(22, 323, 140, 18, 9),          // 9. search bar (bottom)

  // ── Center column ──
  rp(174, 64, 244, 18, 4),          // 10. top toolbar strip
  rp(174, 88, 44, 26, 4),           // 11. driver header (avatar + name)
  rp(300, 86, 27, 28, 4),           // 12. stat card: Total
  rp(330, 86, 27, 28, 4),           // 13. stat card: Assigned
  rp(360, 86, 27, 28, 4),           // 14. stat card: In progress
  rp(390, 86, 27, 28, 4),           // 15. stat card: Completed
  rp(174, 152, 244, 24, 5),         // 16. task #1
  rp(174, 186, 244, 24, 5),         // 17. task #2
  rp(174, 220, 244, 24, 5),         // 18. task #3
  rp(174, 254, 244, 24, 5),         // 19. task #4
  rp(174, 288, 244, 24, 5),         // 20. task #5

  // ── Right detail panel ──
  rp(422, 60, 122, 286, 6),         // 21. panel container
  rp(427, 64, 112, 24, 4),          // 22. header (Created by + action icons)
  rp(427, 94, 112, 78, 4),          // 23. job description + location block
  rp(427, 176, 112, 92, 6),         // 24. map block
  rp(427, 272, 112, 22, 4),         // 25. assigned time
];

// ── Icon card components ──────────────────────────────────────────────────────

function TmInactive({ id, size }) {
  const s = Math.round(size * 0.52);
  const c = '#b0bec5';   // slightly darker grey — more visible
  const rr = Math.round(size * 0.24);
  const shapes = {
    task: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        {/* clipboard body */}
        <rect x="4" y="4" width="16" height="18" rx="2" stroke={c} strokeWidth="1.5"/>
        {/* clip at top */}
        <rect x="8" y="2" width="8" height="4" rx="1.5" stroke={c} strokeWidth="1.5" fill="none"/>
        {/* task lines */}
        <line x1="8" y1="11" x2="16" y2="11" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="8" y1="15" x2="14" y2="15" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="8" y1="19" x2="12" y2="19" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    crm: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        {/* network hub icon */}
        <circle cx="12" cy="5"  r="2.5" stroke={c} strokeWidth="1.4"/>
        <circle cx="5"  cy="19" r="2.5" stroke={c} strokeWidth="1.4"/>
        <circle cx="19" cy="19" r="2.5" stroke={c} strokeWidth="1.4"/>
        <line x1="12" y1="7.5"  x2="6"  y2="16.8" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="12" y1="7.5"  x2="18" y2="16.8" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="7.2" y1="19"  x2="16.8" y2="19" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    mobile: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        {/* phone outline */}
        <rect x="5" y="2" width="14" height="20" rx="3" stroke={c} strokeWidth="1.5"/>
        {/* screen area */}
        <rect x="7.5" y="5.5" width="9" height="11" rx="1" stroke={c} strokeWidth="1" opacity="0.7"/>
        {/* screen content lines */}
        <line x1="9"  y1="8"  x2="15" y2="8"  stroke={c} strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        <line x1="9"  y1="10" x2="13" y2="10" stroke={c} strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        {/* home button */}
        <circle cx="12" cy="19" r="1.2" stroke={c} strokeWidth="1.1"/>
      </svg>
    ),
    team: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        {/* front person */}
        <circle cx="9"  cy="7"  r="3"   stroke={c} strokeWidth="1.4"/>
        <path d="M3 21v-1a6 6 0 016-6h1" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
        {/* back person */}
        <circle cx="16" cy="6"  r="2.5" stroke={c} strokeWidth="1.3"/>
        <path d="M14 21v-1a5 5 0 015-5h1" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="10" y1="21" x2="21" y2="21" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    clock: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9"   stroke={c} strokeWidth="1.5"/>
        {/* clock hands */}
        <line x1="12" y1="12" x2="12" y2="7"  stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="12" y1="12" x2="16" y2="15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
        {/* tick marks */}
        <line x1="12" y1="3.5" x2="12" y2="5"   stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="12" y1="19"  x2="12" y2="20.5" stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="3.5" y1="12" x2="5"   y2="12"  stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="19"  y1="12" x2="20.5" y2="12" stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
    done: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        {/* full circle */}
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.5"/>
        {/* checkmark — bold, clean */}
        <polyline points="7.5 12 10.5 15.5 16.5 8.5"
          stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return (
    <div style={{ width:size, height:size, borderRadius:rr, background:'#f4f6fa', border:'1.5px solid #dde3ec', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
      {shapes[id]}
    </div>
  );
}

function TmActive({ id, size }) {
  const s  = Math.round(size * 0.54);
  const rr = Math.round(size * 0.24);
  const gmap = {
    task:   ['#f59e0b','#ef4444'],
    crm:    ['#0d4fd4','#6366f1'],
    mobile: ['#3b82f6','#8b5cf6'],
    team:   ['#4c1d95','#8b5cf6'],
    clock:  ['#6366f1','#3b82f6'],
    done:   ['#10b981','#34d399'],
  };
  const [c1, c2] = gmap[id];
  const gid = `tma_${id}`;
  const G = (
    <defs>
      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor={c1}/>
        <stop offset="100%" stopColor={c2}/>
      </linearGradient>
    </defs>
  );
  const shapes = {
    task: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{G}
        <rect x="4" y="4" width="16" height="18" rx="2" fill={`url(#${gid})`}/>
        <rect x="8" y="2" width="8" height="4" rx="1.5" fill={`url(#${gid})`} opacity="0.8"/>
        <line x1="8" y1="11" x2="16" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="15" x2="14" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="19" x2="12" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    crm: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{G}
        <circle cx="12" cy="5"  r="3"  fill={`url(#${gid})`}/>
        <circle cx="5"  cy="19" r="3"  fill={`url(#${gid})`}/>
        <circle cx="19" cy="19" r="3"  fill={`url(#${gid})`}/>
        <line x1="12" y1="8"    x2="6"  y2="16.5" stroke={c1} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="8"    x2="18" y2="16.5" stroke={c2} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7.5" y1="19"  x2="16.5" y2="19" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    mobile: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{G}
        <rect x="5" y="2" width="14" height="20" rx="3" fill={`url(#${gid})`}/>
        <rect x="7.5" y="5.5" width="9" height="11" rx="1" fill="white" opacity="0.18"/>
        <line x1="9"  y1="8"  x2="15" y2="8"  stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
        <line x1="9"  y1="10" x2="13" y2="10" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
        <circle cx="12" cy="19" r="1.2" fill="white" opacity="0.8"/>
      </svg>
    ),
    team: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{G}
        <circle cx="9"  cy="7"  r="3.5" fill={`url(#${gid})`}/>
        <path d="M2 21v-1a7 7 0 017-7h2a7 7 0 017 7v1" fill={`url(#${gid})`} opacity="0.85"/>
        <circle cx="17" cy="6"  r="2.8" stroke={c2} strokeWidth="1.3" fill="none"/>
        <path d="M20 21v-0.5a4.5 4.5 0 00-3-4.25" stroke={c2} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    clock: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{G}
        <circle cx="12" cy="12" r="10" fill={`url(#${gid})`}/>
        <line x1="12" y1="12" x2="12" y2="6.5" stroke="white" strokeWidth="2"   strokeLinecap="round"/>
        <line x1="12" y1="12" x2="16.5" y2="15" stroke="white" strokeWidth="2"  strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1.5" fill="white"/>
      </svg>
    ),
    done: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{G}
        <circle cx="12" cy="12" r="10" fill={`url(#${gid})`}/>
        <polyline points="7 12.5 10.5 16 17 8.5"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return (
    <div style={{ width:size, height:size, borderRadius:rr, background:'#fff', boxShadow:'0 8px 28px rgba(99,102,241,0.24), 0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {shapes[id]}
    </div>
  );
}

const SceneTaskManager = forwardRef(function SceneTaskManager(_, ref) {
  const iconRefs   = useRef([]);
  const activeRefs = useRef([]);
  const lineRefs   = useRef([]);
  const dtWireGrp  = useRef(null);
  const dtWireRefs = useRef([]);
  const dtImgRef   = useRef(null);
  const tweens     = useRef([]);
  useEffect(() => () => {
    tweens.current.forEach(t => t?.kill());
    tweens.current = [];
  }, []);
  const [outerRef, canvasScale] = useCanvasScale(TM_CW, TM_CH);

  const stop = () => { tweens.current.forEach(t => t?.kill()); tweens.current = []; };
  const getLen = p => { try { return p.getTotalLength(); } catch { return 300; } };

  const resetAll = () => {
    gsap.set(iconRefs.current.filter(Boolean),   { opacity: 1 });
    // start active icons at scale 0.75 so the `to` animation pops them in
    gsap.set(activeRefs.current.filter(Boolean), { opacity: 0, scale: 0.75, transformOrigin: '50% 50%' });
    lineRefs.current.forEach(p => {
      if (!p) return;
      const L = getLen(p);
      gsap.set(p, { opacity: 0, strokeDasharray: `${L} ${L + 2}`, strokeDashoffset: L });
    });
    gsap.set(dtWireGrp.current, { opacity: 0 });
    gsap.set(dtImgRef.current,  { opacity: 0 });
    dtWireRefs.current.forEach(p => {
      if (!p) return;
      const L = getLen(p);
      gsap.set(p, { strokeDasharray: `${L} ${L + 2}`, strokeDashoffset: L, opacity: 0 });
    });
  };

  const play = () => {
    stop();
    resetAll();

    const IE = 'power3.out', LE = 'power2.inOut', FE = 'power2.in';

    // pop an icon's active layer in — resetAll already set scale:0.75 opacity:0
    const showIcon = (tl, i, at) => {
      const el = activeRefs.current[i];
      if (!el) return;
      tl.to(el, { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.7)' }, at);
    };

    const drawLine = (tl, ci, at, dur) => {
      const p = lineRefs.current[ci];
      if (!p) return;
      const L = getLen(p);
      tl.set(p, { strokeDasharray: `${L} ${L + 2}`, strokeDashoffset: L, opacity: 1 }, at);
      tl.to(p, { strokeDashoffset: 0, duration: dur, ease: LE }, at);
    };

    const tl = gsap.timeline({ onComplete: () => play() });
    tweens.current.push(tl);

    // ── Phase 1: all 6 icons + all 6 connections build over ~4.5 s ───────────
    //
    //   [0:task]───────────────────────[1:crm]
    //      │                               │
    //      │                          [2:mobile]
    //      │                               │
    //   [3:team]──[4:clock]──────────[5:done]
    //
    // Each beat: source icon pops → target icon pops → line draws
    // ~0.75 s between beats → full network at ~4.6 s

    // Beat 1 — task & crm light up, horizontal top line draws
    showIcon(tl, 0, 0.06);
    showIcon(tl, 1, 0.20);
    drawLine(tl, 0, 0.30, 0.42);   // done ≈ 0.72

    // Beat 2 — mobile pops, crm→mobile L-curve draws
    showIcon(tl, 2, 0.78);
    drawLine(tl, 1, 0.92, 0.42);   // done ≈ 1.34

    // Beat 3 — team pops, vertical left spine draws
    showIcon(tl, 3, 1.38);
    drawLine(tl, 2, 1.52, 0.40);   // done ≈ 1.92

    // Beat 4 — clock pops, team→clock short horizontal draws
    showIcon(tl, 4, 1.95);
    drawLine(tl, 3, 2.10, 0.26);   // done ≈ 2.36

    // Beat 5 — done pops, clock→done short horizontal draws
    showIcon(tl, 5, 2.40);
    drawLine(tl, 4, 2.55, 0.26);   // done ≈ 2.81

    // Beat 6 — mobile→done L-curve closes the network loop
    drawLine(tl, 5, 2.85, 0.38);   // done ≈ 3.23

    // ── Hold: all 6 icons + 6 lines fully visible ───────────────────────────
    const PHASE1_END = 3.25;

    // ── Fade everything out ───────────────────────────────────────────────────
    const FADE_START = PHASE1_END + 0.95;
    tl.to(lineRefs.current.filter(Boolean),   { opacity: 0, duration: 0.52, ease: FE }, FADE_START);
    tl.to(activeRefs.current.filter(Boolean), { opacity: 0, scale: 0.75, duration: 0.46, ease: FE }, FADE_START + 0.08);
    tl.to(iconRefs.current.filter(Boolean),   { opacity: 0, duration: 0.55, ease: FE }, FADE_START + 0.16);

    // ── Phase 2: desktop wireframe draws in ───────────────────────────────────
    const WIRE_AT = FADE_START + 1.00;
    tl.to(dtWireGrp.current, { opacity: 1, duration: 0.22 }, WIRE_AT);
    dtWireRefs.current.forEach((p, i) => {
      if (!p) return;
      tl.to(p, { opacity: 1, strokeDashoffset: 0, duration: 0.38, ease: 'power2.out' }, WIRE_AT + 0.05 + i * 0.065);
    });

    // ── Phase 3: image fades in, wireframe fades out ──────────────────────────
    const IMG_AT = WIRE_AT + 0.05 + DT_WIRE.length * 0.065 + 0.38 + 0.18;
    tl.to(dtImgRef.current,  { opacity: 1, duration: 0.82, ease: 'power2.out' }, IMG_AT);
    tl.to(dtWireGrp.current, { opacity: 0, duration: 0.62, ease: FE },           IMG_AT + 0.22);

    // ── Hold image then loop ───────────────────────────────────────────────────
    const HOLD_END = IMG_AT + 0.85 + 4.5;
    tl.to(dtImgRef.current, { opacity: 0, duration: 0.55, ease: FE }, HOLD_END);
  };

  useImperativeHandle(ref, () => ({
    play()  { play(); },
    pause() { tweens.current.forEach(t => t?.pause()); },
    reset() { stop(); resetAll(); },
  }));

  return (
    <div ref={outerRef} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'visible' }}>
      <div style={{ position:'relative', width:TM_CW, height:TM_CH, transform:`scale(${canvasScale})`, transformOrigin:'center center', flexShrink:0 }}>

        {/* SVG gradient + filter definitions */}
        <svg width="0" height="0" style={{ position:'absolute', overflow:'hidden' }}>
          <defs>
            {TM_GRADS.map(g => (
              <linearGradient key={g.id} id={g.id}
                x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
                gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor={g.c1}/>
                <stop offset="100%" stopColor={g.c2}/>
              </linearGradient>
            ))}
            <linearGradient id="tmdwg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#0d4fd4"/>
            </linearGradient>
            <filter id="tmglow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
        </svg>

        {/* z=0 — connection lines */}
        <svg width={TM_CW} height={TM_CH} viewBox={`0 0 ${TM_CW} ${TM_CH}`}
          style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'visible' }}>
          {TM_CONNECTIONS.map((d, i) => (
            <path key={i} ref={el => (lineRefs.current[i] = el)} d={d}
              stroke={`url(#${TM_GRADS[i].id})`} strokeWidth="1.8" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              opacity="0" filter="url(#tmglow)"/>
          ))}
        </svg>

        {/* z=3 — desktop wireframe SVG */}
        <svg width={TM_CW} height={TM_CH} viewBox={`0 0 ${TM_CW} ${TM_CH}`}
          style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none' }}>
          <g ref={dtWireGrp} opacity="0">
            {DT_WIRE.map((d, i) => (
              <path key={i} ref={el => (dtWireRefs.current[i] = el)} d={d}
                stroke="url(#tmdwg)" strokeWidth="0.7" fill="rgba(59,130,246,0.025)"
                strokeLinecap="round" strokeLinejoin="round" opacity="0"/>
            ))}
          </g>
        </svg>

        {/* z=6 — desktop screenshot */}
        <div ref={dtImgRef} style={{
          position:'absolute', left:DT_X, top:DT_Y,
          width:DT_W, height:DT_H, borderRadius:DT_R,
          overflow:'hidden', opacity:0, zIndex:6, pointerEvents:'none',
          willChange:'opacity',
          boxShadow:'0 20px 52px rgba(15,23,42,0.18), 0 4px 14px rgba(15,23,42,0.08)',
          background:'#fff', display:'flex', flexDirection:'column',
        }}>
          <BrowserBar/>
          <div style={{ position:'relative', flex:1 }}>
            <Image src="/software/modules/task-manager/task-manager.webp"
              alt="Task Manager" fill sizes={`${DT_W}px`}
              style={{ objectFit:'contain', objectPosition:'left top' }}/>
          </div>
        </div>

        {/* z=7 — icon cards */}
        {TM_ICONS.map((ic, i) => (
          <div key={ic.id} ref={el => (iconRefs.current[i] = el)}
            style={{ position:'absolute', left:ic.left, top:ic.top, width:ic.size, height:ic.size, zIndex:7, pointerEvents:'none', willChange:'opacity' }}>
            <TmInactive id={ic.id} size={ic.size}/>
            <div ref={el => (activeRefs.current[i] = el)}
              style={{ position:'absolute', inset:0, opacity:0, willChange:'opacity,transform' }}>
              <TmActive id={ic.id} size={ic.size}/>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
});

// ─── Simple wireframe → image scene factory ───────────────────────────────────

function makeScene(WireComp, imgSrc, imgAlt) {
  return forwardRef(function Scene(_, ref) {
    const wireRef = useRef(null);
    const fullRef = useRef(null);
    const tlRef   = useRef(null);
    useEffect(() => () => tlRef.current?.kill(), []);

    useImperativeHandle(ref, () => ({
      pause() { tlRef.current?.pause(); },
      play() {
        tlRef.current?.kill();
        if (!wireRef.current || !fullRef.current) return;
        const paths = [...wireRef.current.querySelectorAll('[data-w]')];
        gsap.set(wireRef.current, { opacity: 1 });
        gsap.set(fullRef.current, { opacity: 0 });
        paths.forEach(p => {
          try { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); }
          catch { gsap.set(p, { strokeDasharray: 300, strokeDashoffset: 300 }); }
        });
        const tl = gsap.timeline();
        tlRef.current = tl;
        tl.to(paths, { strokeDashoffset: 0, duration: 0.85, stagger:{ amount: 0.45, from:'start' }, ease:'power2.out' });
        tl.to(fullRef.current, { opacity: 1, duration: 0.55, ease:'power2.out' }, '-=0.38');
        tl.to(wireRef.current, { opacity: 0, duration: 0.30, ease:'power2.in'  }, '-=0.28');
      },
      reset() {
        tlRef.current?.kill();
        if (wireRef.current) gsap.set(wireRef.current, { opacity: 0 });
        if (fullRef.current) gsap.set(fullRef.current, { opacity: 0 });
      },
    }));

    return (
      <div style={{ position:'absolute', inset:0 }}>
        <div ref={wireRef} style={{ position:'absolute', inset:0, opacity:0 }}><WireComp/></div>
        <div ref={fullRef} style={{ position:'absolute', inset:0, opacity:0 }}>
          <FullImage src={imgSrc} alt={imgAlt}/>
        </div>
      </div>
    );
  });
}

const SceneExpense = forwardRef(function SceneExpense(_, ref) {
  const wireRef    = useRef(null);
  const mainImgRef = useRef(null);
  const mobileRef  = useRef(null);
  const popupRef   = useRef(null);
  const tlRef      = useRef(null);
  useEffect(() => () => tlRef.current?.kill(), []);

  useImperativeHandle(ref, () => ({
    pause() { tlRef.current?.pause(); },
    play() {
      tlRef.current?.kill();
      if (!wireRef.current || !mainImgRef.current) return;
      const paths = [...wireRef.current.querySelectorAll('[data-w]')];
      gsap.set(wireRef.current,    { opacity: 1 });
      gsap.set(mainImgRef.current, { opacity: 0 });
      gsap.set(mobileRef.current,  { opacity: 0, x: -30, scale: 0.92 });
      gsap.set(popupRef.current,   { opacity: 0, x: -20, scale: 0.92 });
      paths.forEach(p => {
        try { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); }
        catch { gsap.set(p, { strokeDasharray: 300, strokeDashoffset: 300 }); }
      });
      const tl = gsap.timeline();
      tlRef.current = tl;
      tl.to(paths, { strokeDashoffset: 0, duration: 0.85, stagger:{ amount: 0.45, from:'start' }, ease:'power2.out' });
      tl.to(mainImgRef.current, { opacity: 1, duration: 0.55, ease:'power2.out' }, '-=0.38');
      tl.to(wireRef.current,    { opacity: 0, duration: 0.30, ease:'power2.in'  }, '-=0.28');
      tl.to(mobileRef.current,  { opacity: 1, x: 0, scale: 1, duration: 0.60, ease:'back.out(1.5)' }, '-=0.10');
      tl.to(popupRef.current,   { opacity: 1, x: 0, scale: 1, duration: 0.55, ease:'back.out(1.6)' }, '-=0.25');
    },
    reset() {
      tlRef.current?.kill();
      if (wireRef.current)    gsap.set(wireRef.current,    { opacity: 0 });
      if (mainImgRef.current) gsap.set(mainImgRef.current, { opacity: 0 });
      if (mobileRef.current)  gsap.set(mobileRef.current,  { opacity: 0 });
      if (popupRef.current)   gsap.set(popupRef.current,   { opacity: 0 });
    },
  }));

  return (
    <div style={{ position:'absolute', inset:0, zIndex:10 }}>
      {/* The wireframe is the SKELETON OF THE PICTURE BELOW IT, so it has to occupy
          exactly the same box — same top edge, same width, same height. It used to
          be `inset:0` with preserveAspectRatio="xMidYMid meet", which fitted a
          620x440 viewBox into this tall portrait panel and then CENTRED it, so the
          skeleton was drawn 84-151px lower than the picture and ~60px narrower.
          The two never registered, which is why the image looked like it appeared
          out of empty space above the wireframe rather than resolving onto it.

          Mirroring the card's own structure here — the same BAR_H strip, then the
          same EXPENSE_AR box — makes this wrapper exactly as tall as the card at
          every width, with no shared magic numbers to drift. */}
      <div ref={wireRef} style={{ position:'absolute', top:0, left:0, right:0, opacity:0, borderRadius:14, overflow:'hidden' }}>
        <div style={{ height:BAR_H }}/>
        <div style={{ width:'100%', aspectRatio:EXPENSE_AR }}/>
        <WireExpense/>
      </div>
      <div ref={mainImgRef} style={{ position:'absolute', inset:0, opacity:0 }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, display:'flex', flexDirection:'column', borderRadius:14, overflow:'hidden', background:'#fff' }}>
          <BrowserBar/>
          {/* aspectRatio is the FILE's own 1800x1076. It was 1448/1060 (AR 1.366)
              while the picture is AR 1.673, so `contain` fitted the picture to the
              width and left 60-110px of white BELOW it, inside the white card —
              invisible white-on-white, but it is what made the card bottom-heavy
              and pushed the card's edge away from where the wireframe ended. */}
          <div style={{ position:'relative', width:'100%', aspectRatio:EXPENSE_AR, overflow:'hidden' }}>
            <Image
              src="/software/modules/expense-manager/expense-manager.webp"
              alt="Expense Manager"
              width={1800}
              height={1076}
              sizes="(min-width:1600px) 45vw, (min-width:1024px) 38vw, 100vw"
              style={{ position:'absolute', top:0, left:0, width:'100%', height:'auto', display:'block' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile app overlay — left side, layer 2 */}
      <div
        ref={mobileRef}
        onMouseEnter={() => gsap.to(mobileRef.current, { scale: 1.05, duration: 0.35, ease:'power3.out' })}
        onMouseLeave={() => gsap.to(mobileRef.current, { scale: 1,    duration: 0.35, ease:'power3.out' })}
        className="fs-phone"
        style={{
          position:'absolute',
          left:'-2%', top:'19%',
          opacity:0, zIndex:40,
          cursor:'pointer',
          willChange:'opacity, transform',
          transformOrigin:'left center',
        }}
      >
        <Image
          src="/software/modules/expense-manager/expense-manager-mobile.webp"
          alt="Expense Manager mobile"
          width={155}
          height={285}
          style={{
            borderRadius:16,
            boxShadow:'0 18px 50px rgba(15,23,42,0.22), 0 4px 14px rgba(15,23,42,0.10)',
          }}
        />
      </div>

      {/* Small "Toll Gate" popup — layer 3, sits on top of mobile */}
      <div
        ref={popupRef}
        onMouseEnter={() => gsap.to(popupRef.current, { scale: 1.12, duration: 0.35, ease:'power3.out' })}
        onMouseLeave={() => gsap.to(popupRef.current, { scale: 1,    duration: 0.35, ease:'power3.out' })}
        style={{
          position:'absolute',
          left:'-13%', top:'calc(39% - 12px)',
          width:'58%', height:'calc(10% + 4px)',
          opacity:0, zIndex:50,
          cursor:'pointer',
          willChange:'opacity, transform',
          transformOrigin:'left center',
        }}
      >
        <Image
          src="/software/modules/expense-manager/toll-payment-popup.png"
          alt="Toll payment popup"
          fill sizes="300px"
          style={{ objectFit:'contain', objectPosition:'left top' }}
        />
      </div>
    </div>
  );
});
const SceneInspection = forwardRef(function SceneInspection(_, ref) {
  const wireRef    = useRef(null);
  const mainImgRef = useRef(null);
  const mobileRef  = useRef(null);
  const tlRef      = useRef(null);
  useEffect(() => () => tlRef.current?.kill(), []);

  useImperativeHandle(ref, () => ({
    pause() { tlRef.current?.pause(); },
    play() {
      tlRef.current?.kill();
      if (!wireRef.current || !mainImgRef.current) return;
      const paths = [...wireRef.current.querySelectorAll('[data-w]')];
      gsap.set(wireRef.current,    { opacity: 1 });
      gsap.set(mainImgRef.current, { opacity: 0 });
      gsap.set(mobileRef.current,  { opacity: 0, x: -30, scale: 0.92 });
      paths.forEach(p => {
        try { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); }
        catch { gsap.set(p, { strokeDasharray: 300, strokeDashoffset: 300 }); }
      });
      const tl = gsap.timeline();
      tlRef.current = tl;
      tl.to(paths, { strokeDashoffset: 0, duration: 0.85, stagger:{ amount: 0.45, from:'start' }, ease:'power2.out' });
      tl.to(mainImgRef.current, { opacity: 1, duration: 0.55, ease:'power2.out' }, '-=0.38');
      tl.to(wireRef.current,    { opacity: 0, duration: 0.30, ease:'power2.in'  }, '-=0.28');
      tl.to(mobileRef.current,  { opacity: 1, x: 0, scale: 1, duration: 0.60, ease:'back.out(1.5)' }, '-=0.10');
    },
    reset() {
      tlRef.current?.kill();
      if (wireRef.current)    gsap.set(wireRef.current,    { opacity: 0 });
      if (mainImgRef.current) gsap.set(mainImgRef.current, { opacity: 0 });
      if (mobileRef.current)  gsap.set(mobileRef.current,  { opacity: 0 });
    },
  }));

  return (
    <div style={{ position:'absolute', inset:0, zIndex:10 }}>
      {/* Wireframe and picture are laid out from ONE structure: the same BrowserBar,
          then the same INSPECTION_AR box. Previously the wireframe was `inset:0`
          with preserveAspectRatio="xMidYMid meet", which centred a 620x440 canvas in
          the tall panel and drew the app frame 137-245px BELOW the picture. Carrying
          the real BrowserBar here too means the frame is already on screen while the
          skeleton draws, so the picture resolves into it instead of replacing it. */}
      <div ref={wireRef} style={{ position:'absolute', top:0, left:0, right:0, opacity:0, borderRadius:14, overflow:'hidden', background:'#fff' }}>
        <BrowserBar/>
        <div style={{ position:'relative', width:'100%', aspectRatio:INSPECTION_AR, overflow:'hidden' }}>
          <WireInspection/>
        </div>
      </div>
      <div ref={mainImgRef} style={{ position:'absolute', inset:0, opacity:0 }}>
        {/* Was `inset:0` with a flex:1 body, so the card filled the whole 746px wrap
            while the picture is only ~317px tall — ~400px of blank white card. Now
            the card is exactly as tall as the artwork it holds. */}
        <div style={{ position:'absolute', top:0, left:0, right:0, display:'flex', flexDirection:'column', background:'#fff', borderRadius:14, overflow:'hidden' }}>
          <BrowserBar/>
          <div style={{ position:'relative', width:'100%', aspectRatio:INSPECTION_AR, overflow:'hidden' }}>
            <Image
              src="/software/modules/inspection/inspection.webp"
              alt="Inspection"
              width={1800}
              height={822}
              sizes="(min-width:1600px) 45vw, (min-width:1024px) 38vw, 100vw"
              style={{ position:'absolute', top:0, left:0, width:'100%', height:'auto', display:'block' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile app overlay — left side */}
      <div
        ref={mobileRef}
        onMouseEnter={() => gsap.to(mobileRef.current, { scale: 1.05, duration: 0.35, ease:'power3.out' })}
        onMouseLeave={() => gsap.to(mobileRef.current, { scale: 1,    duration: 0.35, ease:'power3.out' })}
        className="fs-phone"
        style={{
          position:'absolute',
          left:'calc(-3% + 1px)', top:'calc(15% + 45px)',
          opacity:0, zIndex:40,
          cursor:'pointer',
          willChange:'opacity, transform',
          transformOrigin:'left center',
        }}
      >
        <Image
          src="/software/modules/inspection/inspection-mobile.webp"
          alt="Inspection mobile"
          width={155}
          height={285}
          style={{
            display:'block',
          }}
        />
      </div>
    </div>
  );
});
const SceneFleet = forwardRef(function SceneFleet(_, ref) {
  const wireRef    = useRef(null);
  const mainImgRef = useRef(null);
  const popupRef   = useRef(null);
  const tlRef      = useRef(null);
  useEffect(() => () => tlRef.current?.kill(), []);

  useImperativeHandle(ref, () => ({
    pause() { tlRef.current?.pause(); },
    play() {
      tlRef.current?.kill();
      if (!wireRef.current || !mainImgRef.current) return;
      const paths = [...wireRef.current.querySelectorAll('[data-w]')];
      gsap.set(wireRef.current,    { opacity: 1 });
      gsap.set(mainImgRef.current, { opacity: 0 });
      gsap.set(popupRef.current,   { opacity: 0, x: -20, scale: 0.92 });
      paths.forEach(p => {
        try { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); }
        catch { gsap.set(p, { strokeDasharray: 300, strokeDashoffset: 300 }); }
      });
      const tl = gsap.timeline();
      tlRef.current = tl;
      tl.to(paths, { strokeDashoffset: 0, duration: 0.85, stagger:{ amount: 0.45, from:'start' }, ease:'power2.out' });
      tl.to(mainImgRef.current, { opacity: 1, duration: 0.55, ease:'power2.out' }, '-=0.38');
      tl.to(wireRef.current,    { opacity: 0, duration: 0.30, ease:'power2.in'  }, '-=0.28');
      tl.to(popupRef.current,   { opacity: 1, x: 0, scale: 1, duration: 0.55, ease:'back.out(1.6)' }, '-=0.20');
    },
    reset() {
      tlRef.current?.kill();
      if (wireRef.current)    gsap.set(wireRef.current,    { opacity: 0 });
      if (mainImgRef.current) gsap.set(mainImgRef.current, { opacity: 0 });
      if (popupRef.current)   gsap.set(popupRef.current,   { opacity: 0 });
    },
  }));

  return (
    <div style={{ position:'absolute', inset:0, zIndex:10 }}>
      {/* Same one-structure rule as the other three slides: the real BrowserBar, then
          a FLEET_AR box. The wireframe used to be `inset:0` with xMidYMid meet, which
          centred a 620x440 canvas in the tall panel and drew the skeleton well below
          the picture; carrying the real bar here keeps the chrome pixel-accurate and
          leaves only the body linework to the SVG. */}
      <div ref={wireRef} style={{ position:'absolute', top:0, left:0, right:0, opacity:0, borderRadius:14, overflow:'hidden', background:'#fff' }}>
        <BrowserBar/>
        <div style={{ position:'relative', width:'100%', aspectRatio:FLEET_AR, overflow:'hidden' }}>
          <WireFleet/>
        </div>
      </div>
      <div ref={mainImgRef} style={{ position:'absolute', inset:0, opacity:0 }}>
        {/* Was `inset:0` with a flex:1 body: the card filled the whole 746px wrap while
            this artwork is only ~373px tall, leaving ~340px of blank white card. */}
        <div style={{ position:'absolute', top:0, left:0, right:0, display:'flex', flexDirection:'column', background:'#fff', borderRadius:14, overflow:'hidden' }}>
          <BrowserBar/>
          <div style={{ position:'relative', width:'100%', aspectRatio:FLEET_AR, overflow:'hidden' }}>
            <Image
              src="/software/modules/fleet-manager/fleet-manager.webp"
              alt="Fleet Manager"
              width={1600}
              height={858}
              sizes="(min-width:1600px) 45vw, (min-width:1024px) 38vw, 100vw"
              style={{ position:'absolute', top:0, left:0, width:'100%', height:'auto', display:'block' }}
            />
          </div>
        </div>
      </div>

      {/* Top-left "Sarah Support" popup overlay */}
      <div
        ref={popupRef}
        onMouseEnter={() => gsap.to(popupRef.current, { scale: 1.10, duration: 0.35, ease:'power3.out' })}
        onMouseLeave={() => gsap.to(popupRef.current, { scale: 1,    duration: 0.35, ease:'power3.out' })}
        style={{
          position:'absolute',
          left:'-9%', top:'calc(12% + 8px)',
          width:'42%', height:'10%',
          opacity:0, zIndex:50,
          cursor:'pointer',
          willChange:'opacity, transform',
          transformOrigin:'left center',
        }}
      >
        <Image
          src="/software/modules/fleet-manager/support-agent-popup.png"
          alt="Sarah Support popup"
          fill sizes="320px"
          style={{ objectFit:'contain', objectPosition:'left top' }}
        />
      </div>
    </div>
  );
});


const SCENES = [SceneTaskManager, SceneExpense, SceneInspection, SceneFleet];

export default function FeatureScenes({ sceneRefs, containerRef, activeIdx, onReady }) {
  const [initialIndex] = useState(activeIdx);
  useEffect(() => { onReady(); }, [onReady]);
  return SCENES.map((SceneComp, i) => (
    <div key={i} ref={el => { containerRef.current[i] = el; }}
      style={{ position:'absolute', inset:0, opacity: i === initialIndex ? 1 : 0 }}>
      <SceneComp ref={el => { sceneRefs.current[i] = el; }}/>
    </div>
  ));
}
