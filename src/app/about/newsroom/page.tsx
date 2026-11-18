import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import NewsroomHero from '@/components/about/newsroom/NewsroomHero'
import NewsroomTicker from '@/components/about/newsroom/NewsroomTicker'
import NewsroomBoard from '@/components/about/newsroom/NewsroomBoard'
import NewsroomHighlights from '@/components/about/newsroom/NewsroomHighlights'
import NewsroomSubscribe from '@/components/about/newsroom/NewsroomSubscribe'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import NewsroomVideosAndBlogs from '@/components/about/newsroom/NewsroomVideosAndBlogs'

export const metadata: Metadata = {
  // Absolute: the brief's title already ends with the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'LOCATOR Newsroom | Company News & Updates in the UAE' },
  description:
    'Explore LOCATOR’s latest company news, GPS tracking product updates, customer success stories, industry events and media coverage from the UAE and beyond.',
  alternates: { canonical: '/about/newsroom' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'LOCATOR Newsroom | Company News & Updates in the UAE',
    description:
      'Explore LOCATOR’s latest company news, GPS tracking product updates, customer success stories, industry events and media coverage from the UAE and beyond.',
    url: '/about/newsroom',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'LOCATOR Newsroom | Company News & Updates in the UAE' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOCATOR Newsroom | Company News & Updates in the UAE',
    description:
      'Explore LOCATOR’s latest company news, GPS tracking product updates, customer success stories, industry events and media coverage from the UAE and beyond.',
    images: [siteConfig.ogImage],
  },
}

export default function AboutNewsroomPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <ScrollReveal />
      <NewsroomHero />
      <NewsroomTicker />
      <NewsroomBoard />
      <NewsroomHighlights />
      <NewsroomVideosAndBlogs />
      <NewsroomSubscribe title="Stay Connected with LOCATOR" />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  )
}
