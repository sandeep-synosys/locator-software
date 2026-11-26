import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABEL, EVENT_ITEMS, hasPage, type NewsItem } from '../newsroom-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/* Events listing, laid out like the blog listing: the first event (GITEX, the
   one with its own page) as the wide lead card, the rest in a three-column grid.
   Placeholder events are plain cards with no link, hover or "Read More". */
export default function EventsListing() {
  const [lead, ...rest] = EVENT_ITEMS

  return (
    <section className="evl">
      <style href="nr-eventslisting" precedence="medium">{`
        .evl { background: #fff; }
        .evl-wrap { max-width: var(--w-1180); margin: 0 auto; padding: clamp(30px,4vw,54px) 28px 0; }
        .evl-h1 {
          position: absolute; width: 1px; height: 1px; margin: -1px;
          overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
        }

        .evl-lead {
          display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr);
          gap: clamp(20px,2.8vw,40px); align-items: center; text-decoration: none;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 20px; overflow: hidden;
          padding: clamp(18px,2vw,26px);
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        a.evl-lead:hover { transform: translateY(-3px); border-color: #d5e0f5; box-shadow: 0 22px 48px -24px rgba(11,18,32,.4); }
        @media (max-width: 860px) { .evl-lead { grid-template-columns: 1fr; } }
        .evl-lead-media { position: relative; aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: #eef3fb; order: 2; }
        @media (max-width: 860px) { .evl-lead-media { order: 0; } }
        .evl-lead-media img { object-fit: cover; transition: transform .4s ${EASE}; }
        a.evl-lead:hover .evl-lead-media img { transform: scale(1.04); }
        .evl-lead-title { margin: 12px 0 12px; font-size: clamp(21px,2.2vw,32px); font-weight: 800; line-height: 1.2; letter-spacing: -.024em; color: #0b1220; }
        .evl-lead-excerpt { margin: 0 0 16px; font-size: var(--f-14-5); line-height: 1.7; color: #5b6474; max-width: 58ch; }

        .evl-chip {
          display: inline-block; font-size: var(--f-10); font-weight: 800;
          letter-spacing: .09em; text-transform: uppercase; color: #fff;
          background: #1360ee; padding: 5px 10px; border-radius: 6px;
        }
        .evl-meta { font-size: var(--f-12); color: #97a1b3; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .evl-more { font-size: var(--f-13-5); font-weight: 700; color: #1360ee; }
        a.evl-lead:hover .evl-more, a.evl-card:hover .evl-more { text-decoration: underline; }

        .evl-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          gap: clamp(18px,2.2vw,26px);
          padding: clamp(24px,3vw,40px) 0 clamp(46px,5.5vw,80px);
        }
        @media (max-width: 980px) { .evl-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 620px) { .evl-grid { grid-template-columns: 1fr; } }

        .evl-card {
          display: flex; flex-direction: column; overflow: hidden; text-decoration: none;
          background: #fff; border: 1px solid #e7ecf6; border-radius: 16px;
          transition: transform .22s ${EASE}, box-shadow .22s ${EASE}, border-color .22s ${EASE};
        }
        a.evl-card:hover { transform: translateY(-3px); border-color: #d5e0f5; box-shadow: 0 18px 40px -20px rgba(11,18,32,.35); }
        .evl-card-media { position: relative; aspect-ratio: 16 / 10; background: #eef3fb; overflow: hidden; }
        .evl-card-media img { object-fit: cover; transition: transform .4s ${EASE}; }
        a.evl-card:hover .evl-card-media img { transform: scale(1.05); }
        .evl-card-media .evl-chip { position: absolute; left: 12px; top: 12px; z-index: 2; }
        .evl-card-body { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1; }
        .evl-card-title { margin: 8px 0 9px; font-size: var(--f-15-5); font-weight: 770; line-height: 1.32; letter-spacing: -.016em; color: #0b1220; }
        .evl-card-excerpt {
          margin: 0 0 14px; font-size: var(--f-13); line-height: 1.62; color: #6b7484; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
      `}</style>

      <div className="evl-wrap">
        <h1 className="evl-h1">LOCATOR Events</h1>

        {lead && <LeadCard item={lead} />}

        {rest.length > 0 && (
          <div className="evl-grid">
            {rest.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function LeadCard({ item }: { item: NewsItem }) {
  const linked = hasPage(item)
  const inner = (
    <>
      <div>
        <span className="evl-chip">{item.tag || CATEGORY_LABEL[item.category]}</span>
        <h2 className="evl-lead-title">{item.title}</h2>
        <p className="evl-lead-excerpt">{item.excerpt}</p>
        <p className="evl-meta" style={{ marginBottom: linked ? 14 : 0 }}>
          <span>{item.date}</span>
        </p>
        {linked && <span className="evl-more">Read Full Story →</span>}
      </div>
      <div className="evl-lead-media">
        <Image src={item.image} alt={item.alt ?? ''} fill sizes="(max-width: 860px) 100vw, 520px" priority />
      </div>
    </>
  )
  return linked ? (
    <Link href={item.href} className="evl-lead">
      {inner}
    </Link>
  ) : (
    <div className="evl-lead">{inner}</div>
  )
}

function EventCard({ item }: { item: NewsItem }) {
  const linked = hasPage(item)
  const inner = (
    <>
      <div className="evl-card-media">
        <Image src={item.image} alt={item.alt ?? ''} fill sizes="(max-width: 620px) 100vw, 360px" />
        <span className="evl-chip">{item.tag || CATEGORY_LABEL[item.category]}</span>
      </div>
      <div className="evl-card-body">
        <p className="evl-meta">
          <span>{item.date}</span>
        </p>
        <h2 className="evl-card-title">{item.title}</h2>
        <p className="evl-card-excerpt">{item.excerpt}</p>
        {linked && <span className="evl-more">Read More →</span>}
      </div>
    </>
  )
  return linked ? (
    <Link href={item.href} className="evl-card">
      {inner}
    </Link>
  ) : (
    <div className="evl-card">{inner}</div>
  )
}
