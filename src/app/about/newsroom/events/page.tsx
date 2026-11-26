import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import EventsListing from '@/components/about/newsroom/events/EventsListing'
import NewsroomSubscribe from '@/components/about/newsroom/NewsroomSubscribe'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import { EVENTS_BASE } from '@/components/about/newsroom/newsroom-data'
import { siteConfig, siteUrl } from '@/config/site'

const TITLE = 'LOCATOR Events | Exhibitions, Summits & Webinars'
const DESCRIPTION =
  'Find LOCATOR at upcoming exhibitions, summits and webinars, including GITEX GLOBAL 2026 in Dubai.'

export const metadata: Metadata = {
  // Absolute: the title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: EVENTS_BASE },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: EVENTS_BASE,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [siteConfig.ogImage],
  },
}

export default function EventsIndexPage() {
  const url = `${siteUrl}${EVENTS_BASE}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#events`,
        name: 'LOCATOR Events',
        description: DESCRIPTION,
        url,
        inLanguage: 'en-AE',
        publisher: { '@type': 'Organization', name: siteConfig.name, url: siteUrl },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Newsroom', item: `${siteUrl}/about/newsroom` },
          { '@type': 'ListItem', position: 3, name: 'Events', item: url },
        ],
      },
    ],
  }

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ScrollReveal />
      <SoftwareNavbar />
      <EventsListing />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  )
}
