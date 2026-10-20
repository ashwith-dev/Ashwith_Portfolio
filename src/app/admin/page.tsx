import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Message } from "@/models/Message";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  let projectCount = 0, unreadCount = 0;
  try {
    await connectDB();
    [projectCount, unreadCount] = await Promise.all([
      Project.countDocuments({ published: true }),
      Message.countDocuments({ read: false }),
    ]);
  } catch {
    // DB not available
  }

  const tiles = [
    { label: "Profile", href: "/admin/profile", desc: "Name, bio, tagline, socials" },
    { label: "Projects", href: "/admin/projects", desc: `${projectCount} published` },
    { label: "Skills", href: "/admin/skills", desc: "Manage skill categories" },
    { label: "Experience", href: "/admin/experience", desc: "Work, education, achievements" },
    { label: "Messages", href: "/admin/messages", desc: unreadCount > 0 ? `${unreadCount} unread` : "Contact inbox" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
        Dashboard
      </h1>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "2.5rem", textTransform: "uppercase" }}>
        Portfolio CMS
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {tiles.map(({ label, href, desc }) => (
          <Link
            key={href}
            href={href}
            style={{ display: "block", textDecoration: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "1.5rem", background: "transparent", color: "inherit", transition: "border-color 0.15s" }}
          >
            <h2 style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.4rem" }}>
              {label}
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", margin: 0 }}>
              {desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
