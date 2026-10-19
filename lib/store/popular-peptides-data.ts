/** Static copy and catalog data for SQSpeptides popular peptides category. */

export type PopularPeptideProduct = {
  name: string;
  slug: string;
  price: number;
  purity: string;
};

export const POPULAR_PEPTIDES_EYEBROW = "Research-grade · Bench-first";

export const POPULAR_PEPTIDES_HEADLINE = "The molecules that earn a second order";

export const POPULAR_PEPTIDES_INTRO =
  "Every sharp study starts with a sharp molecule. These are the peptides labs reach for first—tight purity, clear identity, research use only.";

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
  "Trends chase headlines. We chase signal. Single-compound reference materials—so your assay reads clean, and your notebook stays honest.";

export const PRECISION_FEATURES = [
  {
    title: "Purity that holds",
    subtitle: "Research-grade accuracy you can stand behind",
    imageSeed: "lab-purity",
  },
  {
    title: "Verified before it travels",
    subtitle: "Third-party checks where documentation applies",
    imageSeed: "lab-testing",
  },
  {
    title: "One compound. Clear story.",
    subtitle: "Defined composition for reproducible design",
    imageSeed: "lab-bio",
  },
];

/** Factual service highlights (no fabricated customer testimonials). */
export const POPULAR_TRUST_HIGHLIGHTS = [
  {
    title: "Policies in plain sight",
    body: "Privacy, terms, refunds, and shipping—linked in the footer, not buried where nobody looks.",
  },
  {
    title: "Docs when you need them",
    body: "Send your order number and SKU. We confirm what batch documentation exists for that catalog line.",
  },
  {
    title: "A real U.S. address",
    body: "760 East Main Street, Lewisville, TX 75057—the same address on Contact and legal notices.",
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
  title: "From vial to verification",
  body: "We treat every peptide like evidence. Controlled handling, careful checks, and a clear research-only lane—so your work stays clean from unboxing to write-up.",
  bullets: [
    "Handled for research integrity, not hype",
    "Analytical focus on consistency batch to batch",
    "Labeled for the lab—never for clinical use",
    "Domestic fulfillment to protect transit integrity",
    "Strictly for laboratory and analytical study",
  ],
};

export const RELATED_INTRO = "Next vials that keep the same story going—purity first, research only.";

export const FAQ_SUBTITLE = "Short answers. Clear rules. No guesswork on research use.";
