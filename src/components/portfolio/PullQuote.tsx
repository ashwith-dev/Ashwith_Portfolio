"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GUTTER } from "./editorial";

interface PullQuoteProps {
  quote: string;
  author: string;
}

// Relief texture (cracked-earth feel) generated from noise, so no photo asset is needed.
// Used as a background image, so the browser rasterises the filter once instead of every frame.
const TEXTURE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'><filter id='t' x='0' y='0' width='100%' height='100%'><feTurbulence type='turbulence' baseFrequency='0.0065 0.011' numOctaves='6' seed='9' result='n'/><feDiffuseLighting in='n' lighting-color='#ffffff' surfaceScale='6'><feDistantLight azimuth='225' elevation='38'/></feDiffuseLighting></filter><rect width='100%' height='100%' filter='url(#t)'/></svg>`;
const TEXTURE = `url("data:image/svg+xml,${encodeURIComponent(TEXTURE_SVG)}")`;
const STEPS = 9;

export function PullQuote({ quote, author }: PullQuoteProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const words = quote.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const section = sectionRef.current!;
    const wordEls = section.querySelectorAll<HTMLElement>("[data-word]");
    const steps = section.querySelectorAll<HTMLElement>("[data-step]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wordEls.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Pinned: words light up, then ink steps sweep in from the left (bottom row first)
    // and hand over to the dark projects section.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "+=150%", pin: true, scrub: 0.8 },
      });
      tl.fromTo(wordEls, { opacity: 0.28 }, { opacity: 1, ease: "none", duration: 0.3, stagger: 0.7 / Math.max(1, wordEls.length) }, 0);
      tl.to(steps, { scaleX: 1, ease: "power2.inOut", duration: 0.5, stagger: { each: 0.06, from: "end" } }, 1.2);
    }, section);

    return () => ctx.revert();
  }, [quote]);

  return (
    <section
      ref={sectionRef}
      aria-label="Statement"
      style={{
        position: "relative",
        zIndex: 2,
        height: "100svh",
        minHeight: "520px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: `0 ${GUTTER}`,
        backgroundColor: "var(--ink)",
        backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--ink) 80%, transparent) 0%, color-mix(in srgb, var(--ink) 45%, transparent) 70%), ${TEXTURE}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <figure style={{ margin: 0, position: "relative", zIndex: 1, maxWidth: "100%" }}>
        <blockquote style={{ margin: 0 }}>
          <p
            aria-label={quote}
            style={{ fontFamily: "var(--font-geist)", fontWeight: 300, fontSize: "clamp(2.25rem, 6vw, 5.75rem)", lineHeight: 1.04, letterSpacing: "-0.035em", color: "var(--paper)", margin: 0, maxWidth: "13em" }}
          >
            <span aria-hidden="true">“</span>
            {words.map((word, i) => (
              <span key={i} data-word aria-hidden="true" style={{ opacity: 0.28 }}>
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
            <span aria-hidden="true">”</span>
          </p>
        </blockquote>
        <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "color-mix(in srgb, var(--paper) 70%, transparent)", marginTop: "2rem" }}>
          — {author}
        </figcaption>
      </figure>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", pointerEvents: "none" }}>
        {Array.from({ length: STEPS }, (_, i) => (
          <div key={i} data-step style={{ flex: 1, marginBottom: -1, background: "var(--ink)", transform: "scaleX(0)", transformOrigin: "left center" }} />
        ))}
      </div>
    </section>
  );
}
