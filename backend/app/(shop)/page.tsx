import { StoreHome } from "@/components/store/store-home";
import { fetchProducts } from "@/lib/api/products";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof fetchProducts>> = [];
  let apiError = false;
  try {
    const all = await fetchProducts();
    featured = all.slice(0, 4);
  } catch {
    apiError = true;
  }

  return <StoreHome featured={featured} apiError={apiError} />;
}
