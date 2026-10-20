import type { IExperience } from "@/models/Experience";
import { GUTTER, Label, editorialHeading, sectionLabel } from "./editorial";
import { RevealLines } from "./RevealLines";

interface ExperienceSectionProps {
  items: Pick<IExperience, "title" | "organization" | "type" | "startDate" | "endDate" | "description">[];
}

const TYPE_LABELS: Record<string, string> = {
  work: "Work",
  education: "Education",
  internship: "Internship",
  achievement: "Achievement",
  other: "Other",
};

// Rows alternate between two column placements on a 12-column grid, like the reference's staggered topic rows.
const PLACEMENT = [
  { meta: "1 / span 3", body: "4 / span 5" },
  { meta: "6 / span 3", body: "9 / span 4" },
];

export function ExperienceSection({ items }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      style={{ background: "var(--paper)", color: "var(--ink)", padding: `0 ${GUTTER} clamp(5rem, 10vw, 9rem)` }}
    >
      <div style={{ paddingTop: "clamp(4rem, 8vw, 7rem)" }}>
        <span style={{ ...sectionLabel, color: "var(--muted)", marginBottom: "1.75rem" }}>03 / experience & education</span>
        <RevealLines as="h2" id="experience-title" text="Experience & education" style={editorialHeading} />
      </div>

      <ol style={{ listStyle: "none", padding: 0, margin: "clamp(3rem, 6vw, 5rem) 0 0" }}>
        {items.map((item, i) => {
          const place = PLACEMENT[i % 2];
          return (
            <li
              key={`${item.title}-${i}`}
              className="editorial-split"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                columnGap: "clamp(1rem, 2vw, 2rem)",
                rowGap: "1.25rem",
                padding: "clamp(2rem, 4vw, 3.5rem) 0",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div style={{ gridColumn: place.meta }}>
                <Label index={i + 1}>{TYPE_LABELS[item.type] ?? item.type}</Label>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--muted)", margin: "0.9rem 0 0" }}>
                  {item.startDate}
                  {item.endDate ? ` – ${item.endDate}` : " – Present"}
                </p>
              </div>

              <div style={{ gridColumn: place.body }}>
                <h3 style={{ fontFamily: "var(--font-geist)", fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.2, margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", color: "var(--muted)", margin: "0.4rem 0 0" }}>{item.organization}</p>
                {item.description && (
                  <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", lineHeight: 1.6, margin: "1rem 0 0", maxWidth: "60ch" }}>
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
