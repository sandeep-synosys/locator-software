'use client'

import { useState } from 'react'
import Link from 'next/link'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const FAQS = [
  {
    q: 'What does LOCATOR do?',
    a: 'LOCATOR is a technology company building intelligent fleet telematics and IoT solutions — GPS vehicle tracking, fleet management, AI dashcams, fuel monitoring, asset tracking, and IoT connectivity — all on one connected platform that turns real-time data into actionable business intelligence.',
  },
  {
    q: 'Which industries does LOCATOR serve?',
    a: 'We support organizations across logistics and distribution, transportation, construction, government, school transportation, healthcare, oil & gas, facility management, equipment rental, and commercial fleets.',
  },
  {
    q: 'What technologies power the LOCATOR platform?',
    a: 'Our platform combines AI-powered analytics, IoT connectivity, intelligent GPS hardware, cloud computing, and real-time operational intelligence into a single integrated ecosystem.',
  },
  {
    q: 'How does LOCATOR help reduce operational costs?',
    a: 'By improving fleet utilization, monitoring fuel consumption, automating maintenance and workflows, and reducing downtime, LOCATOR helps businesses cut costs while improving efficiency and accountability.',
  },
  {
    q: 'Is LOCATOR suitable for large enterprise fleets?',
    a: 'Yes. LOCATOR offers scalable, enterprise-grade solutions with enterprise security, real-time visibility, and local implementation and technical support — built to grow with your operations.',
  },
  {
    q: 'Where is LOCATOR based and who is behind it?',
    a: 'LOCATOR serves businesses across the United Arab Emirates and is part of Synosys, continually evolving by embracing AI, IoT, cloud computing, and predictive analytics for future-ready mobility.',
  },
  {
    q: 'How do I get started with LOCATOR?',
    a: 'Get in touch with our team for a consultation. We assess your fleet, recommend the right solution, handle installation and configuration, and support you every step of the way.',
  },
]

export default function WhoWeAreFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const toggle = (i: number) => setOpenIdx(p => (p === i ? -1 : i))

  return (
    <>
      <style>{`
        .wwf-item {
          background: #fff; border: 1px solid #e8e8eb; border-left: 2.5px solid transparent;
          border-radius: 12px; overflow: hidden;
          transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background .2s ${EASE};
        }
        .wwf-item.on { border-color: #cdd9ff; border-left-color: #1360ee; background: #fafbff; box-shadow: 0 2px 20px rgba(19,96,238,.08); }
        .wwf-q { margin: 0; font: inherit; letter-spacing: inherit; }
        .wwf-trig { width: 100%; background: none; border: none; display: flex; align-items: flex-start; gap: 14px; padding: 17px 18px; cursor: pointer; font-family: inherit; text-align: left; }
        .wwf-num { font-size: var(--f-10); font-weight: 700; font-family: ui-monospace, 'Cascadia Code', monospace; color: #c4c4d0; padding-top: 3px; flex-shrink: 0; width: 18px; letter-spacing: .02em; transition: color .18s ${EASE}; }
        .wwf-item.on .wwf-num { color: #1360ee; }
        .wwf-qtext { flex: 1; font-size: var(--f-14-5); font-weight: 700; line-height: 1.45; letter-spacing: -.01em; color: #1d1d1f; transition: color .18s ${EASE}; }
        .wwf-item.on .wwf-qtext { color: #1360ee; }
        .wwf-icon { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; background: #f2f2f5; color: #a0a0b0; margin-top: 1px; transition: background .22s ${EASE}, color .22s ${EASE}, transform .48s cubic-bezier(.34,1.3,.64,1); }
        .wwf-item.on .wwf-icon { background: #dde7ff; color: #1360ee; transform: rotate(180deg); }
        .wwf-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .44s ${EASE}; }
        .wwf-item.on .wwf-body { grid-template-rows: 1fr; }
        .wwf-inner { overflow: hidden; min-height: 0; }
        .wwf-ans { margin: 0; padding: 0 18px 20px 50px; font-size: var(--f-13-5); line-height: 1.72; color: #6e6e73; opacity: 0; transform: translateY(-7px); transition: opacity .22s 0s, transform .28s 0s ${EASE}; }
        .wwf-item.on .wwf-ans { opacity: 1; transform: translateY(0); transition: opacity .32s .1s, transform .38s .08s ${EASE}; }
      `}</style>

      <section id="faq" style={{ padding: 'clamp(56px,7vw,92px) 28px', background: '#fff' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            }),
          }}
        />
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'block', fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em', color: '#1360ee', textTransform: 'uppercase', marginBottom: '16px' }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              FAQ
            </span>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.015em', color: '#1d1d1f' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div data-reveal data-reveal-delay="80" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {FAQS.map((item, i) => (
              <div key={item.q} className={`wwf-item${openIdx === i ? ' on' : ''}`}>
                <h3 className="wwf-q">
                <button className="wwf-trig" onClick={() => toggle(i)} aria-expanded={openIdx === i}>
                  <span className="wwf-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="wwf-qtext">{item.q}</span>
                  <span className="wwf-icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 3.5 5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                </h3>
                <div className="wwf-body">
                  <div className="wwf-inner">
                    <p className="wwf-ans">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p data-reveal style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 'var(--f-13)', color: '#a1a1a6', lineHeight: 1.55 }}>
            Still have questions?{' '}
            <Link href="/contact" style={{ color: '#1360ee', fontWeight: 700, textDecoration: 'none' }}>Contact our team</Link>
            {' '}— we&apos;re happy to help.
          </p>
        </div>
      </section>
    </>
  )
}
