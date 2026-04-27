import type { Product } from "@/lib/store/types";
import { apiUrl } from "@/lib/api/backend";
import {
  loadProductBySlugFromCatalogJson,
  loadProductsFromCatalogJson,
} from "@/lib/api/catalog-from-json";

const PRODUCTS_FETCH_TIMEOUT_MS = 12_000;

/** When the Nest API is down, use repo-root `products.json` (dev default; prod opt-in). */
function useCatalogJsonFallback(): boolean {
  if (process.env.STORE_CATALOG_FALLBACK_JSON === "1") return true;
  if (process.env.STORE_CATALOG_FALLBACK_JSON === "0") return false;
  return process.env.NODE_ENV === "development";
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(apiUrl("/products"), {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(PRODUCTS_FETCH_TIMEOUT_MS),
    });
    if (res.ok) return res.json();
  } catch {
    /* connection refused, timeout, etc. */
  }
  if (useCatalogJsonFallback()) return loadProductsFromCatalogJson();
  throw new Error("Failed to load products");
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(apiUrl(`/products/by-slug/${encodeURIComponent(slug)}`), {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(PRODUCTS_FETCH_TIMEOUT_MS),
    });
    if (res.status === 404) return null;
    if (res.ok) return res.json();
  } catch {
    /* network */
  }
  if (useCatalogJsonFallback()) return loadProductBySlugFromCatalogJson(slug);
  throw new Error("Failed to load product");
}
