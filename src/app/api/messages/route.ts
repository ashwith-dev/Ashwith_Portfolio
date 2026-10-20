import { connectDB } from "@/lib/db";
import { Message } from "@/models/Message";
import { requireAdmin } from "@/lib/auth";
import { MessageSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const messages = await Message.find().sort({ createdAt: -1 }).lean();
  return Response.json(messages);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000)) {
    return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = MessageSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  // Honeypot check
  if (parsed.data._hp) {
    return Response.json({ ok: true }); // silently swallow bots
  }

  await connectDB();
  await Message.create({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  return Response.json({ ok: true }, { status: 201 });
}
