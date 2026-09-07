import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  prompt: z.string().trim().max(5000).nullable().optional(),
  done: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea || idea.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const updated = await prisma.idea.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ idea: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea || idea.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.idea.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
