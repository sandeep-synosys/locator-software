"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { isLand } from "./land-mask";

/**
 * AnimatedGlobeHero
 * ----------------------------------------------------------------------------
 * A cinematic, premium globe hero section featuring:
 *  - A photorealistic, procedurally textured Earth (no bitmap dependencies)
 *  - Smooth continuous 360° rotation via a clipped texture pan
 *  - Cinematic curved connection arcs that lift, travel, and land between cities
 *  - Layered atmospheric glow tuned to match a warm-horizon sky gradient
 *  - Minimal glass-morphism stat cards with subtle float + shimmer
 *
 * Notes on implementation:
 *  - Earth surface is built from layered <feTurbulence> noise filters, giving
 *    organic continent / cloud / terminator detail without external assets.
 *  - The "rotation" is a wide texture strip clipped to the globe sphere; it
 *    pans horizontally on loop, which reads as a true 360° spin and avoids
 *    the stretched look of rotating a circular mask.
 *  - Arcs use SVG offset-path for the comet head + a synchronized stroke
 *    reveal for the trail — both share the same cubic-bezier curve so the
 *    head sits perfectly on the trail's leading edge.
 */

/* ============================================================================
 * CONSTANTS
 * ========================================================================== */

const VB_W = 1280;
const VB_H = 540;
const CX = 640;
const CY = 270;
const R = 175; // Globe radius

const DEFAULT_STATS = [
  { value: "15+", label: "Years of industry experience", side: "left", row: "top", icon: "award" },
  { value: "60,000+", label: "Devices actively tracked", side: "left", row: "bottom", icon: "pin" },
  { value: "6000+", label: "Happy customers across", side: "right", row: "top", icon: "smile" },
  { value: "25M+", label: "Data points processed daily", side: "right", row: "bottom", icon: "chart" },
];

/**
 * Stat-card glyphs. Stroked rather than filled, at a hairline weight, so they
 * read as etched into the glass panel instead of sitting on top of it — the
 * cards are translucent and a solid shape would look pasted on.
 */
const STAT_ICONS = {
  award: (
    <>
      <circle cx="12" cy="9" r="5.2" />
      <path d="M8.6 13.4 7.2 21l4.8-2.4 4.8 2.4-1.4-7.6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-6.2 7-11.5a7 7 0 1 0-14 0c0 5.3 7 11.5 7 11.5z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.4 14.2a4.4 4.4 0 0 0 7.2 0" />
      <path d="M9.2 9.4h.01M14.8 9.4h.01" />
    </>
  ),
  chart: (
    <>
      <path d="M5 20V11" />
      <path d="M12 20V4" />
      <path d="M19 20v-6" />
    </>
  ),
};

function StatIcon({ name }) {
  const glyph = STAT_ICONS[name];
  if (!glyph) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}

/**
 * City nodes anchored close to the globe rim — arcs span across
 * the full globe like flight paths / satellite orbits.
 */
const CITY_POLAR = [
  { angle: 268, radius: 0.86, name: "n01" },  // top
  { angle: 315, radius: 0.82, name: "n02" },  // upper-right
  { angle: 8,   radius: 0.86, name: "n03" },  // right-upper
  { angle: 55,  radius: 0.82, name: "n04" },  // right-lower
  { angle: 100, radius: 0.86, name: "n05" },  // lower-right
  { angle: 148, radius: 0.82, name: "n06" },  // bottom
  { angle: 195, radius: 0.86, name: "n07" },  // bottom-left
  { angle: 242, radius: 0.82, name: "n08" },  // left
];

const CITY_NODES = CITY_POLAR.map(({ angle, radius, name }) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * R * radius,
    y: CY + Math.sin(rad) * R * radius,
    name,
  };
});

/**
 * The three elliptical orbit rings that used to encircle the globe, and the
 * four satellite dots that rode along them.
 *
 * Turned OFF at the client's request. Their outer ring reached 1.48x the
 * globe's radius, so they read less as orbits and more as loose curved lines
 * sweeping off toward the corners of the section — which is exactly what was
 * flagged.
 *
 * Kept behind a flag rather than deleted: flip this to true and the whole
 * system comes back exactly as it was, animation and all. A flag rather than a
 * block comment because the markup contains its own block comments, and a
 * nested closing delimiter would terminate the outer one early and break the
 * file.
 *
 * The related CSS (.orbit-ring, .satellite, ringPulse) is deliberately left in
 * place — it is scoped and inert with nothing to match, and removing it would
 * mean this could not simply be switched back on.
 */
const SHOW_ORBITAL_RINGS = false;

/**
 * The shockwave — two rings that sit exactly on the globe's rim and then
 * expand outward to 2.15x its radius while fading, fired at 3.5s and 3.78s,
 * i.e. the moment the sphere finishes assembling. That outward pulse from the
 * edge is the "signal coming off the border" the client asked to remove.
 *
 * Same flag treatment as SHOW_ORBITAL_RINGS: set to true to bring it back.
 *
 * NOT disabled alongside it: `rim-ignite`, the light that strikes and burns
 * once AROUND the circumference. That one travels along the edge rather than
 * leaving it, so it reads as the globe completing rather than as something
 * being emitted, and the formation beat still needs a finish.
 */
const SHOW_FORMATION_SHOCKWAVE = false;

/**
 * The solid SVG sphere — ocean fill, rotating earth texture, cloud layer,
 * spherical shading and terminator.
 *
 * Off, because the globe is now built from the particle field itself
 * (ParticleGlobe below) rather than being a separate object the particles were
 * crossfaded into. Leaving this on would put a solid ball behind the particles
 * and hide the very thing that is supposed to be forming.
 *
 * Set to true to restore the previous solid globe — every def, texture tile and
 * CSS rule it needs is still in this file.
 */
const SHOW_SVG_SPHERE = false;

/**
 * Connections — dense network mesh spanning the globe like flight routes.
 * 12 arcs distributed so the animation keeps a continuous flow of pulses.
 */
const ARC_CONNECTIONS = buildArcs([
  [0, 4, 6.0, 0.0],   // top → lower-right (diameter)
  [1, 5, 6.0, 0.5],   // upper-right → bottom
  [2, 6, 6.0, 1.0],   // right-upper → bottom-left
  [3, 7, 6.0, 1.5],   // right-lower → left (diameter)
  [0, 5, 6.0, 2.0],   // top → bottom
  [1, 6, 6.0, 2.5],   // upper-right → bottom-left (diameter)
  [2, 7, 6.0, 3.0],   // right-upper → left
  [0, 3, 6.0, 3.5],   // top → right-lower
  [4, 7, 6.0, 4.0],   // lower-right → left
  [5, 2, 6.0, 4.5],   // bottom → right-upper
  [6, 1, 6.0, 5.0],   // bottom-left → upper-right
  [0, 6, 6.0, 5.5],   // top → bottom-left
]);

function buildArcs(spec) {
  return spec.map(([fromIdx, toIdx, dur, delay], i) => {
    const a = CITY_NODES[fromIdx];
    const b = CITY_NODES[toIdx];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    // Perpendicular to the chord, normalized
    const px = -dy / dist;
    const py = dx / dist;
    // Pick the perpendicular direction that goes AWAY from globe center
    // so every arc bows outward like an orbital path. For chords passing
    // through the center, alternate the bow side so the network has variety.
    const toCenterX = CX - mx;
    const toCenterY = CY - my;
    const dot = px * toCenterX + py * toCenterY;
    const sign = dot === 0 ? (i % 2 === 0 ? 1 : -1) : (dot > 0 ? -1 : 1);
    const lift = 32 + dist * 0.22;
    const cx = mx + px * sign * lift;
    const cy = my + py * sign * lift;
    return {
      d: `M ${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`,
      from: a,
      to: b,
      dur,
      delay,
    };
  });
}

/* ============================================================================
 * STARFIELD (seeded for SSR-safe stability)
 * ========================================================================== */

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============================================================================
 * STAT COUNTER
 * ----------------------------------------------------------------------------
 * Parses a display string like "10+", "20,000+", "1000+", "1M+" into a target
 * number plus its surrounding formatting (prefix / thousands grouping /
 * magnitude letter / suffix), then smoothly counts up to it once the section
 * scrolls into view.
 *
 * Start value is chosen relative to the target so the motion always feels
 * natural and quick:
 *   - magnitude values (1M+)  -> start ~85% of target (e.g. 0.9M -> 1M)
 *   - small values   (<= 50)  -> start ~50% of target (e.g. 20 -> 12 -> 20)
 *   - large values            -> start ~88-94% of target (no long crawl from 0)
 * ========================================================================== */

const MAGNITUDE = { k: 1e3, m: 1e6, b: 1e9 };

function parseStat(raw) {
  const str = String(raw).trim();
  // prefix | number (digits, commas, dot) | magnitude letter | trailing suffix
  const m = str.match(/^(\D*?)([\d.,]+)\s*([KkMmBb])?(.*)$/);
  if (!m) return null;
  const base = parseFloat(m[2].replace(/,/g, ""));
  if (!isFinite(base)) return null;
  const mag = m[3] ? MAGNITUDE[m[3].toLowerCase()] : 1;
  return {
    raw: str,
    target: base * mag, // real numeric target (1M -> 1,000,000)
  };
}

function getStartValue(target) {
  // Small numbers can count from ~half; big ones start close so there's
  // no long crawl. Either way the motion stays short and natural.
  if (target <= 50) return Math.round(target * 0.5);
  return Math.round(target * 0.85);
}

