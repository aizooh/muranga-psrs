import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const authToken = process.env.TURSO_AUTH_TOKEN;
const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;

let adapter: PrismaLibSQL | undefined;

// FORCE Turso adapter if the token exists (meaning we are in production)
if (authToken) {
  const libsql = createClient({
    url: url || "libsql://placeholder.turso.io", // Prevent crash if URL is missing
    authToken: authToken,
  });
  adapter = new PrismaLibSQL(libsql);
}

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);
if (process.env.NODE_ENV !== "production") g.prisma = prisma;