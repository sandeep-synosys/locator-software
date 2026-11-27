import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import Footer from '@/components/layouts/Footer'
import GitexHero from '@/components/about/newsroom/events/gitex-2026/GitexHero'
import GitexTeamCarousel from '@/components/about/newsroom/events/gitex-2026/GitexTeamCarousel'
import GitexIntro from '@/components/about/newsroom/events/gitex-2026/GitexIntro'
import GitexAbout from '@/components/about/newsroom/events/gitex-2026/GitexAbout'
import GitexPerspective from '@/components/about/newsroom/events/gitex-2026/GitexPerspective'
import GitexIndustries from '@/components/about/newsroom/events/gitex-2026/GitexIndustries'
import GitexModules from '@/components/about/newsroom/events/gitex-2026/GitexModules'
import GitexMeet from '@/components/about/newsroom/events/gitex-2026/GitexMeet'
import GitexClosing from '@/components/about/newsroom/events/gitex-2026/GitexClosing'
import GitexFaq from '@/components/about/newsroom/events/gitex-2026/GitexFaq'
import { GitexBaseStyles } from '@/components/about/newsroom/events/gitex-2026/GitexText'
import { GITEX_ASSETS } from '@/components/about/newsroom/events/gitex-2026/gitex-2026-data'
import { EVENTS_BASE, GITEX_2026_HREF } from '@/components/about/newsroom/newsroom-data'
import { siteConfig, siteUrl } from '@/config/site'

// GITEX GLOBAL 2026 event page. Title, description, keywords, headings, copy,
// links, image file names and alt text follow the "Beyond Tracking: LOCATOR at
// GITEX GLOBAL 2026" SEO content package (26 November 2026).
const TITLE = 'LOCATOR at GITEX GLOBAL 2026 | Beyond Fleet Tracking'
const DESCRIPTION =
  'LOCATOR heads to GITEX GLOBAL 2026 in Dubai (7–11 Dec) to discuss industry-specific fleet management for construction, rental, FM and trading. Stand H15-5.'
const H1 = 'Beyond Tracking, Towards Smarter Decisions: LOCATOR Heads to GITEX GLOBAL 2026'
const PUBLISHED = '2026-11-26'
const KEYWORDS = [
  'LOCATOR at GITEX GLOBAL 2026',
  'GITEX GLOBAL 2026',
  'GITEX GLOBAL Dubai 2026',
  'fleet management technology',
  'smart fleet management',
  'industry-specific fleet management',
  'fleet intelligence',
  'GPS tracking UAE',
  'construction fleet management',
  'rental fleet management',
  'facility management technology',
  'general trading fleet management',
  'fleet management solutions UAE',
  'asset utilisation',
  'fleet operational efficiency',
]
// Featured image: the LOCATOR x GITEX GLOBAL 2026 poster, with the stand and
// hall exactly as supplied.
const FEATURED = {
  url: `${GITEX_ASSETS}/locator-gitex-global-2026-stand-h15-5.jpg`,
  width: 1200,
  height: 630,
  alt: 'LOCATOR at GITEX GLOBAL 2026, Stand H15-5, Hall S15, 7–11 December 2026',
}

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  alternates: { canonical: GITEX_2026_HREF },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // site name and locale are restated here.
  openGraph: {
    type: 'article',
    title: TITLE,
    description: DESCRIPTION,
    url: GITEX_2026_HREF,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    publishedTime: PUBLISHED,
    authors: [siteConfig.name],
    tags: KEYWORDS.slice(0, 3),
    images: [FEATURED],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [FEATURED.url],
  },
}

export default function LocatorAtGitexGlobal2026Page() {
  const url = `${siteUrl}${GITEX_2026_HREF}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: H1,
        description: DESCRIPTION,
        image: [`${siteUrl}${FEATURED.url}`],
        datePublished: PUBLISHED,
        dateModified: PUBLISHED,
        inLanguage: 'en-AE',
        keywords: KEYWORDS.join(', '),
        articleSection: 'Events',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@type': 'Organization', name: siteConfig.name, url: siteUrl },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/brand/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Newsroom', item: `${siteUrl}/about/newsroom` },
          { '@type': 'ListItem', position: 3, name: 'Events', item: `${siteUrl}${EVENTS_BASE}` },
          { '@type': 'ListItem', position: 4, name: 'LOCATOR at GITEX GLOBAL 2026', item: url },
        ],
      },
    ],
  }

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScrollReveal />
      <GitexBaseStyles />
      <SoftwareNavbar />
      <GitexHero />
      <GitexTeamCarousel />
      <GitexIntro />
      <GitexAbout />
      <GitexPerspective />
      <GitexIndustries />
      <GitexModules />
      <GitexMeet />
      <GitexClosing />
      <GitexFaq />
      <Footer />
    </main>
  )
}
