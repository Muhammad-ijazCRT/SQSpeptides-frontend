import {
  SITE_ADDRESS_LINE1,
  SITE_ADDRESS_LINE2,
  SITE_BRAND_NAME,
  SITE_LEGAL_NAME,
  SITE_SUPPORT_EMAIL,
  SITE_SUPPORT_PHONE,
  siteSupportPhoneTelHref,
} from "@/lib/site-business";

type Variant = "footer" | "inline";

export function BusinessAddress({ variant = "inline", className = "" }: { variant?: Variant; className?: string }) {
  const isFooter = variant === "footer";
  const muted = isFooter ? "text-white/70" : "text-neutral-600";
  const strong = isFooter ? "text-white" : "text-black";
  const link = isFooter ? "text-[#D4AF37] hover:text-[#e5c34d]" : "text-[#b8962e] hover:underline";

  return (
    <address className={`not-italic ${className}`}>
      <p className={`text-sm font-semibold ${strong}`}>{SITE_BRAND_NAME}</p>
      <p className={`text-xs ${muted}`}>{SITE_LEGAL_NAME}</p>
      <p className={`mt-2 text-sm ${muted}`}>{SITE_ADDRESS_LINE1}</p>
      <p className={`text-sm ${muted}`}>{SITE_ADDRESS_LINE2}</p>
      <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className={`mt-2 inline-block text-sm font-medium ${link}`}>
        {SITE_SUPPORT_EMAIL}
      </a>
      {SITE_SUPPORT_PHONE ? (
        <a
          href={`tel:${siteSupportPhoneTelHref()}`}
          className={`mt-1 block text-sm font-medium ${link}`}
        >
          {SITE_SUPPORT_PHONE}
        </a>
      ) : null}
    </address>
  );
}
