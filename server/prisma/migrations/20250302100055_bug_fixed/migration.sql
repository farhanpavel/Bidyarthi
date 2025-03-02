/*
  Warnings:

  - Added the required column `busNum` to the `BusRoute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bus_url` to the `BusRoute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_url` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusRoute" ADD COLUMN     "busNum" TEXT NOT NULL,
ADD COLUMN     "bus_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "club_url" TEXT NOT NULL;
