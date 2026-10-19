-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "citizenId" TEXT,
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
    CONSTRAINT "Request_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("category", "citizenId", "createdAt", "description", "id", "imageData", "location", "reference", "resolvedAt", "status", "updatedAt") SELECT "category", "citizenId", "createdAt", "description", "id", "imageData", "location", "reference", "resolvedAt", "status", "updatedAt" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_reference_key" ON "Request"("reference");
CREATE INDEX "Request_status_idx" ON "Request"("status");
CREATE INDEX "Request_citizenId_idx" ON "Request"("citizenId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
