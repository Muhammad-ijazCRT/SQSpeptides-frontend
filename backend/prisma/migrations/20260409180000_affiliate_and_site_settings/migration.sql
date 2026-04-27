-- Site-wide affiliate commission (default 10%, min enforced in app)
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "affiliateCommissionPercent" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SiteSettings" ("id", "affiliateCommissionPercent", "updatedAt")
VALUES ('default', 10, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "Customer" ADD COLUMN "affiliateCode" TEXT;
ALTER TABLE "Customer" ADD COLUMN "affiliateBalance" DECIMAL(12,2) NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "Customer_affiliateCode_key" ON "Customer"("affiliateCode");

ALTER TABLE "Order" ADD COLUMN "affiliateReferrerId" TEXT;
ALTER TABLE "Order" ADD COLUMN "storeCreditUsed" DECIMAL(12,2) NOT NULL DEFAULT 0;

CREATE INDEX "Order_affiliateReferrerId_idx" ON "Order"("affiliateReferrerId");

ALTER TABLE "Order" ADD CONSTRAINT "Order_affiliateReferrerId_fkey" FOREIGN KEY ("affiliateReferrerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "AffiliateEarning" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderSubtotal" DECIMAL(12,2) NOT NULL,
    "commissionPercent" DECIMAL(5,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateEarning_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AffiliateEarning_orderId_key" ON "AffiliateEarning"("orderId");
CREATE INDEX "AffiliateEarning_affiliateId_idx" ON "AffiliateEarning"("affiliateId");

ALTER TABLE "AffiliateEarning" ADD CONSTRAINT "AffiliateEarning_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateEarning" ADD CONSTRAINT "AffiliateEarning_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AffiliatePayoutRequest" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliatePayoutRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AffiliatePayoutRequest_customerId_idx" ON "AffiliatePayoutRequest"("customerId");
CREATE INDEX "AffiliatePayoutRequest_status_idx" ON "AffiliatePayoutRequest"("status");

ALTER TABLE "AffiliatePayoutRequest" ADD CONSTRAINT "AffiliatePayoutRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
