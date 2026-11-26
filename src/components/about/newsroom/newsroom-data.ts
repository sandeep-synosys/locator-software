// Single source of truth for the newsroom. Every card the board renders comes
// from here so the tab filter, the featured slot, and the rail all stay in sync.

import { BLOG_POSTS as MIGRATED_POSTS, blogHref } from './blog/blog-index'

export type NewsCategory =
  | 'product'
  | 'company'
  | 'events'
  | 'stories'
  | 'videos'
  | 'social'
  | 'media'
  | 'blog'

export type NewsItem = {
  id: string
  category: NewsCategory
  /** Small coloured chip drawn on the image. Falls back to the tab label. */
  tag: string
  title: string
  excerpt: string
  image: string
  /** Alt text for the card image. Empty/omitted marks it decorative. */
  alt?: string
  /** How the image fills its frame. Defaults to 'cover' (crops to fill). Use
   *  'contain' when the source shouldn't be cropped — the frame letterboxes
   *  against its own dark background instead. */
  fit?: 'cover' | 'contain'
  /** Only meaningful with fit:'contain'. The image's own width/height ratio
   *  (e.g. '1280 / 805'), applied as the card's aspect-ratio so a 'contain'
   *  image fills its frame edge-to-edge instead of pillarboxing inside a
   *  frame shaped for something else. */
  imageAspect?: string
  date: string
  /** Shown on video cards only. */
  duration?: string
  /** Video cards only — drives the YouTube-style "12K views · 2 weeks ago" line. */
  views?: string
  ago?: string
  /** YouTube video id — plays the item in the newsroom's embedded player. */
  youtubeId?: string
  /** ISO publish time; when set, the "x ago" label is computed from it so it never goes stale. */
  publishedAt?: string
  href: string
  /** Promotes the item into the big featured slot on the "All" tab. */
  featured?: boolean
}

export const TABS: { id: NewsCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'product', label: 'Product Updates' },
  { id: 'company', label: 'Company News' },
  { id: 'events', label: 'Events' },
  { id: 'stories', label: 'Customer Stories' },
  { id: 'videos', label: 'Videos' },
  { id: 'social', label: 'Social Feed' },
  { id: 'media', label: 'Media Coverage' },
  { id: 'blog', label: 'Blog' },
]

export const CATEGORY_LABEL: Record<NewsCategory, string> = {
  product: 'Product Update',
  company: 'Company News',
  events: 'Event',
  stories: 'Customer Story',
  videos: 'Video',
  social: 'Social',
  media: 'Media Coverage',
  blog: 'Blog',
}

// Chip colours per category — kept here rather than in CSS so a new category
// only has to be added in one place.
// All drawn from the site's own hero-gradient blues. They still differ enough to
// tell categories apart at a glance, but the row of chips now reads as one family
// instead of a colour chart. `media` stays slate — it is a neutral, not a hue.
export const CATEGORY_COLOR: Record<NewsCategory, string> = {
  product: '#1360ee',
  company: '#0d4fd4',
  events: '#2f6fed',
  stories: '#1157dd',
  videos: '#0b40b8',
  social: '#2563eb',
  media: '#475569',
  blog: '#4d94ff',
}

/** Events listing page (the Events tab's "View all events" link). */
export const EVENTS_BASE = '/about/newsroom/events'
/** The one event with its own page so far; the other event cards are placeholders. */
export const GITEX_2026_HREF = `${EVENTS_BASE}/gitexglobal2026`

