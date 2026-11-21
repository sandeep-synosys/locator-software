import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import dynamic from 'next/dynamic'
import ScrollReveal from '@/components/software/ScrollReveal'
import VehicleTrackingHero from '@/components/vehicle-tracking/VehicleTrackingHero'
import VehicleTrackingFeatures from '@/components/vehicle-tracking/VehicleTrackingFeatures'
import VehicleTrackingWhy from '@/components/vehicle-tracking/VehicleTrackingWhy'
import TrackingVoices from '@/components/tracking/TrackingVoices'
import VehicleTrackingBenefits from '@/components/vehicle-tracking/VehicleTrackingBenefits'
import ServiceVideo from '@/components/service/ServiceVideo'
import TrackingUseCases from '@/components/tracking/TrackingUseCases'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
// import { FEATURES, WHY_POINTS, BENEFIT_POINTS } from '@/components/vehicle-tracking/data'
// import { VOICES } from '@/components/tracking/data'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

// Below-the-fold and self-contained, so its client JS goes in its own chunk.
// SSR stays on — the HTML is still server-rendered, so there is no pop-in.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Vehicle Tracking System UAE – Live Fleet Tracking | LOCATOR' },
  description:
    'LOCATOR’s vehicle tracking system shows every fleet vehicle live, with fuel monitoring, speeding and idling alerts, and setup within 48 hours across the UAE.',
  keywords: [
    'Vehicle tracking system UAE',
    'GPS vehicle tracking',
    'Live GPS tracking',
    'Vehicle tracking Dubai',
    'GPS fleet monitoring',
  ],
  alternates: { canonical: '/service/vehicle-tracking-system' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Vehicle Tracking System UAE – Live Fleet Tracking | LOCATOR',
    description:
      'LOCATOR’s vehicle tracking system shows every fleet vehicle live, with fuel monitoring, speeding and idling alerts, and setup within 48 hours across the UAE.',
    url: '/service/vehicle-tracking-system',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Vehicle Tracking System UAE – Live Fleet Tracking | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vehicle Tracking System UAE – Live Fleet Tracking | LOCATOR',
    description:
      'LOCATOR’s vehicle tracking system shows every fleet vehicle live, with fuel monitoring, speeding and idling alerts, and setup within 48 hours across the UAE.',
    images: [siteConfig.ogImage],
  },
}

export default function VehicleTrackingSystemPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <VehicleTrackingHero />
      <VehicleTrackingFeatures />
      <WhoWeAreNumbers />
      <VehicleTrackingWhy />
      <TrackingVoices />
      <VehicleTrackingBenefits />
      <ServiceVideo
        eyebrow=""
        title="All Your Vehicles, Assets & Staff on One Platform"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <TrackingUseCases />
      <SoftwareBlog tag={['GPS Tracking', 'Vehicle Maintenance']} />
      <ServiceFAQ />
      <SoftwareCTA />
      <Footer />

      {/* Product + reviews structured data, generated from the same arrays the
          page renders so the two cannot drift. aggregateRating is deliberately
          absent — we hold no rating figures, and inventing one is the dishonest
          part of this markup. */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'LOCATOR Vehicle Tracking System',
            description:
              'GPS vehicle tracking system for UAE fleets — real-time location, fuel management, customisable alerts and accurate reporting.',
            brand: { '@type': 'Brand', name: 'LOCATOR' },
            category: 'Vehicle Tracking System',
            areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
            additionalProperty: [
              ...FEATURES.map(f => ({ '@type': 'PropertyValue', name: f.title, value: f.desc })),
              ...BENEFIT_POINTS.map(b => ({ '@type': 'PropertyValue', name: b.title, value: b.desc })),
              ...WHY_POINTS.map(w => ({ '@type': 'PropertyValue', name: 'Why Locator', value: w })),
            ],
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
