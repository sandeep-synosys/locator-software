import type { Metadata } from 'next'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import ScrollReveal from '@/components/software/ScrollReveal'
import ServiceFAQ from '@/components/service/ServiceFAQ'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — GPS Tracking & Fleet Telematics UAE',
  description:
    'Find answers about LOCATOR GPS installation, fleet tracking, the platform and mobile app, support, plans, and coverage across the UAE.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | Locator',
    description:
      'Answers to common questions about LOCATOR GPS tracking, installation, platform features, support, and coverage.',
    url: '/faq',
    type: 'website',
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
            How can we help?
          </h1>
          <p style={{ margin: '18px auto 0', maxWidth: '52ch', fontSize: 'clamp(14px,1.5vw,18px)', lineHeight: 1.65, color: '#6e6e73' }}>
            Explore answers about GPS installation, our platform, support, and coverage.
          </p>
        </div>
      </section>
      <ServiceFAQ />
      <Footer />
    </main>
  )
}
