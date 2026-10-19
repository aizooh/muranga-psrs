import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { STATUSES } from "@/lib/validation";

const schema = z.object({
  status: z.enum(STATUSES),
  note: z.string().max(500).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input data" }, { status: 400 });

  const current = await prisma.request.findUnique({ where: { id: params.id } });
  if (!current) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  
  if (current.status === parsed.data.status)
    return NextResponse.json({ error: "Already in that status" }, { status: 400 });

  try {
    const updated = await prisma.request.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status,
        resolvedAt: parsed.data.status === "RESOLVED" ? new Date() : null,
        events: {
          create: { 
            fromStatus: current.status, 
            toStatus: parsed.data.status, 
            note: parsed.data.note, 
            actorId: s.userId 
          },
        },
      },
    });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (error) {
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }
}