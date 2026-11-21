import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import TrackingDevicesHero from '@/components/service/tracking-devices/TrackingDevicesHero'
import DeviceCarousel from '@/components/service/tracking-devices/DeviceCarousel'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'GPS Tracking Devices & Accessories UAE | LOCATOR' },
  description:
    'GPS tracking devices, iButton and RFID driver ID, temperature sensors and CAN adapters, supplied, installed and configured by LOCATOR’s own engineers.',
  alternates: { canonical: '/service/tracking-devices' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'GPS Tracking Devices & Accessories UAE | LOCATOR',
    description:
      'GPS tracking devices, iButton and RFID driver ID, temperature sensors and CAN adapters, supplied, installed and configured by LOCATOR’s own engineers.',
    url: '/service/tracking-devices',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'GPS Tracking Devices & Accessories UAE | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPS Tracking Devices & Accessories UAE | LOCATOR',
    description:
      'GPS tracking devices, iButton and RFID driver ID, temperature sensors and CAN adapters, supplied, installed and configured by LOCATOR’s own engineers.',
    images: [siteConfig.ogImage],
  },
}

export default function TrackingDevicesPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <TrackingDevicesHero />
      <DeviceCarousel title="GPS Trackers, Driver ID Readers and Sensors" />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
