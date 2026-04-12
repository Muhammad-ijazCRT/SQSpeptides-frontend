-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "zelleEmail" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "zellePhone" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "zelleTransactionId" TEXT;
ALTER TABLE "Order" ADD COLUMN "zelleProofUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN "zelleSubmittedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "zelleRejectionNote" TEXT;
