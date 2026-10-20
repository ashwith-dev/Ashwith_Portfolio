import { cookies } from "next/headers";
import { clearCookieOptions } from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  store.set(clearCookieOptions());
  return Response.json({ ok: true });
}
