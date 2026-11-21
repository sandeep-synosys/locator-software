import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import GpsTrackingHero from '@/components/service/gps-tracking-system/GpsTrackingHero'
import LogoMarquee from '@/components/Logomarquee'
import TestimonialCarousel from '@/components/TestimonialCarousel/TestimonialCarousel'
import { TESTIMONIAL_DATA } from '@/components/TestimonialCarousel/testimonial-data'
import GpsTrackingLaptop from '@/components/service/gps-tracking-system/GpsTrackingLaptop'
import GpsTrackingWhy from '@/components/service/gps-tracking-system/GpsTrackingWhy'
import ServiceAppScreens from '@/components/service/ServiceAppScreens'
import ServiceVideo from '@/components/service/ServiceVideo'
import ServiceUseCases from '@/components/service/ServiceUseCases'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'GPS Tracking System UAE – Software & Live Alerts | LOCATOR' },
  description:
    'LOCATOR’s GPS tracking system gives UAE businesses live tracking, a year of route playback, geofencing, idle alerts and scheduled reports on web and mobile.',
  keywords: [
    'GPS tracking system UAE',
    'GPS vehicle tracking',
    'GPS tracking Dubai',
    'Vehicle GPS tracker',
    'GPS tracking software UAE',
  ],
  alternates: { canonical: '/service/gps-tracking-system' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'GPS Tracking System UAE – Software & Live Alerts | LOCATOR',
    description:
      'LOCATOR’s GPS tracking system gives UAE businesses live tracking, a year of route playback, geofencing, idle alerts and scheduled reports on web and mobile.',
    url: '/service/gps-tracking-system',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'GPS Tracking System UAE – Software & Live Alerts | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPS Tracking System UAE – Software & Live Alerts | LOCATOR',
    description:
      'LOCATOR’s GPS tracking system gives UAE businesses live tracking, a year of route playback, geofencing, idle alerts and scheduled reports on web and mobile.',
    images: [siteConfig.ogImage],
  },
}

export default function GpsTrackingSystemPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <GpsTrackingHero />
      <LogoMarquee />
      <TestimonialCarousel
        testimonials={TESTIMONIAL_DATA}
        heading="What Our Clients Say"
        subheading="Real feedback from UAE businesses using the LOCATOR GPS tracking system for vehicles and fleets."
      />
      <GpsTrackingLaptop />
      <WhoWeAreNumbers />
      <GpsTrackingWhy />
      <ServiceAppScreens
        eyebrow="The App In Action"
        heading="See Our GPS Tracking System in Action"
        lead="From these screenshots, you can see that LOCATOR is highly customizable. It has been developed to meet the varying needs of individuals and businesses."
        screens={[
          { src: '/services/gps-tracking-system/home-page.png', alt: 'LOCATOR app login screen', w: 592, h: 1024 },
          { src: '/services/gps-tracking-system/poi.png', alt: 'LOCATOR app map view with every tracked vehicle and point of interest', w: 592, h: 1024 },
          { src: '/services/gps-tracking-system/detailed-report.png', alt: 'LOCATOR app detailed report — trips, parking, and idling with durations and distances', w: 592, h: 1024 },
          { src: '/services/gps-tracking-system/idling-alert.png', alt: 'LOCATOR app idling alert pinned to the vehicle location on the map', w: 592, h: 1024 },
        ]}
      />
      <ServiceVideo
        eyebrow=""
        title="All Your Vehicles, Assets & Staff on One Platform"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <ServiceUseCases />
      <SoftwareBlog tag="GPS Tracking" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
