import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import SecurepathPremiumHero from '@/components/regulatory/securepath-premium/SecurepathPremiumHero'
import SecurepathPremiumExplainer from '@/components/regulatory/securepath-premium/SecurepathPremiumExplainer'
import SecurepathPremiumImportance from '@/components/regulatory/securepath-premium/SecurepathPremiumImportance'
import SecurepathPremiumVehicleList from '@/components/regulatory/securepath-premium/SecurepathPremiumVehicleList'
import SecurepathPremiumCertification from '@/components/regulatory/securepath-premium/SecurepathPremiumCertification'
import SecurepathPremiumDevice from '@/components/regulatory/securepath-premium/SecurepathPremiumDevice'
import SecurepathPremiumFAQ from '@/components/regulatory/securepath-premium/SecurepathPremiumFAQ'
import SecurepathPremiumConclusion from '@/components/regulatory/securepath-premium/SecurepathPremiumConclusion'
import SecurepathPremiumVideo from '@/components/regulatory/securepath-premium/SecurepathPremiumVideo'
import RegulatoryBlogFeed from '@/components/regulatory/RegulatoryBlogFeed'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'SecurePath Premium Certification Dubai | LOCATOR' },
  description:
    'Run cash-in-transit, desert safari or hazardous material vehicles in Dubai? SecurePath Premium GPS is mandatory. LOCATOR installs and certifies it end to end.',
  alternates: { canonical: '/securepath-premium' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'SecurePath Premium Certification Dubai | LOCATOR',
    description:
      'Run cash-in-transit, desert safari or hazardous material vehicles in Dubai? SecurePath Premium GPS is mandatory. LOCATOR installs and certifies it end to end.',
    url: '/securepath-premium',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'SecurePath Premium Certification Dubai | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecurePath Premium Certification Dubai | LOCATOR',
    description:
      'Run cash-in-transit, desert safari or hazardous material vehicles in Dubai? SecurePath Premium GPS is mandatory. LOCATOR installs and certifies it end to end.',
    images: [siteConfig.ogImage],
  },
}

export default function SecurepathPremiumPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SecurepathPremiumHero />
      <SecurepathPremiumExplainer />
      <SecurepathPremiumImportance />
      <SecurepathPremiumVehicleList />
      <SecurepathPremiumCertification />
      <SecurepathPremiumDevice />
      <SecurepathPremiumFAQ />
      <SecurepathPremiumConclusion />
      <SecurepathPremiumVideo />
      <RegulatoryBlogFeed tag={['GPS Tracking', 'Car Tracking']} />
      <Footer />
    </main>
  )
}
