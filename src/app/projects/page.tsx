import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof Project.find>> = [];
  try {
    await connectDB();
    projects = await Project.find({ published: true }).sort({ order: 1 }).lean();
  } catch {
    // DB unavailable
  }

  return (
    <main style={{ background: "var(--ink)", minHeight: "100svh", padding: "clamp(4rem, 8vw, 8rem) clamp(1rem, 6vw, 6rem)" }}>
      <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "3rem" }}>
        ← Back
      </Link>

      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 700, color: "var(--paper)", marginBottom: "3rem" }}>
        All Projects
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "2rem", maxWidth: "1200px" }}>
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden", transition: "border-color 0.2s" }}>
              <div style={{ aspectRatio: "16/9", background: "var(--paper)", position: "relative" }}>
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-doto)", fontSize: "3rem", color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}>
                    0{i + 1}
                  </div>
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {project.techStack.slice(0, 3).map((t: string) => (
                    <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "2px", padding: "0.1rem 0.4rem" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontFamily: "var(--font-geist)", fontSize: "1.1rem", fontWeight: 600, color: "var(--paper)", marginBottom: "0.4rem" }}>
                  {project.title}
                </h2>
                <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                  {project.summary}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
