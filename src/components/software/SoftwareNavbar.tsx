'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { REGULATORY_PRODUCTS } from '@/components/regulatory/data'
import { ABOUT_PAGES } from '@/components/about/data'
import { SERVICE_PAGES } from '@/components/service/data'
import { SOFTWARE_MODULES } from '@/components/software/modules-data'
import { INDUSTRY_NAV_ITEMS } from '@/components/industries/industries-nav'

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About us' },
  { href: '/software',   label: 'Software' },
  { href: '/service',    label: 'Service' },
  { href: '/industries', label: 'Industries' },
  { href: '/regulatory', label: 'Regulatory GPS Certifications' },
  { href: '/contact',    label: 'Contact' },
]

// Nav items that open the shutter mega-menu instead of navigating directly.
type NavDropdownItem = { slug: string; name: string; tagline: string; accent: string; icon: React.ReactNode }
const DROPDOWNS: Record<string, { items: NavDropdownItem[]; base: string; label: string; blurb: string; hash?: boolean; navigable?: boolean }> = {
  // navigable: clicking the label goes to the /regulatory overview (like /industries);
  // hover still opens the menu.
  '/regulatory': { items: REGULATORY_PRODUCTS, base: '',         label: 'Regulatory GPS Certifications', blurb: 'Certified GPS & OBU solutions built to meet UAE regulatory requirements.', navigable: true },
  '/about':      { items: ABOUT_PAGES,         base: '/about',   label: 'About Locator',                 blurb: 'Who we are, where we’re headed, and the people behind the platform.' },
  '/software':   { items: SOFTWARE_MODULES,    base: '/software', label: 'Software Platform',            blurb: 'Jump straight to any module of the Locator fleet platform.', hash: true, navigable: true },
  '/service':    { items: SERVICE_PAGES,       base: '/service', label: 'Locator Services',              blurb: 'End-to-end fleet, video, and IoT services for every operation.' },
  // navigable: the label stays a real link to /industries (like /software), so the
  // overview page is still reachable by click while hover opens the menu.
  '/industries': { items: INDUSTRY_NAV_ITEMS,  base: '/industries', label: 'Industries We Serve',       blurb: 'Telematics built around how your sector actually operates.', navigable: true },
}

const itemHref = (dd: { base: string; hash?: boolean }, slug: string) =>
  dd.hash ? `${dd.base}#${slug}` : `${dd.base}/${slug}`

// Every mega-menu icon chip uses this one colour, deliberately overriding each item's
// own `accent`. The per-item accents still drive the destination PAGES (RegulatoryGrid,
// AboutPillarNav, ServiceProcess, SmartIotFeatures and others read the same field), and
// they are right there — a page gets to own its identity colour. In a dropdown they are
// wrong: five items in five hues turn a navigation list into a colour chart and make
// items look categorically different when they are just siblings. Overriding here rather
// than flattening the data keeps both behaviours.
const MENU_ICON_ACCENT = '#1360ee'

