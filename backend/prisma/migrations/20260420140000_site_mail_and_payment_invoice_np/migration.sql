-- SiteSettings: SMTP (editable from admin)
ALTER TABLE "SiteSettings" ADD COLUMN "mailHost" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "mailPort" INTEGER;
ALTER TABLE "SiteSettings" ADD COLUMN "mailSecure" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteSettings" ADD COLUMN "mailUser" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "mailPassword" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "mailFrom" TEXT;

-- PaymentInvoice: NOWPayments instead of Stripe
ALTER TABLE "PaymentInvoice" DROP COLUMN "stripeCheckoutSessionId";
ALTER TABLE "PaymentInvoice" ADD COLUMN "nowpaymentsInvoiceId" TEXT;
