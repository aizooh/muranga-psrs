import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return new Response("Unauthorized", { status: 401 });
  
  const rows = await prisma.request.findMany({ orderBy: { createdAt: "desc" }, include: { citizen: true } });
  
  const header = "Reference,Category,Location,Status,Citizen,Submitted\n";
  const body = rows.map(r =>
    [r.reference, r.category, r.location, r.status, r.citizen.email, r.createdAt.toISOString()]
      .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
  ).join("\n");
  
  return new Response(header + body, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="requests-${Date.now()}.csv"`,
    },
  });
}