export const CATALOG_CATEGORIES = [
  { label: "Product Catalog", href: "/products-catalog" },
  { label: "GLPs", href: "#" },
  { label: "Cellular Research Peptides", href: "#" },
  { label: "Metabolic Research Peptides", href: "#" },
  { label: "Neurological Pathway Research Peptides", href: "#" },
  { label: "Specialty Research Peptides", href: "#" },
  { label: "Blend Research Peptides", href: "#" },
  { label: "Laboratory Research Liquids", href: "#" },
  { label: "Popular Peptides", href: "/#popular-peptides" },
] as const;

export const FILTER_SIZES = [
  { label: "100mg", count: 1 },
  { label: "10mg", count: 18 },
  { label: "10ML", count: 1 },
  { label: "1mg", count: 1 },
  { label: "20mg", count: 1 },
  { label: "30mg", count: 2 },
  { label: "40mg", count: 1 },
  { label: "500mg", count: 1 },
  { label: "50mg", count: 3 },
  { label: "5mg", count: 4 },
  { label: "70mg", count: 1 },
  { label: "80mg", count: 1 },
] as const;

export const CATALOG_REVIEWS = [
  {
    name: "James R",
    date: "Sept 12, 2025",
    text: "The product arrived in perfect condition with secure, professional packaging. Labeling was clear and matched the specifications provided on the website. Quality and purity were exactly as expected for research-grade",
  },
  {
    name: "Daniel Smith",
    date: "Sept 12, 2025",
    text: "From placing the order to receiving the shipment, the process was seamless. The product was well protected and arrived within the expected timeframe. Performance and consistency met professional research requirements.",
  },
  {
    name: "Sarah L",
    date: "Sept 12, 2025",
    text: "Professional-grade product and trustworthy service. Clear documentation and transparent product details were reassuring. The material quality aligned well with the stated specifications.",
  },
] as const;

export const CATALOG_FAQ = [
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
    a: "Batch documentation may be available for specific SKUs. Email support with your order number, SKU, and batch identifier when shown on your label.",
  },
  {
    q: "Where is your inventory located?",
    a: "All inventory is stored and fulfilled domestically within the United States, allowing for faster delivery and reduced transit risks.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are typically processed within 1–2 business days. Domestic shipping generally delivers within 2–5 business days, depending on location and carrier.",
  },
] as const;
