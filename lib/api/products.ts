import type { Product } from "@/lib/store/types";
import { apiUrl } from "@/lib/api/backend";

const PRODUCTS_FETCH_TIMEOUT_MS = 12_000;

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(apiUrl("/products"), {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(PRODUCTS_FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(apiUrl(`/products/by-slug/${encodeURIComponent(slug)}`), {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(PRODUCTS_FETCH_TIMEOUT_MS),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}
