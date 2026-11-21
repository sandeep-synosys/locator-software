'use client'

import { useState } from 'react'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const FAQS = [
  {
    q: 'What is SecurePath Premium?',
    a: 'SecurePath Premium is a mandatory registration specifically designed for selected businesses operating in Dubai. It was introduced by SIRA with the aim of enhancing vehicle security through the implementation of a GPS tracking system.',
  },
  {
    q: 'How can companies register their vehicles with SecurePath Premium?',
    a: 'An approved vendor installs a SIRA-certified GPS tracker and issues a Certificate of Installation, which the business then submits along with its required documents to complete registration.',
  },
  {
    q: 'What are the requirements for registering a vehicle with SecurePath Premium?',
    a: 'You\'ll need a Certificate of Installation from a SIRA-approved vendor, a SIRA-approved GPS device such as the Teltonika FMC150, and the required business documentation — our team can guide you through the exact criteria.',
  },
]

export default function SecurepathPremiumFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const toggle = (i: number) => setOpenIdx(p => (p === i ? -1 : i))

  return (
    <>
      <style>{`
        .sppfq-item {
          background: #fff;
          border: 1px solid #e8e8eb;
          border-left: 2.5px solid transparent;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color .2s ${EASE}, box-shadow .2s ${EASE}, background .2s ${EASE};
        }
        .sppfq-item.on {
          border-color: #cdd9ff;
          border-left-color: #1360ee;
          background: #fafbff;
          box-shadow: 0 2px 20px rgba(19,96,238,.08);
        }
        .sppfq-trig {
          width: 100%; background: none; border: none;
          display: flex; align-items: flex-start; gap: 14px;
          padding: 17px 18px;
          cursor: pointer; font-family: inherit; text-align: left;
        }
        .sppfq-num {
          font-size: var(--f-10); font-weight: 700;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          color: #c4c4d0; padding-top: 3px; flex-shrink: 0;
          width: 18px; letter-spacing: .02em;
          transition: color .18s ${EASE};
        }
        .sppfq-item.on .sppfq-num { color: #1360ee; }
        .sppfq-qtext {
          flex: 1; font-size: var(--f-14-5); font-weight: 700;
          line-height: 1.45; letter-spacing: -.01em; color: #1d1d1f;
          transition: color .18s ${EASE};
        }
        .sppfq-item.on .sppfq-qtext { color: #1360ee; }
        .sppfq-icon {
          width: 26px; height: 26px; border-radius: 50%;
          display: grid; place-items: center; flex-shrink: 0;
          background: #f2f2f5; color: #a0a0b0;
          margin-top: 1px;
          transition: background .22s ${EASE}, color .22s ${EASE},
                      transform .48s cubic-bezier(.34,1.3,.64,1);
        }
        .sppfq-item.on .sppfq-icon {
          background: #dde7ff; color: #1360ee; transform: rotate(180deg);
        }
        .sppfq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .44s ${EASE};
        }
        .sppfq-item.on .sppfq-body { grid-template-rows: 1fr; }
        .sppfq-inner { overflow: hidden; min-height: 0; }
        .sppfq-ans {
          margin: 0;
          padding: 0 18px 20px 50px;
          font-size: var(--f-13-5); line-height: 1.72; color: #6e6e73;
          opacity: 0;
          transform: translateY(-7px);
          transition: opacity .22s 0s, transform .28s 0s ${EASE};
        }
        .sppfq-item.on .sppfq-ans {
          opacity: 1; transform: translateY(0);
          transition: opacity .32s .1s, transform .38s .08s ${EASE};
        }
      `}</style>

      <section id="faq" style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        {/* FAQPage structured data for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div style={{ maxWidth: 'var(--w-1080)', margin: '0 auto' }}>

          <div data-reveal style={{ marginBottom: '32px' }}>
            <h2 style={{ margin: 0, fontSize: 'max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px))', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-.02em', color: '#1d1d1f' }}>
              SecurePath Premium FAQs
            </h2>
          </div>

          <div data-reveal data-reveal-delay="80" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {FAQS.map((item, i) => (
              <div key={item.q} className={`sppfq-item${openIdx === i ? ' on' : ''}`}>
                <button className="sppfq-trig" onClick={() => toggle(i)}>
                  <span className="sppfq-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sppfq-qtext">{item.q}</span>
                  <span className="sppfq-icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 3.5 5.5 7.5l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className="sppfq-body">
                  <div className="sppfq-inner">
                    <p className="sppfq-ans">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
