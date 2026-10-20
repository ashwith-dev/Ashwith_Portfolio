"use client";

import { useEffect, useState } from "react";

interface Message {
  _id: string; name: string; email: string; message: string; read: boolean; createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/messages");
    if (res.ok) {
      setMessages(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>Loading…</p>;

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-geist)", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: "2rem" }}>
        Messages ({messages.filter((m) => !m.read).length} unread)
      </h1>

      {messages.length === 0 && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>No messages yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{ padding: "1.25rem", border: `1px solid ${msg.read ? "var(--border)" : "var(--accent)"}`, borderRadius: "6px", background: msg.read ? "transparent" : "color-mix(in srgb, var(--accent) 5%, transparent)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <span style={{ fontFamily: "var(--font-geist)", fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)" }}>{msg.name}</span>
                {" · "}
                <a href={`mailto:${msg.email}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none" }}>{msg.email}</a>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-geist)", fontSize: "0.875rem", color: "var(--ink)", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
