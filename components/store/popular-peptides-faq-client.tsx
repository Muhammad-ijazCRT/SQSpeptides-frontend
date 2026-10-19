"use client";

import { LargeFaqSection, type LargeFaqItem } from "@/components/store/large-faq-section";

export function PopularPeptidesFaqClient({
  items,
  headingFont,
  subtitle = "Ordering, documentation, and research-use policies at a glance.",
}: {
  items: LargeFaqItem[];
  headingFont: string;
  subtitle?: string;
}) {
  return (
    <LargeFaqSection
      items={items}
      title="Questions before you order"
      headingClassName={headingFont}
      sectionClassName="bg-[#f0ebe3] py-16 sm:py-20 lg:py-24"
      subtitle={subtitle}
    />
  );
}
