/*
  Warnings:

  - The values [DEPOSIT,WITHDRAWAL,PAYMENT,FEE] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('BRAND_PAYMENT', 'CREATOR_EARNING', 'PLATFORM_FEE', 'PAYOUT', 'REFUND');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "WalletType" ADD VALUE 'PLATFORM';

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromWalletId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toWalletId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "externalOrderId" TEXT,
ADD COLUMN     "externalPaymentId" TEXT,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "fromWalletId" DROP NOT NULL,
ALTER COLUMN "toWalletId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
