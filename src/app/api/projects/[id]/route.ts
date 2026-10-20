import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const project = await Project.findById(id).lean();
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(project);
}

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

  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();
  const project = await Project.findByIdAndUpdate(id, parsed.data, {
    new: true, runValidators: true,
  }).lean();
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${parsed.data.slug}`);
  return Response.json(project);
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
  const project = await Project.findByIdAndDelete(id).lean();
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  revalidatePath("/projects");
  return Response.json({ ok: true });
}
