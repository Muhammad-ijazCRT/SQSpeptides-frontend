import {
  SITE_ADDRESS_LINE1,
  SITE_ADDRESS_LINE2,
  SITE_BRAND_NAME,
  SITE_LEGAL_NAME,
  SITE_SUPPORT_EMAIL,
} from "@/lib/site-business";
import type { Product } from "@/lib/store/types";
import { absoluteUrl } from "@/lib/seo/site-url";
import { resolveProductImage } from "@/lib/store/catalog-image";

export function organizationJsonLd() {
  const [cityLine, stateZip] = SITE_ADDRESS_LINE2.split(",").map((s) => s.trim());
  const stateParts = stateZip?.split(/\s+/) ?? [];
  const postalCode = stateParts.length > 1 ? stateParts.slice(1).join(" ") : "";
  const addressRegion = stateParts[0] ?? "TX";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND_NAME,
    legalName: SITE_LEGAL_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    email: SITE_SUPPORT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS_LINE1,
      addressLocality: cityLine,
      addressRegion,
      postalCode,
      addressCountry: "US",
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_BRAND_NAME,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/products-catalog?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  const image = resolveProductImage(product);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? `${product.name} — research-grade peptide for laboratory use only.`,
    image: imageUrl,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: SITE_BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products-catalog/${product.slug}`),
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
