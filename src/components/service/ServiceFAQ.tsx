'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const CATS = [
  { id: 'all',          label: 'All questions' },
  { id: 'installation', label: 'Installation' },
  { id: 'platform',     label: 'Platform & App' },
  { id: 'support',      label: 'Support & Plans' },
  { id: 'coverage',     label: 'Coverage' },
]

const ALL_FAQS = [
  {
    cat: 'installation',
    q: 'How long does GPS device installation take?',
    a: 'A standard installation takes 30–60 minutes per vehicle. Our certified team can complete a fleet of 10 vehicles in a single working day, with minimal disruption to your operations.',
  },
  {
    cat: 'installation',
    q: 'What vehicles and assets can you install GPS on?',
    a: 'We track any motorized vehicle or asset — cars, vans, trucks, buses, motorcycles, forklifts, generators, bulldozers, cranes, boats, yachts, and heavy machinery. If it moves or has an engine, we can track it.',
  },
  {
    cat: 'installation',
    q: 'Do I need to visit your office or do you come to us?',
    a: 'We come to you. Our team visits your site, installs the devices on your fleet, and configures the platform on-location. There is no need to bring vehicles to us.',
  },
  {
    cat: 'platform',
    q: 'How quickly can I see my fleet live after installation?',
    a: 'Your fleet goes live immediately after device installation and software setup. Most clients are tracking in real time within 48 hours of their first contact with us.',
  },
  {
    cat: 'platform',
    q: 'Does the platform have a mobile app for drivers?',
    a: 'Yes. Field staff use the mobile app to receive tasks, update delivery status, upload expense receipts, complete vehicle inspections, and view their own route history in real time.',
  },
  {
    cat: 'platform',
    q: 'Can I configure my own alert zones and thresholds?',
    a: 'Yes. You can draw custom geofence zones, set speed thresholds, define working hours for after-hours alerts, schedule service reminders, and adjust idle-time limits — all from the web dashboard.',
  },
  {
    cat: 'support',
    q: 'Is there a long-term contract?',
    a: 'No long-term lock-in. We offer flexible monthly plans and annual subscriptions. You can scale up or down as your fleet grows, with no cancellation penalties.',
  },
  {
    cat: 'support',
    q: 'What ongoing support do you provide?',
    a: 'We provide dedicated support via phone, email, and WhatsApp. Our UAE-based support team is available during business hours, with emergency coverage for critical alerts and device failures.',
  },
  {
    cat: 'support',
    q: 'Do you provide training after installation?',
    a: 'Yes. We provide on-site training for admin users and drivers, covering the web platform, mobile app, alert configuration, and report generation. Refresher training is available at any time.',
  },
  {
    cat: 'coverage',
    q: 'Can you track vehicles across all UAE emirates?',
    a: 'Yes. Our GPS network provides full coverage across all UAE emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Cross-border tracking is also available.',
  },
  {
    cat: 'coverage',
    q: 'What happens if a GPS device is damaged or tampered with?',
    a: 'You receive an immediate offline alert on the dashboard. Our team dispatches a replacement device and reinstalls it, typically within 24 hours. All devices are tamper-resistant with built-in backup power.',
  },
]

