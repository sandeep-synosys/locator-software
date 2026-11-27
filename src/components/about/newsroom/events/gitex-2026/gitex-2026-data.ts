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
    image: `${GITEX_ASSETS}/team/AJMAL.webp`,
  },
  {
    id: 'celine',
    name: 'Celine Nunag',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/CELINE.webp`,
  },
  {
    id: 'shamnad',
    name: 'Shamnad M V',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/shmnad.webp`,
  },
  {
    id: 'saad',
    name: 'Saad Nizar',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/SAAD.webp`,
  },
  {
    id: 'naseeb',
    name: 'Naseeb C',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/NASEEB.webp`,
  },
  {
    id: 'anna',
    name: 'Anna George',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/ANNA.webp`,
  },
  {
    id: 'shyam',
    name: 'Shyam',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/SHYAM.webp`,
  },
  {
    id: 'Harshad',
    name: 'Harshad Vadassery',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/HARSHAD.webp`,
  },
  {
    id: 'musthafa',
    name: 'Muhammed Musthafa',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/MUSTHAFA.webp`,
  },
  {
    id: 'umar',
    name: 'Umar Navas',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/UMAR.webp`,
  },
  {
    id: 'deepak',
    name: 'Deepak P',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/DEEPAK.webp`,
  },
  {
    id: 'martin',
    name: 'Martin Cinoy',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/MARTIN.webp`,
  },
  {
    id: 'tam',
    name: 'Tam Festus',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/TAM.webp`,
  },
  {
    id: 'nisamudheen',
    name: 'Nisamudheen A K',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/NISAM.webp`,
  },
  {
    id: 'faizal',
    name: 'Faizal Jeelani J',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/FAIZAL.webp`,
  },
  {
    id: 'athul',
    name: 'Athul Babu',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/ATHUL.webp`,
  },
  {
    id: 'thushara',
    name: 'Thushara Raman',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/THUSARA.webp`,
  },
  {
    id: 'jessica',
    name: 'Jessica M. Manalo',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/JESSICA.webp`,
  },
  {
    id: 'aksa',
    name: 'Aksa P R',
    role: 'Sales Team Lead',
    image: `${GITEX_ASSETS}/team/AKSA.webp`,
  },
]
