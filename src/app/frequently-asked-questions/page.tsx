import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import ScrollReveal from '@/components/software/ScrollReveal'
import ServiceFAQ from '@/components/service/ServiceFAQ'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'GPS Tracking FAQs – Installation, App & Support | LOCATOR' },
  description:
    'GPS tracking FAQs answered: how long installation takes, which vehicles we track, contract terms, training, support and coverage across all UAE emirates.',
  alternates: { canonical: '/frequently-asked-questions' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'GPS Tracking FAQs – Installation, App & Support | LOCATOR',
    description:
      'GPS tracking FAQs answered: how long installation takes, which vehicles we track, contract terms, training, support and coverage across all UAE emirates.',
    url: '/frequently-asked-questions',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'GPS Tracking FAQs – Installation, App & Support | LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPS Tracking FAQs – Installation, App & Support | LOCATOR',
    description:
      'GPS tracking FAQs answered: how long installation takes, which vehicles we track, contract terms, training, support and coverage across all UAE emirates.',
    images: [siteConfig.ogImage],
  },
}

export default function FAQPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh', overflowX: 'clip' }}>
      <ScrollReveal />
      <SoftwareNavbar />
      <section
        aria-labelledby="faq-page-title"
        style={{ padding: 'clamp(48px,7vw,88px) 28px', background: 'linear-gradient(135deg, #eef4ff, #f7fcff)' }}
      >
        <div style={{ maxWidth: 'var(--w-1120)', margin: '0 auto', textAlign: 'center' }}>
          <h1 id="faq-page-title" style={{ margin: 0, fontSize: 'clamp(30px,4vw,52px)', fontWeight: 800, lineHeight: 1.15, color: '#1d1d1f' }}>
            GPS Tracking FAQs: How Can We Help?
          </h1>
          <p style={{ margin: '18px auto 0', maxWidth: '52ch', fontSize: 'clamp(14px,1.5vw,18px)', lineHeight: 1.65, color: '#6e6e73' }}>
            Explore answers about GPS installation, our platform, support, and coverage.
          </p>
        </div>
      </section>
      <ServiceFAQ title="Installation, Platform, Support and Coverage Questions" />
      <Footer />
    </main>
  )
}
