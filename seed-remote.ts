import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const client = createClient({
  url: "libsql://muranga-psrs-aizooh.aws-us-west-2.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  console.log("Connecting to Turso...");
  
  // 1. CREATE TABLES
  console.log("Creating tables...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'CITIZEN',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Request" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "reference" TEXT NOT NULL,
      "citizenId" TEXT NOT NULL,
      "title" TEXT NOT NULL DEFAULT 'Untitled Issue',
      "subCounty" TEXT NOT NULL DEFAULT 'Murang''a Town',
      "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
      "department" TEXT,
      "category" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "landmark" TEXT,
      "description" TEXT NOT NULL,
      "imageData" TEXT,
      "status" TEXT NOT NULL DEFAULT 'UNASSIGNED',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "resolvedAt" DATETIME,
      CONSTRAINT "Request_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `);
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "Request_reference_key" ON "Request"("reference");`);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "RequestEvent" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "requestId" TEXT NOT NULL,
      "fromStatus" TEXT,
      "toStatus" TEXT NOT NULL,
      "note" TEXT,
      "actorId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "RequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  // 2. SEED DATA
  console.log("Inserting seed data...");
  const adminHash = await bcrypt.hash("Admin123!", 10);
  const citizenHash = await bcrypt.hash("Citizen123!", 10);

  await client.execute({
    sql: `INSERT INTO User (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING`,
    args: [crypto.randomUUID(), "County Admin", "admin@muranga.go.ke", adminHash, "ADMIN"]
  });

  const citizenId = crypto.randomUUID();
  await client.execute({
    sql: `INSERT INTO User (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING`,
    args: [citizenId, "Jane Doe", "jane@example.com", citizenHash, "CITIZEN"]
  });

  const samples = [
    ["Deep pothole on Kimathi Street", "Roads", "Murang'a Town", "Near Equity Bank", "Massive pothole causing traffic.", "CRITICAL", "UNASSIGNED"],
    ["Burst water pipe", "Water", "Kenol", "Opposite Kenol Flyover", "Water wasting on the road for 2 days.", "HIGH", "IN_PROGRESS"],
    ["Broken streetlights", "Electrical", "Maragua", "Maragua Police Station", "Dark at night, dangerous for pedestrians.", "MEDIUM", "RESOLVED"],
  ];

  for (let i = 0; i < 15; i++) {
    const [title, category, subCounty, landmark, description, severity, status] = samples[i % samples.length];
    const reqId = crypto.randomUUID();
    const ref = `SR-MUR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    
    await client.execute({
      sql: `INSERT INTO Request (id, reference, citizenId, title, subCounty, severity, category, location, landmark, description, status, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [reqId, ref, citizenId, title, subCounty, severity, category, subCounty, landmark, description, status, new Date().toISOString()]
    });

    await client.execute({
      sql: `INSERT INTO RequestEvent (id, requestId, toStatus, note) VALUES (?, ?, ?, ?)`,
      args: [crypto.randomUUID(), reqId, status, "Seeded data"]
    });
  }

  console.log("Cloud DB Seeded successfully!");
}

main().catch(console.error);