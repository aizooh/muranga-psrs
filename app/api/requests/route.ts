import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  title: z.string().min(5),
  category: z.string(),
  subCounty: z.string(),
  location: z.string().min(3),
  landmark: z.string().min(3),
  severity: z.string(),
  description: z.string().min(10),
});

function makeRef() {
  return `SR-MUR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const parsed = schema.safeParse({
    title: form.get("title"),
    category: form.get("category"),
    subCounty: form.get("subCounty"),
    location: form.get("location"),
    landmark: form.get("landmark"),
    severity: form.get("severity"),
    description: form.get("description"),
  });
  
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  let imageData: string | null = null;
  const file = form.get("image");
  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > 3 * 1024 * 1024) return NextResponse.json({ error: "Image under 3MB" }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    imageData = `data:${file.type};base64,${buf.toString("base64")}`;
  }

   const created = await prisma.request.create({
    data: { 
      reference: makeRef(), 
      imageData, 
      citizen: { connect: { id: s.userId } }, // <--- FIXED HERE
      ...parsed.data 
    },
  });
  
  await prisma.requestEvent.create({ data: { requestId: created.id, toStatus: "UNASSIGNED", note: "Reported via Web" } });
  return NextResponse.json({ reference: created.reference }, { status: 201 });
}