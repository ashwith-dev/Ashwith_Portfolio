import { connectDB } from "@/lib/db";
import { Skill } from "@/models/Skill";
import { requireAdmin } from "@/lib/auth";
import { SkillSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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
  const skill = await Skill.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!skill) return Response.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  return Response.json(skill);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const skill = await Skill.findByIdAndDelete(id).lean();
  if (!skill) return Response.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  return Response.json({ ok: true });
}