export default function SoftwareNavbar() {
  const [open, setOpen]       = useState(false)      // mobile drawer
  const [mounted, setMounted] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null) // open mega-menu href
  const [renderMenu, setRenderMenu] = useState<string | null>(null) // content kept during close anim
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  // Keep the last menu rendered so the close animation still shows content.
  useEffect(() => { if (activeMenu) setRenderMenu(activeMenu) }, [activeMenu])

  // Close everything on route change.
  useEffect(() => { setActiveMenu(null); setOpen(false) }, [pathname])

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  const openMega = (href: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
    setActiveMenu(href)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveMenu(null), 130)
  }
  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
  }

  const activeDD = renderMenu ? DROPDOWNS[renderMenu] : null

  return (
    <>
      <style>{`
        /* ── Full-width flat bar ───────────────────────────────────────────── */
        .swn-root {
          position: fixed; top: 0; left: 0; right: 0; width: 100%;
          z-index: 1002;
          background: rgba(255,255,255,0.82);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .swn-root { background: rgba(255,255,255,0.96); }
        }
        /* Bar turns solid while a mega-menu is open so the panel reads clean. */
        .swn-root.menu-open { background: #ffffff; }

        .swn-spacer { height: 64px; }

        .swn-bar {
          /* Ceiling raised so the bar keeps pace with the page content beneath it.
             It can only ever bind above a 1600px viewport — below that the bar is
             already viewport-width minus its padding, so nothing here changes. */
          max-width: max(1600px, min(94vw, 2320px)); margin: 0 auto;
          padding: 0 clamp(16px, 3.5vw, var(--nav-pad));
          height: 64px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        .swn-link {
          position: relative;
          font-size: var(--nav-link); font-weight: 600; color: #3a3a44;
          white-space: nowrap;
          padding: max(8px, min(0.24vw + 4.3px, 10.5px)) max(14px, min(0.42vw + 7.5px, 18px)); border-radius: 10px;
          text-decoration: none; background: none; border: none;
          font-family: inherit; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: color .2s ease, background .2s ease;
        }
        .swn-link::after {
          content: ''; position: absolute; left: 14px; right: 14px; bottom: 3px;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #1f6dff, #0d4fd4);
          transform: scaleX(0); transform-origin: center;
          transition: transform .28s cubic-bezier(.22,.61,.36,1);
        }
        .swn-link:hover { color: #1360ee; }
        .swn-link:hover::after { transform: scaleX(1); }
        .swn-link.active { color: #1360ee; }
        .swn-link.active::after { transform: scaleX(1); }
        .swn-link.menu-current { color: #1360ee; background: rgba(19,96,238,.07); }

        .swn-chev { transition: transform .3s cubic-bezier(.22,.61,.36,1); flex-shrink: 0; }
        .swn-link.menu-current .swn-chev { transform: rotate(180deg); }

        /* ── Shutter mega-menu (drops from the top, full width) ─────────────── */
        .swn-backdrop {
          position: fixed; inset: 64px 0 0 0; z-index: 1000;
          background: rgba(15,23,42,0.14);
          opacity: 0; pointer-events: none;
          transition: opacity .32s ease;
        }
        .swn-backdrop.open { opacity: 1; pointer-events: auto; }

        .swn-mega {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 1001;
          background: #ffffff;
          border-bottom: 1px solid #ececf1;
          box-shadow: 0 40px 60px -34px rgba(15,23,42,.30);
          display: grid; grid-template-rows: 0fr;
          opacity: 0; pointer-events: none;
          transition: grid-template-rows .52s cubic-bezier(.16,1,.3,1),
                      opacity .34s ease,
                      box-shadow .5s ease;
          will-change: grid-template-rows;
        }
        .swn-mega.open { grid-template-rows: 1fr; opacity: 1; pointer-events: auto; }
        .swn-mega-clip { overflow: hidden; min-height: 0; }

        /* Inner content lifts + fades as the shutter unfolds (layered depth) */
        .swn-mega-inner {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(26px,3vw,40px) clamp(20px,4vw,48px) clamp(32px,3.4vw,46px);
          opacity: 0; transform: translateY(-10px);
          transition: opacity .4s ease .04s, transform .55s cubic-bezier(.16,1,.3,1) .04s;
        }
        .swn-mega.open .swn-mega-inner { opacity: 1; transform: none; }

        .swn-mega-head { margin-bottom: 22px; }
        .swn-mega-label { font-size: 12px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; }
        .swn-mega-blurb { margin: 6px 0 0; font-size: 14px; color: #6e6e73; max-width: 560px; line-height: 1.5; }

        /* Adaptive grid — fixed responsive columns so any number of items wraps
           cleanly into even rows (add more items → they flow into new rows). */
        .swn-mega-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
        @media (max-width: 1160px) { .swn-mega-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
        @media (max-width: 1000px) { .swn-mega-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }

        .swn-mega-card {
          display: flex; align-items: center; gap: 13px;
          padding: 13px 14px; border-radius: 14px;
          text-decoration: none; border: 1px solid transparent;
          transition: background .2s cubic-bezier(.22,.61,.36,1), border-color .2s ease, transform .2s cubic-bezier(.22,.61,.36,1), box-shadow .2s ease;
        }
        .swn-mega-card:hover { background: #f6f8fd; border-color: #e6ebf5; transform: translateY(-2px); box-shadow: 0 12px 26px -14px rgba(20,40,90,.3); }
        .swn-mega-ic {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: grid; place-items: center;
          transition: transform .22s cubic-bezier(.34,1.3,.64,1);
        }
        .swn-mega-card:hover .swn-mega-ic { transform: scale(1.08) rotate(-3deg); }
        .swn-mega-ic svg { width: 21px; height: 21px; }
        .swn-mega-name { display: block; font-size: 14.5px; font-weight: 700; color: #1d1d1f; line-height: 1.25; }
        .swn-mega-tag { display: block; font-size: 12px; color: #8e8e93; line-height: 1.35; margin-top: 2px; }
        .swn-mega-go { margin-left: auto; color: #cfd3dc; flex-shrink: 0; opacity: 0; transform: translateX(-4px); transition: transform .2s ease, color .2s ease, opacity .2s ease; }
        .swn-mega-card:hover .swn-mega-go { color: #1360ee; transform: translateX(0); opacity: 1; }

        /* Staggered card reveal each time the shutter opens */
        @keyframes swnCardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .swn-mega.open .swn-mega-card { animation: swnCardIn .5s cubic-bezier(.16,1,.3,1) both; }
        .swn-mega.open .swn-mega-card:nth-child(1) { animation-delay: .06s; }
        .swn-mega.open .swn-mega-card:nth-child(2) { animation-delay: .10s; }
        .swn-mega.open .swn-mega-card:nth-child(3) { animation-delay: .14s; }
        .swn-mega.open .swn-mega-card:nth-child(4) { animation-delay: .18s; }
        .swn-mega.open .swn-mega-card:nth-child(5) { animation-delay: .22s; }
        .swn-mega.open .swn-mega-card:nth-child(6) { animation-delay: .26s; }
        .swn-mega.open .swn-mega-card:nth-child(7) { animation-delay: .30s; }
        .swn-mega.open .swn-mega-card:nth-child(8) { animation-delay: .34s; }
        @media (prefers-reduced-motion: reduce) {
          .swn-mega { transition: opacity .2s ease; }
          .swn-mega-inner { transition: opacity .2s ease; transform: none; }
          .swn-mega.open .swn-mega-card { animation: none; }
        }

        .swn-logo { transition: transform .25s cubic-bezier(.22,.61,.36,1); }
        .swn-logo:hover { transform: scale(1.04); }
        .swn-flag {
          transition: transform .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s ease; cursor: pointer;
        }
        .swn-flag:hover { transform: scale(1.12) rotate(4deg); box-shadow: 0 3px 10px rgba(15,23,42,0.2); }

        .swn-cta {
          position: relative; overflow: hidden; isolation: isolate;
          font-size: var(--nav-link); font-weight: 700; cursor: pointer;
          padding: var(--nav-cta-py) max(22px, min(0.66vw + 11.7px, 29px)); border-radius: 999px; border: none;
          background: linear-gradient(135deg, #1f6dff 0%, #1360ee 55%, #0d4fd4 100%);
          color: #fff; font-family: inherit; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(19,96,238,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
          transition: transform .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s ease;
        }
        .swn-cta::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%);
          transform: translateX(-130%); transition: transform .6s cubic-bezier(.22,.61,.36,1);
        }
        .swn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(19,96,238,0.5), inset 0 1px 0 rgba(255,255,255,0.35); }
        .swn-cta:hover::before { transform: translateX(130%); }
        .swn-cta:active { transform: translateY(0) scale(.97); }

        @media (max-width: 980px) { .swn-pills { display: none !important; } .swn-hamburger { display: flex !important; } .swn-cta { display: none !important; } }
      `}</style>

      {/* Reserves the fixed bar's height in the page flow. */}
      <div className="swn-spacer" aria-hidden="true" />

      {(() => {
        const bar = (
      <>
        <nav className={`swn-root${activeMenu ? ' menu-open' : ''}`} onMouseLeave={scheduleClose}>
          <div className="swn-bar">
            {/* Logo */}
            <Link href="/" className="swn-logo" onMouseEnter={() => setActiveMenu(null)} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <Image src="/brand/logo-wordmark.png" alt="Locator" width={2617} height={911} style={{ width: 'auto', height: 'max(42px, min(1.26vw + 22px, 55px))', objectFit: 'contain' }} priority />
            </Link>

            {/* Nav links */}
            <div className="swn-pills" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
              {NAV_LINKS.map(l => {
                const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                const dd = DROPDOWNS[l.href]
                if (dd) {
                  const isCurrent = activeMenu === l.href
                  const chev = (
                    <svg className="swn-chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )
                  // Navigable dropdowns (e.g. Software) link to their real page on
                  // click while still opening the shutter on hover.
                  if (dd.navigable) {
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`swn-link${isActive ? ' active' : ''}${isCurrent ? ' menu-current' : ''}`}
                        aria-haspopup="menu"
                        aria-expanded={isCurrent}
                        onMouseEnter={() => openMega(l.href)}
                        onClick={() => setActiveMenu(null)}
                      >
                        {l.label}{chev}
                      </Link>
                    )
                  }
                  return (
                    <button
                      key={l.href}
                      type="button"
                      className={`swn-link${isActive ? ' active' : ''}${isCurrent ? ' menu-current' : ''}`}
                      aria-haspopup="menu"
                      aria-expanded={isCurrent}
                      onMouseEnter={() => openMega(l.href)}
                      onClick={() => (isCurrent ? setActiveMenu(null) : openMega(l.href))}
                    >
                      {l.label}{chev}
                    </button>
                  )
                }
                return (
                  <Link key={l.href} href={l.href} className={`swn-link${isActive ? ' active' : ''}`} onMouseEnter={() => setActiveMenu(null)}>
                    {l.label}
                  </Link>
                )
              })}
            </div>

            {/* Right: flag + CTA + hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }} onMouseEnter={() => setActiveMenu(null)}>
              <Image src="/flags/uae.svg" alt="UAE" width={28} height={28} className="swn-flag" style={{ borderRadius: '50%', display: 'block' }} />
              <button className="swn-cta" onClick={() => router.push('/get-a-quote')}>Get a quote</button>

              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className="swn-hamburger"
                style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: 'none', border: 'none', cursor: 'pointer', color: '#1d1d1f' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Backdrop dim behind the shutter */}
        <div className={`swn-backdrop${activeMenu ? ' open' : ''}`} onMouseEnter={scheduleClose} onClick={() => setActiveMenu(null)} aria-hidden="true" />

        {/* Shutter mega-menu */}
        <div
          className={`swn-mega${activeMenu ? ' open' : ''}`}
          role="menu"
          aria-label={activeDD?.label}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="swn-mega-clip">
            {activeDD && (
              <div className="swn-mega-inner">
                <div className="swn-mega-head">
                  <span className="swn-mega-label">{activeDD.label}</span>
                  <p className="swn-mega-blurb">{activeDD.blurb}</p>
                </div>
                <div className="swn-mega-grid">
                  {activeDD.items.map(p => (
                    <Link key={p.slug} href={itemHref(activeDD, p.slug)} className="swn-mega-card" role="menuitem" onClick={() => setActiveMenu(null)}>
                      <span className="swn-mega-ic" style={{ background: `${MENU_ICON_ACCENT}14`, color: MENU_ICON_ACCENT }}>{p.icon}</span>
                      <span style={{ minWidth: 0 }}>
                        <span className="swn-mega-name">{p.name}</span>
                        <span className="swn-mega-tag">{p.tagline}</span>
                      </span>
                      <svg className="swn-mega-go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
        )
        return mounted ? createPortal(bar, document.body) : bar
      })()}

      {/* Mobile drawer */}
      {open && mounted && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #e3e3e6' }}>
            <Image src="/brand/logo-wordmark.png" alt="Locator" width={2617} height={911} style={{ width: 'auto', height: '38px' }} />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e3e3e6', background: '#f5f5f7', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#1d1d1f' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto' }}>
            {NAV_LINKS.map(l => {
              const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              const dd = DROPDOWNS[l.href]
              return (
                <li key={l.href}>
                  {dd ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 4px', borderBottom: '1px solid #e3e3e6', fontSize: '17px', fontWeight: 600, color: '#1d1d1f' }}>
                      <span>{l.label}</span>
                    </div>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 4px', borderBottom: '1px solid #e3e3e6', fontSize: '17px', fontWeight: isActive ? 700 : 600, color: isActive ? '#1360ee' : '#1d1d1f', textDecoration: 'none' }}
                    >
                      <span>{l.label}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  )}
                  {dd && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 0 8px 14px', borderBottom: '1px solid #e3e3e6' }}>
                      {dd.items.map(p => (
                        <Link
                          key={p.slug}
                          href={itemHref(dd, p.slug)}
                          onClick={() => setOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 4px', fontSize: '14.5px', fontWeight: 600, color: '#52525e', textDecoration: 'none' }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: MENU_ICON_ACCENT, flexShrink: 0 }} />
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <div style={{ padding: '20px 24px' }}>
            <button
              onClick={() => { setOpen(false); router.push('/get-a-quote') }}
              style={{ width: '100%', padding: '14px', borderRadius: '999px', border: 'none', background: '#1360ee', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Get a quote
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
