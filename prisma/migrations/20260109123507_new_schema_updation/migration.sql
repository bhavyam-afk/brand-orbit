/*
  Warnings:

  - You are about to drop the column `finalCost` on the `Collaboration` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Collaboration` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "creators" TEXT[],
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Collaboration" DROP COLUMN "finalCost",
DROP COLUMN "status";

-- AddForeignKey
ALTER TABLE "CreatorSocialRawSnapshot" ADD CONSTRAINT "CreatorSocialRawSnapshot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
