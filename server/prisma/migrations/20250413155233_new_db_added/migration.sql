/*
  Warnings:

  - You are about to drop the column `currentLocation` on the `BusRoute` table. All the data in the column will be lost.
  - You are about to drop the column `routeName` on the `BusRoute` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `ChatbotInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `ChatbotInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ChatbotInteraction` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `ChatbotInteraction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `SafetyAlert` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('EMERGENCY', 'ANNOUNCEMENT');

-- DropForeignKey
ALTER TABLE "ChatbotInteraction" DROP CONSTRAINT "ChatbotInteraction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "BusRoute" DROP COLUMN "currentLocation",
DROP COLUMN "routeName",
ADD COLUMN     "currentLatitude" DOUBLE PRECISION NOT NULL DEFAULT 23.8069,
ADD COLUMN     "currentLongitude" DOUBLE PRECISION NOT NULL DEFAULT 90.3686;

-- AlterTable
ALTER TABLE "ChatbotInteraction" DROP COLUMN "question",
DROP COLUMN "response",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SafetyAlert" ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT,
ADD COLUMN     "type" "AnnouncementType" NOT NULL;

-- DropTable
DROP TABLE "Notification";

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classRoll" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GarbageCollection" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "garbageType" TEXT NOT NULL,
    "garbageWeight" TEXT NOT NULL,
    "garbagePic" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,

    CONSTRAINT "GarbageCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "feeName" TEXT NOT NULL,
    "feeType" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "feeDate" TEXT NOT NULL,
    "feeDescription" TEXT NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pay" (
    "id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "feeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Pay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GarbageCollection" ADD CONSTRAINT "GarbageCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mail" ADD CONSTRAINT "Mail_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mail" ADD CONSTRAINT "Mail_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pay" ADD CONSTRAINT "Pay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pay" ADD CONSTRAINT "Pay_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "Fee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
