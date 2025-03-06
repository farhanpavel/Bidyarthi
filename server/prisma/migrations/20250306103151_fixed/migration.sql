/*
  Warnings:

  - A unique constraint covering the columns `[routeId]` on the table `BusDriverAssignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clubId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EventRSVP_userId_eventId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "clubId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventRSVP" ADD COLUMN     "flag" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "BusDriverAssignment_routeId_key" ON "BusDriverAssignment"("routeId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
