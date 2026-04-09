-- AlterTable
ALTER TABLE "AffiliatePayoutRequest" ADD COLUMN     "cryptoNetwork" TEXT,
ADD COLUMN     "cryptoAddress" TEXT,
ADD COLUMN     "rejectionReason" TEXT;
