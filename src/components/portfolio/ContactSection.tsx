"use client";

import { useState, type FormEvent } from "react";

interface ContactSectionProps {
  email: string;
}

export function ContactSection({ email }: ContactSectionProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      _hp: (form.elements.namedItem("_hp") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    outline: "none",
    color: "var(--on-accent)",
    fontFamily: "var(--font-geist)",
    fontSize: "1rem",
    padding: "0.75rem 0",
    width: "100%",
    transition: "border-color 0.2s",
  };

  return (
    <section
      id="contact"
      aria-label="Contact"
      style={{
        background: "var(--accent)",
        padding: "clamp(4rem, 10vw, 10rem) clamp(1rem, 6vw, 6rem)",
        minHeight: "60svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "1.5rem" }}>
        07 / let&apos;s talk
      </span>

      <h2 style={{ fontFamily: "var(--font-geist)", fontSize: "clamp(2.75rem, 8vw, 7.5rem)", fontWeight: 300, letterSpacing: "-0.035em", color: "var(--on-accent)", lineHeight: 1, marginBottom: "3rem" }}>
        Let&apos;s talk.
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(2.5rem, 6vw, 5rem)", maxWidth: "900px" }}>
        {/* Left: form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Honeypot — hidden from real users */}
          <input name="_hp" type="text" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }} />

          <div>
            <label htmlFor="contact-name" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.25rem" }}>
              Name
            </label>
            <input id="contact-name" name="name" type="text" required maxLength={100} style={inputStyle} />
          </div>

          <div>
            <label htmlFor="contact-email" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.25rem" }}>
              Email
            </label>
            <input id="contact-email" name="email" type="email" required maxLength={200} style={inputStyle} />
          </div>

          <div>
            <label htmlFor="contact-message" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.25rem" }}>
              Message
            </label>
            <textarea id="contact-message" name="message" required maxLength={2000} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            style={{
              background: "var(--on-accent)",
              color: "var(--accent)",
              border: "none",
              borderRadius: "3px",
              padding: "0.85rem 2rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: status === "sending" || status === "sent" ? "not-allowed" : "pointer",
              opacity: status === "sending" || status === "sent" ? 0.7 : 1,
              alignSelf: "flex-start",
            }}
          >
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send message"}
          </button>

          {status === "error" && (
            <p role="alert" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        {/* Right: direct contact info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingTop: "2.5rem" }}>
          {email && (
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "0.3rem" }}>
                Email
              </span>
              <a href={`mailto:${email}`} style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", color: "var(--on-accent)", textDecoration: "underline", textUnderlineOffset: "3px", overflowWrap: "anywhere" }}>
                {email}
              </a>
            </div>
          )}
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "0.3rem" }}>
              Location
            </span>
            <p style={{ fontFamily: "var(--font-geist)", fontSize: "1rem", color: "var(--on-accent)", margin: 0 }}>
              Hyderabad, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
