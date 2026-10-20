"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ fontFamily: "var(--font-doto)", fontSize: "2.5rem", color: "var(--accent)", marginBottom: "0.5rem" }}>
          Admin
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2.5rem" }}>
          Portfolio CMS
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label htmlFor="login-email" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              style={{ width: "100%", padding: "0.7rem", border: "1px solid var(--border)", borderRadius: "4px", background: "transparent", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.95rem", outline: "none" }}
            />
          </div>

          <div>
            <label htmlFor="login-password" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              style={{ width: "100%", padding: "0.7rem", border: "1px solid var(--border)", borderRadius: "4px", background: "transparent", color: "var(--ink)", fontFamily: "var(--font-geist)", fontSize: "0.95rem", outline: "none" }}
            />
          </div>

          {error && (
            <p role="alert" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#d32f2f", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: "var(--accent)", color: "var(--on-accent)", border: "none", borderRadius: "4px", padding: "0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
