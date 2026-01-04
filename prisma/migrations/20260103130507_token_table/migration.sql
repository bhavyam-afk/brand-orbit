-- CreateTable
CREATE TABLE "CreatorSocialAccount" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3),
    "igAccountId" TEXT,
    "pageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorSocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorSocialAccount_creatorId_platform_key" ON "CreatorSocialAccount"("creatorId", "platform");

-- AddForeignKey
ALTER TABLE "CreatorDailyMetrics" ADD CONSTRAINT "CreatorDailyMetrics_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorSocialAccount" ADD CONSTRAINT "CreatorSocialAccount_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
