import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import AsateelHero from '@/components/regulatory/asateel/AsateelHero'
import AsateelExplainer from '@/components/regulatory/asateel/AsateelExplainer'
import AsateelSteps from '@/components/regulatory/asateel/AsateelSteps'
import AsateelInstallation from '@/components/regulatory/asateel/AsateelInstallation'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import AsateelHireUsNow from '@/components/regulatory/asateel/AsateelHireUsNow'
import AsateelVideo from '@/components/regulatory/asateel/AsateelVideo'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'ASATEEL Certified OBU Installation Abu Dhabi | LOCATOR' },
  description:
    'ASATEEL certified OBU installation for Abu Dhabi freight, passenger and school bus fleets. LOCATOR supplies, installs and certifies so you can get your permit.',
  alternates: { canonical: '/asateel-certified-obu' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'ASATEEL Certified OBU Installation Abu Dhabi | LOCATOR',
    description:
      'ASATEEL certified OBU installation for Abu Dhabi freight, passenger and school bus fleets. LOCATOR supplies, installs and certifies so you can get your permit.',
    url: '/asateel-certified-obu',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'ASATEEL Certified OBU Installation Abu Dhabi | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASATEEL Certified OBU Installation Abu Dhabi | LOCATOR',
    description:
      'ASATEEL certified OBU installation for Abu Dhabi freight, passenger and school bus fleets. LOCATOR supplies, installs and certifies so you can get your permit.',
    images: [siteConfig.ogImage],
  },
}

export default function AsateelCertifiedObuPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <AsateelHero />
      <AsateelExplainer />
      <AsateelSteps />
      <AsateelInstallation />
      <ServiceWhyChoose />
      <WhoWeAreNumbers />
      <AsateelHireUsNow />
      <AsateelVideo />
      <RegulatoryBlogFeed tag="ASATEEL Compliance" />
      <Footer />
    </main>
  )
}
