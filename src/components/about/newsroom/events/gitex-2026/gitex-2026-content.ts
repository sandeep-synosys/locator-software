/* Copy for the GITEX GLOBAL 2026 event page, taken word for word from the
   "Beyond Tracking: LOCATOR at GITEX GLOBAL 2026" SEO content package
   (26 November 2026). Headings follow its on-page structure; links follow its
   internal and external linking table. A paragraph is a list of plain text and
   link segments. Keep the industry modules unlinked: they are in development. */

export type Seg = string | { text: string; href: string; external?: boolean }
export type Para = Seg[]

export const GITEX_H1 = {
  lead: 'Beyond Tracking, Towards Smarter Decisions:',
  main: 'LOCATOR Heads to',
  /** Shown after the GITEX wordmark image (alt "GITEX"). */
  tail: 'GLOBAL 2026',
}

export const INTRO: Para[] = [
    ['Knowing where a vehicle is answers one question. Knowing what the business should do next is a different problem altogether, and it is usually the one that keeps an operations manager on the phone until evening.'],
    ['A dot on a map can confirm that an excavator is on site or a delivery truck has finished its route. It cannot say whether that excavator should be moved, whether a returned rental car can be promised to the next customer or what happens to the pallets the buyer didn’t accept. Those answers depend on the industry, and they are where fleet management technology now has the most to prove.'],
    ['That idea is what LOCATOR will bring to ', { text: 'GITEX GLOBAL 2026', href: 'https://www.gitex.com/', external: true }, ', taking place in Dubai from 7 to 11 December. The ', { text: 'UAE fleet management company', href: '/' }, ' will be present at Stand H15-5, Hall S15, to talk with visitors about the decisions that follow once location is already known.'],
]

export const ABOUT = {
  heading: 'GITEX GLOBAL 2026: Where Global Technology Meets Business',
  paras: [
    ['For more than four decades, GITEX GLOBAL has been one of the defining dates in the technology calendar. Each December it gathers the people who build technology, the people who invest in it and the organisations that put it to work, from global technology companies and early-stage startups to investors, government leaders and enterprise buyers.'],
    ['The 2026 programme reflects where that conversation has moved. Artificial intelligence sits at the centre, alongside robotics, cybersecurity, data centres, energy and the wider digital transformation of industry. For anyone running fleets, field teams or physical assets, it is a week to see these technologies turned into practical tools.'],
  ] as Para[],
  summit: {
    heading: 'The GITEX Summit: 7 December, Dubai World Trade Centre',
    paras: [
    ['GITEX GLOBAL opens with a one-day summit at Dubai World Trade Centre (DWTC).'],
    ['Ministers, technology leaders, investors and founders will discuss the forces shaping the intelligence economy under three themes: the compute economy, the new map of capital and future frontiers.'],
    ] as Para[],
  },
  expo: {
    heading: 'The GITEX GLOBAL Expo: 8–11 December, Expo City Dubai',
    paras: [
    ['From 8 December, the event moves to the Dubai Exhibition Centre (DEC) at Expo City Dubai for the four-day main expo and its conference stages. This is where technology companies, startups, investors and buyers meet on the show floor to explore new products, compare approaches and start business conversations.'],
    ] as Para[],
  },
}

export const PERSPECTIVE = {
  heading: 'LOCATOR at GITEX GLOBAL 2026: A Different Perspective on Fleet Management',
  paras: [
    ['LOCATOR is known in the UAE for ', { text: 'GPS tracking and fleet management', href: '/service/fleet-telematics' }, '. At GITEX GLOBAL 2026, though, the conversation it wants to have starts one step later, with a simple question: what comes after knowing where a vehicle is?'],
    ['The honest answer is that it depends on who is asking. A plant manager, a rental agent, a service coordinator and a sales representative can look at the same map and need entirely different information. One is thinking about project schedules and machine utilisation; another about which vehicle can be handed over at two o’clock; another about which technician can leave a job without breaking a promise to a client; another about the buyer still waiting for the rest of an order.'],
    ['LOCATOR will use the week to discuss exactly these real-world problems with operators, partners and technology professionals: operational challenges, better-informed decisions, asset utilisation and coordination between teams.'],
  ] as Para[],
}

