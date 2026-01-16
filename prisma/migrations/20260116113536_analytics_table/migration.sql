/*
  Warnings:

  - You are about to drop the `CreatorDailyMetrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreatorDailyMetrics" DROP CONSTRAINT "CreatorDailyMetrics_creatorId_fkey";

-- DropTable
DROP TABLE "CreatorDailyMetrics";

-- CreateTable
CREATE TABLE "CreatorDailyAnalytics" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "followers" INTEGER NOT NULL,
    "reach" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL,
    "engagements" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "replies" INTEGER NOT NULL,
    "profileViews" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorDailyAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorDailyAnalytics_creatorId_date_idx" ON "CreatorDailyAnalytics"("creatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorDailyAnalytics_creatorId_date_key" ON "CreatorDailyAnalytics"("creatorId", "date");

-- AddForeignKey
ALTER TABLE "CreatorDailyAnalytics" ADD CONSTRAINT "CreatorDailyAnalytics_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
