import { connectDB } from "@/lib/db";
import { Experience } from "@/models/Experience";
import { requireAdmin } from "@/lib/auth";
import { ExperienceSchema } from "@/lib/validators";
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

  const parsed = ExperienceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();
  const item = await Experience.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  return Response.json(item);
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
  const item = await Experience.findByIdAndDelete(id).lean();
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  return Response.json({ ok: true });
}
