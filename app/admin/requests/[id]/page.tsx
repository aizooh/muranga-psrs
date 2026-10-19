import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusForm } from "@/components/StatusForm";

export const dynamic = "force-dynamic";

export default async function ManageRequest({ params }: { params: { id: string } }) {
  const r = await prisma.request.findUnique({
    where: { id: params.id },
    include: { citizen: true, events: { orderBy: { createdAt: "desc" } } },
  });
  
  if (!r) notFound();

  return (
    <main className="mx-auto max-w-5xl p-6 mt-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Dashboard</Link>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-900 font-mono">{r.reference}</h1>
          <StatusBadge status={r.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Issue Title</p>
                <p className="text-lg font-semibold text-slate-900">{r.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Category</p>
                  <p className="text-slate-900">{r.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Sub-County</p>
                  <p className="text-slate-900">{r.subCounty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="text-slate-900">{r.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Landmark</p>
                  <p className="text-slate-900">{r.landmark || "Not specified"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Severity</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                  r.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  r.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {r.severity}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Description</p>
                <p className="text-slate-800 bg-slate-50 p-4 rounded-lg mt-1 border border-slate-100">{r.description}</p>
              </div>
              {r.imageData && (
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Attached Photo</p>
                  <img src={r.imageData} alt="Attachment" className="max-h-80 w-full object-contain rounded-lg border border-slate-200 bg-slate-50" />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Col: Action & History */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Citizen Info</h2>
            <p className="font-medium text-slate-900">{r.citizen.name}</p>
            <p className="text-sm text-slate-500">{r.citizen.email}</p>
          </section>

          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-4">Update Status</h2>
            <StatusForm id={r.id} current={r.status} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Event History</h2>
            <ul className="space-y-4">
              {r.events.map(e => (
                <li key={e.id} className="text-sm">
                  <p className="font-medium text-slate-900">{e.toStatus.replace("_"," ")}</p>
                  <p className="text-slate-500 text-xs">{e.createdAt.toLocaleString()}</p>
                  {e.note && <p className="text-slate-600 mt-1 bg-slate-50 p-2 rounded text-xs">{e.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}