import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/components/store/product-detail-actions";
import { fetchProductBySlug } from "@/lib/api/products";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";

const detailImageSizes = "(max-width: 1023px) 100vw, (max-width: 1535px) 50vw, 640px";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div className="flex gap-0.5 text-[#D4AF37]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof fetchProductBySlug>> = null;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    return { title: "Product | SQSpeptides" };
  }
  if (!product) return { title: "Product | SQSpeptides" };
  return { title: `${product.name} | SQSpeptides` };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof fetchProductBySlug>> = null;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    notFound();
  }
  if (!product) notFound();

  const img = resolveProductImage(product);

  return (
    <div className="bg-white text-black">
      <div className="border-b border-[#c9a227] bg-[#c9a227] py-2 text-center text-xs font-bold uppercase tracking-widest text-white">
        For Research Use Only
      </div>

      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <Link
          href="/products-catalog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#9a7b1a] transition hover:underline sm:text-base"
        >
          ← Back to catalog
        </Link>

        <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200/90 transition duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 sm:aspect-square">
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  className={productImageBoxClassName(img)}
                  priority
                  sizes={detailImageSizes}
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 sm:text-sm">99.9% Purity</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
              {product.name}
            </h1>
            <div className="mt-3">
              <Stars rating={product.rating} />
            </div>
            <p className="mt-6 text-3xl font-bold tabular-nums tracking-tight text-black sm:text-4xl">${product.price.toFixed(2)}</p>

            {product.description ? (
              <p className="mt-8 text-base leading-relaxed text-neutral-600 sm:text-lg sm:leading-relaxed">{product.description}</p>
            ) : null}

            <p className="mt-6 rounded-xl border border-neutral-200/90 bg-neutral-50/80 px-4 py-4 text-sm leading-relaxed text-neutral-600 sm:px-5 sm:text-base sm:leading-relaxed">
              Supplied for laboratory and non-clinical research use only. Not intended for human or veterinary use.
            </p>

            <ProductDetailActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
