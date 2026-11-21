import Image from 'next/image'
import Link from 'next/link'
import { BLOG_POSTS, blogHref } from '@/components/about/newsroom/blog/blog-index'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Every regulatory page (ASATEEL, SHAHIN, SecurePath, SecurePath Premium) used
 * to render the exact same two hardcoded posts regardless of topic. `tag`
 * pulls posts that actually match the page's subject instead — falling back
 * to the most recent posts overall if nothing in the index carries that tag
 * yet, so the section never renders empty while more topic-tagged content is
 * still being written.
 */
export default function RegulatoryBlogFeed({ tag, limit = 2 }: { tag?: string | string[]; limit?: number } = {}) {
  const tags = tag ? (Array.isArray(tag) ? tag : [tag]) : []
  const matched = tags.length
    ? BLOG_POSTS.filter(p => tags.includes(p.tag))
    : []
  const posts = (matched.length ? matched : BLOG_POSTS)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit)

  return (
    <>
      <style>{`
        .rbf-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; }
        @media (max-width: 760px) { .rbf-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .rbf-card { flex-direction: column !important; } .rbf-media { width: 100% !important; } }
        .rbf-card {
          display: flex; gap: 20px; align-items: flex-start;
          background: #fff; border: 1px solid #eef0f4; border-radius: 20px;
          padding: 24px; box-shadow: 0 2px 14px rgba(15,23,42,.05);
          transition: transform .22s cubic-bezier(.22,.61,.36,1), box-shadow .22s cubic-bezier(.22,.61,.36,1);
        }
        .rbf-card:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(15,23,42,.1); }
        .rbf-media { position: relative; flex-shrink: 0; width: 42%; }
        .rbf-date {
          position: absolute; top: -12px; left: -12px; z-index: 1;
          background: #fff; border-radius: 10px; padding: 6px 11px;
          box-shadow: 0 6px 18px rgba(15,23,42,.14);
          text-align: center; line-height: 1.1;
        }
        .rbf-date-day { display: block; font-size: var(--f-16); font-weight: 800; color: #1d1d1f; }
        .rbf-date-month { display: block; font-size: var(--f-10-5); font-weight: 600; color: #8e8e93; }
        .rbf-img-wrap { border-radius: 12px; overflow: hidden; }
        .rbf-read {
          color: #1360ee; font-weight: 700; font-size: var(--f-13-5);
          text-decoration: underline; text-underline-offset: 2px;
        }
      `}</style>

      <section style={{ padding: 'clamp(56px,7vw,80px) 28px', background: '#fff' }}>
        <div style={{ maxWidth: 'var(--w-1000)', margin: '0 auto' }}>

          <div data-reveal style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, margin: '0 auto 18px',
              display: 'grid', placeItems: 'center', background: 'rgba(19,96,238,.10)', color: '#1360ee',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 12px', fontSize: 'max(clamp(24px,3vw,34px), min(2.361vw, 49.3px))', fontWeight: 700, color: '#1d1d1f' }}>
              Latest from Our Blog
            </h2>
            <p style={{ margin: '0 auto', maxWidth: '520px', fontSize: 'var(--f-15)', color: '#8e8e93', lineHeight: 1.6 }}>
              We are right here to share the valuable insights on our area of Expertise. We help you to master on managing your Vehicle &amp; Team.
            </p>
          </div>

          <div className="rbf-grid" data-reveal>
            {posts.map((p, i) => {
              const d = new Date(p.date)
              return (
                <Link key={p.slug} href={blogHref(p.slug)} className="rbf-card" data-reveal data-reveal-delay={String(i * 90)} style={{ textDecoration: 'none' }}>
                  <div className="rbf-media">
                    <span className="rbf-date">
                      <span className="rbf-date-day">{String(d.getDate()).padStart(2, '0')}</span>
                      <span className="rbf-date-month">{MONTH_SHORT[d.getMonth()]}</span>
                    </span>
                    <div className="rbf-img-wrap">
                      <Image src={p.hero.src} alt={p.hero.alt} width={p.hero.width} height={p.hero.height} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 10px', fontSize: 'var(--f-16-5)', fontWeight: 700, lineHeight: 1.35, color: '#1d1d1f' }}>
                      {p.title}
                    </h3>
                    <p style={{ margin: '0 0 14px', fontSize: 'var(--f-13-5)', lineHeight: 1.7, color: '#6e6e73' }}>
                      {p.excerpt}
                    </p>
                    <span className="rbf-read">Read More</span>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}
