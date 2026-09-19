import type { Metadata } from 'next'
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
  title: 'GPS Tracker — Service',
  description:
    'The complete GPS tracker device for vehicles and fleets in the UAE — certified Teltonika hardware, professional installation, and real-time reporting on the LOCATOR platform.',
  alternates: { canonical: '/service/gps-tracker' },
  openGraph: {
    title: 'GPS Tracker | Locator',
    description:
      'Certified GPS tracker devices, installed and monitored by Locator across the UAE.',
    url: '/service/gps-tracker',
    type: 'website',
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
        title="All your Vehicles, Assets & Staffs on One Software"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <DeviceCarousel />
      <SoftwareBlog tag="GPS Tracking" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
