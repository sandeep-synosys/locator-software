import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import QuoteHero from '@/components/quote/QuoteHero'
import QuoteForm from '@/components/quote/QuoteForm'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Free GPS Tracking Quote UAE – Fleet & Vehicles | LOCATOR' },
  description:
    'Request a free, no-obligation GPS tracking quote for your UAE fleet. Tell us your vehicle count and LOCATOR will plan a demo and on-site installation.',
  alternates: { canonical: '/get-a-quote' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Free GPS Tracking Quote UAE – Fleet & Vehicles | LOCATOR',
    description:
      'Request a free, no-obligation GPS tracking quote for your UAE fleet. Tell us your vehicle count and LOCATOR will plan a demo and on-site installation.',
    url: '/get-a-quote',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Free GPS Tracking Quote UAE – Fleet & Vehicles | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free GPS Tracking Quote UAE – Fleet & Vehicles | LOCATOR',
    description:
      'Request a free, no-obligation GPS tracking quote for your UAE fleet. Tell us your vehicle count and LOCATOR will plan a demo and on-site installation.',
    images: [siteConfig.ogImage],
  },
}

export default function GetAQuotePage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <QuoteHero />
      <QuoteForm />
      <Footer />
    </main>
  )
}
