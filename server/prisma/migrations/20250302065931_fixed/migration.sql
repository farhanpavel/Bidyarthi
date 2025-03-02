/*
  Warnings:

  - You are about to drop the column `address` on the `CafeteriaMenu` table. All the data in the column will be lost.
  - You are about to drop the column `cafe_url` on the `CafeteriaMenu` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CafeteriaMenu` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `address` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cafe_url` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CafeteriaMenu" DROP COLUMN "address",
DROP COLUMN "cafe_url",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cafe_url" TEXT NOT NULL;
