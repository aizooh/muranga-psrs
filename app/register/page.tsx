"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const isValid = Object.values(checks).every(Boolean);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return setErr("Please meet all password requirements.");
    setErr(""); setLoading(true);
    
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password }),
    });
    const data = await res.json();
    setLoading(false);
    
    if (!res.ok) return setErr(data.error ?? "Registration failed");
    router.push("/dashboard"); router.refresh();
  }

  const CheckItem = ({ met, text }: { met: boolean; text: string }) => (
    <li className={`flex items-center text-xs ${met ? "text-green-600" : "text-gray-400"}`}>
      <span className="mr-2">{met ? "✓" : "○"}</span> {text}
    </li>
  );

  return (
    <main className="mx-auto mt-16 max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
        <p className="text-gray-500 mt-2">Join the city service portal</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input name="name" required minLength={2} placeholder="Jane Doe" 
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" required placeholder="jane@example.com" 
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password" 
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          
          <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Password requirements:</p>
            <ul className="grid grid-cols-2 gap-1">
              <CheckItem met={checks.length} text="At least 8 characters" />
              <CheckItem met={checks.upper} text="Uppercase letter" />
              <CheckItem met={checks.lower} text="Lowercase letter" />
              <CheckItem met={checks.number} text="Number" />
              <CheckItem met={checks.special} text="Special character" />
            </ul>
          </div>
        </div>

        {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</p>}
        
        <button disabled={loading || !isValid} className="w-full rounded-lg bg-blue-600 p-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Already registered? <Link href="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
      </p>
    </main>
  );
}