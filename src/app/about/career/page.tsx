import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import CareerHero from '@/components/about/career/CareerHero'
import CareerJobsList from '@/components/about/career/CareerJobsList'
// import CareerTeamSpotlight from '@/components/about/career/CareerTeamSpotlight'
import CareerValues from '@/components/about/career/CareerValues'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = {
  title: 'Careers — About Locator',
  description:
    'Join the team building AI-powered IoT technology that keeps businesses across the region moving safely and efficiently. Explore open positions at Locator.',
  alternates: { canonical: '/about/career' },
  openGraph: {
    title: 'Careers | Locator',
    description: 'Build the future of fleet intelligence with the Locator team.',
    url: '/about/career',
    type: 'website',
  },
}

export default function AboutCareerPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <CareerHero />
      <CareerJobsList />
      {/* <CareerTeamSpotlight /> */}
      <CareerValues />
      <AboutPillarNav current="career" />
      <Footer />
    </main>
  )
}