function AnimatedNumber({ value, active, delay = 0, duration = 1600 }) {
  const info = useMemo(() => parseStat(value), [value]);
  const startValue = info ? getStartValue(info.target) : 0;

  // Starts on the real figure so the server-rendered HTML (what search engines
  // read) says "99.9%", not the count-up's starting number ("85"). The count
  // jumps to its start value on its first frame, which runs only once the card
  // begins its entrance (both use the same delay), while it is still invisible.
  const [display, setDisplay] = useState(() => String(value));
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || !info || startedRef.current) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    startedRef.current = true;
    let rafId;
    let timeoutId;
    let startTs = null;

    // easeOutCubic — smooth, steady glide that settles gently
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (ts) => {
      if (startTs === null) startTs = ts;
      const t = Math.min((ts - startTs) / duration, 1);
      if (t >= 1) {
        setDisplay(info.raw); // snap to the exact source string (e.g. "1M+")
        return;
      }
      const current = startValue + (info.target - startValue) * ease(t);
      setDisplay(Math.round(current).toLocaleString("en-US"));
      rafId = requestAnimationFrame(tick);
    };

    // Reduced motion skips the count entirely and just states the figure. Both
    // paths go through the timer so the state update lands in a callback rather
    // than synchronously in the effect body.
    timeoutId = setTimeout(() => {
      if (reduced) {
        setDisplay(info.raw);
        return;
      }
      rafId = requestAnimationFrame(tick);
    }, reduced ? 0 : delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [active, info, startValue, delay, duration]);

  if (!info) return <>{value}</>;
  return <>{display}</>;
}

/* ============================================================================
 * PARTICLE GLOBE
 * ----------------------------------------------------------------------------
 * The globe IS the particles. There is no hand-over.
 *
 * The previous version was a crossfade: particles formed a shell, then faded
 * to zero opacity while a separately-rendered SVG sphere faded up underneath
 * them. That swap is what read as the globe "popping" into existence — the
 * thing you watched being built was thrown away and replaced at the moment it
 * finished. Here the same particles that converge are the ones that stay, and
 * the SVG sphere surface underneath is gone entirely (see SHOW_SVG_SPHERE).
 *
 * THE FORMATION
 * Each particle owns a fixed home on the unit sphere and spawns far out along
 * a random direction. It converges by interpolating DIRECTION and RADIUS
 * separately:
 *
 *   direction : normalised lerp from spawn direction toward home direction
 *   radius    : eased lerp from a wide scatter radius down to the shell
 *
 * Interpolating the direction rather than the raw xyz is what makes the
 * approach curve instead of running dead straight at the centre — the swarm
 * sweeps around the sphere as it tightens. A per-particle tangential swirl,
 * decaying to zero as it lands, adds the spiral. Nothing snaps: every particle
 * has its own delay and duration, so the surface knits together over ~2.6s.
 *
 * THE LIVING GLOBE
 * After forming, the particles keep their homes and the whole field rotates on
 * a tilted axis, permanently. Depth is real: every particle is transformed in
 * 3D, projected through a perspective divide, and its size and brightness come
 * from its own z. Back-hemisphere particles dim and shrink, which is what
 * makes a field of flat dots read as a solid rotating body.
 *
 * A lattice of meridians and parallels is built from the SAME particle system,
 * just seeded on a grid instead of a spiral — so the structure of the sphere is
 * drawn by particles too, rather than being an overlay on top of them.
 *
 * PERFORMANCE
 * Where the old burst ran ~4.4s and then stopped, this runs for as long as the
 * section is on screen, so it is built to be cheap per frame:
 *   - all particle data in flat Float32Arrays, no objects, no per-frame allocation
 *   - sin/cos of each home baked once at init; the hot loop is multiply-add
 *   - no depth sort; depth is expressed through alpha and size, which is
 *     indistinguishable at this dot size and saves an O(n log n) sort per frame
 *   - fillRect rather than arc(): far cheaper, and identical below ~2px
 *   - alpha quantised to 1/64 so long runs share a fillStyle string
 *   - the parent's IntersectionObserver stops the loop entirely off-screen
 * ========================================================================== */

