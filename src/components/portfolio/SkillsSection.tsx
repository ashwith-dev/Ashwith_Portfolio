"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ISkill } from "@/models/Skill";
import { GUTTER, Label, LinePlate, editorialHeading, sectionLabel } from "./editorial";
import { RevealLines } from "./RevealLines";

interface SkillsSectionProps {
  skills: Pick<ISkill, "name" | "category">[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s.name);
    return acc;
  }, {});
  const categories = Object.entries(byCategory);

  // Each column's plate draws itself as the column scrolls into view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>("[data-column]").forEach((col) => {
        const strokes = col.querySelectorAll<SVGGeometryElement>("[data-plate] path, [data-plate] line, [data-plate] circle");
        strokes.forEach((el) => {
          const len = el.getTotalLength();
          gsap.fromTo(
            el,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: col, start: "top 85%", end: "top 40%", scrub: 1 } }
          );
        });
      });
    }, section);

    return () => ctx.revert();
  }, [skills]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-title"
      style={{ background: "var(--paper)", color: "var(--ink)", padding: `clamp(5rem, 12vw, 9rem) ${GUTTER} clamp(4rem, 9vw, 7rem)`, borderTop: "1px solid var(--border)" }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem 4rem" }}>
        <div>
          <span style={{ ...sectionLabel, color: "var(--muted)", marginBottom: "1.75rem" }}>02 / skills</span>
          <RevealLines as="h2" id="skills-title" text="What I work with" style={editorialHeading} />
        </div>
        <p style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", lineHeight: 1.5, color: "var(--muted)", maxWidth: "34ch", margin: 0 }}>
          {skills.length} tools across {categories.length} areas — the stack behind the projects further down the page.
        </p>
      </div>

      <div
        style={{
          marginTop: "clamp(3rem, 6vw, 5rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          borderTop: "1px solid var(--border)",
        }}
      >
        {categories.map(([category, items], i) => (
          <div
            key={category}
            data-column
            style={{ borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "1.5rem clamp(1rem, 1.6vw, 1.5rem) 2.25rem" }}
          >
            <Label index={i + 1}>{category}</Label>
            <LinePlate
              seed={i * 17 + 5}
              nodes={3 + (i % 3)}
              width={300}
              height={150}
              bg="var(--paper)"
              style={{ width: "100%", height: "auto", margin: "1.75rem 0 1.5rem", color: "var(--ink)", opacity: 0.8 }}
            />
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {items.map((skill) => (
                <li key={skill} style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", lineHeight: 1.35 }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
