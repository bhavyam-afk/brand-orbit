-- CreateTable
CREATE TABLE "CreatorFollowerSnapshot" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorFollowerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorFollowerSnapshot_creatorId_recordedAt_idx" ON "CreatorFollowerSnapshot"("creatorId", "recordedAt");

-- AddForeignKey
ALTER TABLE "CreatorFollowerSnapshot" ADD CONSTRAINT "CreatorFollowerSnapshot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
