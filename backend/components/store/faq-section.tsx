"use client";

import { LargeFaqSection, type LargeFaqItem } from "@/components/store/large-faq-section";

const faqs: LargeFaqItem[] = [
  {
    q: "Are your products for human consumption?",
    a: "No. Products are sold strictly for laboratory research use only, by qualified professionals.",
  },
  {
    q: "How do I get batch or COA documentation?",
    a: "Email support with your order number, SKU, and batch identifier (if shown on your label). We will send applicable documentation or confirm what is available for that catalog item.",
  },
  {
    q: "What shipping options are available?",
    a: "We offer standard and expedited shipping. Same-day processing applies to orders placed before the daily cutoff.",
  },
  {
    q: "Do you ship internationally?",
    a: "Select regions are supported. Contact support with your location for eligibility and documentation requirements.",
  },
];

export function FaqSection() {
  return (
    <LargeFaqSection
      items={faqs}
      title="Frequently Asked Questions"
      subtitle="Common questions about research use, documentation, and fulfillment."
      sectionClassName="bg-white py-16 sm:py-20 lg:py-24"
    />
  );
}
