'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const STATS = [
  'Experience up to 40% reduction in vehicle maintenance cost',
  'Improve the behaviour of your drivers by over 60%',
  'See over 40% increase in fleet productivity',
  'Reduce the cost of fuel consumption by around 20%',
  'Get your full return on investment within 12 months',
]

const TABS = [
  {
    key: 'quote',
    label: 'Request a quote',
    headline: 'Request a Quote — It’s Free',
    body: 'Tell us your fleet size and we’ll put together a tailored, no-obligation quote within one business day.',
    stat: { value: '950,104+', sub: 'quotes generated to date' },
    cta: { label: 'Get a free quote', href: '/get-a-quote' },
    img: { src: '/services/gps-tracker/request-for-a-quote.svg', w: 831, h: 665, alt: 'Requesting a free GPS tracker quote online' },
  },
  {
    key: 'demo',
    label: 'Get a free demo',
    headline: 'See LOCATOR running live',
    body: 'Book a walkthrough with our team and watch the platform track a real device in real time.',
    stat: { value: '20 min', sub: 'average demo length' },
    cta: { label: 'Book a free demo', href: '/get-a-free-demo' },
    img: { src: '/services/gps-tracker/get-a-free-demo.svg', w: 802, h: 617, alt: 'Live walkthrough demo of the LOCATOR tracking platform' },
  },
  {
    key: 'install',
    label: 'Get installed',
    headline: 'Professional installation, UAE-wide',
    body: 'Our certified technicians fit and configure every device on-site, so it starts reporting from day one.',
    stat: { value: '48 hrs', sub: 'typical install turnaround' },
    cta: { label: 'Schedule installation', href: '/contact' },
    img: { src: '/services/gps-tracker/get-installed.svg', w: 803, h: 617, alt: 'Certified technician installing a GPS tracker device on-site' },
  },
  {
    key: 'monitor',
    label: 'Start monitoring',
    headline: 'Go live on the LOCATOR dashboard',
    body: 'Once installed, your fleet appears instantly on the platform — live location, alerts, and reports from minute one.',
    stat: { value: '99.9%', sub: 'tracking network uptime' },
    cta: { label: 'View the platform', href: '/software' },
    img: { src: '/services/gps-tracker/start-monitoring.svg', w: 803, h: 617, alt: 'Monitoring a live fleet on the LOCATOR dashboard' },
  },
]

export default function GpsTrackerWhy() {
  const [active, setActive] = useState(0)
  const tab = TABS[active]

  return (
    <>
      <style>{`
        .gtw-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(36px,5vw,72px); align-items: center; max-width: var(--w-1200); margin: 0 auto; }
        @media (max-width: 940px) { .gtw-grid { grid-template-columns: 1fr; } }
        .gtw-stat { display: flex; align-items: flex-start; gap: 12px; }
        .gtw-tick {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
          background: rgba(255,255,255,.16); color: #fff; display: grid; place-items: center;
        }
        .gtw-tab {
          font-family: inherit; cursor: pointer; border: none; text-align: left;
          padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700;
          background: rgba(255,255,255,.06); color: rgba(255,255,255,.68);
          transition: background .2s ${EASE}, color .2s ${EASE};
          white-space: nowrap;
        }
        .gtw-tab:hover { background: rgba(255,255,255,.12); color: #fff; }
        .gtw-tab.on { background: #1360ee; color: #fff; }
        .gtw-panel { animation: gtwIn .35s ${EASE} both; }
        @keyframes gtwIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#0f1117' }}>
        <div className="gtw-grid">
          {/* Copy + stats */}
          <div data-reveal="left">
            <span style={{ fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: 'rgba(255,255,255,.5)', borderRadius: '2px' }} /></span>
              Built For Every Fleet
            </span>
            <h2 style={{ margin: '0 0 16px', fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-.015em', color: '#fff' }}>
              The Complete GPS Tracker for Every Fleet
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 'max(clamp(13.5px,1.25vw,15px), min(1.042vw, 21.75px))', lineHeight: 1.75, color: 'rgba(255,255,255,.62)', maxWidth: '48ch' }}>
              A reliable, trusted tracking device that puts your business on steroids today. With this
              GPS tracker online, you can:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {STATS.map(s => (
                <div key={s} className="gtw-stat">
                  <span className="gtw-tick">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span style={{ fontSize: 'var(--f-14-5)', color: 'rgba(255,255,255,.85)', fontWeight: 600, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs + interactive panel */}
          <div data-reveal="right">
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {TABS.map((t, i) => (
                <button key={t.key} className={`gtw-tab${i === active ? ' on' : ''}`} onClick={() => setActive(i)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div key={tab.key} className="gtw-panel" style={{
              background: 'linear-gradient(155deg, #171a22, #10131a)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: '22px', padding: 'clamp(28px,4vw,40px)',
            }}>
              {/* Illustration sits on a light tile so the artwork stays readable on the dark panel */}
              <div style={{
                position: 'relative', marginBottom: '24px',
                borderRadius: '16px', overflow: 'hidden',
                background: 'linear-gradient(160deg, #ffffff 0%, #f2f6fd 100%)',
                border: '1px solid rgba(255,255,255,.1)',
                padding: 'clamp(14px,2.2vw,22px)',
                display: 'grid', placeItems: 'center',
              }}>
                <Image
                  src={tab.img.src}
                  alt={tab.img.alt}
                  width={tab.img.w}
                  height={tab.img.h}
                  sizes="(max-width: 940px) 88vw, 46vw"
                  unoptimized={tab.img.src.endsWith('.svg')}
                  style={{ width: '100%', maxWidth: '380px', height: 'auto', display: 'block' }}
                />
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: 'max(clamp(17px,1.8vw,21px), min(1.458vw, 30.45px))', fontWeight: 800, color: '#fff', letterSpacing: '-.01em' }}>{tab.headline}</h3>
              <p style={{ margin: '0 0 26px', fontSize: 'var(--f-14)', lineHeight: 1.7, color: 'rgba(255,255,255,.62)', maxWidth: '42ch' }}>{tab.body}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
                <div>
                  <div style={{ fontSize: 'var(--f-26)', fontWeight: 800, color: '#fff', letterSpacing: '-.01em' }}>{tab.stat.value}</div>
                  <div style={{ fontSize: 'var(--f-12)', color: 'rgba(255,255,255,.5)', marginTop: '2px' }}>{tab.stat.sub}</div>
                </div>
                <Link href={tab.cta.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: '#1360ee', color: '#fff', fontSize: 'var(--f-13-5)', fontWeight: 700,
                  padding: '12px 20px', borderRadius: '999px', textDecoration: 'none',
                  transition: `background .2s ${EASE}, transform .2s ${EASE}`,
                }}>
                  {tab.cta.label} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
