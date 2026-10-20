import { GUTTER, ON_INK_BORDER, ON_INK_MUTED, editorialHeading, sectionLabel } from "./editorial";
import { RevealLines } from "./RevealLines";

export function CurrentlyBuilding({ items }: { items: string[] }) {
  return (
    <section
      id="now"
      aria-labelledby="now-title"
      style={{ background: "var(--ink)", color: "var(--paper)", padding: `clamp(5rem, 12vw, 10rem) ${GUTTER}` }}
    >
      <div className="editorial-split" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", columnGap: "clamp(1rem, 2vw, 2rem)", rowGap: "3rem" }}>
        <div style={{ gridColumn: "1 / span 7" }}>
          <span style={{ ...sectionLabel, color: ON_INK_MUTED, marginBottom: "1.75rem" }}>05 / now</span>
          <RevealLines as="h2" id="now-title" text="Currently building" style={{ ...editorialHeading, fontSize: "clamp(2.75rem, 8vw, 8rem)", lineHeight: 0.98 }} />
        </div>

        <ol style={{ gridColumn: "9 / span 4", alignSelf: "end", listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${ON_INK_BORDER}` }}>
          {items.map((item, i) => (
            <li key={item} style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", padding: "1.1rem 0", borderBottom: `1px solid ${ON_INK_BORDER}` }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", paddingTop: "0.2rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", lineHeight: 1.45, color: ON_INK_MUTED }}>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
