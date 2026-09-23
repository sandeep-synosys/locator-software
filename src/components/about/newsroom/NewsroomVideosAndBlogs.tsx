'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CustomerReviewVideos from './CustomerReviewVideos'
import { BLOG_POSTS } from './newsroom-data'
import { BLOG_BASE } from './blog/blog-index'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

/*
 * CustomerReviewVideos is the reference column.
 * The blog side intentionally stays compact: three small articles are shown
 * at a time, which keeps its visual height close to the video column without
 * trying to display the complete blog content.
 */
const BLOGS_PER_PAGE = 3

function chunk<T>(list: T[], size: number): T[][] {
  const pages: T[][] = []

  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size))
  }

  return pages
}

const BLOG_PAGES = chunk(BLOG_POSTS, BLOGS_PER_PAGE)

function BlogCard({ blog }: { blog: (typeof BLOG_POSTS)[number] }) {
  const href = blog.href ?? BLOG_BASE
  const isInternal = href.startsWith('/')

  const content = (
    <>
      <div className="nvc-blog-image">
        <Image
          src={blog.image}
          alt={blog.alt ?? ''}
          fill
          sizes="(max-width: 800px) 34vw, 170px"
          style={{ objectFit: blog.fit ?? 'cover' }}
        />
      </div>

      <div className="nvc-blog-body">
        <span className="nvc-blog-date">{blog.date}</span>

        <h3 className="nvc-blog-title">
          {blog.title}
        </h3>

        {blog.excerpt && (
          <p className="nvc-blog-excerpt">
            {blog.excerpt}
          </p>
        )}

        <span className="nvc-blog-more">
          Read More →
        </span>
      </div>
    </>
  )

  if (isInternal) {
    return (
      <Link href={href} className="nvc-blog-card">
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className="nvc-blog-card">
      {content}
    </a>
  )
}

export default function NewsroomVideosAndBlogs() {
  const [blogPage, setBlogPage] = useState(0)

  if (!BLOG_PAGES.length) {
    return (
      <section className="nvc" aria-label="Newsroom videos and content">
        <style>{styles}</style>

        <div className="nvc-inner">
          <div className="nvc-column nvc-column--videos">
            <CustomerReviewVideos />
          </div>

          <div className="nvc-column nvc-column--blogs">
            <BlogHeader />
            <div className="nvc-empty">
              No blog articles available yet.
            </div>
          </div>
        </div>
      </section>
    )
  }

  const pageCount = BLOG_PAGES.length
  const currentBlogs = BLOG_PAGES[blogPage] ?? BLOG_PAGES[0]

  const go = (delta: number) => {
    setBlogPage((current) => (current + delta + pageCount) % pageCount)
  }

  return (
    <>
      <style>{styles}</style>

      <section className="nvc" aria-label="Newsroom videos and blog content">
        <div className="nvc-inner">
          {/* Left 50% — Customer Review Videos */}
          <div className="nvc-column nvc-column--videos">
            <CustomerReviewVideos />
          </div>

          {/* Right 50% — Minimal Blog Slider */}
          <div className="nvc-column nvc-column--blogs">
            <BlogHeader />

            <div className="nvc-blog-stage">
              {pageCount > 1 && (
                <button
                  type="button"
                  className="nvc-arrow nvc-arrow--prev"
                  onClick={() => go(-1)}
                  aria-label="Previous blog posts"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}

              <div className="nvc-blog-list" key={blogPage}>
                {currentBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {pageCount > 1 && (
                <button
                  type="button"
                  className="nvc-arrow nvc-arrow--next"
                  onClick={() => go(1)}
                  aria-label="Next blog posts"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>

            {pageCount > 1 && (
              <div className="nvc-dots">
                {BLOG_PAGES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`nvc-dot ${index === blogPage ? 'is-on' : ''}`}
                    onClick={() => setBlogPage(index)}
                    aria-label={`Blog posts, page ${index + 1}`}
                    aria-current={index === blogPage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function BlogHeader() {
  return (
    <div className="nvc-head">
      <h2>From the Locator Blog</h2>

      <Link href={BLOG_BASE}>
        View All →
      </Link>
    </div>
  )
}

const styles = `
  .nvc {
    width: 100%;
    padding: clamp(44px, 6vw, 72px) 28px;
    background: #f7f9fc;
    border-top: 1px solid #eef2f8;
  }

  .nvc-inner {
    width: min(100%, var(--w-1240));
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(24px, 3vw, 44px);
    align-items: stretch;
  }

  .nvc-column {
    min-width: 0;
    background: #fff;

    border: 1px solid #e7ecf6;
    border-radius: 18px;

    padding: clamp(18px,2.2vw,26px);

    box-shadow:
      0 2px 10px rgba(11,18,32,.04);
  }

  /*
   * CustomerReviewVideos already has its own section wrapper.
   * Remove only its outer spacing/border here so it behaves as the left
   * half of this two-column section instead of creating a nested section.
   */
  .nvc-column--videos .crv {
    padding: 0;
    border-top: 0;
  }

  .nvc-column--videos .crv-inner {
    width: 100%;
  }

  /* ── Blog column ───────────────────────────────────────────── */

  .nvc-column--blogs {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .nvc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 12px;
    margin-bottom: 18px;
    border-bottom: 2px solid #0b1220;
  }

  .nvc-head h2 {
    margin: 0;
    color: #0b1220;
    font-size: var(--f-20, 20px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -.02em;
  }

  .nvc-head a {
    color: #1360ee;
    font-size: var(--f-12-5, 12.5px);
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
  }

  .nvc-head a:hover {
    text-decoration: underline;
  }

  .nvc-blog-stage {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: stretch;
  }

  .nvc-blog-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: nvc-blog-in .35s ${EASE} both;
  }

  @keyframes nvc-blog-in {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
  }

  .nvc-blog-card {
    min-width: 0;
    flex: 1 1 0;
    display: grid;
    grid-template-columns: clamp(108px, 11vw, 150px) minmax(0, 1fr);
    gap: 14px;
    align-items: center;
    padding: 8px;
    border: 1px solid #e7ecf6;
    border-radius: 14px;
    background: #fff;
    text-decoration: none;
    overflow: hidden;
    transition:
      transform .22s ${EASE},
      border-color .22s ${EASE},
      box-shadow .22s ${EASE},
      background .18s ${EASE};
  }

  .nvc-blog-card:hover {
    transform: translateY(-2px);
    border-color: #d5e0f5;
    background: #fff;
    box-shadow: 0 14px 30px -20px rgba(11,18,32,.35);
  }

  .nvc-blog-image {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 112px;
    aspect-ratio: 16 / 10;
    border-radius: 10px;
    overflow: hidden;
    background: #0b1220;
  }

  .nvc-blog-image img {
    transition: transform .35s ${EASE};
  }

  .nvc-blog-card:hover .nvc-blog-image img {
    transform: scale(1.05);
  }

  .nvc-blog-body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px 8px 5px 0;
  }

  .nvc-blog-date {
    display: block;
    margin-bottom: 6px;
    color: #97a1b3;
    font-size: var(--f-11-5, 11.5px);
  }

  .nvc-blog-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 0 0 6px;
    color: #0b1220;
    font-size: var(--f-14, 14px);
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: -.012em;
  }

  .nvc-blog-excerpt {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 0 0 7px;
    color: #70798a;
    font-size: var(--f-12, 12px);
    line-height: 1.45;
  }

  .nvc-blog-more {
    color: #1360ee;
    font-size: var(--f-11-5, 11.5px);
    font-weight: 700;
  }

  .nvc-blog-card:hover .nvc-blog-more {
    text-decoration: underline;
  }

  /* ── Slider controls ───────────────────────────────────────── */

  .nvc-arrow {
    position: absolute;
    top: 50%;
    z-index: 5;
    width: 32px;
    height: 32px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 1px solid #e1e7f0;
    border-radius: 50%;
    background: #fff;
    color: #0b1220;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(11,18,32,.12);
    transform: translateY(-50%);
    transition:
      background .18s ${EASE},
      transform .18s ${EASE},
      box-shadow .18s ${EASE};
  }

  .nvc-arrow:hover {
    background: #f4f8ff;
    box-shadow: 0 8px 20px rgba(11,18,32,.18);
  }

  .nvc-arrow:active {
    transform: translateY(-50%) scale(.94);
  }

  .nvc-arrow--prev {
    left: -16px;
  }

  .nvc-arrow--next {
    right: -16px;
  }

  .nvc-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    padding-top: 14px;
  }

  .nvc-dot {
    width: 7px;
    height: 7px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #d7dee9;
    cursor: pointer;
    transition:
      width .18s ${EASE},
      background .18s ${EASE};
  }

  .nvc-dot.is-on {
    width: 18px;
    border-radius: 999px;
    background: #1360ee;
  }

  .nvc-empty {
    flex: 1;
    min-height: 300px;
    display: grid;
    place-items: center;
    padding: 40px;
    border: 1px dashed #dbe3f0;
    border-radius: 16px;
    color: #8b93a3;
    background: #fafbfe;
  }

  /* ── Responsive ────────────────────────────────────────────── */

  @media (max-width: 1000px) {
    .nvc-inner {
      gap: 24px;
    }

    .nvc-blog-card {
      grid-template-columns: 100px minmax(0, 1fr);
      gap: 11px;
    }

    .nvc-blog-image {
      min-height: 100px;
    }
  }

  @media (max-width: 800px) {
    .nvc {
      padding-inline: 18px;
    }

    .nvc-inner {
      grid-template-columns: 1fr;
      gap: 36px;
    }

    .nvc-column--videos .crv {
      width: 100%;
    }

    .nvc-column--blogs {
      min-height: 0;
    }

    .nvc-blog-card {
      grid-template-columns: 120px minmax(0, 1fr);
    }

    .nvc-blog-image {
      min-height: 108px;
    }
  }

  @media (max-width: 520px) {
    .nvc-head {
      align-items: flex-end;
    }

    .nvc-head h2 {
      font-size: var(--f-18, 18px);
    }

    .nvc-blog-card {
      grid-template-columns: 96px minmax(0, 1fr);
      gap: 10px;
      padding: 7px;
    }

    .nvc-blog-image {
      min-height: 90px;
    }

    .nvc-blog-body {
      padding-right: 4px;
    }

    .nvc-blog-title {
      font-size: var(--f-13, 13px);
    }

    .nvc-blog-excerpt {
      display: none;
    }

    .nvc-arrow--prev {
      left: -8px;
    }

    .nvc-arrow--next {
      right: -8px;
    }
  }

  @media (max-width: 360px) {
    .nvc-blog-card {
      grid-template-columns: 84px minmax(0, 1fr);
    }

    .nvc-blog-image {
      min-height: 78px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nvc-blog-list,
    .nvc-blog-card,
    .nvc-blog-image img,
    .nvc-arrow {
      animation: none;
      transition: none;
    }
  }
`

