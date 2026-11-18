import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import MissionHero from '@/components/about/MissionHero'
import MissionPillars from '@/components/about/MissionPillars'
import MissionCTA from '@/components/about/MissionCTA'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already ends with the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Our Mission | GPS Tracking & Fleet Solutions in UAE | LOCATOR' },
  description:
    'Discover LOCATOR’s mission to help UAE businesses build safer, smarter and more efficient operations through AI-powered IoT, GPS tracking and fleet management solutions.',
  alternates: { canonical: '/about/mission' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Our Mission | GPS Tracking & Fleet Solutions in UAE | LOCATOR',
    description:
      'Discover LOCATOR’s mission to help UAE businesses build safer, smarter and more efficient operations through AI-powered IoT, GPS tracking and fleet management solutions.',
    url: '/about/mission',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Our Mission | GPS Tracking & Fleet Solutions in UAE | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Mission | GPS Tracking & Fleet Solutions in UAE | LOCATOR',
    description:
      'Discover LOCATOR’s mission to help UAE businesses build safer, smarter and more efficient operations through AI-powered IoT, GPS tracking and fleet management solutions.',
    images: [siteConfig.ogImage],
  },
}

export default function AboutMissionPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <MissionHero />
      <MissionPillars />
      <AboutPillarNav current="mission" />
      <MissionCTA />
      <Footer />
    </main>
  )
}
