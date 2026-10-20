import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const project = await Project.findOne({ slug, published: true }).lean();
  if (!project) return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: project.coverImage ? [project.coverImage] : [] },
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({ published: true }, "slug").lean();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return []; // Build without DB — pages rendered on first request
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const project = await Project.findOne({ slug, published: true }).lean();
  if (!project) notFound();

  return (
    <main style={{ background: "var(--ink)", minHeight: "100svh" }}>
      {/* Header */}
      <div style={{ padding: "clamp(3rem, 6vw, 6rem) clamp(1rem, 6vw, 6rem) 0" }}>
        <Link href="/projects" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "3rem" }}>
          ← Projects
        </Link>

        {/* Tech stack */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {project.techStack.map((t: string) => (
            <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "2px", padding: "0.2rem 0.55rem" }}>
              {t}
            </span>
          ))}
        </div>

        <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "clamp(2.5rem, 7vw, 6rem)", fontWeight: 800, color: "var(--paper)", lineHeight: 1.05, marginBottom: "1rem" }}>
          {project.title}
        </h1>
        <p style={{ fontFamily: "var(--font-geist)", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--muted)", maxWidth: "600px", lineHeight: 1.5, marginBottom: "2rem" }}>
          {project.summary}
        </p>

        {/* Links */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", background: "var(--accent)", color: "var(--on-accent)", padding: "0.6rem 1.25rem", borderRadius: "3px", textDecoration: "none" }}>
              Live site →
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid var(--border)", color: "var(--paper)", padding: "0.6rem 1.25rem", borderRadius: "3px", textDecoration: "none" }}>
              GitHub →
            </a>
          )}
        </div>
      </div>

      {/* Cover image */}
      {project.coverImage && (
        <div style={{ position: "relative", aspectRatio: "16/8", maxHeight: "60svh", overflow: "hidden" }}>
          <Image src={project.coverImage} alt={project.title} fill style={{ objectFit: "cover" }} priority sizes="100vw" />
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "clamp(3rem, 6vw, 6rem) clamp(1rem, 6vw, 6rem)", maxWidth: "760px" }}>
        {project.role && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2rem" }}>
            Role: {project.role}
          </p>
        )}
        {project.description && (
          <div style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", color: "var(--paper)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {project.description}
          </div>
        )}

        {/* Image gallery */}
        {project.images.length > 0 && (
          <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "1rem" }}>
            {project.images.map((img: { url: string; alt: string }, i: number) => (
              <div key={i} style={{ position: "relative", aspectRatio: "4/3", borderRadius: "4px", overflow: "hidden" }}>
                <Image src={img.url} alt={img.alt || project.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
