-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "nowpaymentsApiKey" TEXT,
ADD COLUMN     "nowpaymentsPublicKey" TEXT,
ADD COLUMN     "nowpaymentsIpnSecret" TEXT,
ADD COLUMN     "nowpaymentsSandbox" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentCompletion" TEXT NOT NULL DEFAULT 'paid',
ADD COLUMN     "nowpaymentsInvoiceId" TEXT;

-- CreateTable
CREATE TABLE "OrderPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT,
    "amountUsd" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderPayment_orderId_idx" ON "OrderPayment"("orderId");

-- AddForeignKey
ALTER TABLE "OrderPayment" ADD CONSTRAINT "OrderPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
