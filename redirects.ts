// redirects.ts
// Old locator.ae URLs -> new Next.js URLs (73 rules). Source of truth = the mapping sheet.
// '/' and '/sitemap.xml' are intentionally NOT redirected.

export type RedirectRule = { source: string; destination: string; permanent: true };

const rules: [string, string][] = [
  ['/aboutus.html', '/about/who-we-are'],
  ['/software.html', '/software'],
  ['/services.html', '/service/fleet-telematics'],
  ['/shahin.html', '/shahin'],
  ['/asateel-certified-OBU.html', '/asateel-certified-obu'],
  ['/securepath.html', '/securepath'],
  ['/Shahin/securepathpremium.html', '/securepath-premium'],
  ['/Vehicle-tracking-UAE.html', '/service/vehicle-tracking-system'],
  ['/get-free-quote.html', '/get-a-quote'],
  ['/free-demo.html', '/get-a-free-demo'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/blog-details.html/13/Fleet-Tracking-Software', '/about/newsroom/blog/fleet-tracking-software-real-time-vehicle-management'],
  ['/blog-details.html/12/Optimized-GPS', '/about/newsroom/blog/the-tracking-edge-optimized-gps-and-field-tools'],
  ['/career.html', '/about/career'],
  ['/why-locator.html', '/'], // REVIEW: not a topical match (homepage/unrelated target) - Google may treat as soft 404
  ['/blog.html', '/about/newsroom/blog'],
  ['/gps-tracking.html', '/benefits-of-gps-tracking'],
  ['/GPS-Tracker.html', '/service/gps-tracker'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/Car-Tracker.html', '/service/car-tracker'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/GPS-Tracking-System.html', '/service/gps-tracking-system'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/Car-GPS-Tracker.html', '/service/car-gps-tracker'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/Car-Tracking-System.html', '/service/car-tracking-system'],
  ['/Vehicle-Tracking-System.html', '/service/vehicle-tracking-system'],
  ['/contact.html', '/contact'],
  ['/Services/sales-service-tracking.html', '/service/fleet-telematics'],
  ['/Services/delivery-trucks-tracking.html', '/service/fleet-telematics'],
  ['/Services/field-staff-tracking.html', '/service/task-manager'],
  ['/Services/asset-tracking.html', '/service/smart-iot'],
  ['/Services/motor-cycle-tracking.html', '/service/fleet-telematics'],
  ['/Services/school-bus-tracking.html', '/service/fleet-telematics'],
  ['/device-details.html/1/FMB120', '/service/tracking-devices/fmb120'],
  ['/device-details.html/2/FMB920', '/service/tracking-devices/fmb920'],
  ['/device-details.html/3/FMB202', '/service/tracking-devices/fmb202'],
  ['/device-details.html/4/iButton-Reader-Tag', '/service/tracking-devices/ibutton-reader-tag'],
  ['/device-details.html/5/RIF-Reader-Tag', '/service/tracking-devices/rfid-reader-tag'],
  ['/device-details.html/6/Fuel-Sensor', '/service/tracking-devices/fuel-sensor'],
  ['/device-details.html/7/Temperature-Sensor', '/service/tracking-devices/temperature-sensor'],
  ['/device-details.html/8/LV-CAN200', '/service/tracking-devices/lv-can200'],
  ['/device-details.html/9/Bluetooth-Temperature-Humidity', '/service/tracking-devices/bluetooth-temperature-humidity'],
  ['/advice-on-shahin-registration.html', '/shahin'],
  ['/Shahin/shahin-registration.html', '/shahin'],
  ['/help-on-asateel-account-creation.html', '/asateel-certified-obu'],
  ['/asateel-for-delivery-motorbikes.html', '/asateel-certified-obu'],
  ['/SecurePath/certificate.html', '/securepath'],
  ['/SecurePath/certification.html', '/securepath'],
  ['/advice-on-securepath-premium-registration.html', '/securepath-premium'],
  ['/sales-service-tracking.php', '/service/fleet-telematics'],
  ['/delivery-trucks-tracking.php', '/service/fleet-telematics'],
  ['/field-staff-tracking.php', '/service/task-manager'],
  ['/blog-details.html/11/Car-Tracker-Hub', '/about/newsroom/blog/car-tracker-hub-from-routes-to-reports'],
  ['/blog-details.html/10/GPS-Tracker-Insights', '/about/newsroom/blog/next-gen-gps-tracker-insights'],
  ['/blog-details.html/9/Tracker-for-car', '/about/newsroom/blog/car-fleet-why-you-need-a-gps-tracker'],
  ['/blog-details.html/8/GPS-Trackers-Matter-for-Your-Business', '/about/newsroom/blog/why-gps-trackers-matter-for-your-business'],
  ['/blog-details.html/7/The-Power-of-GPS-Vehicle-Trackers', '/about/newsroom/blog/gps-vehicle-trackers-fleet-management-dubai'],
  ['/blog-details.html/1/4-Steps-to-get-vehicle-permit-in-asateel', '/about/newsroom/blog/asateel-vehicle-permit-4-simple-steps'],
  ['/blog-details.html/2/ASATEEL-Simple', '/about/newsroom/blog/asateel-certified-obu-installation-made-simple'],
  ['/blog-details.html/3/Freight-and-passenger-transport-operating', '/about/newsroom/blog/asateel-freight-and-passenger-transport-abu-dhabi'],
  ['/blog-details.html/4/Covid-19', '/about/newsroom/blog'],
  ['/blog-details.html/5/Fleet-Management-Softwares', '/about/newsroom/blog/ten-things-a-fleet-manager-should-be-tracking'],
  ['/blog-details.html/6/High-Mileage-Vehicles', '/about/newsroom/blog/how-to-keep-high-mileage-vehicles-running-smoothly'],
  ['/car-gps-tracker-details.html/1/Fuel-Management', '/service/car-gps-tracker'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/car-gps-tracker-details.html/2/Real-Time-Location-And-GPS', '/service/car-gps-tracker'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/car-gps-tracker-details.html/3/Customizable-Notifications', '/service/car-gps-tracker'], // VERIFY: destination not in the sitemap I saw - must return 200 before launch
  ['/car-tracking-system-details.html/1/Real-Time-Fleet-Visibility', '/service/car-tracking-system'],
  ['/car-tracking-system-details.html/2/Reduced-Fleet-Cost', '/service/car-tracking-system'],
  ['/car-tracking-system-details.html/3/Easy-Reporting', '/service/car-tracking-system'],
  ['/vehicle-tracking-system-details.html/1/Real-Time-Location-and-GPS', '/service/vehicle-tracking-system'],
  ['/vehicle-tracking-system-details.html/2/Proper-Fuel-Management', '/service/vehicle-tracking-system'],
  ['/vehicle-tracking-system-details.html/3/Customizable-and-Accurate-Alerts', '/service/vehicle-tracking-system'],
  ['/advice-to-register-delivery-bikes-in-asateel.html', '/asateel-certified-obu'],
  ['/assistance-on-securepath-certificate-process.html', '/securepath'],
  ['/guidance-on-securepath-certification-process.html', '/securepath'],
  ['/partners.html', '/'],
  ['/faq.html', '/faq'],
];

// ---- Build-time safety net: fails the build if someone later introduces a mistake ----
const lower = (v: string) => v.toLowerCase();
const sources = new Set(rules.map(([s]) => lower(s)));
const seen = new Set<string>();
for (const [s, d] of rules) {
  if (!s.startsWith('/') || !d.startsWith('/')) throw new Error(`Redirect must start with '/': ${s} -> ${d}`);
  if (seen.has(lower(s))) throw new Error(`Duplicate redirect source: ${s}`);
  seen.add(lower(s));
  if (lower(s) === lower(d)) throw new Error(`Redirect loop: ${s}`);
  if (sources.has(lower(d))) throw new Error(`Redirect chain: ${s} -> ${d} (destination is itself redirected)`);
}

export const redirects: RedirectRule[] = rules.map(([source, destination]) => ({
  source,
  destination,
  permanent: true, // Next.js sends 308; Google treats it the same as 301
}));
