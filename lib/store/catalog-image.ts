/** Placeholder product photos when `imageUrl` is not set in the database. */
export function catalogDummyImage(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/900`;
}

/** Use admin-provided image URL when valid; otherwise deterministic placeholder from slug. */
export function resolveProductImage(product: { slug: string; imageUrl: string | null }): string {
  const raw = product.imageUrl?.trim();
  if (raw) {
    if (raw.startsWith("https://") || raw.startsWith("http://") || raw.startsWith("/")) {
      return raw;
    }
  }
  return catalogDummyImage(product.slug);
}
