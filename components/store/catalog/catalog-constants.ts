export const CATALOG_CATEGORIES = [
  "Product Catalog",
  "GLPs",
  "Cellular Research Peptides",
  "Metabolic Research Peptides",
  "Neurological Pathway Research Peptides",
  "Specialty Research Peptides",
  "Blend Research Peptides",
  "Laboratory Research Liquids",
  "Popular Peptides",
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

export type SortKey = "default" | "popularity" | "latest" | "price-asc" | "price-desc";
