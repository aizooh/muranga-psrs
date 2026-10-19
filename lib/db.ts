import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const isProd = process.env.NODE_ENV === "production";

const adapter = isProd
  ? new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  : undefined;

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);
if (process.env.NODE_ENV !== "production") g.prisma = prisma;