// Reduced motion still needs a globe — it just must not animate. The formation
// is skipped and the sphere is drawn once, settled.
function ParticleGlobe({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rnd = mulberry32(20260601);
    const isSmall = window.innerWidth < 768;

    /* ---- Population -------------------------------------------------------
       Three groups, one system — every one of them is a particle that flies in
       during formation, so the whole Earth is genuinely assembled rather than
       revealed:

         LAND    dense and bright, placed only where the real landmask says
                 there is land, so the continents are the actual continents.
         OCEAN   sparse and dim, so the sphere still reads as a solid body
                 between the landmasses instead of a floating archipelago.
         RIM     a great circle on the silhouette. This replaces the SVG ring
                 that used to sweep around the globe: it is made of the same
                 particles, scattered and converging from all around exactly
                 like the rest of the swarm, just landing a beat later.

       Land is oversampled relative to its ~30% area share — roughly 60% of the
       surface budget — because dots on a sphere read much sparser than pixels
       on a flat map, and the continents have to survive being spread over a
       hemisphere and dimmed by depth.

       Counts are a measured budget, not a guess. This runs permanently rather
       than for four seconds, and it is fill-rate bound: every particle is an
       additively-blended rect over a 2160x912 backing store. At 11.7k the
       measured cost was 50ms/frame (18fps) even with GPU rasterisation. The
       spend is therefore concentrated where it is visible — land keeps its
       density because the continents have to be legible; ocean and lattice are
       thinned hard because they are dim anyway and were paying full price for
       almost no visual return. */
    const N_LAND = isSmall ? 2600 : 6200;
    // Ocean is ~70% of the sphere, so it is what decides whether the globe
    // looks like a planet or like a few islands floating in a hole. It was cut
    // to 600 while chasing frame time and the disc ended up 16% covered.
    // The cheap way back is NOT more particles — coverage grows with the
    // SQUARE of dot size but only linearly with count, so bigger, softer,
    // dimmer ocean dots buy far more surface per unit of fill rate than extra
    // tiny ones. See baseSize below.
    const N_OCEAN = isSmall ? 1900 : 4400;
    const N_RIM = isSmall ? 180 : 260;
    const MERIDIANS = 8;
    const PARALLELS = 4;
    const PER_MERIDIAN = isSmall ? 12 : 18;
    const PER_PARALLEL = isSmall ? 16 : 24;
    const N_LATTICE = MERIDIANS * PER_MERIDIAN + PARALLELS * PER_PARALLEL;
    const COUNT = N_LAND + N_OCEAN + N_RIM + N_LATTICE;

    // Group tags drive colour and behaviour in the hot loop.
    const G_LAND = 0, G_OCEAN = 1, G_LATTICE = 2, G_RIM = 3;
    const group = new Uint8Array(COUNT);

    // Home position on the unit sphere, baked once.
    const hx = new Float32Array(COUNT);
    const hy = new Float32Array(COUNT);
    const hz = new Float32Array(COUNT);
    // Spawn direction (unit) + spawn radius multiple of R.
    const sx = new Float32Array(COUNT);
    const sy = new Float32Array(COUNT);
    const sz = new Float32Array(COUNT);
    const sRad = new Float32Array(COUNT);
    // Per-particle character.
    const delay = new Float32Array(COUNT);
    const dur = new Float32Array(COUNT);
    const swirl = new Float32Array(COUNT);
    const wobPhase = new Float32Array(COUNT);
    const wobSpeed = new Float32Array(COUNT);
    const baseSize = new Float32Array(COUNT);
    const bright = new Float32Array(COUNT); // 0 surface .. 1 lattice
    const tint = new Float32Array(COUNT);

    const setHome = (i, x, y, z) => {
      hx[i] = x; hy[i] = y; hz[i] = z;
    };

    /* --- Land and ocean, sampled off a Fibonacci spiral -------------------
       The spiral gives even coverage with no polar clumping (a naive
       random(theta, phi) always bunches at the poles). Each candidate point is
       converted to lat/lon and tested against the real landmask.

       TWO PASSES, and it has to be two. The obvious single-pass version —
       walk the spiral, keep points until each bucket is full — silently
       destroys the distribution: the spiral runs pole to pole, so a bucket
       fills from whichever pole it starts at and everything past that point is
       dropped. At these counts ocean filled inside the top 4% of the sphere
       and land inside the top 46%, leaving the globe as a lopsided blob with
       an empty southern half.
       So: count the candidates first, then accept them on a fractional stride
       spread across the entire walk. Even coverage, exact counts, and no
       dependence on where the spiral happens to begin. */
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    const SAMPLES = (N_LAND + N_OCEAN) * 4;
    const spiralY = (s) => 1 - (s / (SAMPLES - 1)) * 2;

    // Pass 1 — how many candidates of each kind does the spiral actually hit?
    let landCand = 0, oceanCand = 0;
    for (let s = 0; s < SAMPLES; s++) {
      const y = spiralY(s);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = GOLDEN * s;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(Math.sin(th) * r, Math.cos(th) * r) * (180 / Math.PI);
      if (isLand(lat, lon) === 1) landCand++; else oceanCand++;
    }

    // Pass 2 — accept on a fractional stride, so the kept points are spread
    // evenly over the whole sphere instead of clustered at the start.
    const landStep = landCand > 0 ? Math.min(1, N_LAND / landCand) : 0;
    const oceanStep = oceanCand > 0 ? Math.min(1, N_OCEAN / oceanCand) : 0;
    let landAcc = 0, oceanAcc = 0, k = 0;
    for (let s = 0; s < SAMPLES; s++) {
      const y = spiralY(s);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = GOLDEN * s;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);

      if (isLand(lat, lon) === 1) {
        landAcc += landStep;
        if (landAcc >= 1 && k < N_LAND + N_OCEAN) {
          landAcc -= 1;
          setHome(k, x, y, z);
          group[k] = G_LAND;
          // Finer dots than before. Coastlines are read from the SHAPE of the
          // cluster, and fat dots blur one into the next until a continent is a
          // smudge; smaller ones resolve the outline. It also cuts fill rate,
          // which is what pays for there being more of them.
          baseSize[k] = 0.46 + rnd() * 0.3;
          bright[k] = 1;
          tint[k] = rnd() * 0.35;      // land skews bright/white
          k++;
        }
      } else {
        oceanAcc += oceanStep;
        if (oceanAcc >= 1 && k < N_LAND + N_OCEAN) {
          oceanAcc -= 1;
          setHome(k, x, y, z);
          group[k] = G_OCEAN;
          // Deliberately large and soft — these are the water surface, not
          // sparkles. Overlapping broad dots read as a continuous sea; small
          // ones read as static. Size is the cheap lever: the frame cost here
          // is dominated by per-particle draw overhead rather than by pixels,
          // so widening a dot is close to free while adding another one is not.
          baseSize[k] = 2.4 + rnd() * 1.7;
          bright[k] = 0;
          tint[k] = 0.6 + rnd() * 0.4; // ocean skews deep cyan
          k++;
        }
      }
    }
    const N_PLACED = k;

    // --- Lattice: meridians then parallels, on an exact grid. Faint — it is
    //     scaffolding that says "sphere", not a feature competing with land.
    for (let m = 0; m < MERIDIANS; m++) {
      const th = (m / MERIDIANS) * Math.PI * 2;
      const ct = Math.cos(th), st = Math.sin(th);
      for (let j = 0; j < PER_MERIDIAN; j++) {
        const phi = (j / (PER_MERIDIAN - 1)) * Math.PI;
        const sp = Math.sin(phi);
        setHome(k, sp * ct, Math.cos(phi), sp * st);
        group[k] = G_LATTICE;
        baseSize[k] = 0.4 + rnd() * 0.22;
        bright[k] = 0;
        tint[k] = 0.5 + rnd() * 0.4;
        k++;
      }
    }
    for (let p = 0; p < PARALLELS; p++) {
      const phi = ((p + 1) / (PARALLELS + 1)) * Math.PI;
      const sp = Math.sin(phi), cp = Math.cos(phi);
      for (let j = 0; j < PER_PARALLEL; j++) {
        const th = (j / PER_PARALLEL) * Math.PI * 2;
        setHome(k, sp * Math.cos(th), cp, sp * Math.sin(th));
        group[k] = G_LATTICE;
        baseSize[k] = 0.4 + rnd() * 0.22;
        bright[k] = 0;
        tint[k] = 0.5 + rnd() * 0.4;
        k++;
      }
    }

    /* --- The rim ring ------------------------------------------------------
       The ring that used to be an SVG stroke sweeping around the globe. It is
       particles now, and it is NOT part of the rotating sphere: its home is a
       circle on the screen-facing plane, so it always traces the silhouette no
       matter how the Earth turns underneath it. rimIdx0 marks where it starts
       so the hot loop can treat it differently without a branch on group. */
    const rimIdx0 = k;
    for (let i = 0; i < N_RIM; i++) {
      const a = (i / N_RIM) * Math.PI * 2;
      // Scattered across a thin shell rather than pinned to one exact circle.
      // At radius 1 for all 260, they stacked onto a single hairline and
      // composited into a hard edge — the "welded hoop" look. Spread over a
      // shell, with a wider size range, the band gains soft shoulders and
      // reads as atmosphere instead.
      const rimR = 1 + (rnd() - 0.3) * 0.075;
      setHome(k, Math.cos(a) * rimR, Math.sin(a) * rimR, 0);
      group[k] = G_RIM;
      baseSize[k] = 0.85 + rnd() * 1.35;
      bright[k] = 1;
      tint[k] = rnd() * 0.25;
      k++;
    }

    /* How many particles actually exist. NOT the same as COUNT: the stride
       acceptance above lands within a couple of particles of the target rather
       than exactly on it, so COUNT is an upper bound for allocation only.
       Drawing to COUNT would render the unwritten tail — every one of which
       has home (0,0,0) and would pile up as a bright dot at the globe's
       centre. Everything downstream iterates TOTAL. */
    const TOTAL = k;

    // --- Spawn state + character for every particle.
    for (let i = 0; i < TOTAL; i++) {
      // Random unit direction for the spawn point.
      const u = rnd() * 2 - 1;
      const t2 = rnd() * Math.PI * 2;
      const s2 = Math.sqrt(Math.max(0, 1 - u * u));
      sx[i] = s2 * Math.cos(t2);
      sy[i] = u;
      sz[i] = s2 * Math.sin(t2);
      /* 1.5R..2.6R, not 2.1R..4.7R. At 4.7R the swarm spawned 820 SVG units
         from the centre — wider than the 1280-unit section — so the formation
         began as particles strewn across the whole hero instead of as a cloud
         gathering around a point. Close enough now that the globe is always
         the subject. */
      sRad[i] = 1.5 + rnd() * 1.1;
      delay[i] = rnd() * 0.55;          // knit together, never snap
      dur[i] = 1.15 + rnd() * 0.75;
      swirl[i] = (rnd() * 2 - 1) * 2.0; // signed tangential spin-in
      wobPhase[i] = rnd() * Math.PI * 2;
      wobSpeed[i] = 0.5 + rnd() * 0.9;
    }

    /* The ring is the outer layer of the SAME swarm, not a separate object
       swept in from one side. Each rim particle gets an isotropic scattered
       spawn direction, exactly like land/ocean/lattice above, so it converges
       toward its place on the circle from all around rather than sweeping in
       as a band from 9 o'clock. Delay is randomised per-particle rather than
       tied to (i - rimIdx0) — that was the other half of the "sweep": tying
       delay to index made particles land in angular order, i.e. progressively
       around the ring like a clock hand. A later delay window (vs. the body's
       0..0.55) still lands the ring shortly after the surface has knitted, so
       it reads as the formation's last layer snapping into focus, not as
       something arriving afterward. */
    for (let i = rimIdx0; i < rimIdx0 + N_RIM; i++) {
      const u = rnd() * 2 - 1;
      const t2 = rnd() * Math.PI * 2;
      const s2 = Math.sqrt(Math.max(0, 1 - u * u));
      sx[i] = s2 * Math.cos(t2);
      sy[i] = u;
      sz[i] = s2 * Math.sin(t2);
      sRad[i] = 1.6 + rnd() * 1.0;
      delay[i] = 0.95 + rnd() * 0.5;
      dur[i] = 0.8 + rnd() * 0.4;
      swirl[i] = (rnd() * 2 - 1) * 2.0; // signed per-particle, matching the body
    }

    let dims = { w: 0, h: 0 };
    let map = { scale: 1, offX: 0, offY: 0 };
    let dpr = 1;

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      // 1.25, not 1.5. This canvas is fill-rate bound and every step of dpr
      // costs its square in pixels to blend — 1.5 -> 1.25 is 31% fewer. The
      // particles are sub-2px glows under additive blending, where the extra
      // sampling buys nothing you can actually see.
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dims = { w: rect.width, h: rect.height };
      // Matches the SVG's preserveAspectRatio="xMidYMid slice".
      const scale = Math.max(dims.w / VB_W, dims.h / VB_H);
      map = {
        scale,
        offX: (dims.w - VB_W * scale) / 2,
        offY: (dims.h - VB_H * scale) / 2,
      };

    };
    setup();
    const onResize = () => setup();
    window.addEventListener("resize", onResize, { passive: true });

    const FORM_END = 2.0;          // surface has landed by here (rim lands ~2.3)
    const TILT = 0.32;             // axial tilt, radians — reads as a real body
    /* Perspective, and the two things that kept particles outside the rim.
       It was FOCAL/(FOCAL + z2), which has the sign backwards: it SHRANK the
       near hemisphere and MAGNIFIED the far one, so back-side particles
       projected to 1.033 of the radius and sprayed past the ring — the fuzz
       around the edge. Correct form is FOCAL/(FOCAL - z2).
       Even correct, perspective pushes the widest points slightly past the
       silhouette: at FOCAL 9 the maximum projected radius is 1.0062 (at
       z=0.11). CONTAIN is exactly that reciprocal, so the sphere is scaled to
       sit inside the rim by construction rather than by hoping. Slightly under
       1/1.0062 to leave room for the surface wobble. */
    const FOCAL = 9;               // perspective strength, in sphere radii
    const CONTAIN = 0.978;         // 1/1.0062, minus headroom for the wobble
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    // Key light, upper-left, matching the SVG sphereLight gradient's origin so
    // the particle Earth is lit consistently with the rest of the section.
    const LX = -0.55, LY = 0.62, LZ = 0.56;

    /* ---- Draw palette + bins ---------------------------------------------
       Five colour classes x ALPHA_LEVELS steps, every rgba() string built once
       here and reused forever. Everything the hot loop needs is preallocated;
       nothing in the per-frame path allocates. */
    const C_LAND = 0, C_OCEAN = 1, C_LATTICE = 2, C_RIM = 3, C_HOT = 4;
    const ALPHA_LEVELS = 10;
    const NBUCKETS = 5 * ALPHA_LEVELS;
    const CLASS_RGB = [
      [238, 248, 255], // land   — warm white
      [ 70, 150, 245], // ocean  — site blue
      [150, 210, 255], // lattice— pale cyan
      [138, 205, 255], // rim    — atmosphere blue, not white: a white rim
                      //          reads as a stroked outline welded to the globe
      [255, 255, 255], // hot    — in flight
    ];
    const PALETTE = new Array(NBUCKETS);
    for (let c = 0; c < 5; c++) {
      const [r, g2, b2] = CLASS_RGB[c];
      for (let l = 0; l < ALPHA_LEVELS; l++) {
        // Mid-bin alpha, so quantisation error is +/- half a step rather than
        // always rounding down and dimming the whole field.
        const a = (l + 0.5) / ALPHA_LEVELS;
        PALETTE[c * ALPHA_LEVELS + l] = `rgba(${r},${g2},${b2},${a.toFixed(3)})`;
      }
    }
    const bx = new Float32Array(COUNT);
    const by = new Float32Array(COUNT);
    const bs = new Float32Array(COUNT);
    const bucketOf = new Uint8Array(COUNT);
    const order = new Uint32Array(COUNT);
    const bucketCount = new Uint32Array(NBUCKETS);
    const bucketStart = new Uint32Array(NBUCKETS);
    const bucketCursor = new Uint32Array(NBUCKETS);

    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
    const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

    let startTs = null;
    let lastTs = null;
    let rot = 0;
    let rafId;

    const draw = (t, dt) => {
      const cx = CX * map.scale + map.offX;
      const cy = CY * map.scale + map.offY;
      const Rpx = R * map.scale;

      ctx.clearRect(0, 0, dims.w, dims.h);

      // Formation progress drives rotation speed and the core glow. Fast while
      // the swarm gathers, settling to a slow ambient turn — the deceleration
      // is a large part of why the end of the formation feels like an arrival
      // rather than a stop.
      const form = reduced ? 1 : Math.min(1, t / FORM_END);
      const formE = easeInOutSine(form);
      rot += (1.05 + (0.135 - 1.05) * formE) * dt;

      // Ignition core — the point the swarm gathers around. Gone by the time
      // the shell closes, so it never sits inside the finished globe.
      if (!reduced && t < 1.9) {
        const a = t < 0.35 ? t / 0.35 : Math.max(0, 1 - (t - 0.35) / 1.55);
        if (a > 0.01) {
          const cr = Rpx * 0.06 * (1 + Math.sin(t * 6) * 0.18);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 9);
          g.addColorStop(0, `rgba(255,255,255,${0.9 * a})`);
          g.addColorStop(0.3, `rgba(200,232,255,${0.45 * a})`);
          g.addColorStop(1, "rgba(120,180,240,0)");
          ctx.fillStyle = g;
          ctx.fillRect(cx - cr * 9, cy - cr * 9, cr * 18, cr * 18);
        }
      }

      /* ---- The body -------------------------------------------------------
         A particle field ALWAYS has gaps between its particles — that is what
         it is. Relying on particles alone to describe the sphere left most of
         the globe as bare background showing through, which read as a broken,
         half-empty ball rather than a planet.
         So the ocean gets an actual surface: one shaded sphere, lit from the
         same upper-left key as the particles, drawn underneath them. Its alpha
         is tied to formation progress, so it does not appear — it densifies as
         the swarm arrives, and the particles are still what you watch building
         the thing. Two gradients: a lit body, then a limb darkening pass that
         turns a flat disc into something with a curved edge.
         Cost is two gradient fills a frame, which is nothing next to the
         thousands of blended rects above. */
      /* NO SOLID BODY. A shaded sphere was tried here to fill the gaps between
         particles and it was wrong on every count: it is a solid shape that
         appears rather than assembles, it is opaque so it hid the flight arcs
         and city nodes on the SVG underneath, and a deep navy ball does not
         belong on a pale sky-blue section. The globe has to be the particles
         and nothing else — density is the only legitimate way to close the
         gaps, so the counts above carry that job. */

      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      ctx.globalCompositeOperation = "lighter";

      // Reset the bins for this frame. n is the number of particles that
      // actually made it into a bin (spawned, and above the alpha floor).
      bucketCount.fill(0);
      let n = 0;

      for (let i = 0; i < TOTAL; i++) {
        // --- Convergence ---------------------------------------------------
        let ux, uy, uz, rad;
        if (reduced) {
          ux = hx[i]; uy = hy[i]; uz = hz[i]; rad = 1;
        } else {
          const lt = t - delay[i];
          if (lt < 0) continue;                    // not yet spawned
          const u = Math.min(1, lt / dur[i]);
          const e = easeOutCubic(u);

          // Direction: normalised lerp spawn -> home. Curves the approach.
          let dx = sx[i] + (hx[i] - sx[i]) * e;
          let dy = sy[i] + (hy[i] - sy[i]) * e;
          let dz = sz[i] + (hz[i] - sz[i]) * e;

          // Tangential swirl, decaying to nothing as it lands — the spiral.
          const sw = swirl[i] * (1 - e) * (1 - e);
          if (sw !== 0) {
            const c = Math.cos(sw), s = Math.sin(sw);
            const nx = dx * c - dz * s;
            dz = dx * s + dz * c;
            dx = nx;
          }

          // sqrt, not Math.hypot: hypot does overflow-safe scaling that costs
          // several times a plain sqrt, and these are all unit-ish already.
          const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const inv = 1 / (len || 1);
          ux = dx * inv; uy = dy * inv; uz = dz * inv;
          rad = sRad[i] + (1 - sRad[i]) * e;
        }

        // Surface breathing once landed — keeps the skin alive without ever
        // disturbing the silhouette.
        const settled = reduced ? 1 : Math.min(1, Math.max(0, (t - delay[i]) / dur[i]));
        const wob = reduced
          ? 0
          : Math.sin(t * wobSpeed[i] + wobPhase[i]) * 0.012 * settled;
        const rr = (rad + wob) * Rpx;

        // --- 3D transform: spin about Y, then tilt about X -----------------
        // The rim is exempt from the spin: it lives on the screen-facing plane
        // so it traces the silhouette while the Earth turns inside it.
        let x1, y2, z2;
        if (group[i] === G_RIM) {
          x1 = ux; y2 = uy; z2 = uz;
        } else {
          const z1 = -ux * sinR + uz * cosR;
          x1 = ux * cosR + uz * sinR;
          y2 = uy * cosT - z1 * sinT;
          z2 = uy * sinT + z1 * cosT;
        }

        // --- Perspective ---------------------------------------------------
        // Minus z2, not plus — see the note on FOCAL. CONTAIN keeps the whole
        // projected sphere inside the rim.
        const persp = FOCAL / (FOCAL - z2);
        const pr = rr * persp * CONTAIN;
        const px = cx + x1 * pr;
        const py = cy + y2 * pr;

        // Depth 0 (far) .. 1 (near). Drives brightness and size — this is what
        // turns a cloud of flat dots into a body with a front and a back.
        const depth = (z2 + 1) * 0.5;

        const g = group[i];

        /* --- Lighting -------------------------------------------------------
           A single key light from the upper left, exactly where the SVG's
           sphereLight gradient used to put it, so the particle Earth is lit the
           same way the rest of the section is. Diffuse term is the dot product
           of the surface normal (which, on a unit sphere, IS the position) with
           the light direction. This is what gives the globe a lit face and a
           dark limb instead of looking like a flat sticker of dots. */
        const diffuse = ux * LX + uy * LY + uz * LZ;   // -1 .. 1
        const lit = 0.18 + 0.82 * Math.max(0, diffuse * 0.5 + 0.5);

        // Colour comes from the class palette below; only brightness varies
        // per particle, so this just resolves alpha.
        let alpha;
        if (g === G_RIM) {
          // A halo, not a hoop. These composite additively, so alpha stacks
          // fast — at 0.5..0.92 it read as a drawn ring welded round the globe
          // rather than as atmosphere catching the light. Lower again now that
          // they are spread across a shell instead of one hairline: the same
          // light is shared over more particles, so per-particle alpha has to
          // come down or the band simply thickens into a wider hoop.
          alpha = 0.10 + 0.13 * depth;
        } else if (g === G_LAND) {
          // Land. It no longer has to imply the sphere — the body does that —
          // so it can be pushed hard and simply read as glowing continents
          // sitting on an ocean.
          alpha = (0.35 + 0.85 * depth * depth) * lit * (1 - tint[i] * 0.25);
        } else if (g === G_OCEAN) {
          // Low per-dot alpha on purpose: these are wide and they overlap, and
          // under additive blending overlapping dots accumulate. Kept faint so
          // the sea builds up to an even tone instead of blowing out to white
          // wherever three of them happen to land on each other.
          alpha = (0.03 + 0.105 * depth * depth) * lit;
        } else {
          // Lattice: faintest of all — structure, not content.
          alpha = (0.04 + 0.16 * depth * depth) * lit;
        }

        // Extra luminance while still in flight, so the swarm reads as energy
        // before it reads as a surface.
        if (!reduced) {
          const u = (t - delay[i]) / dur[i];
          if (u < 1) alpha += (1 - u) * (1 - u) * 0.6;
        }
        if (alpha < 0.02) continue;
        if (alpha > 1) alpha = 1;

        /* Size GROWS as a particle lands. In flight everything is a tiny spark;
           it only opens up to its full width once it has arrived.
           This is what was wrong with the formation: ocean dots are deliberately
           wide (they are what fills the sphere), but that width was applied the
           whole time, so the approach was thousands of 5-9px squares scattered
           across the entire section — blocky, and covering the whole hero
           rather than converging into a globe. It was also most of the frame
           cost during formation, which is what made it feel slow and glitchy.
           Sparks in, surface at rest. */
        const grow = reduced ? 1 : 0.22 + 0.78 * settled * settled;
        const size = baseSize[i] * map.scale * persp * (0.62 + 0.75 * depth) * grow;

        /* Bucket instead of drawing. Assigning ctx.fillStyle builds a string
           and pokes the canvas state machine; doing that once per particle was
           ~12k string allocations and ~12k state changes every frame, and it
           was by far the dominant cost — 116ms/frame, 8.6fps. Particles are
           binned into a small fixed palette here and drawn per-bin below, which
           turns those 12k state changes into about 40. */
        let cls;
        if (!reduced && (t - delay[i]) / dur[i] < 1) cls = C_HOT;
        else if (g === G_RIM) cls = C_RIM;
        else if (g === G_LAND) cls = C_LAND;
        else if (g === G_OCEAN) cls = C_OCEAN;
        else cls = C_LATTICE;

        let lv = (alpha * ALPHA_LEVELS) | 0;
        if (lv >= ALPHA_LEVELS) lv = ALPHA_LEVELS - 1;

        const b = cls * ALPHA_LEVELS + lv;
        bucketOf[n] = b;
        bx[n] = px; by[n] = py; bs[n] = size;
        bucketCount[b]++;
        n++;
      }

      /* Counting sort into contiguous runs, then one fillStyle per run. Three
         linear passes over n, which is far cheaper than the state churn it
         replaces. */
      let acc = 0;
      for (let b = 0; b < NBUCKETS; b++) {
        bucketStart[b] = acc;
        acc += bucketCount[b];
        bucketCursor[b] = bucketStart[b];
      }
      for (let i = 0; i < n; i++) {
        order[bucketCursor[bucketOf[i]]++] = i;
      }
      for (let b = 0; b < NBUCKETS; b++) {
        const from = bucketStart[b];
        const to = from + bucketCount[b];
        if (from === to) continue;
        ctx.fillStyle = PALETTE[b];
        for (let j = from; j < to; j++) {
          const i = order[j];
          const s = bs[i];
          ctx.fillRect(bx[i] - s, by[i] - s, s * 2, s * 2);
        }
      }

      ctx.globalCompositeOperation = "source-over";
    };

    if (reduced) {
      // One settled frame, no loop at all.
      draw(FORM_END, 0);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    const tick = (ts) => {
      if (startTs === null) { startTs = ts; lastTs = ts; }
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      draw((ts - startTs) / 1000, dt);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="globe-hero__particles"
      aria-hidden="true"
    />
  );
}

