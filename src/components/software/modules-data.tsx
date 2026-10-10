import type { ReactNode } from 'react'

// Sections on the /software page — the drawer links to these via #hash anchors.
export type SoftwareModule = { slug: string; name: string; tagline: string; accent: string; icon: ReactNode }

export const SOFTWARE_MODULES: SoftwareModule[] = [
  {
    slug: 'task-manager',
    name: 'Task Manager',
    tagline: 'Dispatch & track field jobs',
    accent: '#1360ee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9z" /><path d="M8.5 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    slug: 'expense-manager',
    name: 'Expense Manager',
    tagline: 'Receipts, approvals & reports',
    accent: '#13923f',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12v18l-3-1.6L12 21l-3-1.6L6 21z" /><path d="M9 8h6M9 12h6" />
      </svg>
    ),
  },
  {
    slug: 'inspection',
    name: 'Inspection Module',
    tagline: 'Checklists & condition reports',
    accent: '#7c3aed',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 5h11M4 10h11M4 15h7" /><circle cx="17.5" cy="16.5" r="3.5" /><path d="M20 19l2 2" />
      </svg>
    ),
  },
  {
    slug: 'fleet-manager',
    name: 'Fleet Manager',
    tagline: 'Documents, service & costs',
    accent: '#c2740a',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    slug: 'dashcam',
    name: 'AI Video Telematics',
    tagline: 'Video telematics & safety',
    accent: '#0a3aa0',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="7" width="14" height="11" rx="2" /><path d="M16.5 11l5-3v9l-5-3v-3z" />
      </svg>
    ),
  },
]
