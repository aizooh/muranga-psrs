export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
    const { name, email, password } = parsed.data;
    if (await prisma.user.findUnique({ where: { email } }))
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const user = await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
    });
    await createSession({ userId: user.id, role: "CITIZEN", name: user.name, email: user.email });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}