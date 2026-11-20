import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/software/ScrollReveal'
import IndustryHero from '@/components/industries/IndustryHero'
import IndustryBlocks from '@/components/industries/IndustryBlocks'
import ServiceWhyChoose from '@/components/service/ServiceWhyChoose'
import WhoWeAreNumbers from '@/components/about/who-we-are/WhoWeAreNumbers'
import ServiceVideo from '@/components/service/ServiceVideo'
import SoftwareBlog from '@/components/software/SoftwareBlog'
import SoftwareCTA from '@/components/software/SoftwareCTA'
import Footer from '@/components/layouts/Footer'
import { INDUSTRIES, getIndustry } from '@/components/industries/industries-data'
import { siteConfig } from '@/config/site'

// Same trailing sections as the rest of the site (Why Locator, Videos, Blogs,
// FAQ, Footer) — generic and shared, not duplicated per industry.
const ServiceFAQ = dynamic(() => import('@/components/service/ServiceFAQ'))

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) return {}

  // Pages with an approved SEO brief: absolute title (it already names the
  // brand) and full social tags, since page-level openGraph/twitter replace
  // the layout's objects wholesale.
  if (industry.seo) {
    const { title, description } = industry.seo
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: `/industries/${industry.slug}` },
      openGraph: {
        title,
        description,
        url: `/industries/${industry.slug}`,
        type: 'website',
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [siteConfig.ogImage],
      },
    }
  }

  return {
    title: `${industry.name} — Industries`,
    description: industry.lead,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: `${industry.name} | Locator`,
      description: industry.lead,
      url: `/industries/${industry.slug}`,
      type: 'website',
    },
  }
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) notFound()

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <IndustryHero industry={industry} />
      <IndustryBlocks industry={industry} />
      <ServiceWhyChoose />
      <WhoWeAreNumbers />
      <ServiceVideo
        eyebrow=""
        title="All Your Vehicles, Assets & Staff on One Platform"
        titleColor="#1360ee"
        headingMaxWidth="none"
        lead="Take control of your whole operation with LOCATOR GPS Tracking"
      />
      <SoftwareBlog tag={['Fleet Management', 'Fleet Tracking', 'GPS Tracking']} />
      <ServiceFAQ />
      <SoftwareCTA />
      <Footer />
    </main>
  )
}
