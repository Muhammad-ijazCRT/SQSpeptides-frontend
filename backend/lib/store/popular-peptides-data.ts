/** Static copy and catalog data for SQSpeptides popular peptides category. */

export type PopularPeptideProduct = {
  name: string;
  slug: string;
  price: number;
  purity: string;
};

export const POPULAR_PEPTIDES_INTRO =
  "Peptide reference materials for non-clinical study of receptor pharmacology and metabolic biochemistry in controlled laboratory systems—not for human or veterinary use.";

export const CATEGORY_PRODUCTS: PopularPeptideProduct[] = [
  { name: "BPC-157", slug: "bpc-157", price: 75, purity: "99.9% Purity" },
  { name: "GHK-CU", slug: "ghk-cu", price: 51.75, purity: "99.9% Purity" },
  { name: "Glow 70MG (GHK-CU/BPC157/TB500)", slug: "glow-70mg", price: 115, purity: "99.9% Purity" },
  { name: "GLP-3 RT 10mg × 10 Vial Kit", slug: "glp-3-rt-10mg-kit", price: 425, purity: "99.9% Purity" },
  { name: "GLP-3RT", slug: "glp-3rt", price: 120.18, purity: "99.9% Purity" },
  { name: "IGF-1 LR3", slug: "igf-1-lr3", price: 129.95, purity: "99.9% Purity" },
  { name: "KLOW 80MG (KPV/GHK-CU/BPC157/TB500)", slug: "klow-80mg", price: 161, purity: "99.9% Purity" },
  { name: "MOTS-C", slug: "mots-c", price: 92, purity: "99.9% Purity" },
  { name: "Sermorelin", slug: "sermorelin", price: 75, purity: "99.9% Purity" },
  { name: "TB-500", slug: "tb-500", price: 80, purity: "99.9% Purity" },
  { name: "WOLVERINE 10mg (BPC157/TB500)", slug: "wolverine-10mg", price: 115, purity: "99.9% Purity" },
];

export const RELATED_PRODUCTS: PopularPeptideProduct[] = [
  { name: "GLP-3 RT 10mg × 10 Vial Kit", slug: "glp-3-rt-10mg-kit", price: 425, purity: "99.9% Purity" },
  {
    name: "Bacteriostatic Water 10mL",
    slug: "bacteriostatic-water-10ml",
    price: 20.11,
    purity: "Research use only",
  },
  {
    name: "AOD-9604",
    slug: "aod-9604",
    price: 80.49,
    purity: "Research use only",
  },
  {
    name: "Cagrilintide",
    slug: "cagrilintide",
    price: 105.77,
    purity: "Research use only",
  },
  { name: "NAD+", slug: "nad-plus", price: 86.25, purity: "Research use only" },
  {
    name: "KLOW 80MG (KPV/GHK-CU/BPC157/TB500)",
    slug: "klow-80mg",
    price: 161,
    purity: "Research use only",
  },
];

export const PRECISION_INTRO =
  "High-purity research compounds formulated for accuracy, consistency, and laboratory use — without fillers, blends, or unnecessary additives.";

export const PRECISION_FEATURES = [
  {
    title: "Purity You Can Trust",
    subtitle: "Research-grade accuracy",
    imageSeed: "lab-purity",
  },
  {
    title: "Third-Party Lab Tested",
    subtitle: "Verified purity & quality",
    imageSeed: "lab-testing",
  },
  {
    title: "Single-compound reference",
    subtitle: "Defined composition for reproducible assay design",
    imageSeed: "lab-bio",
  },
];

export const CATEGORY_NAV = [
  { label: "Popular Peptides", href: "/popular-peptides", current: true },
  { label: "Metabolic Research", href: "/products-catalog" },
  { label: "Longevity & Repair", href: "/products-catalog" },
  { label: "Cognitive & Neural", href: "/products-catalog" },
  { label: "Immune & Defense", href: "/products-catalog" },
  { label: "All Products", href: "/products-catalog" },
];

export const ATTRIBUTE_FILTERS = [
  { id: "in-stock", label: "In stock" },
  { id: "coa", label: "COA available" },
  { id: "domestic", label: "Domestic fulfillment" },
];

/** Factual service highlights (no fabricated customer testimonials). */
export const POPULAR_TRUST_HIGHLIGHTS = [
  {
    title: "Published policies",
    body: "Privacy, terms, refund, and shipping policies are linked in the site footer so you know how orders, data, and payments are handled.",
  },
  {
    title: "Documentation on request",
    body: "For batch-related questions, email support with your order number and SKU. We confirm what documentation exists for that catalog line.",
  },
  {
    title: "U.S. business address",
    body: "760 East Main Street, Lewisville, TX 75057 — the same address shown on our Contact page and legal notices.",
  },
] as const;

export const FAQ_ITEMS: { q: string; a: string }[] = [
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
    a: "Research materials are generally final sale once shipped. We replace or refund when we confirm our error, severe transit damage, or carrier-documented loss. See our Refund Policy page for the complete policy.",
  },
  {
    q: "How do I contact support?",
    a: "Use the Contact page for our Lewisville, TX address and email, or write to support@sqspeptides.com with your order number.",
  },
  {
    q: "Do you provide usage instructions or dosing guidance?",
    a: "No. We do not provide instructions, recommendations, or guidance related to human or animal use.",
  },
  {
    q: "Is my information kept private?",
    a: "Yes. Our privacy policy explains what we collect, how we use it, and how payment processors handle card data.",
  },
];

export const RESEARCH_QUALITY = {
  title: "Research-Grade Quality You Can Trust",
  body:
    "Our peptide products are handled in controlled laboratory environments and developed with a strong focus on precision, consistency, and research integrity. Every step reflects our commitment to high-quality standards suitable for professional research use.",
  bullets: [
    "Research-grade handling in controlled laboratory settings",
    "Precision testing using advanced analytical instruments",
    "Clean, controlled environments to ensure consistency",
    "Batch-level quality checks for reliability",
    "Designed strictly for research purposes",
  ],
};
