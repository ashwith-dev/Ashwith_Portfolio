"use client";

import { useEffect, useState, type FormEvent, use } from "react";
import { useRouter } from "next/navigation";

interface ProjectData {
  title: string; slug: string; summary: string; description: string;
  role: string; techStack: string; coverImage: string; liveUrl: string;
  githubUrl: string; featured: boolean; published: boolean; order: number;
}

const DEFAULT: ProjectData = {
  title: "", slug: "", summary: "", description: "", role: "",
  techStack: "", coverImage: "", liveUrl: "", githubUrl: "",
  featured: false, published: false, order: 0,
};

export default function AdminProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const [data, setData] = useState<ProjectData>(DEFAULT);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/projects/${id}`).then((r) => r.json()).then((p) => {
      setData({ ...p, techStack: (p.techStack ?? []).join(", ") });
    });
  }, [id, isNew]);

  function set<K extends keyof ProjectData>(key: K, value: ProjectData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const payload = {
      ...data,
      techStack: data.techStack.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const res = await fetch(isNew ? "/api/projects" : `/api/projects/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("saved");
      if (isNew) router.push("/admin/projects");
    } else {
      setStatus("error");
    }
  }

  const inp = (label: string, key: keyof ProjectData, type = "text") => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={String(data[key])}
        onChange={(e) => set(key, e.target.value as ProjectData[typeof key])}
        style={{ padding: "0.6rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.9rem", outline: "none" }}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2rem" }}>
        {isNew ? "New project" : "Edit project"}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {inp("Title", "title")}
        {inp("Slug (URL)", "slug")}
        {inp("Summary", "summary")}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
            Description (markdown)
          </label>
          <textarea
            rows={8}
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            style={{ padding: "0.6rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", resize: "vertical", outline: "none" }}
          />
        </div>
        {inp("Role", "role")}
        {inp("Tech stack (comma-separated)", "techStack")}
        {inp("Cover image URL", "coverImage", "url")}
        {inp("Live URL", "liveUrl", "url")}
        {inp("GitHub URL", "githubUrl", "url")}
        {inp("Order", "order", "number")}

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink)", cursor: "pointer" }}>
            <input type="checkbox" checked={data.published} onChange={(e) => set("published", e.target.checked)} />
            Published
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink)", cursor: "pointer" }}>
            <input type="checkbox" checked={data.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            type="submit"
            disabled={status === "saving"}
            style={{ background: "var(--accent)", color: "var(--on-accent)", border: "none", borderRadius: "4px", padding: "0.7rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: status === "saving" ? "not-allowed" : "pointer", opacity: status === "saving" ? 0.7 : 1 }}
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save"}
          </button>
          <button type="button" onClick={() => router.push("/admin/projects")} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.7rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", color: "var(--muted)" }}>
            Cancel
          </button>
        </div>
        {status === "error" && <p style={{ color: "#d32f2f", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>Save failed.</p>}
      </form>
    </div>
  );
}
