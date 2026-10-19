import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function ref() {
  return `SR-MUR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

async function main() {
  // 1. Create Admin
  await db.user.upsert({
    where: { email: "admin@muranga.go.ke" },
    update: {},
    create: { 
      name: "County Admin", 
      email: "admin@muranga.go.ke", 
      passwordHash: await bcrypt.hash("Admin123!", 10), 
      role: "ADMIN" 
    },
  });

  // 2. Create Citizen (This was missing!)
  const citizen = await db.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: { 
      name: "Jane Doe", 
      email: "jane@example.com", 
      passwordHash: await bcrypt.hash("Citizen123!", 10), 
      role: "CITIZEN" 
    },
  });

  // 3. Create Requests and attach to Citizen
  const samples = [
    ["Deep pothole on Kimathi Street", "Roads", "Murang'a Town", "Near Equity Bank", "Massive pothole causing traffic.", "CRITICAL", "UNASSIGNED"],
    ["Burst water pipe", "Water", "Kenol", "Opposite Kenol Flyover", "Water wasting on the road for 2 days.", "HIGH", "IN_PROGRESS"],
    ["Broken streetlights", "Electrical", "Maragua", "Maragua Police Station", "Dark at night, dangerous for pedestrians.", "MEDIUM", "RESOLVED"],
    ["Blocked drainage", "Sanitation", "Kangema", "Kangema Market", "Flooding whenever it rains.", "HIGH", "UNASSIGNED"],
    ["Garbage pile up", "Sanitation", "Kigumo", "Kigumo Health Centre", "Bad smell from uncollected garbage.", "CRITICAL", "IN_PROGRESS"],
  ];

  for (let i = 0; i < 25; i++) {
    const [title, category, subCounty, landmark, description, severity, status] = samples[i % samples.length];
    
    const r = await db.request.create({
      data: {
        reference: ref(),
        citizen: { connect: { id: citizen.id } }, // <--- The fix is here
        title, 
        category, 
        subCounty, 
        landmark, 
        description, 
        severity, 
        status,
        location: subCounty,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
    });
    
    await db.requestEvent.create({ 
      data: { requestId: r.id, toStatus: status, note: "Seeded data" } 
    });
  }
  
  console.log("Seeded successfully!");
  console.log("Admin: admin@muranga.go.ke / Admin123!");
  console.log("Citizen: jane@example.com / Citizen123!");
}

main().finally(() => db.$disconnect());