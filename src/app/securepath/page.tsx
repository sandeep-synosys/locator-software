import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import SecurepathHero from '@/components/regulatory/securepath/SecurepathHero'
import SecurepathExplainer from '@/components/regulatory/securepath/SecurepathExplainer'
import SecurepathBenefits from '@/components/regulatory/securepath/SecurepathBenefits'
import SecurepathProcess from '@/components/regulatory/securepath/SecurepathProcess'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import SecurepathFAQ from '@/components/regulatory/securepath/SecurepathFAQ'
import SecurepathConclusion from '@/components/regulatory/securepath/SecurepathConclusion'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'SecurePath GPS Tracking for Rent a Car Dubai | LOCATOR' },
  description:
    'SecurePath GPS tracking for Dubai rent a car companies. LOCATOR installs the approved tracker with data SIM and issues the Certificate of Installation for RTA.',
  alternates: { canonical: '/securepath' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'SecurePath GPS Tracking for Rent a Car Dubai | LOCATOR',
    description:
      'SecurePath GPS tracking for Dubai rent a car companies. LOCATOR installs the approved tracker with data SIM and issues the Certificate of Installation for RTA.',
    url: '/securepath',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'SecurePath GPS Tracking for Rent a Car Dubai | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecurePath GPS Tracking for Rent a Car Dubai | LOCATOR',
    description:
      'SecurePath GPS tracking for Dubai rent a car companies. LOCATOR installs the approved tracker with data SIM and issues the Certificate of Installation for RTA.',
    images: [siteConfig.ogImage],
  },
}

export default function SecurepathPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SecurepathHero />
      <SecurepathExplainer />
      <SecurepathBenefits />
      <SecurepathProcess />
      <ServiceWhyChoose />
      <WhoWeAreNumbers />
      <SecurepathFAQ />
      <SecurepathConclusion />
      <RegulatoryBlogFeed tag={['GPS Tracking', 'Fleet Management']} />
      <Footer />
    </main>
  )
}
