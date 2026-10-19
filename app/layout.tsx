import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata: Metadata = { 
  title: "Murang'a County Services",
  description: "Report and track public service requests"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <nav className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between px-4 py-3 sm:px-6 sm:py-4 gap-3 sm:gap-0">
            <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              <span className="text-blue-600">🏛️</span> Murang'a Services
            </Link>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium">
              {s ? (
                <>
                  {s.role === "ADMIN" ? (
                    <Link href="/admin" className="text-slate-600 hover:text-blue-600 transition">Admin Dashboard</Link>
                  ) : (
                    <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition">My Requests</Link>
                  )}
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <span className="text-slate-500 max-w-[120px] sm:max-w-none truncate">{s.name}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-600 hover:text-blue-600 transition">Log in</Link>
                  <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 transition">Sign up</Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <div className="pb-12 px-4 sm:px-0">{children}</div>
      </body>
    </html>
  );
}