import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
let adapter: PrismaLibSQL | undefined;

if (url && url.startsWith("libsql://")) {
  const libsql = createClient({
    url: url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  adapter = new PrismaLibSQL(libsql);
}

const db = new PrismaClient(adapter ? { adapter } : undefined);

function ref() {
  return `SR-MUR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

async function main() {
  await db.user.upsert({
    where: { email: "admin@muranga.go.ke" },
    update: {},
    create: { name: "County Admin", email: "admin@muranga.go.ke", passwordHash: await bcrypt.hash("Admin123!", 10), role: "ADMIN" },
  });

  const citizen = await db.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: { name: "Jane Doe", email: "jane@example.com", passwordHash: await bcrypt.hash("Citizen123!", 10), role: "CITIZEN" },
  });

  const samples = [
    ["Deep pothole on Kimathi Street", "Roads", "Murang'a Town", "Near Equity Bank", "Massive pothole causing traffic.", "CRITICAL", "UNASSIGNED"],
    ["Burst water pipe", "Water", "Kenol", "Opposite Kenol Flyover", "Water wasting on the road for 2 days.", "HIGH", "IN_PROGRESS"],
    ["Broken streetlights", "Electrical", "Maragua", "Maragua Police Station", "Dark at night, dangerous for pedestrians.", "MEDIUM", "RESOLVED"],
  ];

  for (let i = 0; i < 15; i++) {
    const [title, category, subCounty, landmark, description, severity, status] = samples[i % samples.length];
    const r = await db.request.create({
      data: {
        reference: ref(),
        citizen: { connect: { id: citizen.id } },
        title, category, subCounty, landmark, description, severity, status,
        location: subCounty,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
    });
    await db.requestEvent.create({ data: { requestId: r.id, toStatus: status, note: "Seeded data" } });
  }
  console.log("Seeded successfully!");
}

main().finally(() => db.$disconnect());