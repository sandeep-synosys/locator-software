import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import CarGpsHero from '@/components/service/car-gps-tracker/CarGpsHero'
import CarGpsOffers from '@/components/service/car-gps-tracker/CarGpsOffers'
import CarGpsAbout from '@/components/service/car-gps-tracker/CarGpsAbout'
import TestimonialCarousel from '@/components/TestimonialCarousel/TestimonialCarousel'
import { TESTIMONIAL_DATA } from '@/components/TestimonialCarousel/testimonial-data'
import ServiceVideo from '@/components/service/ServiceVideo'
import ServiceUseCases from '@/components/service/ServiceUseCases'
import DeviceCarousel from '@/components/service/tracking-devices/DeviceCarousel'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Car GPS Tracker UAE – Fuel, Location & Alerts | LOCATOR' },
  description:
    'Car GPS tracker for UAE fleets with fuel management, real-time location and custom alerts. Installed by LOCATOR’s own engineers, with setup within 48 hours.',
  alternates: { canonical: '/service/car-gps-tracker' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Car GPS Tracker UAE – Fuel, Location & Alerts | LOCATOR',
    description:
      'Car GPS tracker for UAE fleets with fuel management, real-time location and custom alerts. Installed by LOCATOR’s own engineers, with setup within 48 hours.',
    url: '/service/car-gps-tracker',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Car GPS Tracker UAE – Fuel, Location & Alerts | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car GPS Tracker UAE – Fuel, Location & Alerts | LOCATOR',
    description:
      'Car GPS tracker for UAE fleets with fuel management, real-time location and custom alerts. Installed by LOCATOR’s own engineers, with setup within 48 hours.',
    images: [siteConfig.ogImage],
  },
}

export default function CarGpsTrackerPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <CarGpsHero />
      <CarGpsOffers />
      <WhoWeAreNumbers />
      <CarGpsAbout />
      <TestimonialCarousel
        testimonials={TESTIMONIAL_DATA}
        heading="What Our Clients Say"
        subheading="Real feedback from UAE businesses using the LOCATOR car GPS tracker for vehicles and fleets."
      />
      <ServiceVideo
        eyebrow=""
        title="All Your Vehicles, Assets & Staff on One Platform"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <ServiceUseCases />
      <DeviceCarousel title="Compatible Tracking Hardware" deviceHeadings={false} />
      <SoftwareBlog tag="Car Tracking" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
