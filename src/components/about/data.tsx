import type { ReactNode } from 'react'

export type AboutPage = {
  slug: string
  name: string
  tagline: string
  accent: string
  icon: ReactNode
}

// Every page carries the same accent: the site's blue, #1360ee. The field stays
// per-page rather than being collapsed to a constant because the components read
// `accent` off each item and other datasets (regulatory, services, industries)
// still use their own values — but these six are deliberately identical.
//
// They used to be six different hues, which turned the "Explore more about" grid
// at the foot of every About page into a colour chart and made sibling pages look
// like unrelated products. The navbar already reached the same conclusion and
// overrides these with one blue (MENU_ICON_ACCENT); this makes the pages agree
// with the navigation instead of contradicting it.
export const ABOUT_PAGES: AboutPage[] = [
  {
    slug: 'who-we-are',
    name: 'Who We Are',
    tagline: 'Get to know LOCATOR',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6 23c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'vision',
    name: 'Vision',
    tagline: 'Where we’re headed by 2035',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M2 14s4-8 12-8 12 8 12 8-4 8-12 8-12-8-12-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="14" cy="14" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    slug: 'mission',
    name: 'Mission',
    tagline: 'How we deliver on it',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3l2.8 8.1H25l-7 5.1 2.7 8.1L14 19.2l-7.7 5.1L9 16.2 2 11.1h8.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'core-values',
    name: 'Core Values',
    tagline: 'CORE VALUE',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4l9 3.5v6c0 6-3.8 10.4-9 12-5.2-1.6-9-6-9-12v-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 14l2.6 2.6L18 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'newsroom',
    name: 'Newsroom',
    tagline: 'Company news & updates',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 10v8a2 2 0 0 0 2 2h2V8H6a2 2 0 0 0-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 8l14-4v20L8 20V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 20v3a1.5 1.5 0 0 0 3 0v-2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'career',
    name: 'Careers',
    tagline: 'Build the future with us',
    accent: '#1360ee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 15h20" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
]
