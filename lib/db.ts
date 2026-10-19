import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const isProd = process.env.NODE_ENV === "production";
// Accept either DATABASE_URL or TURSO_DATABASE_URL
const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;

let adapter: PrismaLibSQL | undefined;

if (isProd && url) {
  const libsql = createClient({
    url: url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  adapter = new PrismaLibSQL(libsql);
}

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);
if (process.env.NODE_ENV !== "production") g.prisma = prisma;