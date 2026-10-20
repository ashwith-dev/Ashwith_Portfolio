import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", background: "var(--paper)" }}>
      {/* Top nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 clamp(1rem, 4vw, 3rem)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", height: "56px", overflowX: "auto" }}>
          <Link
            href="/admin"
            style={{ fontFamily: "var(--font-doto)", fontSize: "1.2rem", color: "var(--accent)", textDecoration: "none", flexShrink: 0 }}
          >
            CMS
          </Link>

          <div style={{ display: "flex", gap: "0.25rem", flex: 1 }}>
            {navLinks.slice(1).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  textDecoration: "none",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "3px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexShrink: 0 }}>
            <Link
              href="/"
              target="_blank"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}
            >
              View site →
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 3rem)" }}>
        {children}
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.3rem 0.7rem", color: "var(--muted)", cursor: "pointer" }}
      >
        Log out
      </button>
    </form>
  );
}
