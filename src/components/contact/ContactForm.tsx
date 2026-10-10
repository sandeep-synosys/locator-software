'use client'

import { useState } from 'react'

const LOCATOR_MAP_URL =
  'https://www.google.com/maps/place/Locator+GPS+Tracker+for+Car+Dubai/@25.2194077,55.2798261,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f42d64d345f65:0xf2109013bb2bffd7!8m2!3d25.2194077!4d55.2798261!16s%2Fg%2F11h0gttlv?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D'
const LOCATOR_MAP_EMBED_URL =
  'https://maps.google.com/maps?q=25.2194077%2C55.2798261&z=17&output=embed'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// Each field carries its own leading glyph — the icon sits inside the control,
// so the label row stays clean and the form reads as one column of inputs.
const FIELDS = [
  {
    name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name',
    required: true, half: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'email', label: 'Business Email', type: 'email', placeholder: 'Enter your email',
    required: true, half: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5.5" width="18" height="13" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
        <path d="m3.8 7.6 8.2 5.7 8.2-5.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number',
    required: false, half: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21.5 16.9v2.8a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.6 4.7 1.9 1.9 0 0 1 4.5 2.6h2.8a1.9 1.9 0 0 1 1.9 1.6c.12.9.34 1.8.66 2.7a1.9 1.9 0 0 1-.43 2L8.4 9.8a15.2 15.2 0 0 0 5.6 5.6l.9-.86a1.9 1.9 0 0 1 2-.43c.86.32 1.77.54 2.67.66a1.9 1.9 0 0 1 1.6 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'company', label: 'Company Name', type: 'text', placeholder: 'Enter your company name',
    required: false, half: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V6.4a1.4 1.4 0 0 1 1.4-1.4h7.2A1.4 1.4 0 0 1 14 6.4V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 10.5h4.6A1.4 1.4 0 0 1 20 11.9V20M3 20h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 8.6h1.6M10.4 8.6H12M7 12.2h1.6M10.4 12.2H12M7 15.8h1.6M10.4 15.8H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
] as const

const TOPICS = [
  'Sales & pricing',
  'Product demo',
  'Technical support',
  'Regulatory certification (Asateel / Shahin / SecurePath)',
  'Partnership',
  'Something else',
]

// Mirrors the `accept` attribute — kept in one place so the hint text and the
// picker can never drift apart.
const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
const MAX_MB = 10

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (f && f.size > MAX_MB * 1024 * 1024) {
      setFile(null)
      setFileError(`That file is ${(f.size / 1024 / 1024).toFixed(1)}MB — the limit is ${MAX_MB}MB.`)
      e.target.value = ''
      return
    }
    setFileError(null)
    setFile(f)
  }

  // NOTE: no backend endpoint yet — matches QuoteForm, which also shows the
  // success state locally. Wire both to a real API route when one exists.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="ctf" id="contact-form">
      <style href="ct-contactform" precedence="medium">{`
        .ctf { background: #fff; padding: clamp(44px,6vw,80px) 28px clamp(52px,7vw,88px); }
        .ctf-shell {
          max-width: var(--w-1180); margin: 0 auto;
          display: grid; grid-template-columns: 1.08fr .92fr; gap: clamp(18px,2.4vw,30px);
          align-items: stretch;
        }
        @media (max-width: 940px) { .ctf-shell { grid-template-columns: 1fr; } }

        /* ── Left: form card ── */
        .ctf-card {
          background: #fff; border: 1px solid #e7ebf3; border-radius: 22px;
          padding: clamp(22px,3vw,40px); box-shadow: 0 30px 60px -34px rgba(20,40,90,.22);
        }
        .ctf-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: max(clamp(12px,1.05vw,13.5px), min(0.938vw, 19.57px)); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; margin-bottom: 10px; }
        .ctf-eyebrow i { display: block; width: 28px; height: 2.5px; background: #1360ee; border-radius: 2px; }
        .ctf-title { margin: 0 0 8px; font-size: max(clamp(22px,2.4vw,30px), min(2.083vw, 43.5px)); font-weight: 800; letter-spacing: -.028em; line-height: 1.16; color: #1d1d1f; }
        .ctf-sub { margin: 0 0 24px; font-size: var(--f-14-5); line-height: 1.65; color: #6e6e73; }

        .ctf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 520px) { .ctf-grid { grid-template-columns: 1fr; } }
        .ctf-field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
        .ctf-field.full { grid-column: 1 / -1; }
        .ctf-label { font-size: var(--f-12-5); font-weight: 700; color: #3f4453; }
        .ctf-label b { color: #e5484d; }

        /* Control shell — holds the input plus its leading/trailing glyph. */
        .ctf-control { position: relative; display: block; }
        .ctf-control-ic {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; color: #a3abbb; pointer-events: none;
          transition: color .18s ${EASE};
        }
        .ctf-control-ic svg { width: 100%; height: 100%; display: block; }
        .ctf-control:focus-within .ctf-control-ic { color: #1360ee; }

        .ctf-input, .ctf-textarea, .ctf-select {
          font-family: inherit; font-size: var(--f-14); color: #1d1d1f; width: 100%;
          padding: 14px 15px 14px 44px; border-radius: 12px;
          border: 1.5px solid #e4e8f0; background: #fbfcfe;
          transition: border-color .18s ${EASE}, box-shadow .18s ${EASE}, background .18s ${EASE};
        }
        .ctf-textarea { padding-left: 15px; }
        .ctf-input::placeholder, .ctf-textarea::placeholder { color: #aab0bd; }
        .ctf-input:focus, .ctf-textarea:focus, .ctf-select:focus { outline: none; border-color: #1360ee; background: #fff; box-shadow: 0 0 0 4px rgba(19,96,238,.12); }
        .ctf-textarea { resize: vertical; min-height: 132px; }
        .ctf-select {
          appearance: none; -webkit-appearance: none; cursor: pointer; padding: 14px 42px 14px 15px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6e73' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 15px center; background-size: 15px;
        }
        /* Until a real topic is chosen the control shows placeholder-grey. */
        .ctf-select:invalid { color: #aab0bd; }

        /* ── Attachment ── */
        .ctf-drop {
          position: relative;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 18px 16px; border-radius: 12px; cursor: pointer; text-align: center;
          border: 1.5px dashed #d3dbea; background: #fbfcfe; color: #6e6e73;
          transition: border-color .18s ${EASE}, background .18s ${EASE}, color .18s ${EASE};
        }
        .ctf-drop:hover { border-color: #1360ee; background: #f5f8ff; color: #1360ee; }
        .ctf-drop input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
        .ctf-drop svg { flex-shrink: 0; }
        .ctf-drop-main {
          font-size: var(--f-13-5); font-weight: 700; color: inherit;
          min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ctf-drop.has-file { border-style: solid; border-color: #1360ee; background: #f5f8ff; color: #1360ee; }
        .ctf-hint { margin: 8px 0 0; font-size: var(--f-11-5); line-height: 1.5; color: #9aa3b2; text-align: center; }
        .ctf-hint.err { color: #e5484d; font-weight: 600; }

        .ctf-consent { display: flex; gap: 10px; align-items: flex-start; margin-top: 18px; font-size: var(--f-12-5); line-height: 1.6; color: #6e6e73; }
        .ctf-consent input { width: 16px; height: 16px; margin-top: 1px; accent-color: #1360ee; flex-shrink: 0; }

        /* Trust line under the button — quiet, but it belongs to the form. */
        .ctf-secure {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          margin: 14px 0 0; font-size: var(--f-12); line-height: 1.5; color: #9aa3b2;
        }
        .ctf-secure svg { flex-shrink: 0; }

        .ctf-submit {
          margin-top: 20px; width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 24px; border-radius: 12px; border: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-15); font-weight: 700; color: #fff;
          background: #1360ee; box-shadow: 0 12px 26px -10px rgba(19,96,238,.6);
          transition: background .18s ${EASE}, transform .18s ${EASE}, box-shadow .18s ${EASE};
        }
        .ctf-submit:hover { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 16px 32px -10px rgba(19,96,238,.7); }
        .ctf-submit svg { transition: transform .2s ${EASE}; }
        .ctf-submit:hover svg { transform: translateX(4px); }

        .ctf-success { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-height: 420px; }
        .ctf-check { width: 64px; height: 64px; border-radius: 50%; margin-bottom: 22px; background: rgba(19,146,63,.1); color: #13923f; display: grid; place-items: center; animation: ctfPop .5s ${EASE} both; }
        @keyframes ctfPop { 0% { transform: scale(.5); opacity: 0 } 60% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }

        /* ── Right: map, filling the column beside the form ── */
        .ctf-aside { display: flex; flex-direction: column; }

        .ctf-map {
          position: relative; border-radius: 22px; overflow: hidden;
          border: 1px solid #e7ebf3; background: #fff; min-height: 240px; flex: 1;
          box-shadow: 0 24px 50px -34px rgba(20,40,90,.4);
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE};
        }
        .ctf-map:hover { transform: translateY(-3px); box-shadow: 0 30px 60px -32px rgba(19,96,238,.45); }
        .ctf-map iframe { display: block; width: 100%; height: 100%; min-height: 240px; border: 0; }
        .ctf-map-pill {
          position: absolute; left: 14px; bottom: 14px;
          display: inline-flex; align-items: center; gap: 7px;
          background: #1360ee; color: #fff; border-radius: 999px; padding: 8px 15px;
          font-size: var(--f-11-5); font-weight: 700; letter-spacing: .04em; text-decoration: none;
          box-shadow: 0 8px 20px rgba(19,96,238,.4);
          transition: transform .18s ${EASE}, background .18s ${EASE};
        }
        .ctf-map-pill:hover { background: #0d4fd4; transform: translateY(-2px); }
      `}</style>

      <div className="ctf-shell">
        {/* Left — form */}
        <div className="ctf-card" data-reveal="left">
          {sent ? (
            <div className="ctf-success">
              <div className="ctf-check">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="ctf-title">Message received</h2>
              <p className="ctf-sub">
                Thanks for reaching out — a member of our team will get back to you within one working day.
              </p>
              <button className="ctf-submit" style={{ width: 'auto' }} onClick={() => setSent(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <>
              <span className="ctf-eyebrow"><i />Send us a message</span>
              <h2 className="ctf-title">We&rsquo;d love to hear from you</h2>
              <p className="ctf-sub">
                Fill in the details below and our team will get back to you within one business day.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="ctf-grid">
                  {FIELDS.map(f => (
                    <div key={f.name} className={`ctf-field${f.half ? '' : ' full'}`}>
                      <label className="ctf-label" htmlFor={`ctf-${f.name}`}>
                        {f.label}{f.required && <b> *</b>}
                      </label>
                      <span className="ctf-control">
                        <span className="ctf-control-ic">{f.icon}</span>
                        <input
                          id={`ctf-${f.name}`}
                          className="ctf-input"
                          type={f.type}
                          name={f.name}
                          required={f.required}
                          placeholder={f.placeholder}
                        />
                      </span>
                    </div>
                  ))}

                  <div className="ctf-field full">
                    <label className="ctf-label" htmlFor="ctf-topic">Subject<b> *</b></label>
                    <select id="ctf-topic" className="ctf-select" name="topic" required defaultValue="">
                      <option value="" disabled>Select a subject</option>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="ctf-field full">
                    <label className="ctf-label" htmlFor="ctf-message">Your Message<b> *</b></label>
                    <textarea
                      id="ctf-message"
                      className="ctf-textarea"
                      name="message"
                      required
                      placeholder="Write your message here…"
                    />
                  </div>

                  <div className="ctf-field full">
                    <label className={`ctf-drop${file ? ' has-file' : ''}`} htmlFor="ctf-file">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.4 11.05 12.25 20.2a5.5 5.5 0 0 1-7.78-7.78l9.16-9.15a3.67 3.67 0 0 1 5.18 5.18l-9.15 9.16a1.83 1.83 0 0 1-2.6-2.6l8.46-8.44" />
                      </svg>
                      <span className="ctf-drop-main">
                        {file ? file.name : 'Attach File (Optional)'}
                      </span>
                      <input
                        id="ctf-file"
                        type="file"
                        name="attachment"
                        accept={ACCEPT}
                        onChange={pickFile}
                      />
                    </label>
                    <p className={`ctf-hint${fileError ? ' err' : ''}`}>
                      {fileError ?? `PDF, DOC, DOCX, JPG, PNG (max. ${MAX_MB}MB)`}
                    </p>
                  </div>
                </div>

                <label className="ctf-consent" htmlFor="ctf-consent">
                  <input id="ctf-consent" type="checkbox" name="consent" required />
                  <span>I agree that Locator may contact me about this enquiry.</span>
                </label>

                <button type="submit" className="ctf-submit">
                  Send Message
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.4 2.6 10.9 13.1M21.4 2.6 14.7 21.4l-3.8-8.3-8.3-3.8Z" />
                  </svg>
                </button>

                <p className="ctf-secure">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="10.5" width="16" height="10.5" rx="2.2" />
                    <path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1" />
                  </svg>
                  Your information is secure and will never be shared.
                </p>
              </form>
            </>
          )}
        </div>

        {/* Right — map (the details themselves live in the horizontal bar above) */}
        <div className="ctf-aside" data-reveal="right">
          <div className="ctf-map">
            <iframe
              title="Locator GPS Tracker for Car Dubai — Map"
              src={LOCATOR_MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="ctf-map-pill"
              href={LOCATOR_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
