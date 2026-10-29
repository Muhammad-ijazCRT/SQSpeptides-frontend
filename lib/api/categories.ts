import type { Category } from "@/lib/store/types";
import { apiUrl } from "@/lib/api/backend";

const CATEGORIES_FETCH_TIMEOUT_MS = 12_000;

export const DEFAULT_FALLBACK_CATEGORIES: Category[] = [
  { id: "glp", slug: "glp", name: "GLPs", sortOrder: 1 },
  { id: "cellular", slug: "cellular", name: "Cellular Research Peptides", sortOrder: 2 },
  { id: "metabolic", slug: "metabolic", name: "Metabolic Research Peptides", sortOrder: 3 },
  { id: "neurological", slug: "neurological", name: "Neurological Pathway Research Peptides", sortOrder: 4 },
  { id: "specialty", slug: "specialty", name: "Specialty Research Peptides", sortOrder: 5 },
  { id: "blend", slug: "blend", name: "Blend Research Peptides", sortOrder: 6 },
  { id: "liquids", slug: "liquids", name: "Laboratory Research Liquids", sortOrder: 7 },
];

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(apiUrl("/categories"), {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(CATEGORIES_FETCH_TIMEOUT_MS),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    /* fallback to defaults when backend is down */
  }
  return DEFAULT_FALLBACK_CATEGORIES;
}

export async function fetchAdminCategories(): Promise<Category[]> {
  const res = await fetch("/api/admin/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function createAdminCategory(payload: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}): Promise<Category> {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create category");
  }
  return res.json();
}

export async function updateAdminCategory(
  id: string,
  payload: {
    name?: string;
    slug?: string;
    description?: string;
    sortOrder?: number;
  }
): Promise<Category> {
  const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update category");
  }
  return res.json();
}

export async function deleteAdminCategory(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete category");
  }
  return res.json();
}
