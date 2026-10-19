"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState("");
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error ?? "Login failed");
    router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }
  
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border p-3" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border p-3" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-lg bg-gray-900 p-3 text-white">Sign in</button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        No account? <Link href="/register" className="text-blue-600">Register</Link>
      </p>
    </main>
  );
}