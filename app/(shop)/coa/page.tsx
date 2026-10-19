import { CoaContent } from "@/components/store/coa-content";
import { SITE_BRAND_NAME } from "@/lib/site-business";

export const metadata = {
  title: "Certificates of Analysis (COA)",
  description: `${SITE_BRAND_NAME} Certificates of Analysis — browse batch and lot documentation for research peptides. Verified purity reports and COA library.`,
};

export default function CoaPage() {
  return <CoaContent />;
}