export type IndustryStory = {
  id: string
  /** Short label for the image card and the modules section. */
  label: string
  heading: string
  paras: Para[]
  image: string
  alt: string
}

export const INDUSTRIES = {
  heading: 'Beyond Tracking: Why Different Industries Need Different Answers',
  intro: [
    ['Consider the ', { text: 'four industries LOCATOR is starting with', href: '/industries' }, '. In each, location is known, but the right decision is not obvious.'],
  ] as Para[],
}

export const INDUSTRY_STORIES: IndustryStory[] = [
  {
    id: 'construction',
    label: 'Construction',
    heading: 'Construction Fleet Management: Knowing When Equipment Should Move',
    paras: [
    ['Picture an excavator parked beside an open trench all afternoon. On paper it looks idle. In reality the crew may be waiting for an inspection before they can backfill, and the machine is still essential. Across the city, a second project manager has a team ready to dig and a hire quote waiting for sign-off.'],
    ['Moving the excavator today might save a day’s hire on the second site. It might also leave the first crew stranded the moment the inspector approves the trench. The plant manager’s real question is not where the machine is, but how much work remains on one site and what is about to begin on the other. That is why construction needs ', { text: 'project-related insight', href: '/industries/construction' }, ', not location alone.'],
    ],
    image: 'industries/construction-excavator-fleet-decision.webp',
    alt: 'Excavator waiting beside an open trench on a construction site',
  },
  {
    id: 'rental',
    label: 'Rental and leasing',
    heading: 'Rental Fleet Management: Knowing Which Vehicle Can Be Promised',
    paras: [
    ['A car comes back to the branch at midday, two hours before its next handover, and the driver mentions a vibration in the steering. While the workshop takes a look, the rental agent faces a choice: hold a replacement for the two o’clock booking, or offer that replacement to a walk-in customer asking for the same class of car.'],
    ['Long-term leasing raises the same question on a slower clock. Taking a van out for service may mean arranging a substitute so the customer’s business keeps moving. In both cases the operator needs to know which vehicle can be promised with confidence, to whom and for how long, balancing ', { text: 'availability, maintenance and customer commitments', href: '/industries/rental-leasing' }, '.'],
    ],
    image: 'industries/rental-car-return-branch-check.webp',
    alt: 'Rental car returned to a branch and checked before its next booking',
  },
  {
    id: 'facility',
    label: 'Facility management',
    heading: 'Facility Management: Connecting Technicians with Service Commitments',
    paras: [
    ['An urgent call reports a leak. The nearest service van belongs to a technician testing pumps at another property, where the building engineer has set aside a single hour for access. Pulling that technician away could mean losing the only chance to finish the test that day.'],
    ['For the service desk, “nearest vehicle” is only the start. The decision depends on who can actually leave, who has the skills for the repair and what each building has been promised. The client with the leak needs an arrival time; the building engineer needs to know whether to keep the pump room open. Facility management technology has to see those commitments, not just the vans.'],
    ],
    image: 'industries/facility-service-van-technician.webp',
    alt: 'Facility management technician arriving at a building in a service van',
  },
  {
    id: 'trading',
    label: 'General trading',
    heading: 'General Trading Fleet Management: What Was Delivered and What Remains',
    paras: [
    ['A truck completes every stop on its route and still comes back carrying part of an order. Perhaps the buyer only had room for four of the six pallets. The driver knows what returned; the sales representative who took the order now has to tell the buyer when the balance will arrive.'],
    ['For a trading business, that follow-up conversation is part of the delivery. Before another vehicle is committed, dispatch, sales and warehouse teams need to agree on what the customer received and when someone will be available to accept the rest. Delivery visibility only becomes useful when it connects to the order and the promise behind it.'],
    ],
    image: 'industries/general-trading-partial-delivery-pallets.webp',
    alt: 'Delivery truck returning with undelivered pallets after a partial order',
  },
]

