import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role === "ADMIN") redirect("/admin");
  
  const requests = await prisma.request.findMany({
    where: { citizenId: s.userId }, orderBy: { createdAt: "desc" },
  });
  
  return (
    <main className="mx-auto max-w-4xl p-6 mt-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
          <p className="text-slate-500 mt-1">Track the status of issues you've reported.</p>
        </div>
        <Link href="/dashboard/new" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition shadow-sm text-center">
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-500 text-lg mb-4">You haven't submitted any requests yet.</p>
          <Link href="/dashboard/new" className="text-blue-600 font-medium hover:underline">Submit your first request →</Link>
        </div>
      ) : (
        <ul className="grid gap-4">
          {requests.map(r => (
            <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {r.category}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">{r.reference}</span>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{r.location}</h3>
              <p className="text-slate-600 line-clamp-2 text-sm">{r.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400">Submitted {r.createdAt.toLocaleDateString()}</span>
                <Link href={`/requests/${r.reference}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View Timeline →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}