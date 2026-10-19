"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Track() {
  const router = useRouter();
  const [ref, setRef] = useState("");
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Track a Request</h1>
      <form onSubmit={e => { e.preventDefault(); if (ref.trim()) router.push(`/requests/${ref.trim()}`); }} className="space-y-3">
        <input value={ref} onChange={e => setRef(e.target.value)} placeholder="SR-YYYYMMDD-XXXX"
          className="w-full rounded-lg border p-3 font-mono" />
        <button className="w-full rounded-lg bg-gray-900 p-3 text-white">Look up</button>
      </form>
    </main>
  );
}