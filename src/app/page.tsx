import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import RoadSection from "@/components/RoadSection";
import ScrollShowcase from "@/components/ScrollShowcase";
import FeatureSlider from "@/components/FeatureSlider";
import AnimatedGlobeHero from "@/components/AnimatedGlobeHero";
import VideoHeroSection from "@/components/VideoHeroSection";
import SmartIoT from "@/components/SmartIoT";
import Footer from "@/components/layouts/Footer";

// Bottom-of-page sections: self-contained (no shared scroll context), so we
// defer their client JS into separate chunks. SSR stays ON — the HTML is still
// server-rendered, so there is no pop-in, layout shift, or visual change.
const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel/TestimonialCarousel"),
);
const LogoMarquee = dynamic(() => import("@/components/Logomarquee"));
const BlogSection = dynamic(() => import("@/components/BlogSection"));

export const metadata: Metadata = {
  title: "Fleet Telematics, GPS Tracking & Video Telematics UAE",
  description:
    "LOCATOR delivers GPS fleet tracking, AI video telematics, smart IoT asset monitoring, and RTA-certified solutions across the UAE. Real-time visibility for vehicles, drivers, and business assets.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "LOCATOR — Fleet Telematics & GPS Tracking UAE",
    description:
      "Real-time visibility for vehicles, drivers, and business assets across the UAE.",
    url: "/",
    type: "website",
  },
};

// `home-main` on <main> is a hook for the off-screen rendering rules at the
// bottom of globals.css and carries no styling of its own. It scopes them to
// this page's own sections, so the same components used on other routes are
// unaffected.
export default function Home() {
  return (
    <main className="home-main min-h-screen bg-white relative">
      <HeroSection />

      {/* Road needs elevated z-index to layer over hero bottom edge */}
      <div style={{ position: 'relative', zIndex: 200 }}>
        <RoadSection />
      </div>

      <ScrollShowcase />
      <FeatureSlider />
      <SmartIoT />
      <AnimatedGlobeHero />
      <VideoHeroSection />
      <TestimonialCarousel />
      <LogoMarquee />
      <BlogSection />
      <Footer />
    </main>
  );
}
