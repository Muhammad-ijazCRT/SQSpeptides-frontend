import type { Product } from "@/lib/store/types";

/** Coerce API/localStorage payloads into a valid Product for cart and checkout. */
export function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const id = typeof p.id === "string" ? p.id : null;
  const slug = typeof p.slug === "string" ? p.slug : null;
  const name = typeof p.name === "string" ? p.name : null;
  if (!id || !slug || !name) return null;
  const price = typeof p.price === "number" ? p.price : Number(p.price);
  if (!Number.isFinite(price) || price < 0) return null;
  const rating =
    typeof p.rating === "number" ? p.rating : Number.isFinite(Number(p.rating)) ? Number(p.rating) : 0;
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
