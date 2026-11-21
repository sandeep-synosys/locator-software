import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import dynamic from 'next/dynamic'
import ScrollReveal from '@/components/software/ScrollReveal'
import CarTrackingHero from '@/components/car-tracking/CarTrackingHero'
import CarTrackingOffering from '@/components/car-tracking/CarTrackingOffering'
import CarTrackingBenefits from '@/components/car-tracking/CarTrackingBenefits'
import CarTrackingWhyChoose from '@/components/car-tracking/CarTrackingWhyChoose'
import TrackingVoices from '@/components/tracking/TrackingVoices'
import ServiceVideo from '@/components/service/ServiceVideo'
import TrackingUseCases from '@/components/tracking/TrackingUseCases'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
// import { CAPABILITIES, REASONS } from '@/components/car-tracking/data'
// import { VOICES } from '@/components/tracking/data'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

// Below-the-fold and self-contained, so its client JS goes in its own chunk.
// SSR stays on — the HTML is still server-rendered, so there is no pop-in.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Car Tracking System Dubai & UAE for Businesses | LOCATOR' },
  description:
    'A car tracking system for UAE businesses: see every company car on one live map, control fuel costs with driver data and get automated reports. 24/7 support.',
  alternates: { canonical: '/service/car-tracking-system' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Car Tracking System Dubai & UAE for Businesses | LOCATOR',
    description:
      'A car tracking system for UAE businesses: see every company car on one live map, control fuel costs with driver data and get automated reports. 24/7 support.',
    url: '/service/car-tracking-system',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Car Tracking System Dubai & UAE for Businesses | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Tracking System Dubai & UAE for Businesses | LOCATOR',
    description:
      'A car tracking system for UAE businesses: see every company car on one live map, control fuel costs with driver data and get automated reports. 24/7 support.',
    images: [siteConfig.ogImage],
  },
}

export default function CarTrackingSystemPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <CarTrackingHero />
      <CarTrackingOffering />
      <CarTrackingBenefits />
      <WhoWeAreNumbers />
      <CarTrackingWhyChoose />
      <TrackingVoices />
      <ServiceVideo
        eyebrow=""
        title="All Your Vehicles, Assets & Staff on One Platform"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <TrackingUseCases />
      <SoftwareBlog tag="Car Tracking" />
      <ServiceFAQ />
      <SoftwareCTA />
      <Footer />

      {/* Product + reviews structured data, generated from the same arrays the
          page renders so the two cannot drift. The quotes are real customer
          attributions, which is what makes Review markup honest here — the
          aggregate rating is deliberately omitted, since we hold no rating
          figures and inventing one would be the dishonest part. */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'LOCATOR Car Tracking System',
            description:
              'GPS car tracking system for UAE businesses — real-time fleet visibility, fuel and cost reduction, and automated reporting.',
            brand: { '@type': 'Brand', name: 'LOCATOR' },
            category: 'Vehicle Tracking System',
            areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
            additionalProperty: [...CAPABILITIES, ...REASONS].map(f => ({
              '@type': 'PropertyValue',
              name: f.title,
              value: f.desc,
            })),
            review: VOICES.map(v => ({
              '@type': 'Review',
              reviewBody: v.quote,
              author: { '@type': 'Organization', name: v.company },
            })),
          }),
        }}
      /> */}
    </main>
  )
}
