import type { NextConfig } from "next";
import { redirects as legacyRedirects } from './redirects';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return legacyRedirects;
  },
  poweredByHeader: false,
  compress: true,
  
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],

    // Ship the route's CSS INSIDE the HTML document as a <style> tag instead of
    // a separate <link rel="stylesheet"> request.
    //
    // This is the fix for the flash of unstyled content. Previously the head
    // contained ~17 <link rel="preload"> hints (6 fonts + 11 images) that the
    // preload scanner discovered BEFORE the stylesheet link, so on an HTTP/1.1
    // connection they claimed every socket in the 6-per-origin pool and the
    // render-blocking CSS sat queued behind them. Measured on a throttled
    // Slow-3G profile against `next start`: the CSS request was dispatched at
    // 2068ms and its first response byte did not arrive until 5291ms — 3.2s of
    // pure queueing, while the HTML had finished arriving at 3212ms. That gap is
    // the FOUC window; how it presents (blank screen vs. unstyled markup) is
    // down to the engine, and it widens with round-trip time, which is why it
    // shows up on a Dubai connection and not on a local one.
    //
    // Inlining removes the window rather than shrinking it: there is no second
    // request to lose the race, so the styles cannot arrive after the markup on
    // any connection, from any region, behind any CDN.
    //
    // The cost is real and worth knowing before touching this. `/` goes from
    // 474KB -> 808KB uncompressed, 58.6KB -> 124KB gzipped. That is NOT one copy
    // of the 112KB stylesheet but three: the <style> in <head> plus two more
    // inside the RSC flight payload, which Next emits so client-side navigation
    // can reapply it. Only the first is used for the initial render; the other
    // two are parse cost. Measured first paint on `next start`, cache disabled,
    // median of 3-4 runs: Slow 3G 7480ms -> 2844ms, Slow 3G mobile 7175ms ->
    // 2635ms, Fast 3G 3909ms -> 1934ms. On a fast-bandwidth/high-latency link
    // (5Mbps, 300ms RTT) first paint is main-thread bound rather than
    // network bound in both builds and the difference sits inside run-to-run
    // noise — the win is concentrated exactly where the bug was reported.
    //
    // The way to make this strictly cheaper is to stop shipping one 4000-line
    // globals.css to every route, not to turn this flag back off.
    inlineCss: true,
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Next.js App",
  },
};

export default nextConfig;
