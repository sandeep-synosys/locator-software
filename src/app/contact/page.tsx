import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import ContactHero from '@/components/contact/ContactHero'
import ContactOffices from '@/components/contact/ContactOffices'
import ContactChannels from '@/components/contact/ContactChannels'
import ContactSocial from '@/components/contact/ContactSocial'
import ContactForm from '@/components/contact/ContactForm'
import ContactPresence from '@/components/contact/ContactPresence'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Contact LOCATOR | GPS Tracking in Dubai & Abu Dhabi' },
  description:
    'Contact LOCATOR for GPS tracking sales, support or certification. Visit us in Dubai or Abu Dhabi, call, WhatsApp or email. We reply within one working day.',
  alternates: { canonical: '/contact' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Contact LOCATOR | GPS Tracking in Dubai & Abu Dhabi',
    description:
      'Contact LOCATOR for GPS tracking sales, support or certification. Visit us in Dubai or Abu Dhabi, call, WhatsApp or email. We reply within one working day.',
    url: '/contact',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Contact LOCATOR | GPS Tracking in Dubai & Abu Dhabi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact LOCATOR | GPS Tracking in Dubai & Abu Dhabi',
    description:
      'Contact LOCATOR for GPS tracking sales, support or certification. Visit us in Dubai or Abu Dhabi, call, WhatsApp or email. We reply within one working day.',
    images: [siteConfig.ogImage],
  },
}

export default function ContactPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <ScrollReveal />
      <ContactHero />
      <ContactOffices />
      <ContactForm />
      <ContactPresence />
      <ContactChannels />
      <ContactSocial />
      <Footer />
    </main>
  )
}
