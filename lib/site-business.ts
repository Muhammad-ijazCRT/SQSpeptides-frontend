/**
 * Public business identity for storefront, legal pages, and payment-processor review.
 * Update here to keep address and contact consistent sitewide.
 *
 * Phone: set NEXT_PUBLIC_SUPPORT_PHONE in production (e.g. +19725551234). Display uses the string as-is;
 * tel: links strip to digits and leading + for dialing.
 */
export const SITE_LEGAL_NAME = "SubQ Scientist LLC";
export const SITE_BRAND_NAME = "SQSpeptides";
export const SITE_SUPPORT_EMAIL = "support@sqspeptides.com";

/** E.164-friendly raw value from env; empty if unset (UI may hide phone row). */
export const SITE_SUPPORT_PHONE =
  typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "").trim() : "";

/** Build `tel:` href from SITE_SUPPORT_PHONE (10-digit US assumed if no country code). */
export function siteSupportPhoneTelHref(): string {
  const digits = SITE_SUPPORT_PHONE.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export const SITE_ADDRESS_LINE1 = "760 East Main Street";
export const SITE_ADDRESS_LINE2 = "Lewisville, TX 75057";
export const SITE_ADDRESS_SINGLE_LINE = `${SITE_ADDRESS_LINE1}, ${SITE_ADDRESS_LINE2}`;

export const SITE_BUSINESS_TAGLINE =
  "Research-grade peptides and laboratory supplies for qualified professionals.";