export const NEWS_ITEMS: NewsItem[] = [
  // First so it also leads the Events tab; `featured` puts it in the big slot on "All".
  {
    id: 'gitex-2026',
    category: 'events',
    tag: 'Event',
    title: 'Locator at GITEX Global 2026',
    excerpt:
      'Meet the team at Hall 3, D120 for live demos of AI Fleet Intelligence and the new driver-coaching suite.',
    image: '/newsroom/gitex-global.png',
    fit: 'contain',
    imageAspect: '1536 / 1024',
    date: 'May 28, 2026',
    href: GITEX_2026_HREF,
    featured: true,
  },
  {
    id: 'visionx-2035-summit',
    category: 'events',
    tag: 'Event',
    // NBSP between VisionX and 2035: as one unbreakable token it no longer fits
    // after the em dash, so the line breaks there and the event name starts line 2.
    title: 'Our Journey to the Future Begins — VisionX 2035 Summit',
    excerpt:
      'Highlights from our first-ever Synosys & Beyond – VisionX 2035 Summit. A milestone event shaping the next decade of innovation, growth and global impact.',
    image: '/newsroom/visionx-2035-summit.jpg',
    fit: 'contain',
    imageAspect: '2048 / 1288',
    date: 'May 30, 2026',
    href: '#',
  },
  {
    id: 'indoor-asset-tracking',
    category: 'product',
    tag: 'Product Update',
    title: 'Indoor Asset Tracking Now More Accurate',
    excerpt:
      'BLE beacon triangulation cuts indoor position error to under two metres across warehouses and yards.',
    image: '/newsroom/indoor-asset-tracking.jpeg',
    fit: 'contain',
    imageAspect: '1536 / 1024',
    date: 'May 30, 2026',
    href: '#',
  },
  {
    id: 'transworld-story',
    category: 'stories',
    tag: 'Customer Story',
    title: 'How TransWorld Cut Costs by 35%',
    excerpt:
      'A 480-vehicle logistics fleet on route optimisation and fuel analytics — here is what changed in nine months.',
    image: '/services/transport-logistics-2.webp',
    date: 'May 15, 2026',
    href: '#',
  },
  {
    id: 'v46-release',
    category: 'product',
    tag: 'Product Update',
    title: 'Version 4.6 — Predictive Maintenance & Fuel Intelligence',
    excerpt:
      'Engine-hour thresholds, predicted service windows, and a rebuilt fuel-theft detection engine ship to all plans.',
    image: '/newsroom/graphical-report.png',
    date: 'May 22, 2026',
    href: '#',
  },
  {
    id: 'route-optimisation',
    category: 'product',
    tag: 'Product Update',
    title: 'Smarter Route Optimisation and Mobile App Updates',
    excerpt:
      'Multi-stop sequencing now accounts for live traffic, delivery windows, and vehicle load in one pass.',
    image: '/software/hero-phone/mobile-map-view.webp',
    date: 'April 30, 2026',
    href: '#',
  },
  {
    id: 'temperature-alerts',
    category: 'product',
    tag: 'Product Update',
    title: 'Real-Time Temperature & Cold-Chain Alerts',
    excerpt:
      'Continuous sensor logging now triggers instant excursion alerts and generates one-click compliance exports for refrigerated fleets.',
    image: '/tracking-devices/temperature-humidity-sensor.png',
    date: 'April 12, 2026',
    href: '#',
  },
  {
    id: 'driver-app-scorecards',
    category: 'product',
    tag: 'Product Update',
    title: 'Redesigned Driver App with Live Scorecards',
    excerpt:
      'Drivers now see their safety score, trip history, and coaching tips in a faster, rebuilt mobile app — with in-app notifications for harsh events.',
    image: '/software/hero-phone/mobile-summary.webp',
    date: 'March 28, 2026',
    href: '#',
  },
  {
    id: 'saudi-office',
    category: 'company',
    tag: 'Company News',
    title: 'Locator Opens Riyadh Office to Serve Saudi Fleets',
    excerpt:
      'Local support, Arabic-first onboarding, and in-country installation teams now operate from Riyadh.',
    image: '/newsroom/public-government-fleet.webp',
    date: 'May 12, 2026',
    href: '#',
  },
  {
    id: 'iso-certification',
    category: 'company',
    tag: 'Company News',
    title: 'Locator Achieves ISO 27001 Certification',
    excerpt:
      'An independent audit confirms our information-security controls across the platform and data centres.',
    image: '/regulatory/asateel-certified/locator-asateel.webp',
    date: 'April 18, 2026',
    href: '#',
  },
  {
    id: 'milestone-10k',
    category: 'company',
    tag: 'Company News',
    title: 'Locator Surpasses 10,000 Vehicles Tracked Daily',
    excerpt:
      'A new milestone across the GCC as our platform now monitors more than ten thousand active vehicles every single day.',
    image: '/services/transport-logistics-2.webp',
    date: 'April 05, 2026',
    href: '#',
  },
  {
    id: 'dbschenker-partnership',
    category: 'company',
    tag: 'Company News',
    title: 'Locator Partners with DB Schenker on Regional Logistics',
    excerpt:
      'A new strategic partnership brings AI-powered fleet intelligence to one of the region’s largest logistics operators.',
    image: '/services/facility-management.webp',
    date: 'March 22, 2026',
    href: '#',
  },
  {
    id: 'series-b-funding',
    category: 'company',
    tag: 'Company News',
    title: 'Locator Raises Series B to Expand Across the GCC',
    excerpt:
      'The new funding round accelerates our expansion into Saudi Arabia, Qatar, and Oman, and doubles our R&D team.',
    image: '/newsroom/graphical-report.png',
    date: 'March 08, 2026',
    href: '#',
  },
  {
    id: 'team-expansion',
    category: 'company',
    tag: 'Company News',
    title: 'Locator Doubles Its Field Installation Team',
    excerpt:
      'Fifty new GPS field technicians join across the UAE and KSA, cutting average installation lead times in half.',
    image: '/newsroom/public-government-fleet.webp',
    date: 'February 20, 2026',
    href: '#',
  },
  {
    id: 'fleet-summit',
    category: 'events',
    tag: 'Event',
    title: 'Fleet & Mobility Summit — Dubai',
    excerpt:
      'Our VP of Product joins the panel on AI safety scoring and what regulators will expect by 2027.',
    image: '/newsroom/gps-tracker-vehicle.webp',
    date: 'June 10, 2026',
    href: '#',
  },
  {
    id: 'ai-webinar',
    category: 'events',
    tag: 'Webinar',
    title: 'AI Fleet Intelligence Webinar',
    excerpt:
      'A 45-minute walkthrough of predictive maintenance, driver scoring, and the new analytics workspace.',
    image: '/newsroom/live-map.webp',
    date: 'June 25, 2026',
    href: '#',
  },
  {
    id: 'school-transport-story',
    category: 'stories',
    tag: 'Customer Story',
    title: 'Safer School Runs for 12,000 Students Daily',
    excerpt:
      'RFID student attendance plus live parent notifications across a 210-bus school transport operation.',
    image: '/services/school-and-educational-fleet-monitoring.webp',
    date: 'April 26, 2026',
    href: '#',
  },
  {
    id: 'cold-chain-story',
    category: 'stories',
    tag: 'Customer Story',
    title: 'Cold Chain Compliance Without the Paperwork',
    excerpt:
      'Continuous temperature logging turned a weekly audit scramble into a one-click export.',
    image: '/tracking-devices/temperature.webp',
    date: 'April 09, 2026',
    href: '#',
  },
  {
    id: 'construction-utilisation-story',
    category: 'stories',
    tag: 'Customer Story',
    title: 'Al Laith Group Lifts Equipment Utilisation by 28%',
    excerpt:
      'Machine-hour tracking across 14 active sites turned idle assets into billable hours and cut unauthorised use to near zero.',
    image: '/services/construction-site-fleet.webp',
    date: 'March 30, 2026',
    href: '#',
  },
  {
    id: 'fuel-theft-story',
    category: 'stories',
    tag: 'Customer Story',
    title: 'Energy Fleet Ends Fuel Theft with Sensor Analytics',
    excerpt:
      'A tanker operator traced drain events off the fuel curve and recovered its telematics investment in under four months.',
    image: '/newsroom/petroleum-energy-fleet.webp',
    date: 'March 14, 2026',
    href: '#',
  },
  {
    id: 'rental-recovery-story',
    category: 'stories',
    tag: 'Customer Story',
    title: 'Rental Company Slashes Vehicle Recovery Time',
    excerpt:
      'Live location and geofence alerts helped a 900-car leasing fleet recover overdue vehicles in hours instead of days.',
    image: '/services/rental.webp',
    date: 'February 26, 2026',
    href: '#',
  },
  // Videos — the four uploads on the LOCATOR Media YouTube channel
  // (youtube.com/@locatormedia820), newest first. Titles, descriptions,
  // durations and publish dates are copied from YouTube; `views` is a snapshot
  // taken on 17 Nov 2026 — refresh it here when the counts move.
  {
    id: 'yt-Zu1V_jFl9Xc',
    category: 'videos',
    tag: 'Video',
    title: 'Behind Every Smile, Someone Is Making It Happen.',
    excerpt: 'Behind every journey, someone is making sure everything stays on track.  \nWatch till the end to discover what’s really behind it. 👀  \nLocator — Live GPS Tracking & Fleet Management for Businesses.  \n#LocatorUAE #FleetManagement #GPSTracking #fleettracking  #SmartMobility #DubaiBusiness #uaebusinesss',
    image: 'https://i.ytimg.com/vi/Zu1V_jFl9Xc/hqdefault.jpg',
    date: 'October 08, 2026',
    duration: '1:29',
    views: '9 views',
    publishedAt: '2026-10-08T13:18:19Z',
    youtubeId: 'Zu1V_jFl9Xc',
    href: 'https://www.youtube.com/watch?v=Zu1V_jFl9Xc',
  },
  {
    id: 'yt-ADak-earjZU',
    category: 'videos',
    tag: 'Video',
    title: 'My LOCATOR Plus App - V 2.0 Release',
    excerpt: 'Introducing our all new LOCATOR App to have a better control on your field Staffs & Vehicles on the road to manage them effectively better than before. Update LOCATOR app for FREE from App store or Google Play-store now.\n\nRemember to share LOCATOR to your friends and business partners, and help them to manage their business better than before.\n\nWe are doing everything possible to help in this uncertain time. \n\nWe will get though this uncertain time,  Together.\n\nVisit "www.locator.ae" for more details.',
    image: 'https://i.ytimg.com/vi/ADak-earjZU/hqdefault.jpg',
    date: 'May 27, 2022',
    duration: '1:37',
    views: '71K views',
    publishedAt: '2022-05-27T13:57:44Z',
    youtubeId: 'ADak-earjZU',
    href: 'https://www.youtube.com/watch?v=ADak-earjZU',
  },
  {
    id: 'yt-ThOGjyM23mU',
    category: 'videos',
    tag: 'Video',
    title: 'My LOCATOR Plus App - V2.0 Release',
    excerpt: 'Introducing our all new LOCATOR App to have a better control on your field Staffs & Vehicles on the road to manage them effectively better than before. Update LOCATOR app for FREE from App store or Google Play-store now.\n\nRemember to share LOCATOR to your friends and business partners, and help them to manage their business better than before.\n\nWe are doing everything possible to help in this uncertain time. \n\nWe will get though this uncertain time,  Together.\n\nVisit "www.locator.ae" for more details.',
    image: 'https://i.ytimg.com/vi/ThOGjyM23mU/hqdefault.jpg',
    date: 'July 10, 2020',
    duration: '1:47',
    views: '3.1K views',
    publishedAt: '2020-07-10T11:32:58Z',
    youtubeId: 'ThOGjyM23mU',
    href: 'https://www.youtube.com/watch?v=ThOGjyM23mU',
  },
  {
    id: 'yt-hwqB52vVUig',
    category: 'videos',
    tag: 'Video',
    title: 'LOCATOR - Effective Vehicle Tracking System.',
    excerpt: 'All your Vehicles, Assets & Field staffs on ONE Software and And change the way you manage it !!.',
    image: 'https://i.ytimg.com/vi/hwqB52vVUig/hqdefault.jpg',
    date: 'May 30, 2020',
    duration: '1:55',
    views: '74K views',
    publishedAt: '2020-05-30T06:53:30Z',
    youtubeId: 'hwqB52vVUig',
    href: 'https://www.youtube.com/watch?v=hwqB52vVUig',
  },
]

