-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CREATOR', 'BRAND');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('ACTIVE', 'DRAFT', 'DELETED');

-- CreateEnum
CREATE TYPE "CollabStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'PAYOUT', 'FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CreatorCategory" AS ENUM ('NANO', 'MICRO', 'MACRO', 'CELEB');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'TENTATIVE');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "contentStatus" AS ENUM ('NOT_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CollabType" AS ENUM ('PACKAGE', 'CAMPAIGN');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('CREATOR', 'BRAND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "username" TEXT NOT NULL,
    "location" TEXT,
    "niche" TEXT,
    "profilePicUrl" TEXT,
    "introClipUrl" TEXT,
    "nicheTags" TEXT[],
    "portfolio" JSONB,
    "mlScore" DOUBLE PRECISION,
    "category" "CreatorCategory" NOT NULL,
    "platformLinks" JSONB,
    "follower_count" INTEGER NOT NULL DEFAULT 0,
    "walletId" TEXT,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "logoUrl" TEXT,
    "bio" TEXT,
    "industryTags" TEXT[],
    "socialLinks" JSONB,
    "walletId" TEXT,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "mediaType" TEXT NOT NULL,
    "deliverables" TEXT[],
    "deliveryTimeDays" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "packagestatus" "PackageStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "budget" DECIMAL(12,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "creators" TEXT[],
    "campaignstatus" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageTitle" TEXT NOT NULL,
    "campaignId" TEXT,
    "collabType" "CollabType" NOT NULL,
    "collabstatus" "CollabStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCollaboration" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "contentStatus" "contentStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "contentDraft" JSONB,
    "draftSubmittedAt" TIMESTAMP(3),
    "brandFeedback" TEXT,
    "draftapprovalAt" TIMESTAMP(3),
    "publishedContentUrl" TEXT,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "PackageCollaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignCollaboration" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "scope" JSONB NOT NULL,
    "contentStatus" "contentStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "contentDraft" JSONB,
    "draftSubmittedAt" TIMESTAMP(3),
    "brandFeedback" TEXT,
    "draftapprovalAt" TIMESTAMP(3),
    "publishedContentUrl" TEXT,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "CampaignCollaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT,
    "collabId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletType" "WalletType" NOT NULL,
    "currentBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pendingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalEarned" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "fromWalletId" TEXT NOT NULL,
    "toWalletId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "collabId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorFollowerSnapshot" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "followers_increased" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorFollowerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorAvailability" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AvailabilityStatus" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorAvailability_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "CreatorSocialAccount" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3),
    "igAccountId" TEXT,
    "pageId" TEXT,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorSocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_username_key" ON "CreatorProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_walletId_key" ON "CreatorProfile"("walletId");

-- CreateIndex
CREATE INDEX "CreatorProfile_userId_idx" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_id_username_key" ON "CreatorProfile"("id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_userId_key" ON "BrandProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_username_key" ON "BrandProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_walletId_key" ON "BrandProfile"("walletId");

-- CreateIndex
CREATE INDEX "BrandProfile_userId_idx" ON "BrandProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_id_username_key" ON "BrandProfile"("id", "username");

-- CreateIndex
CREATE INDEX "Package_creatorId_idx" ON "Package"("creatorId");

-- CreateIndex
CREATE INDEX "Campaign_brandId_idx" ON "Campaign"("brandId");

-- CreateIndex
CREATE INDEX "Collaboration_creatorId_idx" ON "Collaboration"("creatorId");

-- CreateIndex
CREATE INDEX "Collaboration_brandId_idx" ON "Collaboration"("brandId");

-- CreateIndex
CREATE INDEX "Collaboration_packageId_idx" ON "Collaboration"("packageId");

-- CreateIndex
CREATE INDEX "Collaboration_campaignId_idx" ON "Collaboration"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCollaboration_collabId_key" ON "PackageCollaboration"("collabId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignCollaboration_collabId_key" ON "CampaignCollaboration"("collabId");

-- CreateIndex
CREATE INDEX "CampaignCollaboration_campaignId_idx" ON "CampaignCollaboration"("campaignId");

-- CreateIndex
CREATE INDEX "Report_campaignId_idx" ON "Report"("campaignId");

-- CreateIndex
CREATE INDEX "Report_collabId_idx" ON "Report"("collabId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Transaction_fromWalletId_idx" ON "Transaction"("fromWalletId");

-- CreateIndex
CREATE INDEX "Transaction_toWalletId_idx" ON "Transaction"("toWalletId");

-- CreateIndex
CREATE INDEX "Transaction_collabId_idx" ON "Transaction"("collabId");

-- CreateIndex
CREATE INDEX "CreatorFollowerSnapshot_creatorId_recordedAt_idx" ON "CreatorFollowerSnapshot"("creatorId", "recordedAt");

-- CreateIndex
CREATE INDEX "CreatorAvailability_creatorId_date_idx" ON "CreatorAvailability"("creatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorAvailability_creatorId_date_key" ON "CreatorAvailability"("creatorId", "date");

-- CreateIndex
CREATE INDEX "CreatorSocialRawSnapshot_creatorId_fetchedAt_idx" ON "CreatorSocialRawSnapshot"("creatorId", "fetchedAt");

-- CreateIndex
CREATE INDEX "CreatorDailyMetrics_creatorId_date_idx" ON "CreatorDailyMetrics"("creatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorDailyMetrics_creatorId_date_key" ON "CreatorDailyMetrics"("creatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorSocialAccount_creatorId_platform_key" ON "CreatorSocialAccount"("creatorId", "platform");

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCollaboration" ADD CONSTRAINT "PackageCollaboration_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collaboration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCollaboration" ADD CONSTRAINT "PackageCollaboration_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCollaboration" ADD CONSTRAINT "CampaignCollaboration_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collaboration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCollaboration" ADD CONSTRAINT "CampaignCollaboration_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collaboration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorFollowerSnapshot" ADD CONSTRAINT "CreatorFollowerSnapshot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorAvailability" ADD CONSTRAINT "CreatorAvailability_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorSocialRawSnapshot" ADD CONSTRAINT "CreatorSocialRawSnapshot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorDailyMetrics" ADD CONSTRAINT "CreatorDailyMetrics_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorSocialAccount" ADD CONSTRAINT "CreatorSocialAccount_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
