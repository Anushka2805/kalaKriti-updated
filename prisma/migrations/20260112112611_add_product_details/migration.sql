-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Handmade Item',
    "image" TEXT,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "basePrice" INTEGER,
    "artisanId" TEXT NOT NULL
);
INSERT INTO "new_Product" ("artisanId", "id", "price") SELECT "artisanId", "id", "price" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
