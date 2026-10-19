"use client";

import { LargeFaqSection, type LargeFaqItem } from "@/components/store/large-faq-section";
import { SITE_SUPPORT_EMAIL } from "@/lib/site-business";

const faqs: LargeFaqItem[] = [
  {
    q: "What are research peptides used for in the lab?",
    a: "Research peptides are supplied for in vitro and analytical laboratory work—assay development, receptor-binding studies, method validation, and other non-clinical experiments. Catalog items are not drugs, supplements, or medical products.",
  },
  {
    q: "Are your peptides for human or veterinary use?",
    a: "No. Every product is sold strictly for laboratory research use only, by qualified professionals. They are not intended to diagnose, treat, cure, or prevent any disease, and they are not for human or animal consumption.",
  },
  {
    q: "Are these pharmaceutical-grade peptides?",
    a: "No. Our catalog is research-grade material for non-clinical study. Items are not pharmaceutical products, are not manufactured under drug-product standards for clinical use, and must not be treated as medicines.",
  },
  {
    q: "How do you define purity for research peptides?",
    a: "Listed purity refers to analytical characterization of the research material (for example HPLC-related assay results where applicable). Always verify the lot documentation for the batch you receive; purity claims apply to research identity and quality control, not clinical suitability.",
  },
  {
    q: "Do you provide Certificates of Analysis (COAs) or batch data?",
    a: `Batch documentation and supporting quality information may be available where applicable. Email ${SITE_SUPPORT_EMAIL} with your order number, SKU, and batch identifier from the label, and we will send what is available for that catalog item.`,
  },
  {
    q: "How should lyophilized research peptides be stored?",
    a: "Store unopened lyophilized material according to the product label and your lab’s SOP—typically cool, dry, and protected from light. Avoid repeated temperature cycling. Once reconstituted for an experiment, follow your protocol’s stability and aliquot practices; we do not provide clinical storage or dosing guidance.",
  },
  {
    q: "How should research peptides be reconstituted for laboratory assays?",
    a: "Reconstitution solvents and concentrations should be chosen by your laboratory based on the peptide’s properties and the assay design (for example solubility, buffer compatibility, and analytical method). We do not provide human-use reconstitution, injection, or dosing instructions.",
  },
  {
    q: "Why does peptide sequence and molecular weight matter on the label?",
    a: "Sequence and molecular weight help researchers confirm identity against their protocol and reference standards. Cross-check the vial label and any batch paperwork before use so experimental records stay traceable.",
  },
  {
    q: "Can the same peptide appear in different vial sizes or concentrations?",
    a: "Yes. Catalog listings may offer multiple research amounts or pack sizes. Confirm the SKU, net content, and any stated concentration on the product page and label before ordering so your experiment planning matches the material received.",
  },
  {
    q: "How do I compare batches for research reproducibility?",
    a: "Record the batch or lot number from each vial, keep COA or assay data with your lab notebook, and avoid mixing lots in a single experiment unless your protocol allows it. Request batch documentation when you need side-by-side analytical comparison.",
  },
  {
    q: "Do you provide usage, dosing, or clinical guidance?",
    a: "No. We do not provide instructions, recommendations, or guidance related to human or animal use, dosing, or medical application. Product pages describe research-oriented catalog details only.",
  },
  {
    q: "Who is eligible to purchase research peptides?",
    a: "Products are intended for qualified researchers, laboratories, and institutions that understand research-only restrictions. By ordering, you confirm the materials will be used solely for lawful laboratory or analytical purposes.",
  },
  {
    q: "How are peptides packaged for research integrity in transit?",
    a: "Items are packaged to protect vial integrity during shipping and labeled for research identification. Domestic U.S. fulfillment helps reduce long transit times that can stress temperature-sensitive materials.",
  },
  {
    q: "What shipping options are available?",
    a: "We offer standard and expedited domestic shipping. Orders placed before the daily cutoff are processed the same business day when inventory allows. Typical domestic delivery is a few business days depending on carrier and destination.",
  },
  {
    q: "Do you ship internationally?",
    a: "We primarily support U.S. shipping. International eligibility, if offered, varies by product and destination—contact support with your location and required documentation before ordering.",
  },
  {
    q: "Do you offer wholesale or volume pricing for labs?",
    a: "Yes. Qualified laboratories and research organizations can apply for wholesale or volume pricing. Use the Apply for Wholesale page or contact support with estimated volumes and SKUs.",
  },
  {
    q: "What is your return policy for research materials?",
    a: "Research materials are generally final sale once shipped. We replace or refund when we confirm our error, severe transit damage, or carrier-documented loss. See the Refund Policy page for full terms.",
  },
  {
    q: "How do I contact support about an order or documentation request?",
    a: `Email ${SITE_SUPPORT_EMAIL} with your order number and SKU (and batch ID for COA requests). Business hours and our Lewisville, TX address are listed on the Contact Us page.`,
  },
];

export function FaqSection() {
  return (
    <LargeFaqSection
      items={faqs}
      title="Frequently Asked Questions"
      subtitle="Research-focused answers on peptide purity, documentation, lab handling, shipping, and compliance."
      sectionClassName="bg-white py-16 sm:py-20 lg:py-24"
    />
  );
}
