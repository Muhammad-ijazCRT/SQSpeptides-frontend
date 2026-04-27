import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/lib/store/types";

async function readCatalogJsonFile(): Promise<string> {
  const here = path.join(process.cwd(), "products.json");
  const parent = path.join(process.cwd(), "..", "products.json");
  try {
    return await readFile(here, "utf8");
  } catch {
    return readFile(parent, "utf8");
  }
}

function toProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const slug = typeof p.slug === "string" ? p.slug : null;
  const name = typeof p.name === "string" ? p.name : null;
  if (!slug || !name) return null;
  const id = typeof p.id === "string" && p.id.length > 0 ? p.id : slug;
  const priceRaw = p.price;
  const price =
    typeof priceRaw === "number" ? priceRaw : Number.isFinite(Number(priceRaw)) ? Number(priceRaw) : NaN;
  if (!Number.isFinite(price) || price < 0) return null;
  const ratingRaw = p.rating;
  const rating =
    typeof ratingRaw === "number"
      ? ratingRaw
      : Number.isFinite(Number(ratingRaw))
        ? Number(ratingRaw)
        : 0;
  const desc = p.description;
  const img =
    typeof p.imageUrl === "string"
      ? p.imageUrl
      : typeof p.image_url === "string"
        ? p.image_url
        : null;
  return {
    id,
    slug,
    name,
    description: typeof desc === "string" ? desc : null,
    price,
    imageUrl: img,
    rating: Math.min(5, Math.max(0, rating)),
  };
}

/** Loads catalog from repo-root `products.json` (same source as Prisma seed in SQSpeptides-backend). */
export async function loadProductsFromCatalogJson(): Promise<Product[]> {
  const buf = await readCatalogJsonFile();
  const raw = JSON.parse(buf) as unknown;
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => toProduct(row)).filter((x): x is Product => x !== null);
}

export async function loadProductBySlugFromCatalogJson(slug: string): Promise<Product | null> {
  const all = await loadProductsFromCatalogJson();
  return all.find((p) => p.slug === slug) ?? null;
}
