import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  prompt: z.string().trim().max(5000).optional().or(z.literal("")),
  projectId: z.string().trim().min(1).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ideas = await prisma.idea.findMany({
    where: { userId: session.user.id, projectId: null },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ ideas });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { name, description, prompt, projectId } = parsed.data;

  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const idea = await prisma.idea.create({
    data: {
      userId: session.user.id,
      projectId: projectId || null,
      name,
      description: description || null,
      prompt: prompt || null,
    },
  });

  return NextResponse.json({ idea });
}
