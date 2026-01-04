-- DropForeignKey
ALTER TABLE "CreatorSocialAccount" DROP CONSTRAINT "CreatorSocialAccount_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "CreatorSocialAccount" ADD CONSTRAINT "CreatorSocialAccount_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
