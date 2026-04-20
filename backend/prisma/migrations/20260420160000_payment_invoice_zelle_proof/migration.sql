-- Zelle proof on admin payment links (same idea as Order Zelle)
ALTER TABLE "PaymentInvoice" ADD COLUMN "zelleTransactionId" TEXT;
ALTER TABLE "PaymentInvoice" ADD COLUMN "zelleProofUrl" TEXT;
ALTER TABLE "PaymentInvoice" ADD COLUMN "zelleSubmittedAt" TIMESTAMP(3);
