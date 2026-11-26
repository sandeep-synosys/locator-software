// GITEX GLOBAL 2026 event page: event facts and the team poster list.
export const GITEX_ASSETS = '/newsroom/events/gitex-global-2026'

export const GITEX_EVENT = {
  dates: '7-11 DEC 2026',
  venue: 'Dubai World Trade Centre & Expo City Dubai',
  stand: 'H15-5',
  hall: 'S15',
}

export type TeamPoster = {
  id: string
  name: string
  role: string
  /** "I'm attending" poster, 1081 x 1350 (4:5). */
  image: string
}

// Add the rest of the team's posters here; the carousel adapts to the count.
export const GITEX_TEAM: TeamPoster[] = [
  {
    id: 'ajmal-roshan',
    name: 'Ajmal Roshan',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/AJMAL.png`,
  },
  {
    id: 'celine',
    name: 'Celine Nunag',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/CELINE.png`,
  },
  {
    id: 'shamnad',
    name: 'Shamnad M V',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/shmnad.png`,
  },
  {
    id: 'saad',
    name: 'Saad Nizar',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/SAAD.png`,
  },
  {
    id: 'naseeb',
    name: 'Naseeb C',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/NASEEB.png`,
  },
  {
    id: 'anna',
    name: 'Anna George',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/ANNA.png`,
  },
]
