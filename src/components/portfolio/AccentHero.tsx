import { GUTTER, LinePlate, sectionLabel } from "./editorial";
import { RevealLines } from "./RevealLines";

interface AccentHeroProps {
  title: string;
  note: string;
  nodes: string[];
  bio: string;
  location: string;
  resumeUrl: string;
}

/**
 * Sticky accent title card with a static network diagram; the about section
 * slides up over it, then both scroll away together.
 */
export function AccentHero({ title, note, nodes, bio, location, resumeUrl }: AccentHeroProps) {
  const titleLines = title.split("·").map((s) => s.trim()).filter(Boolean);

  return (
    <div id="about-wrap" style={{ position: "relative" }}>
      <section
        aria-labelledby="accent-hero-title"
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          minHeight: "560px",
          background: "var(--accent)",
          color: "var(--on-accent)",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "minmax(0, 1fr) auto",
          gap: "2rem",
          padding: `clamp(4.5rem, 10svh, 6.5rem) ${GUTTER} clamp(1.75rem, 6svh, 3.5rem)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
          {nodes.length > 0 && (
            <LinePlate
              seed={23}
              labels={nodes}
              width={920}
              height={400}
              bg="var(--accent)"
              strokeWidth={1}
              style={{ width: "min(100%, 980px)", maxHeight: "100%", height: "auto", opacity: 0.92 }}
            />
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem 3rem" }}>
          <h2
            id="accent-hero-title"
            style={{ fontFamily: "var(--font-geist)", fontWeight: 300, fontSize: "clamp(2rem, 4.3vw, 4.75rem)", lineHeight: 1.04, letterSpacing: "-0.035em", margin: 0 }}
          >
            {titleLines.map((line) => (
              <span key={line} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
          {note && (
            <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.875rem", lineHeight: 1.45, maxWidth: "28ch", margin: 0, opacity: 0.92 }}>
              {note}
            </p>
          )}
        </div>
      </section>

      <section
        id="about"
        aria-label="About"
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--paper)",
          color: "var(--ink)",
          minHeight: "100svh",
          padding: `clamp(5rem, 14svh, 9rem) ${GUTTER} clamp(3rem, 8svh, 5rem)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "3rem",
        }}
      >
        <div>
          <span style={{ ...sectionLabel, color: "var(--muted)", marginBottom: "clamp(2rem, 5svh, 3.5rem)" }}>01 / about</span>
          <RevealLines
            text={bio}
            style={{ fontFamily: "var(--font-geist)", fontWeight: 400, fontSize: "clamp(1.45rem, 3.1vw, 3rem)", lineHeight: 1.2, letterSpacing: "-0.018em", maxWidth: "1250px", margin: 0 }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
          <span style={{ ...sectionLabel, color: "var(--muted)", letterSpacing: "0.15em" }}>{location}</span>
          <a
            href={resumeUrl || "#contact"}
            {...(resumeUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            style={{ ...sectionLabel, letterSpacing: "0.15em", color: "var(--accent)", textDecoration: "none" }}
          >
            {resumeUrl ? "Résumé ↗" : "Get in touch →"}
          </a>
        </div>
      </section>
    </div>
  );
}
