import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import GpsTrackerHero from '@/components/service/gps-tracker/GpsTrackerHero'
import GpsTrackerData from '@/components/service/gps-tracker/GpsTrackerData'
import GpsTrackerWhy from '@/components/service/gps-tracker/GpsTrackerWhy'
import TestimonialCarousel from '@/components/TestimonialCarousel/TestimonialCarousel'
import { TESTIMONIAL_DATA } from '@/components/TestimonialCarousel/testimonial-data'
import ServiceAppScreens from '@/components/service/ServiceAppScreens'
import ServiceUseCases from '@/components/service/ServiceUseCases'
import ServiceVideo from '@/components/service/ServiceVideo'
import DeviceCarousel from '@/components/service/tracking-devices/DeviceCarousel'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'GPS Tracker UAE – Teltonika Device for Fleets | LOCATOR' },
  description:
    'GPS tracker for vehicles and fleets in the UAE: certified Teltonika hardware, professional installation and live reporting on the LOCATOR platform. Free quote.',
  alternates: { canonical: '/service/gps-tracker' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'GPS Tracker UAE – Teltonika Device for Fleets | LOCATOR',
    description:
      'GPS tracker for vehicles and fleets in the UAE: certified Teltonika hardware, professional installation and live reporting on the LOCATOR platform. Free quote.',
    url: '/service/gps-tracker',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'GPS Tracker UAE – Teltonika Device for Fleets | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPS Tracker UAE – Teltonika Device for Fleets | LOCATOR',
    description:
      'GPS tracker for vehicles and fleets in the UAE: certified Teltonika hardware, professional installation and live reporting on the LOCATOR platform. Free quote.',
    images: [siteConfig.ogImage],
  },
}

export default function GpsTrackerPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <GpsTrackerHero />
      <GpsTrackerData />
      <WhoWeAreNumbers />
      <GpsTrackerWhy />
      <TestimonialCarousel
        testimonials={TESTIMONIAL_DATA}
        heading="What Our Clients Say"
        subheading="Real feedback from UAE businesses using the LOCATOR GPS tracker for vehicles, fleets, and assets."
      />
      <ServiceAppScreens
        lead="Real screens from the LOCATOR mobile app — secure login, the live vehicle view with full trip detail, and every tracked asset pinned on one map."
        screens={[
          { src: '/services/gps-tracker/home-page.png', alt: 'LOCATOR app login screen', w: 592, h: 1024 },
          { src: '/services/gps-tracker/live.png', alt: 'LOCATOR app live view showing vehicle status, driver, and location detail', w: 592, h: 1024 },
          { src: '/services/gps-tracker/poi.png', alt: 'LOCATOR app map view with all tracked vehicles and points of interest', w: 592, h: 1024 },
        ]}
      />
      <ServiceUseCases />
      <ServiceVideo
        eyebrow=""
        title="All Your Vehicles, Assets & Staff on One Platform"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <DeviceCarousel title="Compatible Tracking Hardware" deviceHeadings={false} />
      <SoftwareBlog tag="GPS Tracking" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
