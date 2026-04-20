"use client";

import { LargeFaqSection, type LargeFaqItem } from "@/components/store/large-faq-section";

export function PopularPeptidesFaqClient({ items, headingFont }: { items: LargeFaqItem[]; headingFont: string }) {
  return (
    <LargeFaqSection
      items={items}
      title="Frequently asked Questions"
      headingClassName={headingFont}
      sectionClassName="bg-[#f2f2f2] py-16 sm:py-20 lg:py-24"
      subtitle="Ordering, documentation, and research-use policies at a glance."
    />
  );
}
