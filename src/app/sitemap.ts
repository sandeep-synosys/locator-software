import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { DEVICES } from "@/components/service/tracking-devices/devices-data";
import { JOBS } from "@/components/about/career/jobs-data";
import { BLOG_POSTS } from "@/components/about/newsroom/blog/blog-index";
import { INDUSTRIES } from "@/components/industries/industries-data";

// Every live route. Add new entries here as routes are added.
const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/get-a-quote", priority: 0.8 },
  { path: "/get-a-free-demo", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/faq", priority: 0.6 },
  { path: "/about/who-we-are", priority: 0.8 },
  { path: "/about/vision", priority: 0.8 },
  { path: "/about/mission", priority: 0.8 },
  { path: "/about/core-values", priority: 0.8 },
  { path: "/about/newsroom", priority: 0.6 },
  { path: "/about/newsroom/blog", priority: 0.8 },
  ...BLOG_POSTS.map((p) => ({ path: `/about/newsroom/blog/${p.slug}`, priority: 0.7 })),
  { path: "/about/career", priority: 0.6 },
  ...JOBS.map((j) => ({ path: `/about/career/${j.slug}`, priority: 0.5 })),
  { path: "/software", priority: 0.9 },
  { path: "/benefits-of-gps-tracking", priority: 0.7 },
  { path: "/industries", priority: 0.8 },
  ...INDUSTRIES.map((i) => ({ path: `/industries/${i.slug}`, priority: 0.7 })),
  { path: "/service/gps-tracking-system", priority: 0.9 },
  { path: "/service/gps-tracker", priority: 0.9 },
  { path: "/service/car-tracker", priority: 0.9 },
  { path: "/service/car-gps-tracker", priority: 0.9 },
  { path: "/service/vehicle-tracking-system", priority: 0.9 },
  { path: "/service/car-tracking-system", priority: 0.9 },
  { path: "/service/fleet-telematics", priority: 0.9 },
  { path: "/service/video-telematics", priority: 0.9 },
  { path: "/service/smart-iot", priority: 0.6 },
  { path: "/service/task-manager", priority: 0.6 },
  { path: "/service/tracking-devices", priority: 0.6 },
  ...DEVICES.map((d) => ({ path: `/service/tracking-devices/${d.slug}`, priority: 0.5 })),
  { path: "/regulatory", priority: 0.8 },
  { path: "/shahin", priority: 0.8 },
  { path: "/asateel-certified-obu", priority: 0.8 },
  { path: "/securepath", priority: 0.8 },
  { path: "/securepath-premium", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
