import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import CarTrackerHero from '@/components/service/car-tracker/CarTrackerHero'
import LogoMarquee from '@/components/Logomarquee'
import CarTrackerStats from '@/components/service/car-tracker/CarTrackerStats'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import CarTrackerFeatures from '@/components/service/car-tracker/CarTrackerFeatures'
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
  title: { absolute: 'Car Tracker App UAE – Live Tracking & Alerts | LOCATOR' },
  description:
    'LOCATOR’s car tracker app shows every vehicle live, sends instant and after-hours alerts, replays routes and reminds you when service is due. Setup in 48 hours.',
  alternates: { canonical: '/service/car-tracker' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Car Tracker App UAE – Live Tracking & Alerts | LOCATOR',
    description:
      'LOCATOR’s car tracker app shows every vehicle live, sends instant and after-hours alerts, replays routes and reminds you when service is due. Setup in 48 hours.',
    url: '/service/car-tracker',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Car Tracker App UAE – Live Tracking & Alerts | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Tracker App UAE – Live Tracking & Alerts | LOCATOR',
    description:
      'LOCATOR’s car tracker app shows every vehicle live, sends instant and after-hours alerts, replays routes and reminds you when service is due. Setup in 48 hours.',
    images: [siteConfig.ogImage],
  },
}

export default function CarTrackerPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <CarTrackerHero />
      <LogoMarquee />
      <WhoWeAreNumbers />
      <CarTrackerStats />
      <ServiceWhyChoose />
      <CarTrackerFeatures />
      <TestimonialCarousel
        testimonials={TESTIMONIAL_DATA}
        heading="What Our Clients Say"
        subheading="Real feedback from UAE businesses using the LOCATOR car tracker app for vehicles, fleets, and drivers."
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
