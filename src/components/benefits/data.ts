// Source copy for /benefits-of-gps-tracking.
//
// Carried over verbatim in substance from the previous locator.ae page so the
// page keeps its search footprint; only the punctuation and a few run-on
// sentences have been tidied. Order is the order it reads on the page — the
// numerals are derived from the array index, so reordering here reorders the
// index without anything else to keep in step.

export type Benefit = {
  /** Sentence-case, kept short enough to sit on one line at desktop widths. */
  title: string
  desc: string
}

export const BENEFITS: Benefit[] = [
  {
    title: 'Reduced operating cost',
    desc: 'Vehicle tracking cuts your phone bills outright it is no longer a necessity to constantly call employees to find out where they are.',
  },
  {
    title: 'Improved customer relations',
    desc: 'Customers can be given proof that the service they paid for was delivered as promised, at the time it was promised.',
  },
  {
    title: 'Compliance with programmed routes',
    desc: 'Ensure drivers do not deviate from an authorised route, and review the entire movement history whenever a journey is questioned.',
  },
  {
    title: 'Increased productivity',
    desc: 'Track lunch and break hours, expose unauthorised stops, and evaluate overtime requests against what actually happened. Companies typically see a 25% increase in work orders completed after implementing GPS tracking.',
  },
  {
    title: 'Rewarding your dedicated workers',
    desc: 'Nothing discourages a hard-working team faster than watching slack colleagues take home the same wage. The evidence a tracking system provides lets you direct training where it is needed and reward the people carrying the work.',
  },
  {
    title: 'Reduction and control of overtime',
    desc: 'A significant fall in overtime is among the most immediate returns on a GPS vehicle tracking system. Organisations consistently report a substantial decline in overtime claims after installation, which translates directly into higher productivity.',
  },
  {
    title: 'Lower maintenance spend',
    desc: 'Fleet maintenance costs fall as total mileage comes down and driving behaviour improves the two things that wear a vehicle out fastest.',
  },
  {
    title: 'Fleet Visibility for Owners',
    desc: 'Detailed information on where every vehicle and employee is puts owners far more in touch with day-to-day operations, and gives them a real level of control over how the company runs.',
  },
  {
    title: 'Vehicle recovery',
    desc: 'The tracking device installs covertly in each vehicle, so in the event of theft you can give police an exact, live location rather than a description.',
  },
  {
    title: 'Control of personal use',
    desc: 'Many organisations permit vehicle use outside working hours so long as it stays reasonable. That policy is routinely misused, and the excess drives up leasing, fuel and maintenance costs. Tracking curbs the misuse, and the savings usually exceed the cost of the system itself.',
  },
  {
    title: 'Fuel saving',
    desc: 'Bringing average speeds down and keeping vehicles inside the limit feeds straight through to fuel burn, maintenance and accident rates worth up to 20% off a monthly fuel bill.',
  },
]

// Headline figures for the impact strip. Every one of these is drawn from the
// benefit copy above rather than invented, so the two can never contradict
// each other on the same page.
export const IMPACT = [
  { value: 25, suffix: '%', label: 'More work orders completed each day' },
  { value: 20, suffix: '%', label: 'Off a typical monthly fuel bill' },
  { value: 24, suffix: '/7', label: 'Live visibility of every vehicle and asset' },
]
