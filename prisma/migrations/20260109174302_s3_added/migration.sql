/*
  Warnings:

  - The `contentDraft` column on the `PackageCollaboration` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PackageCollaboration" DROP COLUMN "contentDraft",
ADD COLUMN     "contentDraft" JSONB;
