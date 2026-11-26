import type { Metadata } from 'next'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import Footer from '@/components/layouts/Footer'
import GitexHero from '@/components/about/newsroom/events/gitex-2026/GitexHero'
import GitexTeamCarousel from '@/components/about/newsroom/events/gitex-2026/GitexTeamCarousel'
import { GITEX_2026_HREF } from '@/components/about/newsroom/newsroom-data'

// GITEX GLOBAL 2026 event page. Built in stages: hero and team posters so far.
// Kept out of search results (noindex) and the sitemap until the page is complete.
export const metadata: Metadata = {
  title: { absolute: 'LOCATOR at GITEX GLOBAL 2026 | Hall S15, Stand H15-5' },
  description:
    'Meet LOCATOR at GITEX GLOBAL 2026, 7-11 December, Dubai World Trade Centre and Expo City Dubai. Visit us at Hall S15, Stand H15-5.',
  alternates: { canonical: GITEX_2026_HREF },
  robots: { index: false, follow: true },
}

export default function GitexGlobal2026Page() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <SoftwareNavbar />
      <GitexHero />
      <GitexTeamCarousel />
      <Footer />
    </main>
  )
}
