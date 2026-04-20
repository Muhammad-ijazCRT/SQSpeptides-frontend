import type { Product } from "@/lib/store/types";

/** URL / state key for the catalog sidebar "Product categories" nav */
export type CatalogCategoryId =
  | "all"
  | "glp"
  | "cellular"
  | "metabolic"
  | "neurological"
  | "specialty"
  | "blend"
  | "liquids"
  | "popular";

export const CATALOG_NAV: { id: CatalogCategoryId; label: string }[] = [
  { id: "all", label: "Product Catalog" },
  { id: "glp", label: "GLPs" },
  { id: "cellular", label: "Cellular Research Peptides" },
  { id: "metabolic", label: "Metabolic Research Peptides" },
  { id: "neurological", label: "Neurological Pathway Research Peptides" },
  { id: "specialty", label: "Specialty Research Peptides" },
  { id: "blend", label: "Blend Research Peptides" },
  { id: "liquids", label: "Laboratory Research Liquids" },
  { id: "popular", label: "Popular Peptides" },
];

const hay = (p: Product) => `${p.slug} ${p.name}`.toLowerCase();

export function productMatchesCatalogCategory(p: Product, id: CatalogCategoryId): boolean {
  if (id === "all") return true;
  const s = hay(p);
  if (id === "popular") return p.rating >= 4.8;
  if (id === "blend") {
    return p.slug.includes("blend") || p.name.includes("+");
  }
  if (id === "liquids") {
    return /\b10\s*ml\b/i.test(s) || /\b\d+\s*ml\b/i.test(p.name) || s.includes("10ml");
  }
  if (id === "glp") {
    const slug = p.slug.toLowerCase();
    return slug.startsWith("glp-") || slug.startsWith("glp_") || /\bglp[-\s]/i.test(p.name);
  }
  if (id === "neurological") {
    return /semax|selank/i.test(s);
  }
  if (id === "cellular") {
    if (productMatchesCatalogCategory(p, "glp")) return false;
    return /bpc|tb[-_]?500|ss[-_]?31|kpv|cjc|ipamorelin/i.test(s);
  }
  if (id === "metabolic") {
    if (productMatchesCatalogCategory(p, "glp")) return false;
    return /nad|lipo|mots|5-amino|amino-1mq|igf|ghk|glow|cagrilintide|klow/i.test(s);
  }
  if (id === "specialty") {
    if (
      productMatchesCatalogCategory(p, "glp") ||
      productMatchesCatalogCategory(p, "cellular") ||
      productMatchesCatalogCategory(p, "metabolic") ||
      productMatchesCatalogCategory(p, "neurological") ||
      productMatchesCatalogCategory(p, "blend")
    ) {
      return false;
    }
    return /mt[-_]?1|mt[-_]?2|melanotan|sqs|test[-_]?e|testosterone/i.test(s);
  }
  return true;
}

export function isCatalogCategoryId(v: string | null): v is CatalogCategoryId {
  if (!v) return false;
  return CATALOG_NAV.some((n) => n.id === v);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Match size tokens like "10mg", "10ML", "500mg" in product slug/name */
export function productMatchesSizeLabel(p: Product, label: string): boolean {
  const s = hay(p);
  const compact = label.replace(/\s+/g, "").toLowerCase();
  if (compact === "10ml") {
    return /\b10\s*ml\b/i.test(s);
  }
  const m = label.match(/^([\d.]+)\s*(mg|ml)$/i);
  if (m) {
    const [, n, unit] = m;
    const u = unit.toLowerCase();
    const re = new RegExp(`\\b${escapeRegExp(n)}\\s*${u}\\b`, "i");
    return re.test(s);
  }
  return s.includes(compact);
}

export function countProductsWithSize(products: Product[], label: string): number {
  return products.filter((p) => productMatchesSizeLabel(p, label)).length;
}

/** Parse "5mg", "10ML" for numeric sidebar ordering (mg before ml when values tie). */
export function parseSizeLabelForSort(label: string): { value: number; unitOrder: number } | null {
  const m = label.trim().match(/^([\d.]+)\s*(mg|ml)$/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!Number.isFinite(value)) return null;
  const unitOrder = m[2].toLowerCase() === "ml" ? 1 : 0;
  return { value, unitOrder };
}

export function compareSizeLabels(a: string, b: string): number {
  const pa = parseSizeLabelForSort(a);
  const pb = parseSizeLabelForSort(b);
  if (pa && pb) {
    if (pa.value !== pb.value) return pa.value - pb.value;
    if (pa.unitOrder !== pb.unitOrder) return pa.unitOrder - pb.unitOrder;
    return 0;
  }
  if (pa && !pb) return -1;
  if (!pa && pb) return 1;
  return a.localeCompare(b);
}