/** True when the item has a real page to open ('#' marks a placeholder card). */
export const hasPage = (item: NewsItem) => item.href !== '#'

/** Every event, those with a page first (GITEX), then the placeholder cards. */
export const EVENT_ITEMS: NewsItem[] = [
  ...NEWS_ITEMS.filter((i) => i.category === 'events' && hasPage(i)),
  ...NEWS_ITEMS.filter((i) => i.category === 'events' && !hasPage(i)),
]

export type SocialPost = {
  id: string
  network: 'linkedin' | 'instagram' | 'facebook' | 'x' | 'youtube'
  /** Display name on the post byline. */
  handle: string
  /** Second byline line — the follower/role blurb LinkedIn shows under the name. */
  subtitle: string
  time: string
  text: string
  image: string
  type: 'video' | 'image' | 'carousel'
  /** Engagement counts rendered in the reaction bar. */
  likes: number
  comments: number
  reposts: number
  href: string
}

// Ordered newest-first — the Social Feed tab renders these as one continuous
// column, so this array doubles as the feed's sort order.
export const SOCIAL_POSTS: SocialPost[] = [
  // ── Added so the highlights rail has a real rotation per platform: three
  // LinkedIn, three Instagram and three X posts, each on its own image so the
  // carousel never shows the same picture twice in a cycle. ──
  {
    id: 's14',
    network: 'instagram',
    handle: 'locator.ae',
    subtitle: 'Dubai, United Arab Emirates',
    time: '2h',
    text: 'Every smart route adds to your savings. 💰\nTrack smarter. Route better. Save more..\n\n#Locator #FleetManagement #GPS #FuelSavings #SmartMobility #UAE',
    image: '/newsroom/social/instagram/instapost-6.webp',
    likes: 1240,
    comments: 62,
    reposts: 18,
    type: 'image',
    href: 'https://www.instagram.com/p/DdikipqNRBq/?stkn=MW50ODhsOHN1OWNudQ%3D%3D',
  },
  {
    id: 's8',
    network: 'x',
    handle: 'locator_ae',
    subtitle: '@locator_ae',
    time: '6h',
    text: 'Shipped today: geofence dwell alerts now fire on exit as well as entry, so you catch the trailer that left early — not just the one that arrived late.',
    image: '/newsroom/social/instagram/instapost-3.webp',
    likes: 1470,
    comments: 88,
    reposts: 204,
    type: 'image',
    href: '#',
  },
  {
    id: 's9',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '2d',
    text: '📍 GPS showing the wrong location? \n\nYour device may not be broken. Temporary signal interference may affect updates. Our team is monitoring the situation. We wish everyone safety during this time.',
    image: '/newsroom/social/linkedin/linkedin-post-3.webp',
    likes: 1310,
    comments: 96,
    reposts: 133,
    type: 'image',
    href: 'https://www.linkedin.com/posts/locatormedia_gps-showing-the-wrong-location-your-device-activity-7436673272894758912-LJLr/?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAACmPmNAB089clJh72tsQ6KEag52o6SLp5oc&utm_campaign=whatsapp',
  },
  {
    id: 's17',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '2W',
    text: 'The One Wish ✨️ \n\n#Locator #UAE #DubaiBusiness #IoT #InternetOfThings #Teltonika #FleetManagement #GPSTracking #Telematics #SmartMobility #FuelEfficiency',
    image: '/newsroom/social/linkedin/linkedin-post-6.webp',
    likes: 11,
    comments: 0,
    reposts: 2,
    type: 'video',
    href: 'https://www.linkedin.com/posts/locator-uae-dubaibusiness-ugcPost-7521491566184525824-8osW/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE4kPn0BPU-0JkQ_2ANbinU-U7qGoA-rv1o',
  },
  {
    id: 's7',
    network: 'instagram',
    handle: 'locator.ae',
    subtitle: 'Jebel Ali, Dubai',
    time: '61w',
    text: '🚗 Route Playback vs Optimized Route — \n \n What’s the difference? With Locator, you get both! \nRoute Playback: Replay every move your vehicle made. \nOptimized Route: Plan the smartest, most fuel-efficient path before the trip. \n\n📍From real-time tracking to cost-saving insights — we help you manage your fleet smarter. \n✨ Start optimizing your operations today with Locator. \n🔗 Visit locator.ae or call us at +971 4 354 77 66 \n📲 Available on iOS & Android \n\n #FleetTracking #RouteOptimization #GPSMonitoring #LocatorUAE #FleetManagement #SmartLogistics #VehicleTracking',
    image: '/newsroom/social/instagram/instapost-1.webp',
    likes: 986,
    comments: 44,
    reposts: 12,
    type: 'image',
    href: 'https://www.instagram.com/p/DMR4f38xYSt/?stkn=b3I0ejNxcHRpcWU=',
  },
  {
    id: 's18',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '3h',
    text: '🚛 Take complete control of your fleet operations with Locator. 📍\n\n#FleetManagementUAE #FleetManagementDubai #GPSTrackingUAE #VehicleTrackingUAE #FleetSolutionsUAE #FleetManagementGCC #GPSDubai #LogisticsUAE #TransportManagement #Locator',
    image: '/newsroom/social/linkedin/linkedin-post-11.webp',
    likes: 4,
    comments: 0,
    reposts: 1,
    type: 'image',
    href: 'https://lnkd.in/p/dgCfFq8i',
  },
  {
    id: 's15',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '4d',
    text: 'Behind every smile 😊 , someone is making it happen. \n#LocatorUAE #FleetManagement #SmartMobility #DubaiBusiness #UAEBusiness',
    image: '/newsroom/social/linkedin/linkedin-post-5.webp',
    likes: 356,
    comments: 19,
    reposts: 47,
    type: 'video',
    href: 'https://www.linkedin.com/posts/locatormedia_behind-every-smile-someone-is-making-it-activity-7506267449454051328-KZkX/?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAACmPmNAB089clJh72tsQ6KEag52o6SLp5oc&utm_campaign=whatsapp',
  },
  {
    id: 's10',
    network: 'x',
    handle: 'locator_ae',
    subtitle: '@locator_ae',
    time: '3d',
    text: 'Fuel theft is rarely one big siphon. It is 4 litres a night, 200 nights a year, across 40 vehicles. That is what sensor analytics is actually for.',
    image: '/services/petroliume.webp',
    likes: 2240,
    comments: 137,
    reposts: 318,
    type: 'image',
    href: '#',
  },
  {
    id: 's19',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '2W',
    text: 'Wishing everyone a proud and memorable UAE Flag Day ✨',
    image: '/newsroom/social/linkedin/linkedin-post-10.webp',
    likes: 2,
    comments: 0,
    reposts: 0,
    type: 'image',
    href: 'https://lnkd.in/p/d7pRdWC7',
  },
  {
    id: 's21',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '2W',
    text: 'Some partnerships are built over time  through real work, trust, and showing up when it matters. For Synosys and Locator UAE, our relationship with Teltonika has grown over 12+ years into something we genuinely value. Being recognized as a Strategic Alliance Partner in the UAE at Teltonika Telematics Summit Vilnius 2026 is a meaningful moment for us. More than the recognition itself, it reflects the trust, collaboration, and shared commitment that have shaped this journey. A special congratulations 👏 to SHAMS O\'BIL on this achievement, and our sincere thanks to Edvinas Navickas, Mohamed Dagher, and Adil Umar for their continued support and for being part of this journey with us. We’re grateful for everything we’ve built together so far  and proud to see Synosys, Locator UAE, and Teltonika continue to grow together. What began 12+ years ago has grown into something that means even more to us today, built on trust that has only strengthened with time. And as far as we’ve come together, it still feels like there’s so much more ahead.',
    image: '/newsroom/social/linkedin/linkedin-post-8.webp',
    likes: 115,
    comments: 6,
    reposts: 4,
    type: 'image',
    href: 'https://lnkd.in/p/d5-FhRje',
  },
  {
    id: 's11',
    network: 'instagram',
    handle: 'locator.ae',
    subtitle: 'Dubai, United Arab Emirates',
    time: '61w',
    text: '🚛 Driver Behavior Monitoring — Made Smarter Reduce risks, lower fuel costs, and improve fleet safety with real-time behavior insights.\n\n📍 Track speed, harsh braking, cornering & more \n🔄 Replay trips and optimize routes \n🛠️ Prevent costly repairs through proactive monitoring \n\n👉 Take control of your fleet today. \n🔗 www.locator.ae \n\n #FleetManagement #DriverMonitoring #GPSUAE #SmartFleet #LocatorUAE #DubaiTransport #VehicleTracking #telematics',
    image: '/newsroom/social/instagram/instapost-2.webp',
    likes: 1105,
    comments: 51,
    reposts: 22,
    type: 'image',
    href: 'https://www.instagram.com/p/DMW_DsARvtw/?stkn=MjQ3YTJhc2dmZ3Yw',
  },
  {
    id: 's20',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '1W',
    text: '🚗 Reduce unnecessary idling and improve fleet efficiency with LOCATOR.\n\n#Locator #FleetManagement #IdleAlerts #FuelEfficiency #gps #dubai🇦🇪',
    image: '/newsroom/social/linkedin/linkedin-post-9.webp',
    likes: 4,
    comments: 0,
    reposts: 0,
    type: 'image',
    href: 'https://lnkd.in/p/dnwrtMHp',
  },
  {
    id: 's2',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,420 followers',
    time: '5h',
    text: '🤝It’s our privilege to be a Platinum Partner of Teltonika, a world-leading hashtag#IoT and hashtag#telematics hardware manufacturer.\nTogether we grow, delivering smarter and more connected fleet solutions across the UAE.\n\n #Locator #Teltonika #IoT #Telematics #TogetherWeGrow #FleetTracking #UAE #locatoruae #synosys',
    image: '/newsroom/social/linkedin/linkedin-post-1.webp',
    likes: 428,
    comments: 37,
    reposts: 51,
    type: 'image',
    href: 'https://www.linkedin.com/posts/locatormedia_iot-telematics-locator-activity-7386323318154571776-DBDc/?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAACmPmNAB089clJh72tsQ6KEag52o6SLp5oc&utm_campaign=whatsapp',
  },
  {
    id: 's1',
    network: 'instagram',
    handle: 'locator.ae',
    subtitle: 'Dubai, United Arab Emirates',
    time: '60w',
    text: '📍 Smarter Routes. Bigger Savings. \n\n Tired of wasted time and fuel? \nLocator\'s Route Optimizer helps you plan the fastest, most efficient paths — using real-time GPS data. 🚛💡 \n\n ✅ Faster deliveries \n✅ Lower fuel costs \n✅ Real-time control over your fleet \n\nLet your fleet work smarter, not harder.\n📲 Learn more: www.locator.ae \n\n #FleetTracking #RouteOptimization #LocatorUAE #SmartLogistics #GPSsolutions #FleetEfficiency #DubaiBusiness',
    image: '/newsroom/social/instagram/instapost-3.webp',
    likes: 1240,
    comments: 62,
    reposts: 18,
    type: 'image',
    href: 'https://www.instagram.com/p/DMZdmnMOLEc/?stkn=MWFna2JwYm1rdndvaQ%3D%3D',
  },
  {
    id: 's22',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '2W',
    text: 'Every detail documented, from scratches to dents. Keep every vehicle inspection organized with Locator’s Inspection Module.',
    image: '/newsroom/social/linkedin/linkedin-post-7.webp',
    likes: 4,
    comments: 0,
    reposts: 1,
    type: 'image',
    href: 'https://lnkd.in/p/dBWmuKcG',
  },
  {
    id: 's5',
    network: 'youtube',
    handle: 'Locator',
    subtitle: 'New video · 6:41',
    time: '1d',
    text: 'New walkthrough: setting up geofence alerts that your drivers will not ignore. Zone types, dwell thresholds, and escalation rules — all in one sitting.',
    image: '/newsroom/live-map.webp',
    likes: 892,
    comments: 41,
    reposts: 24,
    type: 'image',
    href: '#',
  },
  {
    id: 's16',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,420 followers',
    time: '3d',
    text: 'Every smart route adds to your savings. 💰 \nTrack smarter. Route better. Save more. \n\n #Locator #FleetManagement #GPS #FuelSavings #SmartMobility #UAE',
    image: '/newsroom/social/linkedin/linkedin-post-4.webp',
    likes: 428,
    comments: 37,
    reposts: 51,
    type: 'image',
    href: 'https://www.linkedin.com/posts/locatormedia_locator-fleetmanagement-gps-activity-7506365494124474368-Spl9/?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAACmPmNAB089clJh72tsQ6KEag52o6SLp5oc&utm_campaign=whatsapp',
  },
  {
    id: 's3',
    network: 'facebook',
    handle: 'Locator',
    subtitle: 'Sponsored · Dubai',
    time: '2d',
    text: 'Great conversations at the Fleet & Mobility Summit in Dubai. Thanks to everyone who stopped by the booth — and to the ops teams who told us exactly what is still broken. That list is now our roadmap.',
    image: '/services/video-banner.webp',
    likes: 604,
    comments: 28,
    reposts: 33,
    type: 'image',
    href: '#',
  },
  {
    id: 's12',
    network: 'instagram',
    handle: 'locator.ae',
    subtitle: 'Dubai, United Arab Emirates',
    time: '47w',
    text: '🤝It’s our privilege to be a Platinum Partner of @teltonika_official , a world-leading #IoT and #telematics hardware manufacturer.\nTogether we grow, delivering smarter and more connected fleet solutions across the UAE. \n\n#Locator #Teltonika #IoT #Telematics #TogetherWeGrow #FleetTracking #UAE #locatoruae #synosys',
    image: '/newsroom/social/instagram/instapost-4.webp',
    likes: 1240,
    comments: 62,
    reposts: 18,
    type: 'image',
    href: 'https://www.instagram.com/p/DQELheVkQ4K/?stkn=MXZ1bXIyNXJuZ2Jzbw%3D%3D',
  },
  {
    id: 's4',
    network: 'x',
    handle: 'locator_ae',
    subtitle: '@locator_ae',
    time: '3d',
    text: 'v4.6 is out.\n\n· Predictive maintenance\n· Rebuilt fuel-theft detection\n· Route playback that actually keeps up with a 400-vehicle fleet\n\nShipping to all plans this week.',
    image: '/newsroom/route-playback.webp',
    likes: 2130,
    comments: 94,
    reposts: 312,
    type: 'image',
    href: '#',
  },
  {
    id: 's6',
    network: 'linkedin',
    handle: 'Locator',
    subtitle: '18,90 followers',
    time: '4d',
    text: 'Teltonika Middle East Summit 2025! 🚀\nThe event brought together telematics and IoT leaders to discuss the future of connected mobility. Locator’s long-term partnership with Teltonika Telematics continues to drive innovation in GPS tracking and fleet management across the UAE. \nOur CEO Shams OP represented Locator UAE at the summit, engaging with industry experts on advancing smarter, more reliable fleet solutions. 🌍✨ \n\n#TeltonikaSummit2025 #Telematics #GPS #Innovation #Locator #UAE #FleetManagement',
    image: '/newsroom/social/linkedin/linkedin-post-2-1.webp',
    likes: 356,
    comments: 19,
    reposts: 47,
    type: 'image',
    href: 'https://www.linkedin.com/posts/locatormedia_teltonikasummit2025-telematics-gps-activity-7390389182529191936-vU2X/?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAACmPmNAB089clJh72tsQ6KEag52o6SLp5oc&utm_campaign=whatsapp',
  },
  {
    id: 's13',
    network: 'instagram',
    handle: 'locator.ae',
    subtitle: 'Dubai, United Arab Emirates',
    time: '61W',
    text: '📍 GPS showing the wrong location? Your device may not be broken. Temporary signal interference may affect updates. Our team is monitoring the situation. We wish everyone safety during this time.',
    image: '/newsroom/social/instagram/instapost-5.webp',
    likes: 1240,
    comments: 62,
    reposts: 18,
    type: 'image',
    href: 'https://www.instagram.com/p/DVp7jnlGZT8/?stkn=MTIwdGczMHJwMWg5eQ%3D%3D',
  },
]

