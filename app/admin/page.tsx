import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  const where = {
    ...(searchParams.status && searchParams.status !== "ALL" ? { status: searchParams.status } : {}),
    ...(searchParams.q
      ? { OR: [
          { reference: { contains: searchParams.q } },
          { location: { contains: searchParams.q } },
          { description: { contains: searchParams.q } },
        ] }
      : {}),
  };

  const [requests, pending, inProgress, resolved, total] = await Promise.all([
    prisma.request.findMany({ where, orderBy: { createdAt: "desc" }, include: { citizen: true }, take: 50 }),
    prisma.request.count({ where: { status: "PENDING" } }),
    prisma.request.count({ where: { status: "IN_PROGRESS" } }),
    prisma.request.count({ where: { status: "RESOLVED" } }),
    prisma.request.count(),
  ]);

  const open = pending + inProgress;
  const rate = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <main className="mx-auto max-w-6xl p-6 mt-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage city service requests and analytics.</p>
        </div>
        <a href="/api/admin/export" className="rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
          ⬇ Export CSV
        </a>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Requests</p>
          <p className="text-4xl font-bold text-slate-900">{total}</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-orange-600 mb-1">Open Cases</p>
          <p className="text-4xl font-bold text-orange-700">{open}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-green-600 mb-1">Resolved</p>
          <p className="text-4xl font-bold text-green-700">{resolved}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600 mb-1">Resolution Rate</p>
          <p className="text-4xl font-bold text-blue-700">{rate}%</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm flex flex-col sm:flex-row gap-2">
        <form className="flex flex-1 flex-col sm:flex-row gap-2">
          <input name="q" defaultValue={searchParams.q} placeholder="Search by reference, location or keyword..." 
            className="flex-1 rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <select name="status" defaultValue={searchParams.status ?? "ALL"} 
            className="rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition">Filter</button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Citizen</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{r.reference}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{r.category}</p>
                    <p className="text-xs text-slate-500">{r.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700">{r.citizen.name}</p>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-4 text-slate-500">{r.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/requests/${r.id}`} className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No requests match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}