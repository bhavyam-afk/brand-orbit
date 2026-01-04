-- CreateTable
CREATE TABLE "CreatorSocialRawSnapshot" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorSocialRawSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorDailyMetrics" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "followers" INTEGER NOT NULL,
    "reach" INTEGER,
    "impressions" INTEGER,
    "engagement" INTEGER,

    CONSTRAINT "CreatorDailyMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorSocialRawSnapshot_creatorId_fetchedAt_idx" ON "CreatorSocialRawSnapshot"("creatorId", "fetchedAt");

-- CreateIndex
CREATE INDEX "CreatorDailyMetrics_creatorId_date_idx" ON "CreatorDailyMetrics"("creatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorDailyMetrics_creatorId_date_key" ON "CreatorDailyMetrics"("creatorId", "date");
