'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';

// Text and responsive scene dimensions remain in the server-rendered page.
// Load the large animated SVG previews before their section comes into view.
const FeatureScenes = dynamic(() => import('./Scenes'), { ssr: false });

const SLIDES = [
  {
    id: 'task',
    eyebrow: 'Task Manager',
    cardTitle: 'Task Manager Module',
    cardDesc: 'LOCATOR Task Manager digitizes field and road operations by dispatching tasks to staff via mobile app, with real-time CRM/ERP integration to eliminate duplicate work and improve efficiency.',
  },
  {
    id: 'expense',
    eyebrow: 'Expense Manager',
    cardTitle: 'Expense Manager Module',
    cardDesc: 'The Expense Manager simplifies field expense tracking with instant bill uploads, quick approvals, and AI-powered reports for better cost control.',
  },
  {
    id: 'inspection',
    eyebrow: 'Inspection',
    cardTitle: 'Inspection Module',
    cardDesc: 'LOCATOR Inspection enables digital vehicle and equipment checks with photos and customizable fields, ensuring accountability, compliance, and condition tracking across fleets.',
  },
  {
    id: 'fleet',
    eyebrow: 'Fleet Manager',
    cardTitle: 'Fleet Manager Module',
    cardDesc: 'Fleet Manager lets teams log services via mobile app with real-time updates and automated maintenance reminders to reduce breakdowns and improve vehicle uptime.',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function FeatureSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const isAnimRef    = useRef(false);
  const activeIdxRef = useRef(0);
  const cardRef      = useRef(null);
  const sceneRefs    = useRef([null, null, null, null]);
  const containerRef = useRef([null, null, null, null]);
  const sectionRef = useRef(null);
  const inViewRef = useRef(false);
  const [scenesPrepared, setScenesPrepared] = useState(false);
  const [scenesReady, setScenesReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') {
      inViewRef.current = true;
      const timer = window.setTimeout(() => setScenesPrepared(true), 0);
      return () => window.clearTimeout(timer);
    }
    // The CSS scene container already reserves its full responsive height.
    // Build all four previews ahead of arrival, so switching slides never has
    // to wait for the next preview's artwork, while avoiding initial SVG work.
    const prepare = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setScenesPrepared(true);
      prepare.disconnect();
    }, { rootMargin: '900px 0px' });
    prepare.observe(section);
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      const scene = sceneRefs.current[activeIdxRef.current];
      if (entry.isIntersecting) scene?.play();
      else scene?.pause();
    });
    observer.observe(section);
    return () => { observer.disconnect(); prepare.disconnect(); };
  }, []);

  const onScenesReady = useCallback(() => {
    setScenesReady(true);
    if (inViewRef.current) sceneRefs.current[activeIdxRef.current]?.play();
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      opacity: 1, x: 0, duration: 0.38, ease: 'power3.out',
      onComplete: () => { isAnimRef.current = false; },
    });
  }, [activeIdx]);

  const goTo = useCallback((toIdx) => {
    if (!scenesReady || isAnimRef.current || toIdx === activeIdxRef.current) return;
    isAnimRef.current = true;
    const fromIdx = activeIdxRef.current;
    const dir = toIdx > fromIdx ? 1 : -1;
    activeIdxRef.current = toIdx;
    sceneRefs.current[toIdx]?.reset();

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0, x: dir * -18, duration: 0.22, ease: 'power2.in',
        onComplete: () => {
          setActiveIdx(toIdx);
          if (cardRef.current) gsap.set(cardRef.current, { x: dir * 18 });
        },
      });
    } else { setActiveIdx(toIdx); }

    const fromEl = containerRef.current[fromIdx];
    const toEl   = containerRef.current[toIdx];
    if (fromEl) {
      gsap.to(fromEl, {
        opacity: 0, duration: 0.28, ease: 'power2.in', overwrite: true,
        onComplete: () => {
          sceneRefs.current[fromIdx]?.reset();
          if (toEl) gsap.set(toEl, { opacity: 1 });
          if (inViewRef.current) sceneRefs.current[toIdx]?.play();
        },
      });
    } else {
      if (toEl) gsap.set(toEl, { opacity: 1 });
      if (inViewRef.current) sceneRefs.current[toIdx]?.play();
    }
  }, [scenesReady]);

  const prev = () => goTo((activeIdxRef.current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((activeIdxRef.current + 1) % SLIDES.length);

  const slide = SLIDES[activeIdx];

  return (
    <section ref={sectionRef} data-feature-slider style={{ background:'#fff', width:'100%', padding:'clamp(32px,4vw,56px) 0 clamp(48px,6vw,88px)', position:'relative', overflow:'hidden' }}>
      <div style={{
        position:'absolute', top:0, left:0, width:'55%', height:'100%', pointerEvents:'none',
        background:'radial-gradient(ellipse at 20% 60%, rgba(199,210,254,0.38) 0%, rgba(224,231,255,0.18) 40%, transparent 70%)',
      }}/>

      <div className="fs-container" style={{ position:'relative' }}>

        {/* ── LEFT panel ── */}
        <div className="fs-left" style={{ paddingRight:'clamp(0px, 2vw, 32px)', position:'relative', zIndex:1 }}>
          {/* Sizes are the --sc-* step scale from globals.css, shared with the
              ScrollShowcase rows directly above so the two sections' copy columns
              stay the same size as each other. Each resolves to exactly the flat
              pixel value it replaces up to ~1550px. */}
          <div style={{ fontSize:'var(--sc-13)', fontWeight:700, color:'#1360ee', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'var(--sc-24)' }}>
            {slide.eyebrow}
          </div>
          <h2 style={{ fontSize:'var(--t-h2)', fontWeight:800, lineHeight:1.2, color:'#484b4c', margin:'0 0 var(--sc-16)', maxWidth:'100%', width:'100%' }}>
            Run Your Road Team Smarter<br/>
            <span style={{ fontWeight:700 }}>Empowering field teams,</span>
          </h2>
          <p style={{ fontSize:'var(--t-lead)', color:'#8090bc', lineHeight:1.7, margin:'0 0 var(--sc-28)', maxWidth:'100%' }}>
            Manage, track, and optimize your field workforce in real time<span style={{ color:'#9ca3af' }}> fleets</span>
          </p>

          {/* Carousel card */}
          <div style={{
            borderRadius:8,
            background:'linear-gradient(145deg, rgba(219,227,255,0.55) 0%, rgba(237,242,255,0.42) 50%, rgba(229,236,255,0.38) 100%)',
            padding:'var(--sc-22) var(--sc-28) var(--sc-20)',
          }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
              <button onClick={prev} disabled={!scenesReady} aria-label="Previous feature"
                style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 16px 0 0', fontSize:'var(--sc-28)', color:'#9ca3af', lineHeight:1, flexShrink:0, transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#6b7280'}
                onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}>‹</button>

              <div ref={cardRef} style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'var(--t-h3)', fontWeight:700, color:'#696b6b', marginBottom:'var(--sc-14)', lineHeight:1.35 }}>
                  {slide.cardTitle}
                </div>
                {/* Reserve three lines whatever the slide says. The four descriptions
                    are 145-189 characters, so the card was a different height on each
                    one and the whole left column shifted up or down as the carousel
                    paged. em-based, so it tracks the type rather than pinning a pixel
                    height that only holds at one width. */}
                <p style={{ fontSize:'var(--sc-14-5)', color:'#8090bc', lineHeight:1.78, margin:0, minHeight:'calc(3 * 1.78em)' }}>
                  {slide.cardDesc}
                </p>
              </div>

              <button onClick={next} disabled={!scenesReady} aria-label="Next feature"
                style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 0 0 16px', fontSize:'var(--sc-28)', color:'#9ca3af', lineHeight:1, flexShrink:0, transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#6b7280'}
                onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}>›</button>
            </div>

            {/* Pill indicator: the active slide stretches into a bar, the rest stay
                dots. Width is transitioned alongside the colour so the bar appears to
                travel and reshape between positions rather than the fill snapping
                from one circle to another. */}
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:9, marginTop:20 }}>
              {SLIDES.map((_,i) => {
                const active = i === activeIdx;
                return (
                  <button key={i} onClick={()=>goTo(i)} disabled={!scenesReady}
                    aria-label={`Go to slide ${i+1}`}
                    aria-current={active ? 'true' : undefined}
                    style={{
                      width: active ? 32 : 9,
                      height: 9,
                      // Not '50%': that would re-round the pill into an ellipse as it
                      // widens. A large fixed radius keeps the caps circular.
                      borderRadius: 999,
                      border:'none', cursor:'pointer', padding:0, flexShrink:0,
                      background: active ? '#414e63' : '#d2dcec',
                      transition:'width 0.38s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.38s ease',
                    }}/>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT panel ── */}
        <div className="fs-right" style={{ position:'relative', zIndex:20 }}>
          <div className="fs-scene-wrap" aria-busy={!scenesReady} style={{ overflow:'visible' }}>
            {scenesPrepared && <FeatureScenes sceneRefs={sceneRefs} containerRef={containerRef}
              activeIdx={activeIdx} onReady={onScenesReady}/>}
          </div>
        </div>

      </div>
    </section>
  );
}
