import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import ServiceHero from '@/components/service/ServiceHero'
import BenefitsSection from '@/components/software/BenefitsSection'
import ServiceFleetShowcase from '@/components/service/ServiceFleetShowcase'
import ServiceIndustries from '@/components/service/ServiceIndustries'
import ServiceProcess from '@/components/service/ServiceProcess'
import AnimatedGlobeHero from '@/components/AnimatedGlobeHero'
import ServiceVideo from '@/components/service/ServiceVideo'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import DashcamShowcase from '@/components/software/DashcamShowcase'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import ScrollReveal from '@/components/software/ScrollReveal'
import Footer from '@/components/layouts/Footer'

const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

// Numbers section — same animated globe used on the landing page.
const SERVICE_STATS = [
  { value: '15+',    label: 'Years of fleet expertise',  side: 'left',  row: 'top',    icon: 'award' },
  { value: '60,000+', label: 'Vehicles tracked daily',    side: 'left',  row: 'bottom', icon: 'pin' },
  { value: '6,000+',   label: 'UAE businesses served',     side: 'right', row: 'top',    icon: 'smile' },
  { value: '99.9%',  label: 'Tracking network uptime',   side: 'right', row: 'bottom', icon: 'chart' },
]

// In-copy links (SEO brief) — styled like the site's other inline text links.
const inlineLink = { color: '#1360ee', fontWeight: 600, textDecoration: 'none' }

export const metadata: Metadata = {
  // Absolute: the brief's title already names the brand, so skip the "| LOCATOR" template.
  title: { absolute: 'Fleet Telematics UAE | GPS Tracking & Live Alerts – LOCATOR' },
  description:
    'Track every vehicle, driver and route in real time with LOCATOR GPS fleet telematics. Get idle alerts, geofencing and service reminders. Book a free UAE site visit.',
  alternates: { canonical: '/service/fleet-telematics' },
  // Page-level openGraph/twitter replace the layout's objects wholesale, so the
  // shared image, site name and locale are restated here.
  openGraph: {
    title: 'Fleet Telematics UAE | GPS Tracking & Live Alerts – LOCATOR',
    description:
      'Track every vehicle, driver and route in real time with LOCATOR GPS fleet telematics. Get idle alerts, geofencing and service reminders. Book a free UAE site visit.',
    url: '/service/fleet-telematics',
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Fleet Telematics UAE | GPS Tracking & Live Alerts – LOCATOR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fleet Telematics UAE | GPS Tracking & Live Alerts – LOCATOR',
    description:
      'Track every vehicle, driver and route in real time with LOCATOR GPS fleet telematics. Get idle alerts, geofencing and service reminders. Book a free UAE site visit.',
    images: [siteConfig.ogImage],
  },
}

export default function FleetTelematicsPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <ServiceHero />
      <BenefitsSection
        title="What LOCATOR Fleet Telematics Includes"
        shortOverrides={{
          // Field Tasks Manager
          6: (
            <>
              Assign tasks to drivers, track progress, and monitor completion live with{' '}
              <Link href="/service/task-manager" style={inlineLink}>LOCATOR Task Manager</Link>.
            </>
          ),
        }}
      />
      {/* Landing target for the Fleet Telematics feature cards on the home page —
          they link to /service/fleet-telematics#fleet-telematics, where the same
          six features are spelled out in full. */}
      <ServiceFleetShowcase />
      <ServiceIndustries />
      <ServiceProcess />
      <AnimatedGlobeHero stats={SERVICE_STATS} />
      <ServiceVideo />
      <ServiceWhyChoose />
      {/* Kept as a short teaser that links out — the full story lives on
          /service/video-telematics, which owns this topic. */}
      <DashcamShowcase
        title="AI Dash Cameras with Video Telematics"
        cardTitles={{ 0: 'Live HD video' }}
        intro={
          <>
            Real-time driver monitoring, cargo surveillance, and multi-camera recording for trucks,
            taxis, buses, delivery vehicles, and commercial fleets. Explore{' '}
            <Link href="/service/video-telematics" style={inlineLink}>AI dash cameras and video telematics</Link>.
          </>
        }
      />
      <SoftwareBlog tag={['Fleet Tracking', 'Fleet Management']} />
      <ServiceFAQ title="Fleet Telematics FAQs" schema />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
