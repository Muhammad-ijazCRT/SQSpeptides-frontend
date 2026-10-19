import Image from "next/image";
import Link from "next/link";

const DEFAULT_BANNER_IMAGE = "/products/popular-pepetides/popular-pepetides.png";

export type ShopPageBannerProps = {
  brandClassName?: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Extra classes on the hero Image (e.g. object-position for contact art). */
  imageClassName?: string;
  /**
   * Solid cream band + fade from the top edge so artwork / contact symbols
   * do not appear to bleed into the site banners above the hero.
   */
  containTopArt?: boolean;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

/** Shared 3:1 page banner used on catalog + popular peptides (different copy per page). */
export function ShopPageBanner({
  brandClassName = "",
  breadcrumbLabel,
  eyebrow,
  title,
  intro,
  imageSrc = DEFAULT_BANNER_IMAGE,
  imageAlt = "SQS research peptide vials",
  imageClassName = "object-cover object-center",
  containTopArt = false,
  primaryCta,
  secondaryCta,
}: ShopPageBannerProps) {
  return (
    <section className="relative isolate aspect-[3/1] w-full overflow-hidden bg-[#f7f2e8] max-md:aspect-auto max-md:min-h-[340px]">
      <div
        className={
          containTopArt
            ? "absolute inset-x-0 bottom-0 top-8 z-0 sm:top-10 lg:top-11"
            : "absolute inset-0 z-0"
        }
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          unoptimized
          className={imageClassName}
          sizes="100vw"
        />
      </div>

      {/* Solid cream top edge — stops contact symbols from meeting the banners above */}
      {containTopArt ? (
        <div className="absolute inset-x-0 top-0 z-[2] h-8 bg-[#f7f2e8] sm:h-10 lg:h-11" aria-hidden>
          <div className="absolute inset-x-0 bottom-0 h-6 translate-y-full bg-gradient-to-b from-[#f7f2e8] to-transparent" />
        </div>
      ) : null}

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-[#f7f2e8]/92 via-[#f7f2e8]/40 to-transparent max-md:from-[#f7f2e8]/95 max-md:via-[#f7f2e8]/70 md:via-35%"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-[1400px] flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <nav className="pp-fade-up text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 sm:text-[11px]">
          <Link href="/" className="transition hover:text-neutral-950">
            Home
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <span className="text-neutral-950">{breadcrumbLabel}</span>
        </nav>

        <div className="pp-fade-up-delay mt-3 max-w-md sm:mt-4 sm:max-w-lg lg:max-w-xl">
          <p className={`text-2xl font-bold tracking-tight text-[#9a7b1a] sm:text-3xl md:text-4xl ${brandClassName}`}>
            SQS
          </p>
          <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.35em] text-neutral-600 sm:text-[10px]">
            {eyebrow}
          </p>
          <h1
            className={`mt-2 text-xl font-bold leading-[1.15] tracking-tight text-neutral-950 sm:text-2xl md:text-3xl lg:text-[2.15rem] ${brandClassName}`}
          >
            {title}
          </h1>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-neutral-800 sm:mt-3 sm:text-[15px] md:text-base">
            {intro}
          </p>

          <div className="pp-fade-up-delay-2 mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:items-center">
            <a
              href={primaryCta.href}
              className="inline-flex min-h-10 items-center justify-center bg-neutral-950 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#D4AF37] hover:text-black sm:min-h-11 sm:px-7"
            >
              {primaryCta.label}
            </a>
            <Link
              href={secondaryCta.href}
              className="inline-flex min-h-10 items-center justify-center border-2 border-neutral-950 bg-white/50 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-950 backdrop-blur-sm transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black sm:min-h-11 sm:px-7"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
