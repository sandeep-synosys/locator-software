"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

// Start artwork before its section is visible, including layers hidden by a
// GSAP timeline. Native lazy loading alone waits too long for those layers.
function useArtworkLoading() {
  const ref = useRef<HTMLImageElement>(null);
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    const image = ref.current;
    if (!image) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setNearby(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearby(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(image.closest("section, footer") || image);
    return () => observer.disconnect();
  }, []);

  return { ref, loading: nearby ? ("eager" as const) : ("lazy" as const) };
}

export default function ViewportImage(props: ImageProps) {
  const artwork = useArtworkLoading();
  return <Image {...props} alt={props.alt} {...artwork} />;
}

export function ViewportNativeImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const artwork = useArtworkLoading();
  // Native images also need loading="lazy" during SSR: React otherwise emits
  // preload hints, even for artwork many screens below the first viewport.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ""} {...artwork} />;
}
