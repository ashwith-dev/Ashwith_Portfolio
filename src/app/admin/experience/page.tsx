"use client";

import { useEffect, useState, type FormEvent } from "react";

interface ExpItem {
  _id: string; title: string; organization: string;
  type: string; startDate: string; endDate: string;
  description: string; order: number;
}

const EMPTY = { title: "", organization: "", type: "education" as const, startDate: "", endDate: "", description: "", order: 0 };
const TYPES = ["work", "education", "internship", "achievement", "other"];

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExpItem[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/experience");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  function f<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((d) => ({ ...d, [key]: value }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(editId ? `/api/experience/${editId}` : "/api/experience", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm(EMPTY);
    setEditId(null);
    load();
  }

  function startEdit(item: ExpItem) {
    setEditId(item._id);
    setForm({ title: item.title, organization: item.organization, type: item.type as typeof EMPTY.type, startDate: item.startDate, endDate: item.endDate, description: item.description, order: item.order });
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    load();
  }

  const inputStyle = { padding: "0.55rem 0.75rem", border: "1px solid var(--border)", borderRadius: "3px", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.85rem", outline: "none", width: "100%" };

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2rem" }}>
        Experience & Education
      </h1>

      <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "6px" }}>
        <h2 style={{ gridColumn: "1/-1", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>
          {editId ? "Edit entry" : "Add entry"}
        </h2>
        {([ ["Title", "title"], ["Organization", "organization"], ["Start year", "startDate"], ["End year (blank = present)", "endDate"] ] as const).map(([label, key]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</label>
            <input required={key !== "endDate"} value={form[key as keyof typeof EMPTY] as string} onChange={(e) => f(key as keyof typeof EMPTY, e.target.value as never)} style={inputStyle} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Type</label>
          <select value={form.type} onChange={(e) => f("type", e.target.value as typeof EMPTY.type)} style={{ ...inputStyle }}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Order</label>
          <input type="number" value={form.order} onChange={(e) => f("order", Number(e.target.value))} style={inputStyle} />
        </div>
        <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => f("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} style={{ background: "var(--accent)", color: "var(--on-accent)", border: "none", borderRadius: "3px", padding: "0.6rem 1.25rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            {saving ? "Saving…" : editId ? "Update" : "Add"}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.6rem 1.25rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", color: "var(--muted)" }}>Cancel</button>}
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item) => (
          <div key={item._id} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "4px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.25rem", display: "block" }}>{item.type}</span>
              <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 0.2rem" }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>{item.organization} · {item.startDate}{item.endDate ? ` – ${item.endDate}` : " – Present"}</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
              <button onClick={() => startEdit(item)} style={{ background: "transparent", border: "none", color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", cursor: "pointer" }}>Edit</button>
              <button onClick={() => remove(item._id)} style={{ background: "transparent", border: "none", color: "#d32f2f", fontFamily: "var(--font-mono)", fontSize: "0.65rem", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
