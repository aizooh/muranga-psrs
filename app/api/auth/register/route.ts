import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  
  if (!parsed.success) {
    // Return the specific Zod error message
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  
  const { name, email, password } = parsed.data;
  if (await prisma.user.findUnique({ where: { email } }))
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
  });
  
  await createSession({ userId: user.id, role: "CITIZEN", name: user.name, email: user.email });
  return NextResponse.json({ ok: true }, { status: 201 });
}