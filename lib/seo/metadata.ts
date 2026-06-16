import type { Metadata } from "next";
import {
  SITE_BRAND_NAME,
  SITE_BUSINESS_TAGLINE,
  SITE_SUPPORT_EMAIL,
} from "@/lib/site-business";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/site-url";

const DEFAULT_OG_IMAGE = "/logo.png";

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  /** Set false for checkout, account, admin-adjacent pages */
  index?: boolean;
  ogImage?: string;
};

export function buildPageMetadata({
  title,
  description = SITE_BUSINESS_TAGLINE,
  path = "/",
  index = true,
  ogImage = DEFAULT_OG_IMAGE,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
  const fullTitle = title.includes(SITE_BRAND_NAME) ? title : `${title} | ${SITE_BRAND_NAME}`;

  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_BRAND_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: SITE_BRAND_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

const ROOT_DESCRIPTION = `${SITE_BUSINESS_TAGLINE} U.S. business with published policies and secure checkout.`;
const ROOT_TITLE = `${SITE_BRAND_NAME} | Research Peptides`;

export const rootSiteMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: ROOT_TITLE,
    template: `%s | ${SITE_BRAND_NAME}`,
  },
  description: ROOT_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_BRAND_NAME,
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE), alt: SITE_BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: { index: true, follow: true },
  applicationName: SITE_BRAND_NAME,
  authors: [{ name: SITE_BRAND_NAME, url: getSiteUrl() }],
  creator: SITE_BRAND_NAME,
  publisher: SITE_BRAND_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  other: {
    "contact:email": SITE_SUPPORT_EMAIL,
  },
};
