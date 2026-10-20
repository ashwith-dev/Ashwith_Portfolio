"use client";

export function SkipLink() {
  return (
    <a
      href="#about"
      className="skip-link"
      style={{
        position: "fixed",
        top: "-100%",
        left: "1rem",
        zIndex: 9999,
        background: "var(--accent)",
        color: "var(--on-accent)",
        padding: "0.5rem 1rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        textDecoration: "none",
        borderRadius: "0 0 4px 4px",
        transition: "top 0.1s",
      }}
      onFocus={(e) => { (e.target as HTMLAnchorElement).style.top = "0"; }}
      onBlur={(e) => { (e.target as HTMLAnchorElement).style.top = "-100%"; }}
    >
      Skip to content
    </a>
  );
}
