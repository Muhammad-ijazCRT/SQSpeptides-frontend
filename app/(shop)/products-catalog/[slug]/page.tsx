import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductDetailShell } from "@/components/store/product-detail/product-detail-shell";
import { fetchProductBySlug, fetchProducts } from "@/lib/api/products";
import { productJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveProductImage } from "@/lib/store/catalog-image";
import { stripHtml } from "@/lib/store/strip-html";
import type { Product } from "@/lib/store/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof fetchProductBySlug>> = null;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    return { title: "Product | SQSpeptides" };
  }
  if (!product) return { title: "Product" };
  const img = resolveProductImage(product);
  const rawDescription = product.description?.trim() || "";
  const description =
    (rawDescription ? stripHtml(rawDescription) : "") ||
    `${product.name} — 99.9% purity research peptide for laboratory use only. Not for human consumption.`;
  return buildPageMetadata({
    title: product.name,
    description,
    path: `/products-catalog/${product.slug}`,
    ogImage: img,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: Product | null = null;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    notFound();
  }
  if (!product) notFound();

  let allProducts: Product[] = [];
  try {
    allProducts = await fetchProducts();
  } catch {
    allProducts = [];
  }

  // Filter related products (exclude current, prefer matching category or spotlighted)
  const related = allProducts
    .filter((p) => p.id !== product!.id && p.slug !== product!.slug)
    .sort((a, b) => {
      // Prioritize same category if exists
      if (product!.categoryId) {
        if (a.categoryId === product!.categoryId && b.categoryId !== product!.categoryId) return -1;
        if (b.categoryId === product!.categoryId && a.categoryId !== product!.categoryId) return 1;
      }
      // Then prioritize spotlight
      if (a.spotlight && !b.spotlight) return -1;
      if (!a.spotlight && b.spotlight) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ProductDetailShell product={product} relatedProducts={related} />
    </>
  );
}
