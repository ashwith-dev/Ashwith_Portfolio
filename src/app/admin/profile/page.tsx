"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Metadata } from "next";

interface ProfileData {
  name?: string; tagline?: string; heroTagline?: string; bio?: string;
  pullQuote?: string; currentlyBuilding?: string[]; location?: string;
  email?: string; resumeUrl?: string; avatarUrl?: string;
  socials?: { label: string; url: string }[];
}

const field = (label: string, name: string, value: string, onChange: (v: string) => void, type = "text", multiline = false) => (
  <div key={name} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
    <label htmlFor={`pf-${name}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        id={`pf-${name}`}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "0.6rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.9rem", resize: "vertical", outline: "none" }}
      />
    ) : (
      <input
        id={`pf-${name}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "0.6rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.9rem", outline: "none" }}
      />
    )}
  </div>
);

export default function AdminProfilePage() {
  const [data, setData] = useState<ProfileData>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then(setData);
  }, []);

  function update(key: keyof ProfileData) {
    return (v: string) => setData((d) => ({ ...d, [key]: v }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2rem" }}>
        Profile
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {field("Name", "name", data.name ?? "", update("name"))}
        {field("Tagline", "tagline", data.tagline ?? "", update("tagline"))}
        {field("Hero tagline (shown in intro)", "heroTagline", data.heroTagline ?? "", update("heroTagline"))}
        {field("Bio", "bio", data.bio ?? "", update("bio"), "text", true)}
        {field("Pull quote", "pullQuote", data.pullQuote ?? "", update("pullQuote"))}
        {field("Location", "location", data.location ?? "", update("location"))}
        {field("Email", "email", data.email ?? "", update("email"), "email")}
        {field("Resume URL", "resumeUrl", data.resumeUrl ?? "", update("resumeUrl"), "url")}
        {field("Avatar URL", "avatarUrl", data.avatarUrl ?? "", update("avatarUrl"), "url")}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
            Currently Building (one per line)
          </label>
          <textarea
            rows={3}
            value={(data.currentlyBuilding ?? []).join("\n")}
            onChange={(e) => setData((d) => ({ ...d, currentlyBuilding: e.target.value.split("\n").filter(Boolean) }))}
            style={{ padding: "0.6rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.9rem", resize: "vertical", outline: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          style={{ alignSelf: "flex-start", background: "var(--accent)", color: "var(--on-accent)", border: "none", borderRadius: "4px", padding: "0.7rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: status === "saving" ? "not-allowed" : "pointer", opacity: status === "saving" ? 0.7 : 1 }}
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
        </button>
        {status === "error" && <p style={{ color: "#d32f2f", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>Save failed. Check your session.</p>}
      </form>
    </div>
  );
}
