import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import AboutPillarHero from '@/components/about/AboutPillarHero'
import CoreValuesIntro from '@/components/about/CoreValuesIntro'
import AboutValues from '@/components/about/AboutValues'
import MissionCTA from '@/components/about/MissionCTA'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Core Values of LOCATOR | Customer Success & Innovation in the UAE' },
  description:
    'Discover the principles behind LOCATOR’s GPS tracking and fleet management solutions in the UAE, built on customer success, innovation, trust, safety and operational excellence.',
  alternates: { canonical: '/about/core-values' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Core Values of LOCATOR | Customer Success & Innovation in the UAE',
    description:
      'Discover the principles behind LOCATOR’s GPS tracking and fleet management solutions in the UAE, built on customer success, innovation, trust, safety and operational excellence.',
    url: '/about/core-values',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Core Values of LOCATOR | Customer Success & Innovation in the UAE' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Core Values of LOCATOR | Customer Success & Innovation in the UAE',
    description:
      'Discover the principles behind LOCATOR’s GPS tracking and fleet management solutions in the UAE, built on customer success, innovation, trust, safety and operational excellence.',
    images: [siteConfig.ogImage],
  },
}

export default function AboutCoreValuesPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <AboutPillarHero
        slug="core-values"
        title="# The principles that guide how we innovate, work, and grow together."
        lead="The principles that guide how we innovate, work, and grow together."
      />
      <CoreValuesIntro />
      <AboutValues />
      <AboutPillarNav current="core-values" />
      <MissionCTA />
      <Footer />
    </main>
  )
}
