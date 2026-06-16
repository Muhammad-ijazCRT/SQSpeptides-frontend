import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/api/products";
import { absoluteUrl } from "@/lib/seo/site-url";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/products-catalog", changeFrequency: "daily", priority: 0.95 },
  { path: "/popular-peptides", changeFrequency: "weekly", priority: 0.85 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/apply-wholesale", changeFrequency: "monthly", priority: 0.65 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProducts();
    productEntries = products.map((p) => ({
      url: absoluteUrl(`/products-catalog/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    /* API unavailable at build/runtime — static URLs still published */
  }

  return [...staticEntries, ...productEntries];
}
