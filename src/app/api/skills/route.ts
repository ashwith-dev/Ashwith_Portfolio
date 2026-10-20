import { connectDB } from "@/lib/db";
import { Skill } from "@/models/Skill";
import { requireAdmin } from "@/lib/auth";
import { SkillSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET() {
  await connectDB();
  const skills = await Skill.find().sort({ order: 1 }).lean();
  return Response.json(skills);
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

  const parsed = SkillSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();
  const skill = await Skill.create(parsed.data);
  revalidatePath("/");
  return Response.json(skill, { status: 201 });
}
