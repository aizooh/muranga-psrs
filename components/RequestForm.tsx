"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestForm() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setLoading(true);
    const res = await fetch("/api/requests", { method: "POST", body: new FormData(e.currentTarget) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(data.error ?? "Failed");
    router.push(`/requests/${data.reference}`);
  }

  const inputClass = "w-full rounded-xl border border-slate-300 p-3.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm";
  const labelClass = "block text-sm font-semibold text-slate-800 mb-1.5";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Issue Title <span className="text-red-500">*</span></label>
        <input name="title" required minLength={5} placeholder="e.g. Deep pothole on Kimathi Street" className={inputClass} />
      </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>Category <span className="text-red-500">*</span></label>
          <select name="category" required className={inputClass}>
            <option value="Roads">Roads</option>
            <option value="Water">Water Supply</option>
            <option value="Electrical">Electrical</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Public Facilities">Public Facilities</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Sub-County <span className="text-red-500">*</span></label>
          <select name="subCounty" required className={inputClass}>
            <option value="Murang'a Town">Murang'a Town</option>
            <option value="Kenol">Kenol</option>
            <option value="Maragua">Maragua</option>
            <option value="Kangema">Kangema</option>
            <option value="Kigumo">Kigumo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Location / Ward <span className="text-red-500">*</span></label>
          <input name="location" required placeholder="e.g. Murang'a Town" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Closest Landmark <span className="text-red-500">*</span></label>
          <input name="landmark" required placeholder="e.g. Near Equity Bank" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Severity Level <span className="text-red-500">*</span></label>
        <select name="severity" required className={inputClass}>
          <option value="LOW">Low - Minor inconvenience</option>
          <option value="MEDIUM">Medium - Needs attention</option>
          <option value="HIGH">High - Dangerous</option>
          <option value="CRITICAL">Critical - Immediate hazard</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Description <span className="text-red-500">*</span></label>
        <textarea name="description" required rows={4} placeholder="Describe the issue..." className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Photo Evidence <span className="text-slate-400 font-normal">(Optional)</span></label>
        <input name="image" type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition border border-slate-300 rounded-xl bg-slate-50 cursor-pointer" />
      </div>

      {err && <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{err}</p>}
      
      <button disabled={loading} className="w-full rounded-xl bg-blue-600 p-4 text-white font-bold text-lg hover:bg-blue-700 disabled:opacity-60 transition shadow-md">
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}