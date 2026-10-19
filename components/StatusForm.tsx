"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES } from "@/lib/validation";

export function StatusForm({ id, current }: { id: string; current: string }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    try {
      const res = await fetch(`/api/admin/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: fd.get("status"), note: fd.get("note") || undefined }),
      });
      
      const text = await res.text();
      if (!text) throw new Error(`Server error: ${res.status} ${res.statusText}`);
      
      const data = JSON.parse(text);
      setLoading(false);
      
      if (!res.ok) return setErr(data.error ?? "Failed to update status");
      router.refresh();
    } catch (error: any) {
      setLoading(false);
      setErr(error.message || "A network error occurred");
    }
  }
  
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <select name="status" defaultValue={current} className="w-full rounded-lg border p-3 bg-white">
        {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
      </select>
      <input name="note" placeholder="Optional note" className="w-full rounded-lg border p-3 bg-white" />
      {err && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}
      <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition">
        {loading ? "Updating..." : "Update Status"}
      </button>
    </form>
  );
}