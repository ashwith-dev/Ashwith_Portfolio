"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { IProject } from "@/models/Project";
import { GUTTER, Label, LinePlate, ON_INK_BORDER, ON_INK_MUTED, editorialHeading, sectionLabel } from "./editorial";
import { RevealLines } from "./RevealLines";

interface ProjectsSectionProps {
  projects: Pick<IProject, "title" | "slug" | "summary" | "coverImage" | "techStack">[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length === 0) return;
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalWidth = track.scrollWidth - wrapRef.current!.clientWidth;

      if (totalWidth <= 0) return;

      // On mobile (< 768px) skip pinned horizontal scroll
      if (window.innerWidth < 768) return;

      // Start directly under the pinned quote, so its ink wipe hands over to this section
      // instead of a full screen of empty ink scrolling past.
      wrapRef.current!.style.marginTop = "-100svh";

      const distance = () => track.scrollWidth - wrapRef.current!.clientWidth;
      // The first screen of scroll is the quote sliding off above; the cards only move after that.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to({}, { duration: window.innerHeight / distance() });
      tl.to(track, { x: () => -distance(), ease: "none", duration: 1 });
    }, wrapRef);

    const wrap = wrapRef.current;
    return () => {
      ctx.revert();
      if (wrap) wrap.style.marginTop = "";
    };
  }, [projects]);

  return (
    <section
      ref={wrapRef}
      id="work"
      aria-labelledby="work-title"
      style={{ position: "relative", zIndex: 1, background: "var(--ink)", color: "var(--paper)", overflow: "hidden" }}
    >
      <div style={{ padding: `clamp(4rem, 9svh, 6rem) ${GUTTER} clamp(2rem, 5svh, 3rem)`, display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem 3rem" }}>
        <div>
          <span style={{ ...sectionLabel, color: ON_INK_MUTED, marginBottom: "1.25rem" }}>06 / selected work</span>
          <RevealLines as="h2" id="work-title" text="Selected work" style={{ ...editorialHeading, fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }} />
        </div>
        <span style={{ ...sectionLabel, color: ON_INK_MUTED, letterSpacing: "0.15em" }}>{projects.length} projects</span>
      </div>

      {/* Horizontal scroll track (stacks vertically below 768px, see globals.css) */}
      <div
        ref={trackRef}
        className="projects-track"
        style={{
          display: "flex",
          padding: `0 ${GUTTER} clamp(3rem, 8svh, 5rem)`,
          width: "max-content",
        }}
      >
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            style={{
              display: "block",
              width: "clamp(290px, 31vw, 460px)",
              flexShrink: 0,
              textDecoration: "none",
              color: "inherit",
              borderLeft: `1px solid ${ON_INK_BORDER}`,
              padding: "0 clamp(1rem, 1.8vw, 1.75rem) 1rem",
            }}
          >
            <article>
              <Label index={i + 1}>{project.title}</Label>

              <div
                style={{
                  aspectRatio: "4 / 3",
                  maxHeight: "38svh",
                  width: "100%",
                  margin: "1.5rem 0 1.25rem",
                  position: "relative",
                  overflow: "hidden",
                  background: "color-mix(in srgb, var(--paper) 5%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.05)" }}
                    sizes="(max-width: 768px) 90vw, 31vw"
                  />
                ) : (
                  <LinePlate
                    seed={i * 29 + 11}
                    nodes={4 + (i % 3)}
                    width={320}
                    height={220}
                    bg="var(--ink)"
                    style={{ width: "82%", height: "auto", color: "var(--paper)", opacity: 0.55 }}
                  />
                )}
              </div>

              <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", lineHeight: 1.55, color: ON_INK_MUTED, margin: "0 0 1rem" }}>
                {project.summary}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", margin: 0, lineHeight: 1.8 }}>
                {project.techStack.slice(0, 5).join(" · ")}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
