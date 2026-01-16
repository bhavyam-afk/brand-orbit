-- CreateEnum
CREATE TYPE "CustomPackageStatus" AS ENUM ('REQUESTED', 'COUNTERED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "CustomPackageRequest" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deliverables" TEXT[],
    "mediaType" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "deliveryDays" INTEGER NOT NULL,
    "status" "CustomPackageStatus" NOT NULL DEFAULT 'REQUESTED',
    "counterPrice" DECIMAL(65,30),
    "counterDeliverables" TEXT[],
    "counterMessage" TEXT,
    "collaborationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomPackageRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomPackageRequest_creatorId_status_idx" ON "CustomPackageRequest"("creatorId", "status");

-- CreateIndex
CREATE INDEX "CustomPackageRequest_brandId_idx" ON "CustomPackageRequest"("brandId");

-- AddForeignKey
ALTER TABLE "CustomPackageRequest" ADD CONSTRAINT "CustomPackageRequest_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPackageRequest" ADD CONSTRAINT "CustomPackageRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
