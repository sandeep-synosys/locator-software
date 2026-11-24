import type { ReactNode } from 'react'

export type RegulatoryProduct = {
  slug: string
  name: string
  tagline: string
  description: string
  accent: string
  icon: ReactNode
}

export const REGULATORY_PRODUCTS: RegulatoryProduct[] = [
  {
    slug: 'shahin',
    name: 'SHAHIN',
    tagline: 'GPS registration for cargo trucks in Dubai',
    description:
      'A certified GPS vehicle-tracking solution built to meet SHAHIN monitoring requirements, giving fleet owners and regulators continuous, verifiable visibility into vehicle location, movement, and compliance status.',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4l9 3.5v6c0 6-3.8 10.4-9 12-5.2-1.6-9-6-9-12v-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 14l2.6 2.6L18 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'asateel-certified-obu',
    name: 'ASATEEL Certified OBU',
    tagline: 'Certified OBU for Abu Dhabi freight & buses',
    description:
      'An ASATEEL-certified on-board unit (OBU) for trucks and heavy vehicles, delivering the real-time location and movement data required for regulatory compliance and reporting.',
    accent: '#13923f',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M11 8V4M17 8V4M11 24v-4M17 24v-4M8 11H4M8 17H4M24 11h-4M24 17h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'securepath',
    name: 'SecurePath',
    tagline: 'GPS certification for Dubai rent a car fleets',
    description:
      'A dedicated safety-tracking layer for passenger and cargo vehicles, combining live location tracking with route and safety alerts to keep every trip accounted for.',
    accent: '#7c3aed',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 25s8-7.5 8-13.5A8 8 0 0 0 6 11.5C6 17.5 14 25 14 25z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 11.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'securepath-premium',
    name: 'SecurePath Premium',
    tagline: 'SIRA GPS for regulated businesses in Dubai',
    description:
      'The premium tier of Securepath, adding AI-assisted driver-behavior insights, deeper analytics, and priority support for fleets that need the highest level of oversight.',
    accent: '#c2740a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4l9 3.5v6c0 6-3.8 10.4-9 12-5.2-1.6-9-6-9-12v-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 9.3l1.1 2.28 2.5.37-1.8 1.77.43 2.52L14 15.02l-2.23 1.22.43-2.52-1.8-1.77 2.5-.37z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
]
