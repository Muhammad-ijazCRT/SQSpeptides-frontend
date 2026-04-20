import { Suspense } from "react";
import { ProductCatalogClient } from "@/components/store/catalog/product-catalog-client";
import { fetchProducts } from "@/lib/api/products";

export const metadata = {
  title: "Product Catalog",
  description: "All research peptides — laboratory use only.",
};

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
