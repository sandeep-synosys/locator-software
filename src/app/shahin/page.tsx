import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import ShahinHero from '@/components/regulatory/shahin/ShahinHero'
import ShahinExplainer from '@/components/regulatory/shahin/ShahinExplainer'
import ShahinCrossSell from '@/components/regulatory/shahin/ShahinCrossSell'
import ShahinSteps from '@/components/regulatory/shahin/ShahinSteps'
import ShahinFAQ from '@/components/regulatory/shahin/ShahinFAQ'
import ShahinConclusion from '@/components/regulatory/shahin/ShahinConclusion'
import ShahinVideo from '@/components/regulatory/shahin/ShahinVideo'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'SHAHIN Registration Dubai – Cargo Truck GPS | LOCATOR' },
  description:
    'SHAHIN registration for Dubai cargo trucks, handled end to end. LOCATOR supplies and installs the approved GPS device and guides your fleet through the portal.',
  alternates: { canonical: '/shahin' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'SHAHIN Registration Dubai – Cargo Truck GPS | LOCATOR',
    description:
      'SHAHIN registration for Dubai cargo trucks, handled end to end. LOCATOR supplies and installs the approved GPS device and guides your fleet through the portal.',
    url: '/shahin',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'SHAHIN Registration Dubai – Cargo Truck GPS | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHAHIN Registration Dubai – Cargo Truck GPS | LOCATOR',
    description:
      'SHAHIN registration for Dubai cargo trucks, handled end to end. LOCATOR supplies and installs the approved GPS device and guides your fleet through the portal.',
    images: [siteConfig.ogImage],
  },
}

export default function ShahinPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <ShahinHero />
      <ShahinExplainer />
      <ShahinCrossSell />
      <ShahinSteps />
      <ShahinFAQ />
      <ShahinConclusion />
      <ShahinVideo />
      <RegulatoryBlogFeed tag={['Fleet Management', 'Fleet Tracking']} />
      <Footer />
    </main>
  )
}
