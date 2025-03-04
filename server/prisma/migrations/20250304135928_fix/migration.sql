/*
  Warnings:

  - Added the required column `mealType` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CafeteriaOrder_userId_menuId_key";

-- AlterTable
ALTER TABLE "BusRoute" ADD COLUMN     "currentLocation" TEXT NOT NULL DEFAULT 'Campus';

-- AlterTable
ALTER TABLE "CafeteriaMenu" ADD COLUMN     "mealType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CafeteriaOrder" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preOrder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;