/* ============================================================================
 * COMPONENT
 * ========================================================================== */

export default function AnimatedGlobeHero({
  stats = DEFAULT_STATS,
  showStats = true,
  className = "",
}) {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const [active, setActive] = useState(false);
  // Bumped on every fresh entry. Used as a React key so the particle canvas and
  // the stat cards remount, which is what makes their animations and counters
  // genuinely restart rather than sit at their finished state.
  const [runId, setRunId] = useState(0);

  // Plays whenever the section enters the viewport, and RESETS when it leaves,
  // so scrolling away and coming back replays the whole sequence from zero.
  // (Previously the observer disconnected on first sight — the animation was
  // strictly once per page load.)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Guarded so repeated intersection callbacks while already on
            // screen can't restart the sequence mid-play.
            setActive((wasActive) => {
              if (!wasActive) setRunId((r) => r + 1);
              return true;
            });
          } else {
            setActive(false);
          }
        }
      },
      // threshold 0: enters on the first visible pixel, leaves only once the
      // section is completely out of view.
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SMIL (the arcs, city-node pulses and orbiting satellites) is driven by the
  // SVG's own clock, not CSS, so it needs pausing and rewinding by hand.
  // Pausing is the single biggest scroll win here: off screen, those ~90 SMIL
  // timelines stop costing anything at all.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (active) {
      svg.setCurrentTime(0); // rewind so arcs restart with everything else
      svg.unpauseAnimations();
    } else {
      svg.pauseAnimations();
    }
  }, [active, runId]);

  // Stable starfield
  const stars = useMemo(() => {
    const rnd = mulberry32(20260518);
    // 90 -> 48. Each star is an SVG circle carrying its own infinite CSS
    // animation; they're small and scattered, so halving the count reads the
    // same while halving the number of forever-running timelines.
    return Array.from({ length: 48 }, () => ({
      cx: rnd() * VB_W,
      cy: rnd() * VB_H * 0.7, // Keep stars in upper portion
      r: 0.3 + rnd() * 1.1,
      delay: rnd() * 6,
      duration: 2.5 + rnd() * 3,
      opacity: 0.25 + rnd() * 0.55,
    }));
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`globe-hero ${active ? "is-active" : ""} ${className}`}
      role="img"
      aria-label="Animated globe with global network connections"
    >
      {/* Keys are prefixed because this and the stats container are siblings:
          a bare key={runId} gave both the same key and React warned about a
          duplicate. The value still changes per run, which is the point. */}
      <ParticleGlobe key={`particles-${runId}`} active={active} />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="globe-hero__svg"
      >
        <defs>
          {/* ============================================================
              BACKGROUND GRADIENTS
              HERO PALETTE — pixel-matched to .hero-gradient-flow:
                base ramp #1360ee → #0a84e3 → #3abede → #97def1
                patches  rgba(13,47,165) / (10,132,227) / (8,178,224)
                         (58,190,222) / (170,225,245) / (193,235,247)
              No warm/amber tones — pure blue→cyan→ice family.
              ============================================================ */}
          <linearGradient id="bgSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1360ee" />
            <stop offset="45%"  stopColor="#0a84e3" />
            <stop offset="75%"  stopColor="#3abede" />
            <stop offset="100%" stopColor="#97def1" />
          </linearGradient>
          <radialGradient id="bgDeepBlue" cx="18%" cy="12%" r="70%">
            <stop offset="0%"   stopColor="#0d2fa5" stopOpacity="0.6" />
            <stop offset="55%"  stopColor="#0d2fa5" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0d2fa5" stopOpacity="0" />
          </radialGradient>
          {/* Horizon glow — re-tuned from warm amber to pale-ice cyan */}
          <radialGradient id="bgHorizonGlow" cx="45%" cy="108%" r="70%">
            <stop offset="0%"   stopColor="#c1ebf7" stopOpacity="0.85" />
            <stop offset="25%"  stopColor="#aae1f5" stopOpacity="0.55" />
            <stop offset="55%"  stopColor="#97def1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#97def1" stopOpacity="0" />
          </radialGradient>
          {/* Right wash — re-tuned to sky-cyan */}
          <radialGradient id="bgRightWarm" cx="95%" cy="55%" r="55%">
            <stop offset="0%"   stopColor="#3abede" stopOpacity="0.45" />
            <stop offset="50%"  stopColor="#08b2e0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#08b2e0" stopOpacity="0" />
          </radialGradient>
          {/* Bottom-left wash — re-tuned to pale-ice cyan */}
          <radialGradient id="bgBottomLeftWarm" cx="15%" cy="95%" r="45%">
            <stop offset="0%"   stopColor="#c1ebf7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c1ebf7" stopOpacity="0" />
          </radialGradient>

          {/* Deep-blue cloud patch — hero deep-navy + electric blue */}
          <radialGradient id="darkCloudPatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0d2fa5" stopOpacity="1" />
            <stop offset="40%"  stopColor="#0a84e3" stopOpacity="0.62" />
            <stop offset="65%"  stopColor="#0a84e3" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0a84e3" stopOpacity="0" />
          </radialGradient>
          {/* Watery cyan patch — hero sky-cyan + pale cyan */}
          <radialGradient id="wateryBluePatch" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#08b2e0" stopOpacity="0.85" />
            <stop offset="45%"  stopColor="#3abede" stopOpacity="0.45" />
            <stop offset="75%"  stopColor="#aae1f5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#aae1f5" stopOpacity="0" />
          </radialGradient>

          {/* ============================================================
              EARTH SURFACE — procedural texture via turbulence
              Layer 1: low-frequency noise = continent shapes
              Layer 2: higher-frequency = terrain detail / coastlines
              Layer 3: very high frequency = cloud streaks
              ============================================================ */}
          <filter id="continentNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.014"
              numOctaves="4"
              seed="7"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.45
                      0 0 0 0 0.72
                      0 0 0 0 0.88
                      0 0 0 4 -1.6"
            />
          </filter>
          <filter id="terrainNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed="13"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.55
                      0 0 0 0 0.78
                      0 0 0 0 0.92
                      0 0 0 1.5 -0.6"
            />
          </filter>
          <filter id="cloudNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.045"
              numOctaves="3"
              seed="22"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 2.2 -0.9"
            />
          </filter>

          {/* Ocean base — matched to hero sky gradient
              (#1360ee → #0a84e3 → #3abede → #97def1) so the globe reads
              as part of the surrounding sky, not a paler disc on top. */}
          <radialGradient id="oceanBase" cx="42%" cy="32%" r="72%">
            <stop offset="0%"   stopColor="#1f6ff0" />
            <stop offset="40%"  stopColor="#0a84e3" />
            <stop offset="75%"  stopColor="#3abede" />
            <stop offset="100%" stopColor="#97def1" />
          </radialGradient>

          {/* Spherical shading — top-left highlight, bottom-right shadow */}
          <radialGradient id="sphereLight" cx="32%" cy="22%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sphereShade" cx="70%" cy="78%" r="65%">
            <stop offset="0%" stopColor="#0d2fa5" stopOpacity="0" />
            <stop offset="65%" stopColor="#0d2fa5" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d2fa5" stopOpacity="0.28" />
          </radialGradient>

          {/* Terminator — re-tuned to pale-ice cyan rim (matches hero palette) */}
          <radialGradient id="terminatorWarm" cx="50%" cy="95%" r="55%">
            <stop offset="0%"   stopColor="#c1ebf7" stopOpacity="0.75" />
            <stop offset="50%"  stopColor="#97def1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#97def1" stopOpacity="0" />
          </radialGradient>

          {/* Atmospheric halo — soft white ring around the globe */}
          <radialGradient id="atmoHalo" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="78%" stopColor="#cce8f8" stopOpacity="0.03" />
            <stop offset="92%" stopColor="#ffffff" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="atmoHaloOuter" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="88%" stopColor="#e8f4fc" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Arc trail gradient — fades from transparent to bright white tip */}
          <linearGradient id="arcTrail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Glow filters */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="brightGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cometGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sphere clip path */}
          <clipPath id="globeClip">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>

          {/* ============================================================
              Earth texture symbol — one self-contained tile, exactly
              the width of the globe diameter. We render TWO copies of
              this symbol side-by-side and translate the parent group
              horizontally. When the leading copy has moved exactly one
              tile-width, the trailing copy is now in the leading
              copy's original position — so the loop is seamless.

              This is the standard trick for endless scrolling textures.
              Crucially, the noise is BAKED into the symbol once, so the
              two copies render identical pixels — no procedural mismatch.
              ============================================================ */}
          <symbol
            id="earthTile"
            width={R * 2}
            height={R * 2}
            viewBox={`0 0 ${R * 2} ${R * 2}`}
          >
            <rect width={R * 2} height={R * 2} fill="#0a84e3" />
            <rect
              width={R * 2}
              height={R * 2}
              fill="white"
              filter="url(#continentNoise)"
              opacity="0.78"
            />
            <rect
              width={R * 2}
              height={R * 2}
              fill="white"
              filter="url(#terrainNoise)"
              opacity="0.16"
              style={{ mixBlendMode: "screen" }}
            />
          </symbol>

          <symbol
            id="cloudTile"
            width={R * 2}
            height={R * 2}
            viewBox={`0 0 ${R * 2} ${R * 2}`}
          >
            <rect
              width={R * 2}
              height={R * 2}
              fill="white"
              filter="url(#cloudNoise)"
              opacity="0.6"
            />
          </symbol>
        </defs>

        {/* ====================================================================
            BACKGROUND LAYERS
            ==================================================================== */}
        <rect width={VB_W} height={VB_H} fill="url(#bgSky)" />
        <rect width={VB_W} height={VB_H} fill="url(#bgDeepBlue)" />

        {/* Uneven cool-blue cloud patches — top + sides only.
            Keep clear of the bottom where the warm horizon glow lives,
            so blue and gold never muddy each other. */}
        <g className="cloud-patches">
          {/* Top band */}
          <ellipse cx="128"  cy="32"  rx="742" ry="238" fill="url(#darkCloudPatch)" opacity="0.62" />
          <ellipse cx="1178" cy="16"  rx="666" ry="205" fill="url(#darkCloudPatch)" opacity="0.60" />
          <ellipse cx="666"  cy="54"  rx="435" ry="108" fill="url(#darkCloudPatch)" opacity="0.52" />
          <ellipse cx="870"  cy="32"  rx="384" ry="86"  fill="url(#darkCloudPatch)" opacity="0.50" />
          {/* Mid band */}
          <ellipse cx="205"  cy="172" rx="538" ry="151" fill="url(#darkCloudPatch)" opacity="0.44" />
          <ellipse cx="1024" cy="138" rx="589" ry="173" fill="url(#darkCloudPatch)" opacity="0.42" />
          {/* Side patches hugging the globe (kept above the warm horizon) */}
          <ellipse cx="60"   cy="260" rx="320" ry="180" fill="url(#darkCloudPatch)" opacity="0.36" />
          <ellipse cx="1230" cy="240" rx="320" ry="180" fill="url(#darkCloudPatch)" opacity="0.34" />
          <ellipse cx="180"  cy="360" rx="240" ry="150" fill="url(#darkCloudPatch)" opacity="0.26" />
          <ellipse cx="1110" cy="340" rx="240" ry="150" fill="url(#darkCloudPatch)" opacity="0.24" />
          {/* Cool watery blue around the 1M+ card area (right-mid / lower-right) */}
          <ellipse cx="1150" cy="320" rx="280" ry="170" fill="url(#wateryBluePatch)" opacity="0.55" />
          <ellipse cx="1230" cy="395" rx="220" ry="135" fill="url(#wateryBluePatch)" opacity="0.42" />
        </g>

        <rect width={VB_W} height={VB_H} fill="url(#bgRightWarm)" />
        <rect width={VB_W} height={VB_H} fill="url(#bgBottomLeftWarm)" />
        <rect width={VB_W} height={VB_H} fill="url(#bgHorizonGlow)" className="horizon-pulse" />

        {/* Starfield */}
        <g className="stars">
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#ffffff"
              opacity={s.opacity}
              style={{
                animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          ))}
        </g>

        {/* ====================================================================
            GLOBE
            ==================================================================== */}
        <g className="globe-group">
          {/* Outer soft atmosphere */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 60}
            fill="url(#atmoHaloOuter)"
            className="halo-outer"
          />
          {/* Inner crisp atmosphere */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 28}
            fill="url(#atmoHalo)"
            className="halo-inner"
          />

          {/* ============================================================
              SVG SPHERE SURFACE — off.
              This block (ocean fill, rotating earth texture, cloud layer,
              spherical shading, terminator, inner edge) is the solid sphere
              the particles used to be swapped out for. It is exactly what
              made the globe "pop": the swarm you watched assemble was
              discarded and this appeared underneath it.
              The particle field is the globe now, so none of it renders.
              Set SHOW_SVG_SPHERE to true to get the old solid globe back —
              the defs, tiles and CSS are all still here, untouched.
              Deliberately still rendered above this: the atmosphere halos and
              the glowing rim, which give the particle sphere its silhouette
              and atmosphere; and below it the city nodes and flight arcs.
              ============================================================ */}
          {SHOW_SVG_SPHERE && (
          <>
          {/* Ocean base sphere */}
          <circle cx={CX} cy={CY} r={R} fill="url(#oceanBase)" />

          {/* Rotating Earth texture — two identical copies of the texture
              tile placed side-by-side, translated as a group. When the
              group has shifted left by exactly one tile-width, the second
              copy is in the first copy's original spot — so when the
              animation loops back to 0, there's no visible jump. This is
              what makes the surface VISIBLY rotate (the noise is baked
              into a symbol, so it moves with the geometry). */}
          <g clipPath="url(#globeClip)">
            <g className="earth-rotate">
              <use
                href="#earthTile"
                x={CX - R}
                y={CY - R}
                width={R * 2}
                height={R * 2}
              />
              <use
                href="#earthTile"
                x={CX - R + R * 2}
                y={CY - R}
                width={R * 2}
                height={R * 2}
              />
            </g>
          </g>

          {/* Cloud layer — same two-copy technique, slower drift */}
          <g clipPath="url(#globeClip)" style={{ mixBlendMode: "screen" }}>
            <g className="cloud-rotate" opacity="0.55">
              <use
                href="#cloudTile"
                x={CX - R}
                y={CY - R}
                width={R * 2}
                height={R * 2}
              />
              <use
                href="#cloudTile"
                x={CX - R + R * 2}
                y={CY - R}
                width={R * 2}
                height={R * 2}
              />
            </g>
          </g>

          {/* Spherical shading — applied after texture for proper 3D feel */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="url(#sphereLight)"
            clipPath="url(#globeClip)"
          />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="url(#sphereShade)"
            clipPath="url(#globeClip)"
          />

          {/* Warm terminator glow at bottom */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="url(#terminatorWarm)"
            clipPath="url(#globeClip)"
          />
          </>
          )}

          {/* Atmosphere, not an outline.
              This pair used to be a white bloom under a 4.5px white stroke at
              0.92 opacity — that crisp stroke was the hard ring welded round
              the globe, and no amount of softening the rim PARTICLES could
              affect it because it is drawn here in SVG, over the top of them.
              Now: one wide, soft blue bloom, and a second much fainter pass
              just inside it to give the limb a little more presence. Neither
              has a hard enough edge to read as a drawn circle. */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 5}
            fill="none"
            stroke="#7ec8ff"
            strokeWidth="18"
            opacity="0.30"
            filter="url(#ringGlow)"
          />
          <circle
            cx={CX}
            cy={CY}
            r={R + 1}
            fill="none"
            stroke="#a9dcff"
            strokeWidth="7"
            opacity="0.26"
            filter="url(#ringGlow)"
          />
          {/* Inner edge darkening for sphere depth */}
          <circle
            cx={CX}
            cy={CY}
            r={R - 0.5}
            fill="none"
            stroke="#0d2fa5"
            strokeWidth="1.5"
            opacity="0.22"
          />

          {/* ============================================================
              FORMATION BEAT — plays once, as the particles hand over.
              Previously the sphere just faded up underneath them, which
              read as a crossfade rather than as the thing being built.
              ============================================================ */}
          {/* Ignition: light strikes the rim and burns around it */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 2}
            pathLength="100"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="rim-ignite"
            opacity="0"
            // Start the burn at 12 o'clock rather than 3 o'clock
            transform={`rotate(-90 ${CX} ${CY})`}
          />
          {/* Shockwave leaving the surface as the sphere completes */}
          {SHOW_FORMATION_SHOCKWAVE && (
            <>
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="#dff2ff"
                className="shockwave"
                opacity="0"
              />
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="#ffffff"
                className="shockwave shockwave--late"
                opacity="0"
              />
            </>
          )}
        </g>

        {/* ====================================================================
            ORBITAL RINGS + SATELLITES — premium 3D orbital ring system.
            Three elliptical rings at different tilts encircle the globe,
            with satellite dots traveling along each path via CSS offset-path
            (GPU-accelerated, no layout cost). Gives a cinematic high-end
            SaaS "global network" feel without breaking the existing layout.
            ==================================================================== */}
        {SHOW_ORBITAL_RINGS && (
        <g className="orbital-layer">
          {/* Outer orbit — broadest, gentle tilt left */}
          <ellipse
            cx={CX} cy={CY}
            rx={R * 1.48} ry={R * 0.46}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.7"
            transform={`rotate(-16 ${CX} ${CY})`}
            className="orbit-ring orbit-ring--outer"
          />
          {/* Middle orbit — opposite tilt, dashed */}
          <ellipse
            cx={CX} cy={CY}
            rx={R * 1.32} ry={R * 0.34}
            fill="none"
            stroke="rgba(190,225,255,0.28)"
            strokeWidth="0.6"
            strokeDasharray="3 2.5"
            transform={`rotate(22 ${CX} ${CY})`}
            className="orbit-ring orbit-ring--middle"
          />
          {/* Inner orbit — subtle, just outside atmosphere */}
          <ellipse
            cx={CX} cy={CY}
            rx={R * 1.18} ry={R * 0.27}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.5"
            transform={`rotate(-6 ${CX} ${CY})`}
            className="orbit-ring orbit-ring--inner"
          />

          {/* Orbiting satellites — native SVG animateMotion along each ring path.
              Each is a two-circle stack (wide translucent halo + solid core)
              rather than a filtered dot. A Gaussian-blur filter on a moving
              element has to be re-rasterized on every single frame, for the
              whole life of the page; two plain circles are drawn straight to the
              compositor and read the same at this size. */}
          {[
            { rx: 1.48, ry: 0.46, rot: -16, dur: "18s", begin: "0s",   core: 1.5, halo: 4.5, fill: "#ffffff", sweep: 1 },
            { rx: 1.32, ry: 0.34, rot: 22,  dur: "13s", begin: "-4s",  core: 1.0, halo: 3.2, fill: "#cfeaff", sweep: 0 },
            { rx: 1.18, ry: 0.27, rot: -6,  dur: "22s", begin: "-10s", core: 1.2, halo: 3.6, fill: "#ffffff", sweep: 1 },
            { rx: 1.48, ry: 0.46, rot: -16, dur: "26s", begin: "-16s", core: 0.8, halo: 2.6, fill: "#ffe7b8", sweep: 0, reverse: true },
          ].map((s, i) => {
            const a = R * s.rx;
            const b = R * s.ry;
            const x0 = s.reverse ? CX + a : CX - a;
            const x1 = s.reverse ? CX - a : CX + a;
            const path = `M ${x0} ${CY} A ${a} ${b} ${s.rot} 1 ${s.sweep} ${x1} ${CY} A ${a} ${b} ${s.rot} 1 ${s.sweep} ${x0} ${CY}`;
            return (
              <g key={i} className="satellite">
                <animateMotion dur={s.dur} begin={s.begin} repeatCount="indefinite" rotate="auto" path={path} />
                <circle r={s.halo} fill={s.fill} opacity="0.18" />
                <circle r={s.core} fill={s.fill} />
              </g>
            );
          })}
        </g>
        )}

        {/* ====================================================================
            CITY NODES — pulsing markers anchored to the visible hemisphere
            ==================================================================== */}
        <g className="city-nodes">
          {CITY_NODES.map((node, i) => {
            const dur = 3.2 + (i % 4) * 0.4;
            const begin = `${i * 0.35}s`;
            return (
              <g
                key={node.name}
                className="city-node"
                style={{ animationDelay: `${4.0 + i * 0.08}s` }}
              >
                {/* Unfiltered: these pulse forever, so a blur filter here was
                    16 re-rasterizations per frame (8 nodes x 2 layers). The
                    wide low-opacity disc gives the same halo for free. */}
                <circle cx={node.x} cy={node.y} r="6" fill="#ffffff" opacity="0.15">
                  <animate attributeName="opacity" values="0.07;0.22;0.07" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="5;7.5;5" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                </circle>
                <circle cx={node.x} cy={node.y} r="2" fill="#ffffff" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="2.6;3.6;2.6" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                </circle>
                <circle cx={node.x} cy={node.y} r="2" fill="#ffffff">
                  <animate attributeName="opacity" values="0.55;1;0.55" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="1.7;2.4;1.7" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                </circle>
                <circle cx={node.x} cy={node.y} r="0.9" fill="#ffffff">
                  <animate attributeName="opacity" values="0.55;1;0.55" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
        </g>

        {/* ====================================================================
            CONNECTION ARCS — cinematic city-to-city travel paths
            Each arc has:
              - A faint static guide line (very subtle)
              - An animated stroke that draws along the path
              - A bright comet head following the same offset-path
            ==================================================================== */}
        <g className="arcs">
          {ARC_CONNECTIONS.map((arc, i) => {
            const dur = `${arc.dur}s`;
            const begin = `${arc.delay}s`;
            return (
            <g key={i}>
              {/* Static network route — always visible thin white line */}
              <path
                d={arc.d}
                pathLength="100"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
              {/* Animated bright pulse traveling the full path
                  Uses SVG SMIL <animate> so it works on SVG without
                  needing CSS keyframe resolution. */}
              <path
                d={arc.d}
                pathLength="100"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0"
                strokeDasharray="0 100"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 100; 30 100; 8 100; 0 100"
                  keyTimes="0; 0.5; 0.85; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  values="0; -25; -92; -100"
                  keyTimes="0; 0.5; 0.85; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0; 0.95; 0.95; 0.5; 0"
                  keyTimes="0; 0.1; 0.5; 0.85; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </path>
              {/* Traveling comet head — halo. Unfiltered for the same reason as
                  the satellites: 12 blurred elements moving continuously was the
                  single heaviest thing in the section. */}
              <circle r="5" fill="#ffffff" opacity="0">
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={arc.d} />
                <animate
                  attributeName="opacity"
                  values="0; 0.22; 0.22; 0"
                  keyTimes="0; 0.08; 0.92; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="2.6" fill="#ffffff" opacity="0">
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={arc.d} />
                <animate
                  attributeName="opacity"
                  values="0; 0.5; 0.5; 0"
                  keyTimes="0; 0.08; 0.92; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Traveling comet head — bright core */}
              <circle r="1.5" fill="#ffffff" opacity="0">
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={arc.d} />
                <animate
                  attributeName="opacity"
                  values="0; 1; 1; 0"
                  keyTimes="0; 0.08; 0.92; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Landing pulse at destination */}
              <circle
                cx={arc.to.x}
                cy={arc.to.y}
                r="1.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0; 0; 0.9; 0"
                  keyTimes="0; 0.88; 0.92; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="1.5; 1.5; 3; 9.6"
                  keyTimes="0; 0.88; 0.92; 1"
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            );
          })}
        </g>
      </svg>

      {/* ======================================================================
          FLOATING STAT CARDS — minimal glass-morphism
          ====================================================================== */}
      {showStats && (
        // Remounts the cards on each entry, restarting both their CSS entrance
        // and the count-up (which otherwise latches via startedRef).
        <div className="globe-hero__stats" key={`stats-${runId}`}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`stat-card stat-card--${stat.side} stat-card--${stat.row}`}
              style={{
                "--enter-delay": `${4.2 + i * 0.15}s`,
                "--float-delay": `${i * 0.6}s`,
              }}
            >
              <div className="stat-card__inner">
                {stat.icon && (
                  <span className="stat-card__icon" aria-hidden="true">
                    <StatIcon name={stat.icon} />
                  </span>
                )}
                <div className="stat-card__text">
                  <div className="stat-card__value">
                    <AnimatedNumber
                      value={stat.value}
                      active={active}
                      delay={(4.2 + i * 0.15) * 1000}
                    />
                  </div>
                  <div className="stat-card__label">{stat.label}</div>
                </div>
              </div>
              <span className="stat-card__shimmer" aria-hidden="true" />
              <span className="stat-card__edge" aria-hidden="true" />
            </div>
          ))}
        </div>
      )}

      {/* ======================================================================
          STYLES
          ====================================================================== */}
      <style jsx global>{`
        .globe-hero {
          position: relative;
          width: 100%;
          aspect-ratio: 1280 / 540;
          overflow: hidden;
          isolation: isolate;
          /* HERO PALETTE — fallback before SVG paints */
          background: #1360ee;
        }
        .globe-hero__svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* ----- Off-screen = zero cost -----
           The globe never stops moving: earth + cloud pans, two halo breaths,
           a horizon pulse, three ring pulses and 90 twinkling stars all loop
           forever, and every one of them keeps compositing while the visitor is
           reading a completely different part of the page. That background load
           is what made scrolling feel heavy well before this section arrived.
           One rule parks all of it the moment the section leaves the viewport;
           the SMIL clock is paused alongside it from JS. */
        .globe-hero:not(.is-active),
        .globe-hero:not(.is-active) * {
          animation-play-state: paused !important;
        }
        /* Paint containment: the browser can skip this subtree's raster work
           entirely when it's scrolled out, and can't be asked to reflow the
           page because of anything happening inside it. */
        .globe-hero {
          contain: layout paint style;
        }

        /* Entrance gating — hidden until the section scrolls into view
           (or the fallback timer fires). Globe reveals first, then ~1.3s
           later the city nodes appear, then the arcs at 1.5s. Stat cards
           animate in via their own staggered --enter-delay timing. */
        .globe-hero :global(.globe-group),
        .globe-hero :global(.city-nodes),
        .globe-hero :global(.arcs),
        .globe-hero :global(.orbital-layer) {
          opacity: 0;
        }

        /* Opacity ONLY — no transform, and that is the whole fix.

           This rule used to carry, alongside the reveal animation:
               transform-box: fill-box;
               transform-origin: 640px 270px;   (i.e. CX, CY)
           and that is what made the ring appear to fly in from the side.
           fill-box resolves transform-origin from the group's OWN bounding-box
           corner rather than from SVG user space. The outer halo circle is
           r = R + 60 = 235, so this group's bbox starts near (405, 35) — which
           put the origin at roughly user-space (1045, 305), about 405 units
           right of the globe's actual centre. globeReveal scales 0.85 -> 1, so
           the whole group (rings, halos and all) started ~61 units to the RIGHT
           and slid left into place. With no transform at all there is no origin
           to get wrong and nothing to slide.

           Retimed too: 1.4s -> 2.9s, where it used to be 2.6s -> 3.9s. The rim
           particles are in flight from ~0.95s and land between ~1.75s and
           ~2.65s (see the rim spawn block), so the stroke now firms up
           underneath them AS they arrive — the ring densifies out of the
           converging particles instead of fading in after they had already
           finished. The ease keeps it imperceptible early, so nothing pops. */
        .globe-hero.is-active :global(.globe-group) {
          animation: globeFadeIn 1.5s cubic-bezier(0.45, 0, 0.55, 1) 1.4s forwards;
        }
        .globe-hero.is-active :global(.city-nodes) {
          animation: globeFadeIn 0.9s ease-out 4.0s forwards;
        }
        .globe-hero.is-active :global(.arcs) {
          animation: globeFadeIn 0.8s ease-out 4.2s forwards;
        }
        .globe-hero.is-active :global(.orbital-layer) {
          animation: globeFadeIn 1.1s ease-out 3.6s forwards;
        }
        /* Rings draw themselves on rather than the whole ellipse fading up. */
        .globe-hero :global(.orbit-ring--outer),
        .globe-hero :global(.orbit-ring--inner) {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
        }
        .globe-hero.is-active :global(.orbit-ring--outer) {
          animation: orbitDraw 2s cubic-bezier(0.22, 1, 0.36, 1) 3.6s forwards,
                     ringPulse 6s ease-in-out 5.6s infinite;
        }
        .globe-hero.is-active :global(.orbit-ring--inner) {
          animation: orbitDraw 1.7s cubic-bezier(0.22, 1, 0.36, 1) 3.85s forwards,
                     ringPulse 5.2s ease-in-out 5.55s infinite;
        }

        /* ----- Formation beat (each plays exactly once) ----- */
        .globe-hero :global(.rim-ignite),
        .globe-hero :global(.shockwave) {
          opacity: 0;
        }
        /* Pulled from 2.75s to 1.75s. At 2.75s this burned around a ring that
           had already fully faded up, so it read as a second, separate event
           happening TO the ring. At 1.75s it coincides with the rim particles
           landing and the stroke firming up, so the three are one beat. */
        .globe-hero.is-active :global(.rim-ignite) {
          animation: rimIgnite 1.9s cubic-bezier(0.4, 0, 0.2, 1) 1.75s forwards;
        }
        .globe-hero.is-active :global(.shockwave) {
          transform-box: fill-box;
          transform-origin: center;
          animation: shockwave 1.6s cubic-bezier(0.16, 1, 0.3, 1) 3.5s forwards;
        }
        .globe-hero.is-active :global(.shockwave--late) {
          animation-delay: 3.78s;
        }
        /* Nodes land one after another with a slight overshoot, rather than
           the whole set appearing at once. */
        .globe-hero.is-active :global(.city-node) {
          transform-box: fill-box;
          transform-origin: center;
          animation: nodePop 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        /* ----- Particle formation canvas -----
           Sits between the SVG layers and the stat cards. Pointer-events
           disabled so it never intercepts hover/click. */
        .globe-hero__particles {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          display: block;
        }
        /* Keyframes (globeReveal, globeFadeIn, earthSpin, cloudSpin,
           haloBreatheIn, haloBreatheOut, horizonBreathe, ringPulse,
           arcDraw, arcComet, arcLand, cityPulse, twinkle, cardEnter,
           cardFloat, shimmerSweep) live in src/app/globals.css so the
           inline style={{ animation: '...' }} on SVG children can
           resolve them — styled-jsx scoping was preventing that. */

        /* ----- Earth rotation: two-copy seamless slide.
                 The .earth-rotate group contains two identical tiles
                 side-by-side. Translating by exactly -tileWidth puts
                 the second tile where the first started, so the loop
                 back to 0 is invisible. This is what makes the surface
                 VISIBLY rotate. ----- */
        .globe-hero :global(.earth-rotate) {
          animation: earthSpin 32s linear infinite;
          will-change: transform;
        }
        .globe-hero :global(.cloud-rotate) {
          animation: cloudSpin 58s linear infinite;
          will-change: transform;
        }

        /* ----- Atmospheric halo breathing ----- */
        .globe-hero :global(.halo-inner) {
          transform-box: fill-box;
          transform-origin: center;
          animation: haloBreatheIn 7s ease-in-out infinite;
        }
        .globe-hero :global(.halo-outer) {
          transform-box: fill-box;
          transform-origin: center;
          animation: haloBreatheOut 9s ease-in-out infinite;
        }

        .globe-hero :global(.horizon-pulse) {
          animation: horizonBreathe 10s ease-in-out infinite;
        }

        /* ----- Orbital rings + satellites ----- */
        .globe-hero :global(.orbit-ring) {
          transform-box: fill-box;
          transform-origin: center;
        }
        .globe-hero :global(.orbit-ring--outer) {
          animation: ringPulse 6s ease-in-out infinite;
        }
        .globe-hero :global(.orbit-ring--middle) {
          animation: ringPulse 7.5s ease-in-out -2s infinite;
        }
        .globe-hero :global(.orbit-ring--inner) {
          animation: ringPulse 5.2s ease-in-out -3s infinite;
        }
        .globe-hero :global(.satellite) {
          will-change: transform, offset-distance;
          offset-rotate: 0deg;
        }

        /* ====================================================================
           STAT CARDS — minimal, tighter to globe, more premium glass
           ==================================================================== */
        .globe-hero__stats {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .stat-card {
          position: absolute;
          padding: clamp(13px, 1.45vw, 20px) clamp(15px, 1.6vw, 22px);
          min-width: clamp(176px, 18.5vw, 264px);
          background: rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(5px) saturate(110%);
          -webkit-backdrop-filter: blur(5px) saturate(110%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          color: #ffffff;
          box-shadow:
            0 2px 8px rgba(15, 70, 120, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
          opacity: 0;
          transform: translateY(20px) scale(0.96);
          filter: blur(6px);
          pointer-events: auto;
          /* No overflow:hidden here — it used to contain the shimmer sweep, but it
             also sliced the edge glow off flat at the bottom border. The sweep
             is clipped by its own frame instead (see .stat-card__shimmer). */
        }
        .globe-hero.is-active .stat-card {
          animation:
            cardEnter 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--enter-delay) forwards,
            cardFloat 6s ease-in-out calc(var(--enter-delay) + 1.3s) infinite;
        }
        /* Icon left, figures right — the card reads as one row rather than a
           stacked block, which is what gives it the wider, steadier shape. */
        .stat-card__inner {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: clamp(12px, 1.3vw, 18px);
        }
        .stat-card__text { min-width: 0; }

        /* The glyph sits in its own lighter pane, a shade brighter than the card
           so it separates from it without introducing a second colour. */
        .stat-card__icon {
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: clamp(40px, 4vw, 57px);
          height: clamp(40px, 4vw, 57px);
          border-radius: clamp(11px, 1.15vw, 16px);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.94);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }
        .stat-card__icon svg {
          width: clamp(19px, 1.9vw, 27px);
          height: clamp(19px, 1.9vw, 27px);
        }

        /* Lit underline along the bottom edge. Inset from the corners and faded
           at both ends so it reads as light catching the panel rather than a
           drawn border. */
        .stat-card__edge {
          position: absolute;
          left: 7%;
          right: 7%;
          bottom: 0;
          height: 2px;
          border-radius: 2px;
          z-index: 3;
          /* Holds near-full brightness across the middle rather than peaking at
             a single point, so it reads as a lit edge instead of a highlight
             dot, then falls off sharply at both ends. */
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(200, 236, 255, 0.55) 14%,
            rgba(238, 250, 255, 1) 38%,
            rgba(238, 250, 255, 1) 62%,
            rgba(200, 236, 255, 0.55) 86%,
            rgba(255, 255, 255, 0) 100%
          );
          /* Three stacked shadows: a tight core, a mid halo and a wide bloom.
             One large blur alone goes muddy — the layered falloff is what makes
             it look like light rather than a blurred line. */
          box-shadow:
            0 0 6px rgba(214, 244, 255, 0.95),
            0 0 16px rgba(150, 215, 255, 0.7),
            0 0 34px rgba(110, 195, 255, 0.45);
          pointer-events: none;
        }
        .stat-card__value {
          font-size: max(clamp(17px, 1.9vw, 26px), min(1.806vw, 37.7px));
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 12px rgba(0, 40, 90, 0.25);
        }
        .stat-card__label {
          font-size: max(clamp(9px, 0.78vw, 11.5px), min(0.780vw, 16.29px));
          font-weight: 400;
          opacity: 0.92;
          margin-top: 4px;
          letter-spacing: 0.01em;
        }
        /* The sweep needs a frame that clips it and a band that moves inside that
           frame — they cannot be the same element. clip-path is applied in the
           element's own coordinate space and is then carried along by transform,
           so a clipped element that translates takes its clip with it: the band
           slid out past the card edge still fully visible, which is exactly what
           was leaking either side of every card.

           So the span is now the frame — inset:0, overflow:hidden, the card's own
           radius — and its ::before is the band that travels. Clipping the frame
           is safe where clipping .stat-card was not: the frame carries no glow to
           slice off, which is why overflow:hidden was removed from the card. */
        .stat-card__shimmer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 18px;
          pointer-events: none;
          z-index: 1;
        }
        .stat-card__shimmer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 255, 255, 0.07) 50%,
            transparent 65%
          );
          transform: translateX(-100%);
        }
        .globe-hero.is-active .stat-card__shimmer::before {
          animation: shimmerSweep 9s ease-in-out calc(var(--enter-delay) + 2s) infinite;
        }
        /* cardEnter / cardFloat / shimmerSweep keyframes live in globals.css */

        /* Positioning — closer to globe, tighter to center */
        .stat-card--left  { left: clamp(4%, 9.5vw, 14%); }
        .stat-card--right { right: clamp(4%, 9.5vw, 14%); }
        .stat-card--top.stat-card--left     { top: 40%; }
        .stat-card--bottom.stat-card--left  { top: 71%; }
        .stat-card--top.stat-card--right    { top: 26%; }
        .stat-card--bottom.stat-card--right { top: 57%; }

        /* ----- Responsive ----- */
        @media (max-width: 1024px) {
          .stat-card { min-width: 140px; padding: 8px 11px; border-radius: 12px; }
          .stat-card__shimmer { border-radius: 12px; }
          .stat-card--left  { left: clamp(3%, 7vw, 10%); }
          .stat-card--right { right: clamp(3%, 7vw, 10%); }
          .stat-card--top.stat-card--left     { top: 37%; }
          .stat-card--bottom.stat-card--left  { top: 68%; }
          .stat-card--top.stat-card--right    { top: 22%; }
          .stat-card--bottom.stat-card--right { top: 58%; }
        }
        @media (max-width: 768px) {
          .globe-hero { aspect-ratio: 4 / 3; }
          .stat-card { min-width: 100px; padding: 7px 10px; border-radius: 10px; }
          .stat-card__shimmer { border-radius: 10px; }
          .stat-card__value { font-size: var(--f-15); }
          .stat-card__label { font-size: var(--f-9-5); }
          .stat-card--top.stat-card--left     { top: 8%;  left: 3%; }
          .stat-card--bottom.stat-card--left  { top: 76%; left: 3%; }
          .stat-card--top.stat-card--right    { top: 8%;  right: 3%; }
          .stat-card--bottom.stat-card--right { top: 76%; right: 3%; }
        }
        @media (max-width: 480px) {
          .globe-hero { aspect-ratio: 3 / 4; }
          .stat-card { min-width: 88px; padding: 6px 9px; }
          .stat-card__value { font-size: var(--f-13); }
          .stat-card__label { font-size: 8.5px; }
          .stat-card--top.stat-card--left     { top: 5%; }
          .stat-card--bottom.stat-card--left  { top: 80%; }
          .stat-card--top.stat-card--right    { top: 5%; }
          .stat-card--bottom.stat-card--right { top: 80%; }
        }

        /* ----- Accessibility ----- */
        @media (prefers-reduced-motion: reduce) {
          .globe-hero :global(*) { animation: none !important; }
          .globe-hero :global(.globe-group),
          .globe-hero :global(.city-nodes),
          .globe-hero :global(.arcs),
          .globe-hero :global(.orbital-layer) { opacity: 1 !important; }
          /* The rings are dash-drawn, so without their animation they'd stay
             invisible — hand them a solid stroke instead. */
          .globe-hero :global(.orbit-ring--outer),
          .globe-hero :global(.orbit-ring--inner) { stroke-dashoffset: 0 !important; }
          /* One-shot flourishes have no resting state worth showing. */
          .globe-hero :global(.rim-ignite),
          .globe-hero :global(.shockwave) { display: none !important; }
          .stat-card {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
}