export const MODULES = {
  heading: 'Developing Industry-Specific Modules Around Real Business Decisions',
  paras: [
    ['These examples point to the approach LOCATOR is now taking. Rather than adding more data to the same map, the company is developing industry-specific modules, each designed around a decision that someone in that industry has to make every day.'],
    ['The modules are in development, and LOCATOR has not announced launch dates.'],
    ['Construction, rental and leasing, facility management and general trading are the starting points. Other sectors have their own versions of these moments: a cold-chain truck that cannot afford to wait, a waste collection route that changes daily, a school bus that simply cannot run late. For each industry, the starting questions stay the same: who has to make the call, and what information would help them make it with confidence?'],
    ['For smart fleet management, it is a shift from showing everything that can be measured to surfacing what the decision-maker needs to know.'],
  ] as Para[],
}

export const MEET = {
  heading: 'Meet LOCATOR at GITEX GLOBAL 2026',
  rows: [
    { label: 'Event', value: 'GITEX GLOBAL 2026, 7–11 December 2026' },
    { label: 'Summit', value: 'GITEX Summit · 7 December · Dubai World Trade Centre (DWTC)' },
    { label: 'Expo', value: 'GITEX GLOBAL Expo · 8–11 December · Dubai Exhibition Centre (DEC), Expo City Dubai' },
    { label: 'LOCATOR', value: 'Stand H15-5 · Hall S15' },
  ],
  paras: [
    ['If your business runs construction equipment, a rental or leasing fleet, facility maintenance teams or trading deliveries, LOCATOR’s team would like to hear about the decisions your people make every day. Fleet managers, business owners, technology professionals and potential partners are all welcome to visit Stand H15-5 in Hall S15 to talk through industry-specific fleet management challenges and see how LOCATOR is approaching them.'],
  ] as Para[],
}

/* Links the brief places in the Meet section: "plan your visit" in the event
   box, then "visitor registration" after it, then contact and demo. */
export const MEET_LINKS = {
  planVisit: { text: 'Plan your visit', href: 'https://www.gitex.com/plan-your-visit-2026' },
  registration: { text: 'Visitor registration', href: 'https://visit.gitex.com/registration?sub_event=GLOBAL' },
  contact: { text: 'Talk to LOCATOR’s team', href: '/contact' },
  demo: { text: 'Book a live demo', href: '/get-a-free-demo' },
}

export const GITEX_SUMMIT_HREF = 'https://www.gitex.com/conference-overview-2026'

export const CLOSING = {
  heading: 'Looking Beyond Location',
  paras: [
    ['Knowing where vehicles and assets are remains the foundation of fleet operational efficiency. But the businesses that get the most from their fleets will be the ones whose systems help them decide what to do next: when to move a machine, which car to promise, ', { text: 'which technician to send', href: '/service/task-manager' }, ' and how to finish a delivery that came back half-full.'],
    ['That is the conversation LOCATOR is taking to GITEX GLOBAL 2026. Bring your toughest operational question to Stand H15-5, Hall S15, and see what the answer could look like for your industry.'],
  ] as Para[],
}

/* FAQ section of the brief. FAQPage JSON-LD is built from this same list. */
export type GitexFaqItem = { q: string; a: string }

export const GITEX_FAQS: GitexFaqItem[] = [
  {
    q: 'When and where is GITEX GLOBAL 2026?',
    a: 'GITEX GLOBAL 2026 runs from 7 to 11 December 2026 in Dubai. The GITEX Summit takes place on 7 December at Dubai World Trade Centre (DWTC), and the main GITEX GLOBAL Expo runs from 8 to 11 December at the Dubai Exhibition Centre (DEC), Expo City Dubai.',
  },
  {
    q: 'Where can I find LOCATOR at GITEX GLOBAL 2026?',
    a: 'LOCATOR will be at Stand H15-5, Hall S15. Check the official GITEX floor plan or contact LOCATOR before your visit to confirm directions.',
  },
  {
    q: 'What will LOCATOR be discussing at GITEX GLOBAL 2026?',
    a: 'LOCATOR will be talking about industry-specific fleet management: the operational decisions businesses face after they already know where their vehicles and assets are, with examples from construction, rental and leasing, facility management and general trading.',
  },
  {
    q: 'Are LOCATOR’s industry-specific modules available now?',
    a: 'Not yet. LOCATOR is developing them, starting with construction, rental and leasing, facility management and general trading. No launch dates have been announced. LOCATOR’s existing GPS tracking and fleet management services are available today.',
  },
]
