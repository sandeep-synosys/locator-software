import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import SoftwareHero from '@/components/software/SoftwareHero'
import BenefitsSection from '@/components/software/BenefitsSection'
import ModulesSection from '@/components/software/ModulesSection'
import DashcamShowcase from '@/components/software/DashcamShowcase'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import ScrollReveal from '@/components/software/ScrollReveal'
import Footer from '@/components/layouts/Footer'

const SoftwareFAQ = dynamic(() => import('@/components/software/SoftwareFAQ'))

export const metadata: Metadata = {
  title: { absolute: 'Fleet Management Software in UAE | LOCATOR' },
  description:
    'Manage your fleet with LOCATOR software in the UAE. Track vehicles live, assign tasks, monitor expenses and inspections, and improve driver safety.',
  keywords: [
    'Fleet Management Software UAE',
    'GPS Fleet Tracking',
    'Fleet Telematics',
    'Vehicle Tracking Software',
    'AI Dashcam UAE',
  ],
}

export default function SoftwarePage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <SoftwareHero />
      <BenefitsSection />
      <ModulesSection />
      <DashcamShowcase />
      <SoftwareBlog tag={['GPS Tracking', 'Fleet Tracking']} />
      <SoftwareFAQ />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
