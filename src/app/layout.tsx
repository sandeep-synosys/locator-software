import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/site";
import ScrollRestoration from "@/components/ScrollRestoration";
import ContactDock from "@/components/common/ContactDock";
import StyledJsxRegistry from "./StyledJsxRegistry";
import Script from "next/script";
import { GoogleTagManager } from '@next/third-parties/google';

// ---------------------------------------------------------------------------
// Environment switch.
//
// Only the LIVE site (locator.ae) sets SITE_ENV=production. On beta, local dev,
// preview builds, or anywhere the variable is missing, this is false, so:
//   - Google Tag Manager (GTM-W99N62T) is NOT loaded  -> no beta traffic or test
//     conversions in the real GA4 / Google Ads data
//   - the Tawk.to chat widget is NOT loaded           -> no beta chats in the
//     live chat inbox
//   - robots meta is noindex,nofollow                 -> beta can't get indexed
//
// Failing safe is deliberate: forgetting the variable can never leak tracking
// or indexing, it just leaves them off.
// ---------------------------------------------------------------------------
const isProd = process.env.SITE_ENV === "production";
const GTM_ID = "GTM-W99N62T";

// Self-hosted rather than next/font/google.
//
// `next/font/google` downloads these at BUILD time, so any machine that cannot
// reach fonts.googleapis.com — a corporate proxy, a VPN, an offline CI runner —
// fails the build outright rather than degrading. The files in ./fonts are the
// exact same latin-subset woff2 files Google serves for these families and
// weights, so nothing about the rendered type changes; next/font/google was
// already self-hosting these same bytes into the bundle. The only difference is
// that the fetch now happened once, by hand, instead of on every clean build.
//
// To refresh: request the css2 URL for the family with a modern browser
// User-Agent (an old UA gets you ttf instead of woff2), keep the @font-face
// blocks commented `/* latin */`, and download their src URLs.
const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "./fonts/Poppins-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-700.woff2", weight: "700", style: "normal" },
  ],
});

// Inter ships as a VARIABLE font: Google returns one file for 400/500/600 alike,
// so it is declared once with the range rather than three times with the same src.
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    // Range widened 600 -> 700 for the Get a Quote pill, which the reference
    // renders at bold. This is a descriptor, not a subset: the same file backs
    // it either way, so nothing that already asks for 400-600 changes. If the
    // file's wght axis genuinely stops short of 700 the browser clamps and we
    // get 600 back, which is the previous behaviour rather than a regression.
    { path: "./fonts/Inter-Variable.woff2", weight: "400 700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      {isProd && <GoogleTagManager gtmId={GTM_ID} />}
      <body
        className="min-h-screen bg-background font-poppins antialiased"
        suppressHydrationWarning
      >
        {/* Organization/WebSite structured data for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
            }),
          }}
        />
        {isProd && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {/* Wraps everything that can contain `<style jsx>` — page content and the
            dock alike — so those rules are written into the document during
            rendering instead of being injected by the client at hydration. See
            StyledJsxRegistry for why. */}
        <StyledJsxRegistry>
          <ScrollRestoration />
          {children}
          <ContactDock />
          <Script
            id="tawk-to-chat"
            strategy="lazyOnload"
            src="https://embed.tawk.to/5ed23f408ee2956d73a601e9/default"
            crossOrigin="anonymous"
          />
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
