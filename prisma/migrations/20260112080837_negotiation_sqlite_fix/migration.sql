/*
  Warnings:

  - You are about to drop the column `buyerName` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `counterAmount` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `offerAmount` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Negotiation` table. All the data in the column will be lost.
  - Added the required column `artisanId` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerId` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerOffer` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Negotiation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" INTEGER NOT NULL,
    "artisanId" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Negotiation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "buyerOffer" INTEGER NOT NULL,
    "artisanCounter" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Negotiation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Negotiation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Negotiation" ("conversationId", "createdAt", "id", "status") SELECT "conversationId", "createdAt", "id", "status" FROM "Negotiation";
DROP TABLE "Negotiation";
ALTER TABLE "new_Negotiation" RENAME TO "Negotiation";
CREATE INDEX "Negotiation_productId_idx" ON "Negotiation"("productId");
CREATE INDEX "Negotiation_buyerId_idx" ON "Negotiation"("buyerId");
CREATE INDEX "Negotiation_artisanId_idx" ON "Negotiation"("artisanId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
