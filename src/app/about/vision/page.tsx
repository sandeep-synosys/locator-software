import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import ScrollReveal from '@/components/software/ScrollReveal'
import VisionHero from '@/components/about/VisionHero'
import VisionRoadmap from '@/components/about/VisionRoadmap'
import AboutPillarNav from '@/components/about/AboutPillarNav'
// import SoftwareCTA from '@/components/software/SoftwareCTA' // Get Started Today — disabled
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  // Absolute: the brief's title already ends with the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'LOCATOR Vision | Connected Mobility & IoT in the UAE' },
  description:
    'Explore LOCATOR’s vision for connected mobility and IoT innovation, from the UAE to the GCC and beyond. Our 2035 ambition: one million connected devices.',
  alternates: { canonical: '/about/vision' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'LOCATOR Vision | Connected Mobility & IoT in the UAE',
    description:
      'Explore LOCATOR’s vision for connected mobility and IoT innovation, from the UAE to the GCC and beyond. Our 2035 ambition: one million connected devices.',
    url: '/about/vision',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'LOCATOR Vision | Connected Mobility & IoT in the UAE' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOCATOR Vision | Connected Mobility & IoT in the UAE',
    description:
      'Explore LOCATOR’s vision for connected mobility and IoT innovation, from the UAE to the GCC and beyond. Our 2035 ambition: one million connected devices.',
    images: [siteConfig.ogImage],
  },
}

export default function AboutVisionPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <VisionHero />

      {/* Vision intro — matches WhoWeArePurpose design */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 0, paddingBottom: 'clamp(56px,7vw,92px)', paddingLeft: 28, paddingRight: 28, background: '#f7f9fc' }}>
        <div aria-hidden="true" style={{ position: 'absolute', width: 460, height: 460, top: -160, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%, rgba(19,96,238,.07), transparent 70%)', pointerEvents: 'none' }} />

        <div data-reveal style={{ position: 'relative', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'block', marginBottom: '20px' }}>
            <span style={{ display: 'inline-block', width: '34px', height: '3px', background: '#1360ee', borderRadius: '2px' }} />
          </span>
          <h2 style={{ margin: 0, fontSize: 'max(clamp(26px,3.2vw,38px), min(2.5vw, 52px))', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-.02em', color: '#1d1d1f' }}>
            One million IoT devices.{' '}
            <span style={{ color: '#1360ee' }}>One connected world.</span>
          </h2>
          <div style={{ margin: '24px auto', height: '4px', width: '80px', borderRadius: '999px', background: 'linear-gradient(90deg,#1360ee,#0d4fd4)' }} />
          <p style={{ margin: 0, fontSize: 'max(clamp(15px,1.5vw,17px), min(1.181vw, 24.65px))', lineHeight: 1.8, color: '#52525e' }}>
            By 2035, we envision a globally connected world where one million IoT devices enable smarter mobility, safer assets, and more intelligent operations — positioning us as a trusted global leader in AI-powered IoT innovation.
          </p>
        </div>
      </section>

      <VisionRoadmap />
      <AboutPillarNav current="vision" />
      {/* <SoftwareCTA /> */}
      <Footer />
    </main>
  )
}
