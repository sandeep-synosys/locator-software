import Image from 'next/image'
import Link from 'next/link'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import type { Industry } from './industries-data'

export default function IndustryHero({ industry }: { industry: Industry }) {
  return (
    <>
      <style>{`
        .ixh-hero { background: #fff; }

        .ixh-crumbs-bar { border-bottom: 1px solid #eef1f7; }
        .ixh-crumbs {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          max-width: var(--w-1280); margin: 0 auto; padding: 16px 28px;
          font-size: var(--f-14); color: #6e6e73;
        }
        .ixh-crumbs a { color: #1d1d1f; font-weight: 600; text-decoration: none; transition: color .18s ease; }
        .ixh-crumbs a:hover { color: #1360ee; }
        .ixh-crumbs svg { color: #b8bcc4; flex-shrink: 0; }
        .ixh-crumbs .cur { color: #8e8e93; }

        /* min-height (not a fixed height): the band keeps its usual size but
           grows when the copy needs more room, so the eyebrow is never pushed
           against (or clipped by) the top edge on wide screens, where the
           vw-based type is larger. Flex lets the body fill the band and keep
           the copy anchored to the bottom as before. */
        .ixh-photo { position: relative; overflow: hidden; display: flex; min-height: clamp(300px, 38vw, 460px); }
        .ixh-photo img { object-fit: cover; }
        /* Layered scrim: a strong bottom-up fade so the multi-line headline
           always sits on dark pixels, plus a left-side wash so text stays
           legible even where the photo is bright (e.g. pale buildings). */
        .ixh-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(0deg, rgba(4,8,18,.94) 0%, rgba(4,8,18,.82) 32%, rgba(4,8,18,.55) 58%, rgba(4,8,18,.28) 80%, rgba(4,8,18,.1) 100%),
            linear-gradient(90deg, rgba(4,8,18,.7) 0%, rgba(4,8,18,.35) 40%, transparent 78%);
        }

        .ixh-photo-body {
          position: relative; z-index: 2; flex: 1; width: 100%;
          display: flex; align-items: flex-end;
          max-width: var(--w-1280); margin: 0 auto;
          padding: clamp(32px,4vw,64px) 28px clamp(26px,4vw,46px);
        }
        .ixh-content { max-width: min(760px, 90vw); }

        .ixh-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: max(clamp(13px,1.15vw,15px), min(1.042vw, 21.75px)); font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
          color: #9ec2ff; margin-bottom: 16px;
          text-shadow: 0 2px 12px rgba(0,0,0,.35);
        }
        .ixh-eyebrow i { display: block; width: 34px; height: 3px; background: #9ec2ff; border-radius: 2px; }

        .ixh-title {
          margin: 0; font-size: max(clamp(30px,4.6vw,56px), min(3.889vw, 81.2px)); font-weight: 800;
          line-height: 1.08; letter-spacing: -.02em; color: #fff; max-width: 20ch;
          text-shadow: 0 2px 4px rgba(0,0,0,.45), 0 8px 34px rgba(0,0,0,.4);
        }

        .ixh-lead { margin: 16px 0 0; max-width: 62ch; font-size: max(clamp(14px,1.25vw,16.5px), min(1.146vw, 23.93px)); line-height: 1.72; color: rgba(255,255,255,.86); }
      `}</style>

      <section className="ixh-hero">
        <SoftwareNavbar />

        <div className="ixh-crumbs-bar">
          <nav className="ixh-crumbs" aria-label="Breadcrumb">
            <Link href="/">Homepage</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <Link href="/industries">Industries</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span className="cur">{industry.name}</span>
          </nav>
        </div>

        <div className="ixh-photo" data-reveal>
          <Image src={industry.heroImage} alt={industry.name} fill priority sizes="100vw" />
          <div className="ixh-scrim" />
          <div className="ixh-photo-body">
            <div className="ixh-content">
              <span className="ixh-eyebrow"><i />{industry.name}</span>
              <h1 className="ixh-title">{industry.tagline}</h1>
              <p className="ixh-lead">{industry.lead}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
