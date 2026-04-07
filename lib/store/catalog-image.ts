/** Served from `public/product-vial.svg` when a product has no usable `imageUrl`. */
export const DEFAULT_PRODUCT_IMAGE = "/product-vial.svg";

/** @deprecated Use `DEFAULT_PRODUCT_IMAGE` or `resolveProductImage`. Kept for call sites that still import the name. */
export function catalogDummyImage(_seed: string): string {
  return DEFAULT_PRODUCT_IMAGE;
}

/**
 * Older seeds used `/images/N.jpg` while assets live under `public/products/images/`.
 */
function normalizeStoredImageUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const legacy = /^\/images\/([^/]+\.(?:jpg|jpeg|png|webp|gif|svg))$/i.exec(s);
  if (legacy) {
    return `/products/images/${legacy[1]}`;
  }
  return s;
}

function isAllowedImageUrl(s: string): boolean {
  return (
    s.startsWith("https://") ||
    s.startsWith("http://") ||
    s.startsWith("/")
  );
}

/** Use `imageUrl` from the API/DB when valid; otherwise {@link DEFAULT_PRODUCT_IMAGE}. */
export function resolveProductImage(product: { slug: string; imageUrl: string | null }): string {
  const raw = product.imageUrl?.trim();
  if (!raw) {
    return DEFAULT_PRODUCT_IMAGE;
  }
  const normalized = normalizeStoredImageUrl(raw);
  if (normalized && isAllowedImageUrl(normalized)) {
    return normalized;
  }
  return DEFAULT_PRODUCT_IMAGE;
}

export function isDefaultProductImage(src: string): boolean {
  return src === DEFAULT_PRODUCT_IMAGE;
}

/** `next/image` `fill`: cover for real photos; contain + padding for the default vial SVG. */
export function productImageBoxClassName(src: string, tail = ""): string {
  const base = isDefaultProductImage(src) ? "object-contain p-3 sm:p-4" : "object-cover";
  return tail ? `${base} ${tail}` : base;
}
