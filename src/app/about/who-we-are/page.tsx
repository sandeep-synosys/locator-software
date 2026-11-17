import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import WhoWeAreHero from '@/components/about/who-we-are/WhoWeAreHero'
import WhoWeArePurpose from '@/components/about/who-we-are/WhoWeArePurpose'
import WhoWeAreRoots from '@/components/about/who-we-are/WhoWeAreRoots'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import WhoWeAreJourney from '@/components/about/who-we-are/WhoWeAreJourney'
import WhoWeAreServices from '@/components/about/who-we-are/WhoWeAreServices'
// import ServiceIndustries from '@/components/service/ServiceIndustries' // GPS Fleet Services — disabled
// import WhoWeAreTechnology from '@/components/about/who-we-are/WhoWeAreTechnology' // Technology & Innovation — disabled
// import WhoWeAreWhyChoose from '@/components/about/who-we-are/WhoWeAreWhyChoose' // Why Businesses Choose LOCATOR — disabled
// import WhoWeAreVideo from '@/components/about/who-we-are/WhoWeAreVideo' // video section — disabled
import WhoWeAreFAQ from '@/components/about/who-we-are/WhoWeAreFAQ'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already ends with the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'About LOCATOR | GPS Tracking Company in the UAE Since 2009' },
  description:
    'LOCATOR is a GPS tracking and fleet telematics company in the UAE. Established in 2009 and part of Synosys, serving businesses from Dubai and Abu Dhabi.',
  alternates: { canonical: '/about/who-we-are' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'About LOCATOR | GPS Tracking Company in the UAE Since 2009',
    description:
      'LOCATOR is a GPS tracking and fleet telematics company in the UAE. Established in 2009 and part of Synosys, serving businesses from Dubai and Abu Dhabi.',
    url: '/about/who-we-are',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'About LOCATOR | GPS Tracking Company in the UAE Since 2009' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About LOCATOR | GPS Tracking Company in the UAE Since 2009',
    description:
      'LOCATOR is a GPS tracking and fleet telematics company in the UAE. Established in 2009 and part of Synosys, serving businesses from Dubai and Abu Dhabi.',
    images: [siteConfig.ogImage],
  },
}

export default function WhoWeArePage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <WhoWeAreHero />
      <WhoWeAreRoots />
      <WhoWeArePurpose />
      <WhoWeAreNumbers />
      <WhoWeAreJourney />
      <WhoWeAreServices />
      {/* <ServiceIndustries /> */}
      {/* <WhoWeAreTechnology /> */}
      {/* <WhoWeAreWhyChoose /> */}
      {/* <WhoWeAreVideo /> */}
      <WhoWeAreFAQ />
      <AboutPillarNav current="who-we-are" />
      <SoftwareBlog /> {/* No single topic — About page shows the most recent posts overall */}
      <Footer />
    </main>
  )
}
