import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import BenefitsHero from '@/components/benefits/BenefitsHero'
import BenefitsIndex from '@/components/benefits/BenefitsIndex'
import BenefitsClosing from '@/components/benefits/BenefitsClosing'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import { BENEFITS } from '@/components/benefits/data'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: '11 Benefits of GPS Tracking for UAE Fleets | LOCATOR' },
  description:
    'Explore 11 benefits of GPS tracking for UAE fleets, from lower operating and maintenance costs to less overtime, vehicle recovery and fuel savings of up to 20%.',
  alternates: { canonical: '/benefits-of-gps-tracking' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: '11 Benefits of GPS Tracking for UAE Fleets | LOCATOR',
    description:
      'Explore 11 benefits of GPS tracking for UAE fleets, from lower operating and maintenance costs to less overtime, vehicle recovery and fuel savings of up to 20%.',
    url: '/benefits-of-gps-tracking',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: '11 Benefits of GPS Tracking for UAE Fleets | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '11 Benefits of GPS Tracking for UAE Fleets | LOCATOR',
    description:
      'Explore 11 benefits of GPS tracking for UAE fleets, from lower operating and maintenance costs to less overtime, vehicle recovery and fuel savings of up to 20%.',
    images: [siteConfig.ogImage],
  },
}

export default function BenefitsOfGpsTrackingPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <BenefitsHero />
      <WhoWeAreNumbers />
      <BenefitsIndex />
      <BenefitsClosing />
      <SoftwareCTA />
      <Footer />

      {/* ItemList structured data. The page IS a list of eleven named benefits,
          so describing it as one is the honest markup — and it is what lets the
          entries surface individually in search rather than only as a page. It is
          generated from the same array the page renders, so the two cannot drift. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Benefits of GPS Tracking',
            itemListOrder: 'https://schema.org/ItemListUnordered',
            numberOfItems: BENEFITS.length,
            itemListElement: BENEFITS.map((b, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: b.title,
              description: b.desc,
            })),
          }),
        }}
      />
    </main>
  )
}
