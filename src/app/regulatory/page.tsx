import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import RegulatoryHeader from '@/components/regulatory/RegulatoryHeader'
import RegulatoryGrid from '@/components/regulatory/RegulatoryGrid'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Regulatory GPS Certification in Dubai & Abu Dhabi | LOCATOR' },
  description:
    'Regulatory GPS certification for Dubai cargo trucks, Abu Dhabi commercial transport and rent a car fleets. LOCATOR supplies, installs and certifies your GPS.',
  alternates: { canonical: '/regulatory' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Regulatory GPS Certification in Dubai & Abu Dhabi | LOCATOR',
    description:
      'Regulatory GPS certification for Dubai cargo trucks, Abu Dhabi commercial transport and rent a car fleets. LOCATOR supplies, installs and certifies your GPS.',
    url: '/regulatory',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Regulatory GPS Certification in Dubai & Abu Dhabi | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regulatory GPS Certification in Dubai & Abu Dhabi | LOCATOR',
    description:
      'Regulatory GPS certification for Dubai cargo trucks, Abu Dhabi commercial transport and rent a car fleets. LOCATOR supplies, installs and certifies your GPS.',
    images: [siteConfig.ogImage],
  },
}

export default function RegulatoryPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <RegulatoryHeader
        eyebrow="Regulatory Compliance"
        title="Regulatory GPS Certifications in the UAE"
        subtitle="Certified GPS tracking solutions built to meet UAE fleet regulatory requirements — choose the certification that matches your fleet."
      >
        <RegulatoryGrid />
      </RegulatoryHeader>
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
