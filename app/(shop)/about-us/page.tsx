import { AboutUsContent } from "@/components/store/about-us-content";
import { SITE_BRAND_NAME, SITE_BUSINESS_TAGLINE } from "@/lib/site-business";

export const metadata = {
  title: "About Us",
  description: `${SITE_BRAND_NAME} — research peptides and lab supplies for qualified professionals. ${SITE_BUSINESS_TAGLINE}`,
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
