"use client";

import { LargeFaqSection, type LargeFaqItem } from "@/components/store/large-faq-section";

const items: LargeFaqItem[] = [
  {
    q: "What are your products intended for?",
    a: "All products sold on this site are intended strictly for laboratory research and analytical purposes only. They are not approved for human or veterinary use and are not intended to diagnose, treat, cure, or prevent any disease.",
  },
  {
    q: "Who can purchase from your website?",
    a: "Our products are supplied to qualified researchers, laboratories, and institutions. By purchasing, you acknowledge that you understand the intended research-only nature of these materials.",
  },
  {
    q: "Are your products pharmaceutical grade?",
    a: "No. Our products are supplied as research-grade compounds intended for non-clinical study. They are not pharmaceutical products and are not manufactured for human consumption.",
  },
  {
    q: "Do you provide Certificates of Analysis (COAs)?",
    a: "Batch documentation and supporting quality information may be available upon request where applicable. Please contact us directly if you require additional batch-related documentation.",
  },
  {
    q: "Where is your inventory located?",
    a: "All inventory is stored and fulfilled domestically within the United States, allowing for faster delivery and reduced transit risks.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are typically processed within 1–2 business days. Domestic shipping generally delivers within 2–5 business days, depending on location and carrier.",
  },
  {
    q: "Do you ship internationally?",
    a: "At this time, we primarily support domestic U.S. shipping. International availability, if offered, may vary by product and destination.",
  },
  {
    q: "How are products packaged?",
    a: "Products are securely packaged to maintain integrity during transit and are labeled clearly for research identification purposes.",
  },
  {
    q: "Do you offer bulk or wholesale pricing?",
    a: "Yes. Bulk and wholesale pricing may be available for qualified buyers. Please contact us directly to discuss volume-based opportunities.",
  },
  {
    q: "Can I modify or cancel an order after placing it?",
    a: "Once an order has been processed or shipped, modifications may not be possible. Please contact us as soon as possible after placing your order for assistance.",
  },
  {
    q: "What is your return or refund policy?",
    a: "Due to the nature of research materials, all sales are final once shipped. If there is an issue with your order upon arrival, please contact us promptly.",
  },
  {
    q: "How do I contact support?",
    a: "For questions regarding orders, documentation, or general inquiries, please use the contact form on our website or reach out via the listed support channels.",
  },
  {
    q: "Do you provide usage instructions or dosing guidance?",
    a: "No. We do not provide instructions, recommendations, or guidance related to human or animal use.",
  },
  {
    q: "Is my information kept private?",
    a: "Yes. We respect customer privacy and handle all information in accordance with our privacy policy.",
  },
];

export function CatalogFaq() {
  return (
    <LargeFaqSection
      items={items}
      title="Frequently asked Questions"
      subtitle="Straight answers about research use, shipping, documentation, and support."
    />
  );
}