export type MediaMention = {
  id: string
  publication: string
  title: string
  date: string
  image: string
  href: string
}

export const MEDIA_MENTIONS: MediaMention[] = [
  {
    id: 'm1',
    publication: 'Khaleej Times',
    title: 'Locator Raises the Bar for Fleet Intelligence in the UAE',
    date: 'May 24, 2026',
    image: '/newsroom/live-map.webp',
    href: '#',
  },
  {
    id: 'm2',
    publication: 'Gulf Business',
    title: 'AI-Powered Telematics Is Driving Smarter Fleets Across the Gulf',
    date: 'May 11, 2026',
    image: '/newsroom/graphical-report.png',
    href: '#',
  },
  {
    id: 'm3',
    publication: 'Arabian Business',
    title: 'Locator’s Growth Story and Road Ahead',
    date: 'April 20, 2026',
    image: '/services/transport-logistics-2.webp',
    href: '#',
  },
  {
    id: 'm4',
    publication: 'Zawya',
    title: 'Regional Logistics Operators Turn to Predictive Maintenance',
    date: 'April 03, 2026',
    image: '/services/facility-management.webp',
    href: '#',
  },
]

export type LiveUpdate = {
  id: string
  kind: 'release' | 'video' | 'linkedin' | 'webinar' | 'event'
  title: string
  body: string
  /**
   * How old the update is when the page loads, in seconds. The rail renders
   * this through a live formatter that ticks upward ("3s ago" → "1m ago"), so
   * the panel ages in real time instead of showing a frozen string.
   */
  secondsAgo: number
  cta: string
  href: string
}

