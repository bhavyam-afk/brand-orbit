-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'TENTATIVE');

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

-- CreateIndex
CREATE INDEX "CreatorAvailability_creatorId_date_idx" ON "CreatorAvailability"("creatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorAvailability_creatorId_date_key" ON "CreatorAvailability"("creatorId", "date");

-- AddForeignKey
ALTER TABLE "CreatorAvailability" ADD CONSTRAINT "CreatorAvailability_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
