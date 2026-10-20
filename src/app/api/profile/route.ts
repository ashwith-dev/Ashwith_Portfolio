import { connectDB } from "@/lib/db";
import { Profile } from "@/models/Profile";
import { requireAdmin } from "@/lib/auth";
import { ProfileSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne().lean();
  return Response.json(profile ?? {});
}

export async function PUT(request: Request) {
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

  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();
  const profile = await Profile.findOneAndUpdate({}, parsed.data, {
    upsert: true,
    new: true,
    runValidators: true,
  }).lean();

  revalidatePath("/");
  return Response.json(profile);
}
