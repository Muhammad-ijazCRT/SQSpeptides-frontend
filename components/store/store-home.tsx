import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/store/brand-logo";
import { ProductCard } from "@/components/store/product-card";
import { FaqSection } from "@/components/store/faq-section";
import type { Product } from "@/lib/store/types";

type Props = { featured: Product[]; apiError?: boolean };

const reviews = [
  { name: "Dr. Morgan K.", text: "Consistent labeling and fast fulfillment. Our lab reorders monthly." },
  { name: "Alex R.", text: "COA matched the batch exactly. Support answered technical questions same day." },
  { name: "Jordan P.", text: "Clean packaging and documentation. Exactly what we need for compliance." },
];

const valueProps = [
  {
    title: "Same Day Order Processing",
    body: "Orders placed before cutoff ship the same business day when inventory allows.",
  },
  {
    title: "Free Guarantee Fulfillment",
    body: "If we miss our service commitment, we make it right — tracked and documented.",
  },
  {
    title: "Best Label Service",
    body: "Batch numbers, concentration, and storage notes printed for traceability.",
  },
  {
    title: "Each Research Amount Counts!",
    body: "Precision filling and verification so your protocols stay reproducible.",
  },
];

export function StoreHome({ featured, apiError }: Props) {
  return (
    <>
      <section className="relative flex min-h-[min(100dvh,920px)] flex-col items-center justify-center overflow-hidden bg-black px-4 py-24 text-center sm:min-h-[78vh]">
        <video
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center motion-reduce:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/animation.mp4" type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-black/45 motion-reduce:hidden sm:bg-black/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-1 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(212,175,55,0.12), transparent), radial-gradient(ellipse 50% 50% at 0% 80%, rgba(212,175,55,0.1), transparent)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-1 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.06%22/%3E%3C/svg%3E')]" />
        <div className="relative z-10 flex flex-col items-center">
          <BrandLogo priority height={88} className="mb-6 max-h-[5.5rem] sm:max-h-24 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" />
          <h1 className="text-4xl font-extrabold tracking-tight text-[#D4AF37] sm:text-5xl md:text-6xl">
            PURITY DISCOVERED
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            Premium Research Peptides
          </p>
          <Link
            href="/products-catalog"
            className="mt-10 inline-block border-2 border-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section id="featured-research" className="scroll-mt-28 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <h2 className="text-center text-3xl font-bold text-black md:text-4xl">
              Featured Research Items
            </h2>
            <Link
              href="/popular-peptides"
              className="text-sm font-semibold uppercase tracking-widest text-[#b8962e] hover:underline"
            >
              Popular Peptides →
            </Link>
          </div>
          {apiError && (
            <p className="mt-4 text-center text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg py-3 px-4 max-w-2xl mx-auto">
              Product catalog could not be loaded. Start the API server (<code className="text-xs">backend</code>) and ensure{" "}
              <code className="text-xs">NEXT_PUBLIC_API_URL</code> points to it.
            </p>
          )}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {featured.length === 0 && !apiError && (
            <p className="mt-8 text-center text-neutral-500">No products yet. Run the database seed.</p>
          )}
        </div>
      </section>

      <section className="bg-neutral-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-black md:text-4xl">Product Reviews</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote
                key={r.name}
                className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="text-[#D4AF37] mb-3">★★★★★</div>
                <p className="text-neutral-700 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-black">— {r.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-black py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#D4AF37]">
              <span>About</span>
              <span className="normal-case">
                <BrandLogo height={28} className="max-h-7" />
              </span>
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Raising the Standard in Research Supply!
            </h2>
            <p className="mt-6 text-white/70 leading-relaxed">
              We combine rigorous sourcing, verified analytics, and operational discipline so your research pipeline stays
              dependable from order to bench. Every batch is documented and traceable.
            </p>
            <Link
              href="/products-catalog"
              className="mt-8 inline-block border-2 border-white px-6 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D4AF37]/30">
            <Image
              src="/product-vial.svg"
              alt="SQSpeptides research vial"
              fill
              className="object-contain bg-neutral-950 p-8"
            />
          </div>
        </div>
      </section>

      <section id="research-priority" className="scroll-mt-28 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <h2 className="text-center text-3xl font-bold text-black md:text-4xl">
              Accurate research is our priority
            </h2>
            <Link
              href="/lab-calculator"
              className="text-sm font-semibold uppercase tracking-widest text-[#b8962e] hover:underline"
            >
              Lab calculator →
            </Link>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:items-center">
            <div className="space-y-8">
              {valueProps.slice(0, 2).map((v) => (
                <div key={v.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] text-[#D4AF37]">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-bold text-black">{v.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-xs">
              <Image src="/product-vial.svg" alt="" fill className="object-contain" />
            </div>
            <div className="space-y-8">
              {valueProps.slice(2, 4).map((v) => (
                <div key={v.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] text-[#D4AF37]">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-bold text-black">{v.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-950 py-16 lg:py-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.1), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Precision You Can Measure</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 text-left">
            <div>
              <h3 className="text-[#D4AF37] text-sm font-semibold uppercase">Email Support</h3>
              <p className="mt-2 text-white/80">support@sqspeptides.com</p>
            </div>
            <div>
              <h3 className="text-[#D4AF37] text-sm font-semibold uppercase">Call Support</h3>
              <p className="mt-2 text-white/80">+1 (555) 014-2270</p>
            </div>
            <div>
              <h3 className="text-[#D4AF37] text-sm font-semibold uppercase">Location</h3>
              <p className="mt-2 text-white/80">262 Chapman Rd, Ste 240, Newark, DE 19702</p>
            </div>
          </div>
          <Link
            href="/contact-us"
            className="mt-10 inline-block bg-[#D4AF37] px-8 py-3 text-sm font-bold text-black hover:bg-[#c9a432] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>

      <section className="relative border-t-[6px] border-[#D4AF37] bg-gradient-to-b from-neutral-100 via-white to-neutral-50 py-16 md:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" aria-hidden />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#9a7b1a] sm:text-xs">
            Wholesale &amp; partners
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[2.5rem] md:leading-tight">
            Scale your lab or earn with referrals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:text-lg">
            Volume pricing for qualified facilities, or share your link and earn commission on every qualifying order.
          </p>

          <div className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-2 md:gap-8 lg:mt-16 lg:gap-10">
            <div className="scroll-mt-28 flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-neutral-900/5 sm:p-10 md:min-h-[280px] md:justify-between">
              <div>
                <span className="inline-block rounded-full bg-amber-100/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                  Wholesale
                </span>
                <h3 className="mt-4 text-2xl font-bold text-black sm:text-[1.65rem] sm:leading-snug">Apply for wholesale</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Volume pricing and streamlined ordering for qualified laboratories and research organizations.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10">
                <Link
                  href="/apply-wholesale"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#D4AF37] px-8 py-4 text-base font-bold text-black shadow-sm transition hover:bg-[#c9a432] sm:w-auto sm:self-start"
                >
                  Get started
                </Link>
                <Link href="/contact-us" className="text-center text-sm font-semibold text-[#b8962e] hover:underline sm:text-left">
                  Questions? Contact us
                </Link>
              </div>
            </div>

            <div
              id="become-affiliate"
              className="scroll-mt-28 flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-neutral-900/5 sm:p-10 md:min-h-[280px] md:justify-between"
            >
              <div>
                <span className="inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">
                  Affiliate
                </span>
                <h3 className="mt-4 text-2xl font-bold text-black sm:text-[1.65rem] sm:leading-snug">Become an affiliate</h3>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  <span>Partner with</span>
                  <BrandLogo height={28} className="max-h-7" />
                  <span>and earn on referred orders.</span>
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10">
                <Link
                  href="/account/affiliate"
                  className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-neutral-800 sm:w-auto sm:self-start"
                >
                  Open affiliate dashboard
                </Link>
                <p className="text-center text-sm text-neutral-500 sm:text-left">
                  Sign in required. New here?{" "}
                  <Link href="/account/signup" className="font-semibold text-[#b8962e] hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}
