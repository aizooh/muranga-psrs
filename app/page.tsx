import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 pt-24 pb-12 text-center">
      <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
        Official City Portal
      </span>
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
        Report city issues <span className="text-blue-600">instantly.</span>
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Submit requests for broken streetlights, water leaks, or missed garbage collection. Track progress in real-time.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/register" className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-4 text-white font-semibold shadow-md hover:bg-blue-700 transition">
          Submit a Request
        </Link>
        <Link href="/track" className="w-full sm:w-auto rounded-lg border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition">
          Track Existing Request
        </Link>
      </div>
    </main>
  );
}