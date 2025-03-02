/*
  Warnings:

  - The primary key for the `ARMap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusDriverAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusRoute` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CafeteriaMenu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CafeteriaOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CampusLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChefAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClassSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `EventRSVP` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FacultyContact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Restaurant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,menuId]` on the table `CafeteriaOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,clubId]` on the table `ClubMembership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,eventId]` on the table `EventRSVP` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ARMap" DROP CONSTRAINT "ARMap_locationId_fkey";

-- DropForeignKey
ALTER TABLE "BusDriverAssignment" DROP CONSTRAINT "BusDriverAssignment_routeId_fkey";

-- DropForeignKey
ALTER TABLE "BusDriverAssignment" DROP CONSTRAINT "BusDriverAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "BusNotification" DROP CONSTRAINT "BusNotification_routeId_fkey";

-- DropForeignKey
ALTER TABLE "BusNotification" DROP CONSTRAINT "BusNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "CafeteriaOrder" DROP CONSTRAINT "CafeteriaOrder_menuId_fkey";

-- DropForeignKey
ALTER TABLE "CafeteriaOrder" DROP CONSTRAINT "CafeteriaOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChefAssignment" DROP CONSTRAINT "ChefAssignment_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "ChefAssignment" DROP CONSTRAINT "ChefAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMembership" DROP CONSTRAINT "ClubMembership_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMembership" DROP CONSTRAINT "ClubMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventRSVP" DROP CONSTRAINT "EventRSVP_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventRSVP" DROP CONSTRAINT "EventRSVP_userId_fkey";

-- AlterTable
ALTER TABLE "ARMap" DROP CONSTRAINT "ARMap_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "locationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ARMap_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ARMap_id_seq";

-- AlterTable
ALTER TABLE "BusDriverAssignment" DROP CONSTRAINT "BusDriverAssignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "routeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusDriverAssignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BusDriverAssignment_id_seq";

-- AlterTable
ALTER TABLE "BusNotification" DROP CONSTRAINT "BusNotification_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "routeId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusNotification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BusNotification_id_seq";

-- AlterTable
ALTER TABLE "BusRoute" DROP CONSTRAINT "BusRoute_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BusRoute_id_seq";

-- AlterTable
ALTER TABLE "CafeteriaMenu" DROP CONSTRAINT "CafeteriaMenu_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CafeteriaMenu_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CafeteriaMenu_id_seq";

-- AlterTable
ALTER TABLE "CafeteriaOrder" DROP CONSTRAINT "CafeteriaOrder_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "menuId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CafeteriaOrder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CafeteriaOrder_id_seq";

-- AlterTable
ALTER TABLE "CampusLocation" DROP CONSTRAINT "CampusLocation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CampusLocation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CampusLocation_id_seq";

-- AlterTable
ALTER TABLE "ChefAssignment" DROP CONSTRAINT "ChefAssignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "restaurantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ChefAssignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ChefAssignment_id_seq";

-- AlterTable
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ClassSchedule_id_seq";

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Club_id_seq";

-- AlterTable
ALTER TABLE "ClubMembership" DROP CONSTRAINT "ClubMembership_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "clubId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClubMembership_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ClubMembership_id_seq";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "EventRSVP" DROP CONSTRAINT "EventRSVP_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "eventId" SET DATA TYPE TEXT,
ADD CONSTRAINT "EventRSVP_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EventRSVP_id_seq";

-- AlterTable
ALTER TABLE "FacultyContact" DROP CONSTRAINT "FacultyContact_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FacultyContact_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FacultyContact_id_seq";

-- AlterTable
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Restaurant_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "CafeteriaOrder_userId_menuId_key" ON "CafeteriaOrder"("userId", "menuId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMembership_userId_clubId_key" ON "ClubMembership"("userId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRSVP_userId_eventId_key" ON "EventRSVP"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "CafeteriaOrder" ADD CONSTRAINT "CafeteriaOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeteriaOrder" ADD CONSTRAINT "CafeteriaOrder_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "CafeteriaMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefAssignment" ADD CONSTRAINT "ChefAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefAssignment" ADD CONSTRAINT "ChefAssignment_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusNotification" ADD CONSTRAINT "BusNotification_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "BusRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusNotification" ADD CONSTRAINT "BusNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRSVP" ADD CONSTRAINT "EventRSVP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRSVP" ADD CONSTRAINT "EventRSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ARMap" ADD CONSTRAINT "ARMap_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "CampusLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusDriverAssignment" ADD CONSTRAINT "BusDriverAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusDriverAssignment" ADD CONSTRAINT "BusDriverAssignment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "BusRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
