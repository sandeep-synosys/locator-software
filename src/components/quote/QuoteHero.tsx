import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'

export default function QuoteHero() {
  return (
    <>
      <style>{`
        .qh-hero {
          position: relative; overflow: hidden;
          background: radial-gradient(120% 90% at 50% -10%, #eef3ff 0%, #ffffff 60%);
          padding: clamp(16px,2vw,28px) 28px clamp(28px,4vw,44px);
        }
        .qh-inner { max-width: var(--w-1180); margin: 0 auto; text-align: center; padding-top: clamp(8px,1.4vw,16px); }

        .qh-title { margin: 0; font-size: max(clamp(30px,4.4vw,52px), min(3.611vw, 75.4px)); font-weight: 800; line-height: 1.08; letter-spacing: -.03em; color: #1d1d1f; }
        .qh-title b { color: #1360ee; font-weight: 800; }

        .qh-crumbs { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; font-size: var(--f-13); color: #6e6e73; }
        .qh-crumbs a { color: #6e6e73; text-decoration: none; font-weight: 600; transition: color .18s ease; }
        .qh-crumbs a:hover { color: #1360ee; }
        .qh-crumbs .cur { color: #1360ee; font-weight: 700; }
      `}</style>

      <section className="qh-hero">
        <SoftwareNavbar />
        <div className="qh-inner">
          <h1 className="qh-title">Get a Free <b>GPS Tracking Quote</b></h1>
          <nav className="qh-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="cur">Get a Quote</span>
          </nav>
        </div>
      </section>
    </>
  )
}
