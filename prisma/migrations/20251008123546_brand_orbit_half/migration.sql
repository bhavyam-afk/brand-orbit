/*
  Warnings:

  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Influencer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[offerId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `offerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INFLUENCER', 'BRAND');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('STORY', 'REEL', 'POST', 'LIVE');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- DropForeignKey
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "Campaign_brandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "Campaign_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_brandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_influencerId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
ADD COLUMN     "offerId" TEXT NOT NULL,
ADD COLUMN     "platformFee" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "brandId" SET DATA TYPE TEXT,
ALTER COLUMN "influencerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Payment_id_seq";

-- DropTable
DROP TABLE "public"."Brand";

-- DropTable
DROP TABLE "public"."Campaign";

-- DropTable
DROP TABLE "public"."Influencer";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfluencerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "niche" TEXT,
    "followersCount" INTEGER,
    "platformLinks" JSONB,
    "profilePic" TEXT,
    "location" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfluencerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "industry" TEXT,
    "logoUrl" TEXT,
    "location" TEXT,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "influencerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "deliveryTime" INTEGER,
    "platform" TEXT,
    "mediaType" "MediaType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "influencerId" TEXT NOT NULL,
    "packageId" TEXT,
    "offerAmount" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InfluencerProfile_userId_key" ON "InfluencerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InfluencerProfile_username_key" ON "InfluencerProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_userId_key" ON "BrandProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_offerId_key" ON "Payment"("offerId");

-- AddForeignKey
ALTER TABLE "InfluencerProfile" ADD CONSTRAINT "InfluencerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
