import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1 }).lean();
  return Response.json(projects);
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

  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();
  try {
    const project = await Project.create(parsed.data);
    revalidatePath("/");
    revalidatePath("/projects");
    return Response.json(project, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return Response.json({ error: "Slug already exists" }, { status: 409 });
    }
    throw err;
  }
}
