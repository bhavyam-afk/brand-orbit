/*
  Warnings:

  - You are about to drop the column `followers` on the `CreatorFollowerSnapshot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `BrandProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,username]` on the table `BrandProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandName` to the `Collaboration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Collaboration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers_increased` to the `CreatorFollowerSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collaboration" DROP CONSTRAINT "Collaboration_brandId_fkey";

-- AlterTable
ALTER TABLE "Collaboration" ADD COLUMN     "brandName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CreatorFollowerSnapshot" DROP COLUMN "followers",
ADD COLUMN     "followers_increased" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN     "follower_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_username_key" ON "BrandProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_id_username_key" ON "BrandProfile"("id", "username");

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_brandId_brandName_fkey" FOREIGN KEY ("brandId", "brandName") REFERENCES "BrandProfile"("id", "username") ON DELETE RESTRICT ON UPDATE CASCADE;
