'use client'

import PrivacyNotice from '@/components/common/PrivacyNotice'
import TurnstileField from '@/components/common/TurnstileField'
import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Job } from './jobs-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

const COUNTRY_CODES = [
  { code: '+971', label: 'UAE' },
  { code: '+966', label: 'KSA' },
  { code: '+965', label: 'Kuwait' },
  { code: '+974', label: 'Qatar' },
  { code: '+968', label: 'Oman' },
  { code: '+973', label: 'Bahrain' },
  { code: '+91', label: 'India' },
]

type Experience = { id: number; value: string }

export default function JobDetail({ job }: { job: Job }) {
  const [turnstileToken, setTurnstileToken] = useState('')
  const [verificationAttempt, setVerificationAttempt] = useState(0)
  const [tab, setTab] = useState<'overview' | 'application'>('overview')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [screeningAnswer, setScreeningAnswer] = useState<'yes' | 'no' | null>(null)
  const nextExpId = useRef(0)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    if (!turnstileToken) {
      setSubmitError('Please complete the security check before submitting.')
      return
    }
    const formData = new FormData(e.currentTarget)
    formData.set('jobSlug', job.slug)
    const resume = formData.get('resume')
    if (!(resume instanceof File) || !resume.size || resume.size > 5 * 1024 * 1024) {
      setSubmitError('Please choose a non-empty resume no larger than 5 MB.')
      return
    }
    setSending(true)
    setSubmitError(null)
    try {
      const response = await fetch('/api/career-application', { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        setSubmitError(result.error || 'Unable to send your application. Please try again.')
        return
      }
      setSent(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError('Unable to send your application. Please try again.')
    } finally {
      setTurnstileToken('')
      setVerificationAttempt(value => value + 1)
      setSending(false)
    }
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try { await navigator.share({ title: job.title, url }) } catch { /* user cancelled */ }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const addExperience = () => {
    nextExpId.current += 1
    setExperiences((list) => [...list, { id: nextExpId.current, value: '' }])
  }
  const removeExperience = (id: number) => setExperiences((list) => list.filter((e) => e.id !== id))

  return (
    <section className="jd-section">
      <style>{`
        .jd-section { padding: clamp(28px,4vw,44px) 28px clamp(64px,7vw,96px); background: #fff; }
        .jd-inner { max-width: 760px; margin: 0 auto; }

        .jd-back { display: inline-flex; align-items: center; gap: 7px; font-size: var(--f-13); font-weight: 600; color: #6e6e73; text-decoration: none; margin-bottom: clamp(24px,3vw,36px); transition: color .18s ease, gap .18s ease; }
        .jd-back:hover { color: #1360ee; gap: 10px; }

        .jd-head { text-align: center; padding-bottom: clamp(24px,3vw,32px); border-bottom: 1px solid #eef1f7; }
        .jd-logo { position: relative; width: 230px; height: 62px; margin: 0 auto 22px; }
        .jd-title { margin: 0 0 12px; font-size: max(clamp(22px,2.8vw,30px), min(2.083vw, 43.5px)); font-weight: 800; letter-spacing: -.02em; color: #1d1d1f; }
        .jd-meta { margin: 0 0 6px; font-size: var(--f-13-5); font-weight: 700; color: #52525e; }
        .jd-meta span { color: #c3cbd9; margin: 0 8px; }
        .jd-loc { margin: 0; font-size: var(--f-13-5); color: #8b93a3; }

        .jd-tabs { display: flex; justify-content: center; gap: clamp(24px,3vw,36px); margin-top: clamp(24px,3vw,32px); }
        .jd-tab {
          padding: 10px 2px 14px; background: none; border: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-13); font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
          color: #9aa2b1; border-bottom: 2px solid transparent; transition: color .2s ${EASE}, border-color .2s ${EASE};
        }
        .jd-tab[aria-selected="true"] { color: #1360ee; border-color: #1360ee; }
        .jd-tab:hover { color: #1360ee; }

        .jd-body { padding-top: clamp(28px,3.5vw,40px); }

        /* ── Overview ── */
        .jd-ov-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
        .jd-ov-h3 { margin: 0; font-size: max(clamp(17px,1.8vw,20px), min(1.389vw, 29px)); font-weight: 800; color: #1d1d1f; }
        .jd-share {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px;
          font-family: inherit; font-size: var(--f-12-5); font-weight: 700; color: #1360ee;
          background: none; border: 1px solid #dbe4fb; border-radius: 999px; padding: 7px 14px; cursor: pointer;
          transition: background .18s ${EASE}, border-color .18s ${EASE};
        }
        .jd-share:hover { background: #eef3ff; border-color: #1360ee; }

        .jd-intro { margin: 0 0 clamp(28px,3.4vw,36px); font-size: var(--f-15); line-height: 1.8; color: #3a3a44; }

        .jd-list-h { margin: 0 0 14px; font-size: var(--f-15); font-weight: 800; color: #1d1d1f; }
        .jd-list { list-style: none; margin: 0 0 clamp(28px,3.4vw,36px); padding: 0; }
        .jd-list li { position: relative; padding-left: 22px; margin-bottom: 12px; font-size: var(--f-14-5); line-height: 1.65; color: #3a3a44; }
        .jd-list li::before { content: ''; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: #1360ee; }

        .jd-apply-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 28px; border-radius: 12px; border: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-14-5); font-weight: 700; color: #fff;
          background: #1360ee; box-shadow: 0 12px 26px -10px rgba(19,96,238,.55);
          transition: .18s ${EASE};
        }
        .jd-apply-cta:hover { background: #0d4fd4; transform: translateY(-1px); }

        /* ── Application form ── */
        .jd-autofill {
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
          padding: clamp(16px,2vw,20px); border-radius: 14px; border: 1.5px solid #1d1d1f;
          margin-bottom: clamp(28px,3.4vw,36px);
        }
        .jd-autofill-h { margin: 0 0 4px; font-size: var(--f-12-5); font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #1d1d1f; }
        .jd-autofill-p { margin: 0; font-size: var(--f-12-5); line-height: 1.5; color: #8b93a3; max-width: 40ch; }
        .jd-autofill-btn {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px;
          font-family: inherit; font-size: var(--f-13); font-weight: 700; color: #fff;
          background: #0a0f1e; border: none; border-radius: 10px; padding: 12px 18px; cursor: pointer;
          transition: background .18s ${EASE};
        }
        .jd-autofill-btn:hover { background: #1360ee; }

        .jd-section-row { display: flex; align-items: center; justify-content: space-between; margin: 28px 0 16px; }
        .jd-section-row:first-of-type { margin-top: 0; }
        .jd-section-h { margin: 0; font-size: var(--f-15); font-weight: 800; color: #1d1d1f; }
        .jd-section-clear {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: inherit; font-size: var(--f-12); font-weight: 700; color: #9aa2b1;
          background: none; border: none; cursor: pointer; transition: color .18s ${EASE};
        }
        .jd-section-clear:hover { color: #e5484d; }
        .jd-section-add {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: inherit; font-size: var(--f-12-5); font-weight: 700; color: #1360ee;
          background: #fff; border: 1.5px solid #1360ee; border-radius: 999px; padding: 7px 14px; cursor: pointer;
          transition: background .18s ${EASE};
        }
        .jd-section-add:hover { background: #eef3ff; }

        .jd-optional { font-weight: 500; color: #9aa2b1; }

        .jd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 520px) { .jd-form-grid { grid-template-columns: 1fr; } }
        .jd-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .jd-field.full { grid-column: 1 / -1; }
        .jd-label { font-size: var(--f-12); font-weight: 700; color: #52525e; }
        .jd-label b { color: #e5484d; }
        .jd-hint { margin: 0; font-size: var(--f-11-5); line-height: 1.5; color: #9aa2b1; }
        .jd-input, .jd-textarea {
          font-family: inherit; font-size: var(--f-14); color: #1d1d1f; width: 100%;
          padding: 13px 15px; border-radius: 11px;
          border: 1.5px solid #e4e8f0; background: #fbfcfe;
          transition: border-color .18s ${EASE}, box-shadow .18s ${EASE}, background .18s ${EASE};
        }
        .jd-input::placeholder, .jd-textarea::placeholder { color: #aab0bd; }
        .jd-input:focus, .jd-textarea:focus { outline: none; border-color: #1360ee; background: #fff; box-shadow: 0 0 0 4px rgba(19,96,238,.12); }
        .jd-textarea { resize: vertical; min-height: 100px; }

        .jd-phone-row { display: flex; gap: 8px; }
        .jd-phone-code {
          flex-shrink: 0; width: 92px; font-family: inherit; font-size: var(--f-14); color: #1d1d1f;
          padding: 13px 10px; border-radius: 11px; border: 1.5px solid #e4e8f0; background: #fbfcfe;
          cursor: pointer; transition: border-color .18s ${EASE};
        }
        .jd-phone-code:focus { outline: none; border-color: #1360ee; }
        .jd-phone-row .jd-input { flex: 1; }

        .jd-exp-row { display: flex; gap: 8px; margin-bottom: 10px; }
        .jd-exp-row .jd-input { flex: 1; }
        .jd-exp-remove {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 11px;
          border: 1.5px solid #e4e8f0; background: #fff; color: #9aa2b1; cursor: pointer;
          display: grid; place-items: center; transition: border-color .18s ${EASE}, color .18s ${EASE};
        }
        .jd-exp-remove:hover { border-color: #e5484d; color: #e5484d; }

        .jd-dropzone {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          padding: 28px 16px; border-radius: 12px; border: 1.5px dashed #d4dae6; background: #fbfcfe;
          cursor: pointer; text-align: center; transition: border-color .18s ${EASE}, background .18s ${EASE};
        }
        .jd-dropzone:hover { border-color: #1360ee; background: #f4f8ff; }
        .jd-dropzone svg { color: #1360ee; }
        .jd-dropzone span { font-size: var(--f-13); color: #6e6e73; }
        .jd-dropzone b { color: #1360ee; }
        .jd-dropzone input { display: none; }

        /* Real radios under the hood (so "required" is genuinely enforced by
           the browser), visually presented as a pill toggle. */
        .jd-yn-row { display: flex; gap: 10px; }
        .jd-yn-row input { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .jd-yn-btn {
          display: inline-block; padding: 11px 26px; border-radius: 10px; border: 1.5px solid #e4e8f0; background: #fff;
          font-size: var(--f-13-5); font-weight: 700; color: #52525e; cursor: pointer;
          transition: .18s ${EASE};
        }
        .jd-yn-btn:hover { border-color: #1360ee; color: #1360ee; }
        .jd-yn-row input:checked + .jd-yn-btn { background: #1360ee; border-color: #1360ee; color: #fff; }
        .jd-yn-row input:focus-visible + .jd-yn-btn { outline: 2px solid #1360ee; outline-offset: 2px; }

        .jd-submit {
          margin-top: 8px; width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 24px; border-radius: 12px; border: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-15); font-weight: 700; color: #fff;
          background: #1360ee; box-shadow: 0 12px 26px -10px rgba(19,96,238,.6);
          transition: .18s ${EASE};
        }
        .jd-submit:disabled { opacity: .65; cursor: wait; transform: none; }
        .jd-submit:hover:not(:disabled) { background: #0d4fd4; transform: translateY(-1px); }

        .jd-success { text-align: center; padding: clamp(40px,6vw,64px) 8px; }
        .jd-check { width: 64px; height: 64px; margin: 0 auto 22px; border-radius: 50%; background: rgba(19,146,63,.1); color: #13923f; display: grid; place-items: center; }
        .jd-success h2 { margin: 0 0 8px; font-size: max(clamp(20px,2.4vw,26px), min(1.806vw, 37.7px)); font-weight: 800; color: #1d1d1f; }
        .jd-success p { margin: 0 auto 24px; max-width: 44ch; font-size: var(--f-14-5); line-height: 1.65; color: #6e6e73; }
      `}</style>

      <div className="jd-inner">
        <Link href="/about/career" className="jd-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          All positions
        </Link>

        <div className="jd-head">
          <div className="jd-logo"><Image src="/brand/logo-wordmark.png" alt="LOCATOR" fill sizes="230px" style={{ objectFit: 'contain' }} priority /></div>
          <h1 className="jd-title">{job.title}</h1>
          <p className="jd-meta">{job.type}<span>&middot;</span>{job.department}</p>
          <p className="jd-loc">{job.location}</p>

          <div className="jd-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'overview'} className="jd-tab" onClick={() => setTab('overview')}>Overview</button>
            <button role="tab" aria-selected={tab === 'application'} className="jd-tab" onClick={() => setTab('application')}>Application</button>
          </div>
        </div>

        <div className="jd-body">
          {tab === 'overview' ? (
            <div>
              <div className="jd-ov-head">
                <h2 className="jd-ov-h3">Description</h2>
                <button className="jd-share" onClick={handleShare}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <path d="M8.6 10.5l6.8-3.9M8.6 13.5l6.8 3.9" />
                  </svg>
                  {copied ? 'Link copied' : 'Share this job'}
                </button>
              </div>

              <p className="jd-intro">{job.intro}</p>

              <h3 className="jd-list-h">Key Responsibilities</h3>
              <ul className="jd-list">
                {job.responsibilities.map((r) => <li key={r}>{r}</li>)}
              </ul>

              <h3 className="jd-list-h">Requirements</h3>
              <ul className="jd-list">
                {job.requirements.map((r) => <li key={r}>{r}</li>)}
              </ul>

              <button className="jd-apply-cta" onClick={() => setTab('application')}>
                Apply for this role
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          ) : sent ? (
            <div className="jd-success">
              <div className="jd-check">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h2>Application received</h2>
              <p>Thanks for applying to {job.title} — our recruitment team will review your application and get back to you.</p>
              <button className="jd-apply-cta" onClick={() => setTab('overview')}>Back to job details</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-busy={sending}>
              {/* Autofill banner — shares the same hidden input as Resume below,
                  so picking a file here really does fill that field too. */}
              <div className="jd-autofill">
                <div>
                  <p className="jd-autofill-h">Upload your resume</p>
                  <p className="jd-autofill-p">Attach your resume — PDF, DOC, DOCX, ODT, or RTF, up to 5 MB.</p>
                </div>
                <button type="button" className="jd-autofill-btn" onClick={() => resumeInputRef.current?.click()}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15V3M7 8l5-5 5 5" /><path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
                  </svg>
                  Import resume
                </button>
              </div>

              <div className="jd-section-row">
                <h3 className="jd-section-h">Personal information</h3>
              </div>
              <div className="jd-form-grid">
                <div className="jd-field">
                  <label className="jd-label" htmlFor="jd-first">First name<b> *</b></label>
                  <input id="jd-first" name="firstName" className="jd-input" type="text" required placeholder="First name" />
                </div>
                <div className="jd-field">
                  <label className="jd-label" htmlFor="jd-last">Last name<b> *</b></label>
                  <input id="jd-last" name="lastName" className="jd-input" type="text" required placeholder="Last name" />
                </div>
                <div className="jd-field full">
                  <label className="jd-label" htmlFor="jd-email">Email<b> *</b></label>
                  <input id="jd-email" name="email" className="jd-input" type="email" required placeholder="you@email.com" />
                </div>
                <div className="jd-field full">
                  <label className="jd-label" htmlFor="jd-phone">Phone<b> *</b></label>
                  <div className="jd-phone-row">
                    <select name="countryCode" className="jd-phone-code" defaultValue="+971" aria-label="Country code">
                      {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <input id="jd-phone" name="phone" className="jd-input" type="tel" required placeholder="5xx xxx xxx" />
                  </div>
                </div>
                <div className="jd-field full">
                  <label className="jd-label" htmlFor="jd-address">Address <span className="jd-optional">(Optional)</span></label>
                  <input id="jd-address" name="address" className="jd-input" type="text" placeholder="City, region, country" />
                  <p className="jd-hint">Include your city, region, and country, so we can manage your application easily.</p>
                </div>
              </div>

              <div className="jd-section-row">
                <h3 className="jd-section-h">Profile</h3>
              </div>

              <div className="jd-field full">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <label className="jd-label" style={{ margin: 0 }}>Experience <span className="jd-optional">(Optional)</span></label>
                  <button type="button" className="jd-section-add" onClick={addExperience}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    Add
                  </button>
                </div>
                {experiences.map((exp) => (
                  <div key={exp.id} className="jd-exp-row">
                    <input className="jd-input" type="text" name="experience" placeholder="e.g. XYZ Company — Sales Executive (2 yrs)" />
                    <button type="button" className="jd-exp-remove" onClick={() => removeExperience(exp.id)} aria-label="Remove experience">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="jd-field full">
                <label className="jd-label">Resume<b> *</b></label>
                <label className="jd-dropzone" htmlFor="jd-resume">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15V3M7 8l5-5 5 5" /><path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
                  </svg>
                  <span>{fileName ? <b>{fileName}</b> : <><b>Choose a file</b> or drag and drop here</>}</span>
                  <input ref={resumeInputRef} id="jd-resume" name="resume" type="file" required accept=".pdf,.doc,.docx,.odt,.rtf" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
                </label>
              </div>

              <div className="jd-section-row">
                <h3 className="jd-section-h">Details</h3>
              </div>

              <div className="jd-field full">
                <label className="jd-label" htmlFor="jd-cover">Cover letter</label>
                <textarea id="jd-cover" name="coverLetter" className="jd-textarea" placeholder="Tell us why you're a good fit for this role" />
              </div>

              <div className="jd-field full">
                <label className="jd-label" htmlFor="jd-relocate">Are you willing to work on-site in {job.location.split(',')[0]}?<b> *</b></label>
                <textarea id="jd-relocate" name="onsite" className="jd-textarea" required style={{ minHeight: '70px' }} placeholder="Yes / No — add any details" />
              </div>

              <div className="jd-field full">
                <label className="jd-label" htmlFor="jd-salary">What is your salary expectation?<b> *</b></label>
                <textarea id="jd-salary" name="salary" className="jd-textarea" required style={{ minHeight: '70px' }} placeholder="e.g. AED 3,000 / month" />
              </div>

              <div className="jd-field full">
                <label className="jd-label" id="jd-screening-label">{job.screeningQuestion}<b> *</b></label>
                <div className="jd-yn-row" role="radiogroup" aria-labelledby="jd-screening-label">
                  <label>
                    <input
                      type="radio" name="screening" value="yes" required
                      checked={screeningAnswer === 'yes'} onChange={() => setScreeningAnswer('yes')}
                    />
                    <span className="jd-yn-btn">Yes</span>
                  </label>
                  <label>
                    <input
                      type="radio" name="screening" value="no" required
                      checked={screeningAnswer === 'no'} onChange={() => setScreeningAnswer('no')}
                    />
                    <span className="jd-yn-btn">No</span>
                  </label>
                </div>
              </div>

              <PrivacyNotice>We use your application details to assess your suitability for the role.</PrivacyNotice>
              {submitError && (
                <p role="alert" style={{ color: '#b42318', marginBottom: '12px' }}>{submitError}</p>
              )}
              <TurnstileField action="career_application" onTokenChange={setTurnstileToken} resetKey={verificationAttempt} />
              <button type="submit" className="jd-submit" disabled={sending || !turnstileToken}>
                {sending ? 'Sending application…' : 'Submit application'}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
