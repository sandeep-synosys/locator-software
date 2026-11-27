/* Line icons for the four starting industries (and the other sectors the brief
   mentions as potential examples). Decorative: always paired with a text label. */
export type GitexIconId =
  | 'construction'
  | 'rental'
  | 'facility'
  | 'trading'
  | 'coldchain'
  | 'waste'
  | 'school'

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function GitexIcon({ id, size = 26 }: { id: GitexIconId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {id === 'construction' && (
        <g {...P}>
          <rect x="3" y="21" width="17" height="6" rx="3" />
          <path d="M6 21v-6h8l2 6" />
          <path d="M9 15v-3h4" />
          <path d="M16 18 23 8l5 9" />
          <path d="M28 17h-3l-1 4h5z" />
        </g>
      )}
      {id === 'rental' && (
        <g {...P}>
          <path d="M4 21v-4l3-6h14l4 6v4" />
          <path d="M3 21h24v3H3z" />
          <circle cx="9" cy="24" r="2.4" />
          <circle cx="21" cy="24" r="2.4" />
          <circle cx="25" cy="7" r="3" />
          <path d="M22.8 9.2 18 14" />
        </g>
      )}
      {id === 'facility' && (
        <g {...P}>
          <path d="M5 28V6h13v22" />
          <path d="M9 10h2M14 10h0M9 15h2M14 15h0M9 20h2" />
          <path d="M18 14h9v14" />
          <path d="M3 28h26" />
          <path d="m21 21 3-3m-1-2a2 2 0 1 1 3 3" />
        </g>
      )}
      {id === 'trading' && (
        <g {...P}>
          <path d="M3 9h14v13H3z" />
          <path d="M17 13h6l4 5v4h-10" />
          <circle cx="8" cy="24" r="2.4" />
          <circle cx="22" cy="24" r="2.4" />
          <path d="M7 9V5h6v4" />
        </g>
      )}
      {id === 'coldchain' && (
        <g {...P}>
          <path d="M16 4v24M5.6 10l20.8 12M5.6 22l20.8-12" />
          <path d="m13 6 3 3 3-3M13 26l3-3 3 3" />
        </g>
      )}
      {id === 'waste' && (
        <g {...P}>
          <path d="M6 9h20M13 9V6h6v3" />
          <path d="m8 9 1.5 18h13L24 9" />
          <path d="M13.5 14v8M18.5 14v8" />
        </g>
      )}
      {id === 'school' && (
        <g {...P}>
          <rect x="4" y="5" width="24" height="18" rx="3" />
          <path d="M4 14h24M10 5v9M16 5v9M22 5v9" />
          <circle cx="9.5" cy="25.5" r="2.4" />
          <circle cx="22.5" cy="25.5" r="2.4" />
        </g>
      )}
    </svg>
  )
}
