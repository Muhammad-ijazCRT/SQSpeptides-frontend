-- CreateTable
CREATE TABLE "PaymentInvoice" (
    "id" TEXT NOT NULL,
    "publicToken" TEXT NOT NULL,
    "gatewayType" TEXT NOT NULL,
    "gatewayLabel" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "description" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT,
    "checkoutUrl" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paidAt" TIMESTAMP(3),
    "paymentDetails" JSONB,
    "confirmationEmailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInvoice_publicToken_key" ON "PaymentInvoice"("publicToken");

-- CreateIndex
CREATE INDEX "PaymentInvoice_status_idx" ON "PaymentInvoice"("status");

-- CreateIndex
CREATE INDEX "PaymentInvoice_paidAt_idx" ON "PaymentInvoice"("paidAt");

-- CreateIndex
CREATE INDEX "PaymentInvoice_createdAt_idx" ON "PaymentInvoice"("createdAt");
