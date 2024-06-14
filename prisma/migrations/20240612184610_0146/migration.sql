/*
  Warnings:

  - Added the required column `name` to the `HookLink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HookLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "HookLink_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HookLink" ("id", "link", "ownerId") SELECT "id", "link", "ownerId" FROM "HookLink";
DROP TABLE "HookLink";
ALTER TABLE "new_HookLink" RENAME TO "HookLink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
