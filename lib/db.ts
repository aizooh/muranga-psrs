import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const isProd = process.env.NODE_ENV === "production";

let adapter: PrismaLibSQL | undefined;

if (isProd) {
  // In Prisma 5.22, you must create the client first, then pass it to the adapter
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  adapter = new PrismaLibSQL(libsql);
}

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);
if (process.env.NODE_ENV !== "production") g.prisma = prisma;