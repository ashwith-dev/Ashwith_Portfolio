"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Skill { _id: string; name: string; category: string; order: number; }

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/skills");
    setSkills(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, order }),
    });
    setName(""); setCategory(""); setOrder(0);
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  }

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2rem" }}>
        Skills
      </h1>

      {/* Add form */}
      <form onSubmit={add} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Name", val: name, set: setName },
          { label: "Category", val: category, set: setCategory },
        ].map(({ label, val, set }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</label>
            <input required value={val} onChange={(e) => set(e.target.value)} style={{ padding: "0.55rem 0.75rem", border: "1px solid var(--border)", borderRadius: "3px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.85rem", outline: "none", width: "160px" }} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} style={{ padding: "0.55rem 0.75rem", border: "1px solid var(--border)", borderRadius: "3px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.85rem", outline: "none", width: "80px" }} />
        </div>
        <button type="submit" disabled={saving} style={{ background: "var(--accent)", color: "var(--on-accent)", border: "none", borderRadius: "3px", padding: "0.55rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
          Add
        </button>
      </form>

      {/* Skills grouped by category */}
      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
            {cat}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skills.filter((s) => s.category === cat).map((s) => (
              <div key={s._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "color-mix(in srgb, var(--ink) 6%, transparent)", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.3rem 0.75rem" }}>
                <span style={{ fontFamily: "var(--font-geist)", fontSize: "0.85rem", color: "var(--ink)" }}>{s.name}</span>
                <button onClick={() => remove(s._id)} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
