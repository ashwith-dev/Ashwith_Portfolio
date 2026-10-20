"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string; title: string; slug: string; published: boolean; featured: boolean; order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  async function toggle(id: string, field: "published" | "featured", value: boolean) {
    const project = projects.find((p) => p._id === id);
    if (!project) return;
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...project, [field]: value }),
    });
    load();
  }

  if (loading) return <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)" }}>Projects</h1>
        <Link
          href="/admin/projects/new"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--accent)", color: "var(--on-accent)", padding: "0.5rem 1rem", borderRadius: "3px", textDecoration: "none" }}
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>No projects yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {projects.map((p) => (
          <div
            key={p._id}
            style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--paper)" }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", width: "24px", textAlign: "center" }}>{p.order}</span>
            <span style={{ flex: 1, fontFamily: "var(--font-geist)", fontSize: "0.9rem", color: "var(--ink)", fontWeight: 500 }}>{p.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)" }}>{p.slug}</span>

            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", cursor: "pointer" }}>
              <input type="checkbox" checked={p.published} onChange={(e) => toggle(p._id, "published", e.target.checked)} />
              Published
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", cursor: "pointer" }}>
              <input type="checkbox" checked={p.featured} onChange={(e) => toggle(p._id, "featured", e.target.checked)} />
              Featured
            </label>

            <Link href={`/admin/projects/${p._id}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
              Edit
            </Link>
            <button
              onClick={() => deleteProject(p._id)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", border: "none", color: "#d32f2f", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
