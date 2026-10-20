"use client";

import { useEffect, useState } from "react";

const pill = {
  fontFamily: "var(--font-geist)",
  fontSize: "0.8rem",
  lineHeight: 1,
  padding: "0.6rem 0.95rem",
  textDecoration: "none",
  borderRadius: "999px",
} as const;

/** Small fixed top-right nav; stays out of the intro and appears once the accent hero reaches the top. */
export function SiteNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("about-wrap");
    if (!anchor) return;
    const update = () => setVisible(anchor.getBoundingClientRect().top <= 1);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav
      aria-label="Site"
      style={{
        position: "fixed",
        top: "1rem",
        right: "clamp(1rem, 3vw, 2rem)",
        zIndex: 50,
        display: "flex",
        gap: "0.4rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(-8px)",
        visibility: visible ? "visible" : "hidden",
        transition: visible
          ? "opacity 0.3s ease, transform 0.3s ease, visibility 0s"
          : "opacity 0.3s ease, transform 0.3s ease, visibility 0s 0.3s",
      }}
    >
      <a href="#work" style={{ ...pill, background: "var(--paper)", color: "var(--ink)", boxShadow: "inset 0 0 0 1px var(--border)" }}>
        Work
      </a>
      <a href="#contact" style={{ ...pill, background: "var(--ink)", color: "var(--paper)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--paper) 28%, transparent)" }}>
        Contact
      </a>
    </nav>
  );
}
