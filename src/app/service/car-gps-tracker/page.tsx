import type { Metadata } from 'next'
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
  title: 'Car GPS Tracker — Service',
  description:
    'The best car GPS tracker for maximum visibility — fuel management, real-time location, and customizable alerts for every vehicle in your fleet across the UAE.',
  alternates: { canonical: '/service/car-gps-tracker' },
  openGraph: {
    title: 'Car GPS Tracker | Locator',
    description:
      'A perfect solution to monitor your vehicles — live location, fuel management, and smart alerts from LOCATOR.',
    url: '/service/car-gps-tracker',
    type: 'website',
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
        title="All your Vehicles, Assets & Staffs on One Software"
        titleColor="#1360ee"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
        headingMaxWidth="760px"
      />
      <ServiceUseCases />
      <DeviceCarousel />
      <SoftwareBlog tag="Car Tracking" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
