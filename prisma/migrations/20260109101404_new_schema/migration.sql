/*
  Warnings:

  - You are about to drop the column `brandName` on the `Collaboration` table. All the data in the column will be lost.
  - You are about to drop the column `creatorName` on the `Collaboration` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collaboration" DROP CONSTRAINT "Collaboration_brandId_brandName_fkey";

-- DropForeignKey
ALTER TABLE "Collaboration" DROP CONSTRAINT "Collaboration_creatorId_creatorName_fkey";

-- DropForeignKey
ALTER TABLE "CreatorSocialAccount" DROP CONSTRAINT "CreatorSocialAccount_creatorId_fkey";

-- AlterTable
ALTER TABLE "Collaboration" DROP COLUMN "brandName",
DROP COLUMN "creatorName";

-- CreateTable
CREATE TABLE "PackageCollaboration" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "status" "PackageStatus" NOT NULL,

    CONSTRAINT "PackageCollaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignCollaboration" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "scope" JSONB NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "CampaignCollaboration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageCollaboration_collabId_key" ON "PackageCollaboration"("collabId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignCollaboration_collabId_key" ON "CampaignCollaboration"("collabId");

-- CreateIndex
CREATE INDEX "CampaignCollaboration_campaignId_idx" ON "CampaignCollaboration"("campaignId");

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCollaboration" ADD CONSTRAINT "PackageCollaboration_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collaboration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCollaboration" ADD CONSTRAINT "PackageCollaboration_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCollaboration" ADD CONSTRAINT "CampaignCollaboration_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collaboration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCollaboration" ADD CONSTRAINT "CampaignCollaboration_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorSocialAccount" ADD CONSTRAINT "CreatorSocialAccount_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
