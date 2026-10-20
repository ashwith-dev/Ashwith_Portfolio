import type { IExperience } from "@/models/Experience";
import { GUTTER, sectionLabel } from "./editorial";
import { RevealLines } from "./RevealLines";

interface AchievementsSectionProps {
  items: Pick<IExperience, "title" | "organization" | "startDate" | "endDate" | "description">[];
}

export function AchievementsSection({ items }: AchievementsSectionProps) {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      style={{ background: "var(--paper)", color: "var(--ink)", padding: `0 ${GUTTER} clamp(5rem, 10vw, 8rem)` }}
    >
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "clamp(4rem, 8vw, 6rem)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem 3rem" }}>
        <div>
          <span style={{ ...sectionLabel, color: "var(--muted)", marginBottom: "1.5rem" }}>04 / achievements</span>
          <RevealLines
            as="h2"
            id="achievements-title"
            text="Achievements"
            style={{ fontFamily: "var(--font-geist)", fontWeight: 300, fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0 }}
          />
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "clamp(2.5rem, 5vw, 4rem) 0 0" }}>
        {items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="editorial-split"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              columnGap: "clamp(1rem, 2vw, 2rem)",
              rowGap: "0.75rem",
              padding: "clamp(1.5rem, 3vw, 2.25rem) 0",
              borderTop: "1px solid var(--border)",
              borderBottom: i === items.length - 1 ? "1px solid var(--border)" : undefined,
            }}
          >
            <span style={{ gridColumn: "1 / span 2", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--accent)", paddingTop: "0.5rem" }}>
              {item.endDate && item.endDate !== item.startDate ? `${item.startDate} – ${item.endDate}` : item.startDate}
            </span>
            <div style={{ gridColumn: "3 / span 5" }}>
              <h3 style={{ fontFamily: "var(--font-geist)", fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>
                {item.title}
              </h3>
              {item.organization && (
                <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.95rem", color: "var(--muted)", margin: "0.4rem 0 0" }}>{item.organization}</p>
              )}
            </div>
            {item.description && (
              <p style={{ gridColumn: "8 / span 5", fontFamily: "var(--font-geist)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0, paddingTop: "0.35rem" }}>
                {item.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
