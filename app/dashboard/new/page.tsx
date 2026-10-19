import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { RequestForm } from "@/components/RequestForm";

export default async function NewRequest() {
  const s = await getSession();
  if (!s || s.role !== "CITIZEN") redirect("/login");
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">New Request</h1>
      <div className="rounded-xl border bg-white p-6"><RequestForm /></div>
    </main>
  );
}