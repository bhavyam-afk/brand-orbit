/*
  Warnings:

  - A unique constraint covering the columns `[id,username]` on the table `CreatorProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorName` to the `Collaboration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageTitle` to the `Collaboration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collaboration" DROP CONSTRAINT "Collaboration_creatorId_fkey";

-- AlterTable
ALTER TABLE "Collaboration" ADD COLUMN     "creatorName" TEXT NOT NULL,
ADD COLUMN     "packageTitle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_id_username_key" ON "CreatorProfile"("id", "username");

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_creatorId_creatorName_fkey" FOREIGN KEY ("creatorId", "creatorName") REFERENCES "CreatorProfile"("id", "username") ON DELETE RESTRICT ON UPDATE CASCADE;