/** "3s ago", "12m ago", "4h ago", "2d ago" — matches how a real feed reads. */
export function formatAgo(seconds: number): string {
  if (seconds < 3) return 'just now'
  if (seconds < 60) return `${Math.floor(seconds)}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// The sticky rail. Ordered newest-first; `time` is relative on purpose so the
// panel reads as a feed rather than an archive.
export const LIVE_UPDATES: LiveUpdate[] = [
  {
    id: 'l1',
    kind: 'release',
    title: 'Version 4.6 Released',
    body: 'AI Driver Behaviour with Predictive Intelligence is here.',
    secondsAgo: 3,
    cta: 'View Release Notes',
    href: '#',
  },
  {
    id: 'l2',
    kind: 'video',
    title: 'New Customer Review Video',
    body: 'TransWorld Logistics shares their success story.',
    secondsAgo: 720,
    cta: 'Watch Now',
    href: '#',
  },
  {
    id: 'l3',
    kind: 'linkedin',
    title: 'New LinkedIn Post',
    body: 'How AI is transforming fleet operations in 2026.',
    secondsAgo: 1560,
    cta: 'Open Post',
    href: '#',
  },
  {
    id: 'l4',
    kind: 'webinar',
    title: 'Webinar Reminder',
    body: 'AI Fleet Intelligence Webinar at 3:00 PM GST.',
    secondsAgo: 3900,
    cta: 'Register Now',
    href: '#',
  },
  {
    id: 'l5',
    kind: 'event',
    title: 'GITEX Global 2026',
    body: 'Booth setup completed. See you at Hall 3, D120.',
    secondsAgo: 11400,
    cta: 'View Photos',
    href: '#',
  },
]

export type TickerItem = { label: string; badge?: string }

export const TICKER: TickerItem[] = [
  { label: 'v4.6 Released', badge: 'New' },
  { label: 'New Customer Story', badge: 'Video' },
  { label: 'GITEX Global 2026', badge: 'Event' },
  { label: 'New LinkedIn Post', badge: 'Social' },
  { label: 'AI Maintenance Feature Launched' },
  { label: 'Riyadh Office Now Open', badge: 'News' },
  { label: 'ISO 27001 Certified' },
]

export type TimelineEntry = {
  version: string
  date: string
  title: string
  body: string
  latest?: boolean
  href: string
}

export const RELEASE_TIMELINE: TimelineEntry[] = [
  {
    version: 'v4.6.0',
    date: 'May 22, 2026',
    title: 'AI Driver Behaviour',
    body: 'Predictive alerts, fuel-anomaly detection, and more.',
    latest: true,
    href: '#',
  },
  {
    version: 'v4.5.2',
    date: 'May 02, 2026',
    title: 'Maintenance Scheduling',
    body: 'Smart Reports and Performance Improvements.',
    href: '#',
  },
  {
    version: 'v4.5.0',
    date: 'April 30, 2026',
    title: 'Route Optimisation',
    body: 'Sensor Enhancements and Mobile App Updates.',
    href: '#',
  },
]

export type UpcomingEvent = {
  day: string
  month: string
  title: string
  meta: string
  cta: string
  href: string
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    day: '25',
    month: 'JUN',
    title: 'AI Fleet Intelligence Webinar',
    meta: '3:00 PM GST · Online',
    cta: 'Register',
    href: '#',
  },
  {
    day: '13',
    month: 'OCT',
    title: 'GITEX Global 2026',
    meta: 'Dubai World Trade Centre',
    cta: 'Learn More',
    href: '#',
  },
  {
    day: '10',
    month: 'JUN',
    title: 'Fleet & Mobility Summit',
    meta: 'Dubai World Trade Centre',
    cta: 'Learn More',
    href: '#',
  },
]

// The Blog tab is fed by the articles migrated from the old locator.ae blog.
// Mapped here rather than duplicated so the card copy, image and date always
// match what the article page itself renders.
export const BLOG_POSTS: NewsItem[] = MIGRATED_POSTS.map((p) => ({
  id: p.slug,
  category: 'blog',
  tag: p.tag,
  title: p.title,
  excerpt: p.excerpt,
  image: p.hero.src,
  alt: p.hero.alt,
  date: p.dateLabel,
  href: blogHref(p.slug),
}))
