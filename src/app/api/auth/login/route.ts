import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { LoginSchema } from "@/lib/validators";
import { signToken, sessionCookieOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminHash = process.env.ADMIN_PASSWORD_HASH!;

  const emailOk = email === adminEmail;
  // Always run bcrypt to avoid timing-based enumeration
  const hashToCheck = emailOk ? adminHash : "$2b$12$invalidhashpaddingtomakethisslow00000000000000000000";
  const passwordOk = await compare(password, hashToCheck);

  if (!emailOk || !passwordOk) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ email });
  const store = await cookies();
  store.set(sessionCookieOptions(token));

  return Response.json({ ok: true });
}
