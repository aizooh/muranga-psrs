import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      status: "success", 
      userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
        hasAuthSecret: !!process.env.AUTH_SECRET,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "error", 
      message: error.message,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
      }
    }, { status: 500 });
  }
}