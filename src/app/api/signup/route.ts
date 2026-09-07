import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().trim().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, passwordHash, name },
  });

  return NextResponse.json({ ok: true });
}
