import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/login?next=/admin");
  if (s.role !== "ADMIN") redirect("/dashboard");
  return <>{children}</>;
}