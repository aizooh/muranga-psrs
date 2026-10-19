import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function TrackRequest({ params }: { params: { reference: string } }) {
  const request = await prisma.request.findUnique({
    where: { reference: params.reference.toUpperCase() },
    include: { events: { orderBy: { createdAt: "asc" } } },
  });
  if (!request) notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-xl">{request.reference}</h1>
        <StatusBadge status={request.status} />
      </div>
      <section className="rounded-xl border bg-white p-4 space-y-1">
        <p><span className="text-gray-500">Category:</span> {request.category}</p>
        <p><span className="text-gray-500">Location:</span> {request.location}</p>
        <p><span className="text-gray-500">Submitted:</span> {request.createdAt.toLocaleString()}</p>
        <p className="pt-2">{request.description}</p>
        {request.imageData && <img src={request.imageData} alt="" className="mt-3 max-h-64 rounded-lg border" />}
      </section>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-600">Timeline</h2>
        <ol className="space-y-3">
          {request.events.map(e => (
            <li key={e.id} className="flex gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
              <div>
                <p className="text-sm font-medium">{e.toStatus.replace("_", " ")}</p>
                {e.note && <p className="text-sm text-gray-600">{e.note}</p>}
                <p className="text-xs text-gray-400">{e.createdAt.toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}