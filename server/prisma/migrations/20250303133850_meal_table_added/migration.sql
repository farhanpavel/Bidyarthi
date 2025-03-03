/*
  Warnings:

  - You are about to drop the column `available` on the `CafeteriaMenu` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ClubMembership` table. All the data in the column will be lost.
  - Added the required column `meal_url` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `CafeteriaMenu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CafeteriaMenu" DROP COLUMN "available",
ADD COLUMN     "meal_url" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClubMembership" DROP COLUMN "role";

-- AddForeignKey
ALTER TABLE "CafeteriaMenu" ADD CONSTRAINT "CafeteriaMenu_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
