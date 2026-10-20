import { connectDB } from "@/lib/db";
import { Experience } from "@/models/Experience";
import { requireAdmin } from "@/lib/auth";
import { ExperienceSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET() {
  await connectDB();
  const experience = await Experience.find().sort({ order: 1 }).lean();
  return Response.json(experience);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ExperienceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();
  const item = await Experience.create(parsed.data);
  revalidatePath("/");
  return Response.json(item, { status: 201 });
}
