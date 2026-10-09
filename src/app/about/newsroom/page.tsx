import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import NewsroomHero from '@/components/about/newsroom/NewsroomHero'
import NewsroomTicker from '@/components/about/newsroom/NewsroomTicker'
import NewsroomBoard from '@/components/about/newsroom/NewsroomBoard'
import NewsroomHighlights from '@/components/about/newsroom/NewsroomHighlights'
import NewsroomSubscribe from '@/components/about/newsroom/NewsroomSubscribe'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import NewsroomVideosAndBlogs from '@/components/about/newsroom/NewsroomVideosAndBlogs'

export const metadata: Metadata = {
  title: 'Newsroom — About Locator',
  description:
    'Company news, product announcements, and updates from the team building Locator’s AI-powered IoT platform.',
  alternates: { canonical: '/about/newsroom' },
  openGraph: {
    title: 'Newsroom | Locator',
    description: 'Company news and updates from the Locator team.',
    url: '/about/newsroom',
    type: 'website',
  },
}

export default function AboutNewsroomPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <ScrollReveal />
      <NewsroomHero />
      <NewsroomTicker />
      <NewsroomBoard />
      <NewsroomHighlights />
      <NewsroomVideosAndBlogs />
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  )
}
