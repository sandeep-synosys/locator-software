// Content transcribed from "industries (3).docx" — each entry mirrors that
// doc's per-industry structure (Banner → Block 1 → Block 2), so the detail
// pages read exactly like the source brief. Shared trailing sections (Why
// Locator, Videos, Blogs, FAQ, Footer) are the same generic components
// already used across the site, composed in the [slug] route rather than
// duplicated here.

export type IndustryBlock = {
  title: string
  subtitle: string
  desc: string[]
  featuresLabel: string
  features: string[]
}

export type Industry = {
  slug: string
  name: string
  /** Card grid: short "who it's for" pill shown under the title. */
  cardTag: string
  /** Card thumbnail image (grid on /industries page). */
  image: string
  imageW: number
  imageH: number
  /** Hero banner background image (detail page). */
  heroImage: string
  heroImageW: number
  heroImageH: number
  /** Hero banner headline (the doc's "Banner" line). */
  tagline: string
  /** Hero banner sub-paragraph. */
  lead: string
  block1: IndustryBlock & { image?: string; imagePosition?: string }
  block2: IndustryBlock & { image?: string; imagePosition?: string }
  /** Approved SEO brief for this page; pages without one keep the generic metadata. */
  seo?: { title: string; description: string }
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'rental-leasing',
    name: 'Rental & Leasing',
    cardTag: 'Rental and leasing companies',
    image: '/industries/rental-leasing/card.webp',
    imageW: 1254,
    imageH: 1254,
    heroImage: '/industries/rental-leasing/card.webp',
    heroImageW: 1254,
    heroImageH: 1254,
    tagline: 'Track, Protect and Optimize Every Rental Asset',
    lead: 'LOCATOR helps rental and leasing companies track, protect, and optimize vehicles, machines, and equipment from one centralized telematics platform.',
    block1: {
      title: 'Complete Visibility for Rental Vehicles and Equipment',
      subtitle: 'Know Where Every Asset Is and How It Is Being Used',
      desc: [
        'Track cars, trucks, buses, generators, forklifts, cranes, excavators, and other rental equipment across branches, customer sites, yards, and project locations.',
        'View real-time location, movement, ignition status, engine hours, idling, parking, and asset availability through a single rental asset management platform.',
      ],
      featuresLabel: 'Key Features',
      features: [
        'Live GPS tracking and asset status',
        'Trip and activity history',
        'Engine-hour and mileage monitoring',
        'Geofence and unauthorized movement alerts',
        'Multi-branch and multi-site fleet visibility',
        'Remote immobilization for compatible assets',
      ],
      image: '/industries/rental-leasing/block-1.webp',
    },
    block2: {
      title: 'Reduce Theft, Misuse and Rental Risk',
      subtitle: 'Protect Vehicles, Machines and High-Value Equipment',
      desc: [
        'Receive instant alerts when a rental asset leaves an approved area, operates beyond agreed hours, remains inactive, or is used without authorization.',
        'LOCATOR helps rental and leasing companies reduce theft, vehicle misuse, excessive machine usage, delayed returns, and unnecessary wear.',
      ],
      featuresLabel: 'Benefits',
      features: [
        'Faster vehicle and equipment recovery',
        'Reduced unauthorized use and movement',
        'Better monitoring of customer usage',
        'Improved driver and operator accountability',
        'Reliable activity records for disputes and investigations',
      ],
      image: '/industries/rental-leasing/block-2.webp',
    },
  },
  {
    slug: 'transportation-logistics',
    name: 'Transportation & Logistics',
    cardTag: 'Logistics and freight fleets',
    image: '/industries/transportation-logistics/card.webp',
    imageW: 1254,
    imageH: 1254,
    heroImage: '/industries/transportation-logistics/hero.webp',
    heroImageW: 1254,
    heroImageH: 1254,
    tagline: 'Smarter Fleet Operations. Faster Deliveries. Lower Costs.',
    lead: 'LOCATOR helps logistics companies track fleets, optimize routes, monitor drivers, and improve delivery performance.',
    block1: {
      title: 'Real-Time Fleet Visibility and Route Control',
      subtitle: 'Track Every Vehicle, Trip, and Delivery',
      desc: [
        'Monitor live vehicle locations, routes, stops, idling, and trip progress in real time. LOCATOR helps dispatch teams improve route planning, respond quickly to delays, and provide accurate delivery updates to customers.',
      ],
      featuresLabel: 'Key Features',
      features: [
        'Live GPS vehicle tracking',
        'Route history and trip playback',
        'Geofence and route-deviation alerts',
        'Parking, stoppage, and idling reports',
        'Estimated arrival and delivery visibility',
        'Multi-branch and multi-fleet monitoring',
      ],
      image: '/industries/transportation-logistics/block-1.webp',
    },
    block2: {
      title: 'Improve Safety, Efficiency, and Profitability',
      subtitle: 'Reduce Fuel Costs and Improve Fleet Performance',
      desc: [
        'Monitor speeding, harsh braking, rapid acceleration, excessive idling, and unauthorized vehicle use. Actionable telematics data helps reduce fuel consumption, improve driver accountability, control operating costs, and increase fleet utilization.',
      ],
      featuresLabel: 'Business Benefits',
      features: [
        'Reduce fuel and operating costs',
        'Improve driver safety and accountability',
        'Minimize delays and unauthorized trips',
        'Automate maintenance and service reminders',
        'Improve vehicle utilization and delivery efficiency',
        'Integrate with ERP, CRM, dispatch, and logistics systems',
      ],
      image: '/industries/transportation-logistics/block-2.webp',
    },
  },
  {
    slug: 'courier-last-mile-delivery',
    name: 'Courier & Last Mile Delivery',
    cardTag: 'Courier and last-mile delivery',
    image: '/industries/courier-last-mile-delivery/card.webp',
    imageW: 1254,
    imageH: 1254,
    heroImage: '/industries/courier-last-mile-delivery/hero.webp',
    heroImageW: 1254,
    heroImageH: 1254,
    tagline: 'Smarter GPS Tracking for Courier & Last-Mile Delivery',
    lead: 'Track delivery vehicles and riders, optimize routes, monitor performance, and complete every delivery faster with LOCATOR’s GPS tracking and telematics platform.',
    block1: {
      title: 'Real-Time Delivery Fleet Visibility',
      subtitle: 'Know Where Every Delivery Is',
      desc: [
        'Track courier vehicles, delivery vans, and bikes in real time from one centralized platform. Monitor routes, stops, idle time, trip history, and delivery progress to improve visibility and respond quickly to delays.',
      ],
      featuresLabel: 'Key Features',
      features: [
        'Live vehicle and rider tracking',
        'Route history and stop monitoring',
        'Geofence and movement alerts',
        'Accurate customer delivery updates',
      ],
      image: '/industries/courier-last-mile-delivery/block-1.png',
    },
    block2: {
      title: 'Faster and More Efficient Last-Mile Operations',
      subtitle: 'Optimize Every Route and Delivery',
      desc: [
        'LOCATOR helps courier and last-mile delivery companies improve route planning, reduce fuel costs, monitor driver behaviour, and increase on-time deliveries. Integration with delivery, ERP, or CRM systems enables automated workflows and better operational control.',
      ],
      featuresLabel: 'Benefits',
      features: [
        'AI-powered route optimization',
        'Driver behaviour monitoring',
        'Proof of delivery and task management',
        'ERP, CRM, and delivery-system integration',
        'Improved fleet productivity and customer satisfaction',
      ],
      image: '/industries/courier-last-mile-delivery/block-2.png',
      // Loading dock, van and gate all sit close to the photo's right edge —
      // a centered crop was clipping into them. Anchoring right instead
      // trims the crop entirely from the (mostly empty) left side.
      imagePosition: 'right center',
    },
  },
  {
    slug: 'construction',
    name: 'Construction',
    cardTag: 'Construction and heavy equipment',
    image: '/industries/construction/card.webp',
    imageW: 1254,
    imageH: 1254,
    heroImage: '/industries/construction/hero.webp',
    heroImageW: 1254,
    heroImageH: 1254,
    tagline: 'GPS Tracking and Telematics for Construction Fleets',
    lead: 'Track construction vehicles, heavy machinery, and equipment in real time. Improve asset utilization, safety, maintenance, and operational control with LOCATOR.',
    block1: {
      title: 'Real-Time Visibility of Vehicles and Machines',
      subtitle: 'Know Where Every Asset Is',
      desc: [
        'Monitor trucks, pickups, excavators, cranes, loaders, generators, and other construction equipment from one centralized platform. Track location, movement, operating hours, idle time, and unauthorized usage across multiple sites.',
      ],
      featuresLabel: 'Key Features',
      features: [
        'Live vehicle and machine tracking',
        'Site-entry and exit alerts',
        'Engine-hour and idle-time monitoring',
        'Theft and unauthorized-movement alerts',
      ],
      image: '/industries/construction/block-1.webp',
    },
    block2: {
      title: 'Improve Construction Fleet Efficiency',
      subtitle: 'Reduce Downtime and Operating Costs',
      desc: [
        'LOCATOR helps construction companies improve asset utilization, control fuel usage, automate maintenance reminders, and reduce equipment downtime. Integrate telematics data with ERP or project management systems for better planning and cost control.',
      ],
      featuresLabel: 'Benefits',
      features: [
        'Fuel and equipment usage monitoring',
        'Preventive maintenance reminders',
        'Driver and operator behaviour insights',
        'Multi-site fleet and asset management',
        'ERP and project-system integration',
      ],
      image: '/industries/construction/block-2.webp',
    },
  },
  {
    slug: 'field-services',
    name: 'Field Services',
    cardTag: 'Field service and mobile teams',
    image: '/industries/field-services/card.webp',
    imageW: 1254,
    imageH: 1254,
    heroImage: '/industries/field-services/card.webp',
    heroImageW: 1254,
    heroImageH: 1254,
    tagline: 'GPS Tracking for Field Service Teams and Vehicles',
    lead: 'Track service vehicles and field teams in real time. Improve scheduling, response times, productivity, and customer service with LOCATOR.',
    seo: {
      title: 'Field Service Vehicle Tracking UAE – Teams & Jobs | LOCATOR',
      description:
        'Field service vehicle tracking that shows every technician and van live. Assign jobs by location, track working time and send customers accurate ETAs.',
    },
    block1: {
      title: 'Real-Time Field Team Visibility',
      subtitle: 'Know Where Every Team Is',
      desc: [
        'Monitor technicians, service vehicles, and mobile teams from one centralized platform. Assign jobs based on location, track travel and working time, and provide customers with accurate arrival updates.',
      ],
      featuresLabel: 'Key Features',
      features: [
        'Live vehicle and technician tracking',
        'Smart job assignment and scheduling',
        'Route, stop, and working-time monitoring',
        'Accurate ETA and customer updates',
      ],
      image: '/industries/field-services/block-1.webp',
    },
    block2: {
      title: 'Smarter Field Service Operations',
      subtitle: 'Complete More Jobs with Less Delay',
      desc: [
        'LOCATOR helps field service companies optimize routes, reduce fuel and travel time, monitor job progress, and capture digital proof of service. Integrate with CRM, ERP, or field service systems to automate workflows and improve operational efficiency.',
      ],
      featuresLabel: 'Benefits',
      features: [
        'Route optimization and dispatching',
        'Task and job-status management',
        'Digital proof of service',
        'Driver behaviour and expense monitoring',
        'CRM, ERP, and field-service integration',
      ],
      image: '/industries/field-services/block-2.webp',
    },
  },
  {
    slug: 'food-beverage',
    name: 'Food & Beverage',
    cardTag: 'Food and beverage distribution',
    image: '/industries/food-beverage/card.webp',
    imageW: 1254,
    imageH: 1254,
    heroImage: '/industries/food-beverage/card.webp',
    heroImageW: 1254,
    heroImageH: 1254,
    tagline: 'GPS Tracking and Telematics for Food & Beverage Delivery',
    lead: 'Track delivery vehicles, protect temperature-sensitive products, and improve on-time deliveries with LOCATOR’s GPS tracking and fleet management platform.',
    block1: {
      title: 'Real-Time Delivery Fleet Visibility',
      subtitle: 'Track Every Vehicle and Delivery',
      desc: [
        'Monitor food and beverage delivery vans, trucks, and refrigerated vehicles in real time. Track routes, stops, delivery progress, and cargo temperature from one centralized platform.',
      ],
      featuresLabel: 'Key Features',
      features: [
        'Live vehicle and delivery tracking',
        'Temperature and cold-chain monitoring',
        'Route, stop, and idle-time visibility',
        'Geofence and delivery alerts',
      ],
      image: '/industries/food-beverage/block-1.webp',
    },
    block2: {
      title: 'Smarter Food Distribution Operations',
      subtitle: 'Protect Product Quality and Reduce Delivery Costs',
      desc: [
        'LOCATOR helps food and beverage companies optimize routes, reduce fuel consumption, maintain cold-chain compliance, and improve on-time delivery performance. Integrate with ERP, CRM, or order management systems for more efficient distribution.',
      ],
      featuresLabel: 'Benefits',
      features: [
        'AI-powered route optimization',
        'Temperature deviation alerts',
        'Driver behaviour and fuel monitoring',
        'Digital proof of delivery',
        'ERP and order-management integration',
      ],
      image: '/industries/food-beverage/block-2.webp',
    },
  },
]

export function getIndustry(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug)
}
