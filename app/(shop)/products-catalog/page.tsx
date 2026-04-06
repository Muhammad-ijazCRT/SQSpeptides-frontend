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

  return <ProductCatalogClient products={products} apiError={apiError} />;
}
