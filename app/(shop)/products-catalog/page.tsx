import { Suspense } from "react";
import { ProductCatalogClient } from "@/components/store/catalog/product-catalog-client";
import { fetchProducts } from "@/lib/api/products";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Product Catalog",
  description:
    "Browse research-grade peptides and laboratory supplies. 99.9% purity compounds for qualified professionals — laboratory use only.",
  path: "/products-catalog",
});

export const revalidate = 60;

export default async function ProductCatalogPage() {
  let products: Awaited<ReturnType<typeof fetchProducts>> = [];
  let apiError = false;
  try {
    products = await fetchProducts();
  } catch {
    apiError = true;
  }

  return (
    <Suspense
      fallback={
        <div className="bg-white px-4 py-20 text-center text-sm text-neutral-500">
          Loading catalog…
        </div>
      }
    >
      <ProductCatalogClient products={products} apiError={apiError} />
    </Suspense>
  );
}
