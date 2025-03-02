/*
  Warnings:

  - You are about to drop the column `date` on the `CafeteriaMenu` table. All the data in the column will be lost.
  - Added the required column `address` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cafe_url` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CafeteriaMenu" DROP COLUMN "date",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cafe_url" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