// `title` lets a page use its own SEO heading; `schema` adds FAQPage JSON-LD.
// Both default off so the other pages that share this section are unchanged
// (the /faq page already outputs its own FAQPage markup).
export default function ServiceFAQ({
  title = 'Frequently asked questions',
  schema = false,
}: { title?: string; schema?: boolean } = {}) {
  const [activeCat, setActiveCat] = useState('all')
  const [openIdx,   setOpenIdx]   = useState<number>(0)

  const filtered = useMemo(
    () => (activeCat === 'all' ? ALL_FAQS : ALL_FAQS.filter(f => f.cat === activeCat)),
    [activeCat],
  )

  const handleCat = (id: string) => { setActiveCat(id); setOpenIdx(0) }
  const toggle    = (i: number)  => setOpenIdx(p => p === i ? -1 : i)

  return (
    <>
      <style>{`
        @keyframes sfqSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }

        .sfq-cat {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 10px 13px; border-radius: 9px;
          border: none; background: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-13); font-weight: 600;
          color: #52525e; text-align: left;
          transition: background .15s ${EASE}, color .15s ${EASE};
        }
        .sfq-cat:hover:not(.on) { background: #f5f5f7; color: #1d1d1f; }
        .sfq-cat.on { background: #eef3ff; color: #1360ee; font-weight: 700; }

        .sfq-badge {
          font-size: var(--f-10); font-weight: 700; padding: 2px 7px;
          border-radius: 999px; background: rgba(0,0,0,.06); color: #8888a0;
          transition: background .15s, color .15s;
          font-variant-numeric: tabular-nums;
        }
        .sfq-cat.on .sfq-badge { background: rgba(19,96,238,.13); color: #1360ee; }

        .sfq-item {
          background: #fff;
          border: 1px solid #e8e8eb;
          border-left: 2.5px solid transparent;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background .2s ${EASE};
        }
        .sfq-item.on {
          border-color: #cdd9ff;
          border-left-color: #1360ee;
          background: #fafbff;
          box-shadow: 0 2px 20px rgba(19,96,238,.08);
        }

        .sfq-trig {
          width: 100%; background: none; border: none;
          display: flex; align-items: flex-start; gap: 14px;
          padding: 17px 18px;
          cursor: pointer; font-family: inherit; text-align: left;
        }

        .sfq-num {
          font-size: var(--f-10); font-weight: 700;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          color: #c4c4d0; padding-top: 3px; flex-shrink: 0;
          width: 18px; letter-spacing: .02em;
          transition: color .18s ${EASE};
        }
        .sfq-item.on .sfq-num { color: #1360ee; }

        .sfq-qtext {
          flex: 1; font-size: var(--f-14-5); font-weight: 700;
          line-height: 1.45; letter-spacing: -.01em; color: #1d1d1f;
          transition: color .18s ${EASE};
        }
        .sfq-item.on .sfq-qtext { color: #1360ee; }

        .sfq-icon {
          width: 26px; height: 26px; border-radius: 50%;
          display: grid; place-items: center; flex-shrink: 0;
          background: #f2f2f5; color: #a0a0b0; margin-top: 1px;
          transition: background .22s ${EASE}, color .22s ${EASE},
                      transform .48s cubic-bezier(.34,1.3,.64,1);
        }
        .sfq-item.on .sfq-icon { background: #dde7ff; color: #1360ee; transform: rotate(180deg); }

        .sfq-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .44s ${EASE}; }
        .sfq-item.on .sfq-body { grid-template-rows: 1fr; }
        .sfq-inner { overflow: hidden; min-height: 0; }

        .sfq-ans {
          margin: 0; padding: 0 18px 20px 50px;
          font-size: var(--f-13-5); line-height: 1.72; color: #6e6e73;
          opacity: 0; transform: translateY(-7px);
          transition: opacity .22s 0s, transform .28s 0s ${EASE};
        }
        .sfq-item.on .sfq-ans {
          opacity: 1; transform: translateY(0);
          transition: opacity .32s .1s, transform .38s .08s ${EASE};
        }

        .sfq-list { animation: sfqSlideIn .26s ${EASE} both; }

        @media (max-width: 860px) {
          .sfq-grid  { grid-template-columns: 1fr !important; }
          .sfq-sidebar { flex-direction: row !important; flex-wrap: wrap !important; gap: 6px !important; padding: 0 !important; border: none !important; }
          .sfq-cat  { width: auto !important; padding: 7px 13px !important; border: 1px solid #e8e8eb !important; }
          .sfq-badge { display: none; }
          .sfq-sidebar-label { display: none !important; }
        }
      `}</style>

      <section id="faq" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff', borderTop: '1px solid #f0f0f3' }}>
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: ALL_FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }}
          />
        )}
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto' }}>

          {/* Header */}
          <div data-reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontSize: 'max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px))', fontWeight: 800, letterSpacing: '.04em',
              color: '#1360ee', textTransform: 'uppercase' as const,
              display: 'block', marginBottom: '16px',
            }}>
              <span style={{ display: 'block', marginBottom: '12px' }}><span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} /></span>
              FAQ
            </span>
            <h2 style={{
              margin: 0,
              fontSize: 'max(clamp(19px,2.2vw,26px), min(1.806vw, 37.7px))',
              fontWeight: 800, lineHeight: 1.06,
              letterSpacing: '-.015em', color: '#1d1d1f',
            }}>
              {title}
            </h2>
          </div>

          {/* Main grid */}
          <div
            className="sfq-grid"
            data-reveal
            data-reveal-delay="80"
            style={{ display: 'grid', gridTemplateColumns: '196px 1fr', gap: '28px', alignItems: 'start' }}
          >
            {/* Sidebar */}
            <div
              className="sfq-sidebar"
              style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px', background: '#f9f9fb', borderRadius: '14px', border: '1px solid #e8e8eb' }}
            >
              <p
                className="sfq-sidebar-label"
                style={{ margin: '6px 4px 8px', fontSize: 'var(--f-10)', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#b0b0be' }}
              >
                Browse by topic
              </p>
              {CATS.map(cat => {
                const count = cat.id === 'all' ? ALL_FAQS.length : ALL_FAQS.filter(f => f.cat === cat.id).length
                return (
                  <button
                    key={cat.id}
                    className={`sfq-cat${activeCat === cat.id ? ' on' : ''}`}
                    onClick={() => handleCat(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="sfq-badge">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* FAQ list */}
            <div className="sfq-list" key={activeCat}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {filtered.map((item, i) => (
                  <div key={`${activeCat}-${i}`} className={`sfq-item${openIdx === i ? ' on' : ''}`}>
                    <button className="sfq-trig" onClick={() => toggle(i)}>
                      <span className="sfq-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="sfq-qtext">{item.q}</span>
                      <span className="sfq-icon" aria-hidden="true">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M1.5 3.5 5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    <div className="sfq-body">
                      <div className="sfq-inner">
                        <p className="sfq-ans">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ margin: '24px 0 0', fontSize: 'var(--f-13)', color: '#a1a1a6', lineHeight: 1.55 }}>
                Can&apos;t find what you&apos;re looking for?{' '}
                <Link href="/contact" style={{ color: '#1360ee', fontWeight: 700, textDecoration: 'none' }}>
                  Contact our team
                </Link>
                {' '}— we&apos;re happy to help.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
