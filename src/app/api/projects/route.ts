import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  prompt: z.string().trim().max(5000).optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { ideas: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
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

  const { name, description, prompt } = parsed.data;
  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      name,
      description: description || null,
      prompt: prompt || null,
    },
  });

  return NextResponse.json({ project });
}
