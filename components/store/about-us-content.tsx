import Image from "next/image";
import Link from "next/link";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME } from "@/lib/site-business";

const ABOUT_HERO_IMAGE = "/about-us.png";
const PRODUCTS_VISUAL = "/products/popular-pepetides/popular-pepetides.png";
const VIAL_VISUAL = "/products/images/1.jpg";

const FEATURES = [
  {
    title: "Research Grade Quality",
    description: "High-purity peptides prepared for laboratory research workflows.",
    icon: "quality" as const,
  },
  {
    title: "Trusted Documentation",
    description: "Clear product data and COA support for full transparency.",
    icon: "docs" as const,
  },
  {
    title: "Laboratory Use Only",
    description: "Sold strictly for in-vitro research — not for human use.",
    icon: "lab" as const,
  },
  {
    title: "Reliable Support",
    description: "Responsive help for orders, docs, and wholesale inquiries.",
    icon: "support" as const,
  },
] as const;

const OFFERINGS = [
  {
    title: "Research Peptides",
    description: "Catalog peptides for qualified laboratory buyers.",
    icon: "peptide" as const,
  },
  {
    title: "Laboratory Supplies",
    description: "Essentials that support consistent research workflows.",
    icon: "supplies" as const,
  },
  {
    title: "Bulk & Wholesale",
    description: "Volume options for institutions and research teams.",
    icon: "wholesale" as const,
  },
] as const;

const VALUES = [
  {
    title: "Quality",
    description: "Research-grade purity you can rely on.",
    icon: "diamond" as const,
  },
  {
    title: "Transparency",
    description: "Clear documentation with every SKU.",
    icon: "docs" as const,
  },
  {
    title: "Reliability",
    description: "Consistent supply and predictable fulfillment.",
    icon: "people" as const,
  },
  {
    title: "Support",
    description: "A knowledgeable team ready to help.",
    icon: "support" as const,
  },
] as const;

const COMMITMENTS = [
  {
    title: "Quality Sourcing",
    description: "Carefully selected research materials.",
    icon: "source" as const,
  },
  {
    title: "Rigorous Testing",
    description: "Verified analytics where applicable.",
    icon: "test" as const,
  },
  {
    title: "Secure Handling",
    description: "Packaged and shipped with care.",
    icon: "secure" as const,
  },
] as const;

export function AboutUsContent() {
  return (
    <div className="bg-white text-neutral-950">
      {/* 1. Hero — same framing language as Contact Us */}
      <section className="relative isolate w-full overflow-hidden bg-[#faf8f4]">
        <div className="relative aspect-[5/4] w-full sm:aspect-[16/9] md:aspect-[2.35/1] lg:aspect-[2.5/1]">
          <div className="about-hero-bg-motion absolute inset-0">
            <Image
              src={ABOUT_HERO_IMAGE}
              alt="SQSpeptides research laboratory with peptide vials and scientific equipment"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-[72%_48%] sm:object-[68%_45%] md:object-[62%_42%] lg:object-[58%_40%]"
            />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent max-sm:from-white/94 max-sm:via-white/65 sm:from-white/60 sm:via-white/18 md:from-white/40 md:via-transparent"
          />

          <div className="absolute inset-0 z-10">
            <div className="mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-10">
              <div className="about-fade-up w-full max-w-[17.5rem] sm:max-w-sm md:max-w-md lg:max-w-lg">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C5A02B] sm:text-[11px] md:text-xs md:tracking-[0.38em]">
                  Our story
                </p>
                <h1 className="about-fade-up-delay mt-2 text-[1.85rem] font-bold leading-[1.05] tracking-tight text-neutral-950 sm:mt-3 sm:text-4xl md:text-[2.85rem] lg:text-[3.4rem]">
                  About <span className="text-[#C5A02B]">Us</span>
                </h1>
                <p className="about-fade-up-delay-2 mt-3 max-w-md text-[13px] leading-relaxed text-neutral-600 sm:mt-4 sm:text-[15px] md:text-base lg:text-lg">
                  Research-grade peptides and laboratory supplies for professionals advancing scientific discovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature cards — Contact Us card language */}
      <section className="relative z-10 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {FEATURES.map((item) => (
              <article
                key={item.title}
                className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B] sm:h-11 sm:w-11">
                  <FeatureIcon name={item.icon} />
                </span>
                <h2 className="mt-4 text-base font-bold tracking-tight sm:text-lg">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who We Are */}
      <section className="border-t border-black/[0.04] bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-10 lg:py-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f0e6] lg:col-span-6 lg:aspect-[5/4]">
            <Image
              src={ABOUT_HERO_IMAGE}
              alt="Scientists working in an SQSpeptides research laboratory"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[78%_42%]"
            />
          </div>

          <div className="lg:col-span-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
              Who we are
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Advancing Research Through Quality and Integrity
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
              {SITE_BRAND_NAME} is operated by {SITE_LEGAL_NAME} in Lewisville, Texas. We supply research peptides
              and lab materials to qualified buyers who need consistent quality and clear documentation.
            </p>

            <ul className="mt-6 space-y-3">
              {["Trusted by researchers", "Premium research products", "Committed to science"].map((label) => (
                <li key={label} className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C5A02B]/15 text-[#C5A02B]">
                    <CheckIcon />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <Link
              href="/contact-us"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C5A02B] px-6 text-sm font-bold text-white transition hover:bg-[#8E701D]"
            >
              Learn more
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Products / What We Offer */}
      <section className="bg-[#faf8f4]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-10 lg:py-20">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
              What we offer
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Research Peptides &amp; Lab Supplies
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
              A focused catalog built for laboratory research — from individual peptides to bulk supply for teams.
            </p>

            <ul className="mt-7 space-y-3">
              {OFFERINGS.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3.5 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.18)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B]">
                    <OfferIcon name={item.icon} />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-bold text-neutral-950">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-neutral-500 sm:text-sm">
                      {item.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/products-catalog"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C5A02B] px-6 text-sm font-bold text-white transition hover:bg-[#8E701D]"
            >
              Browse product catalog
              <ArrowIcon />
            </Link>
          </div>

          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-white lg:order-2 lg:col-span-6 lg:aspect-[5/4]">
            <Image
              src={PRODUCTS_VISUAL}
              alt="SQSpeptides research peptide vials"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 5. Why Choose SQS */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
              Why choose SQS
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Our Values</h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {VALUES.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B]">
                  <ValueIcon name={item.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Commitment / Quality */}
      <section className="border-t border-black/[0.04] bg-[#faf8f4]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-10 lg:py-20">
          <div className="lg:col-span-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
              Our commitment
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Excellence in Every Order
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 sm:text-base">
              From sourcing to shipment, we focus on clarity, consistency, and care for research buyers.
            </p>
            <div className="relative mt-8 hidden aspect-square max-w-xs overflow-hidden rounded-2xl bg-white lg:block">
              <Image
                src={VIAL_VISUAL}
                alt="SQSpeptides research peptide vial"
                fill
                unoptimized
                sizes="320px"
                className="object-contain p-6"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1 lg:gap-5">
            {COMMITMENTS.map((item) => (
              <article
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.18)] sm:flex-col sm:p-6 lg:flex-row lg:items-center"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B]">
                  <CommitIcon name={item.icon} />
                </span>
                <div>
                  <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="relative isolate overflow-hidden bg-neutral-950 mb-5">
        <div className="absolute inset-0 opacity-35" aria-hidden>
          <Image
            src={ABOUT_HERO_IMAGE}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/70" />
        </div>

        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
              Let&apos;s advance science together
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
              Explore the catalog or reach our team with any questions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products-catalog"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C5A02B] px-7 text-sm font-bold text-white transition hover:bg-[#8E701D]"
            >
              <CatalogGlyph />
              Browse Catalog
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-black/40 px-7 text-sm font-bold text-white backdrop-blur-sm transition hover:border-[#C5A02B] hover:bg-[#C5A02B] hover:text-white"
            >
              <MailGlyph />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureIcon({ name }: { name: (typeof FEATURES)[number]["icon"] }) {
  switch (name) {
    case "quality":
      return <MedalIcon />;
    case "docs":
      return <DocIcon />;
    case "lab":
      return <BeakerIcon />;
    case "support":
      return <HeadsetIcon />;
  }
}

function OfferIcon({ name }: { name: (typeof OFFERINGS)[number]["icon"] }) {
  switch (name) {
    case "peptide":
      return <VialIcon />;
    case "supplies":
      return <BoxIcon />;
    case "wholesale":
      return <GearIcon />;
  }
}

function ValueIcon({ name }: { name: (typeof VALUES)[number]["icon"] }) {
  switch (name) {
    case "diamond":
      return <DiamondIcon />;
    case "docs":
      return <DocIcon />;
    case "people":
      return <PeopleIcon />;
    case "support":
      return <HeadsetIcon />;
  }
}

function CommitIcon({ name }: { name: (typeof COMMITMENTS)[number]["icon"] }) {
  switch (name) {
    case "source":
      return <SourceIcon />;
    case "test":
      return <TestIcon />;
    case "secure":
      return <SecureIcon />;
  }
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </svg>
  );
}

function BeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 3h6M10 3v5.2L5.4 18.2A2.5 2.5 0 0 0 7.6 22h8.8a2.5 2.5 0 0 0 2.2-3.8L13.9 8.2V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 13v-1a8 8 0 1 1 16 0v1" />
      <path d="M4 13v3.5A1.5 1.5 0 0 0 5.5 18H7v-5H5.5A1.5 1.5 0 0 0 4 14.5V13Zm16 0v1.5a1.5 1.5 0 0 1-1.5 1.5H17v-5h1.5A1.5 1.5 0 0 1 20 14.5V13Z" />
      <path d="M17 18v1a3 3 0 0 1-3 3h-1" />
    </svg>
  );
}

function VialIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 3h6v4l-2 2v10a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V9L9 7V3Z" />
      <path d="M9 3h6M10 14h4" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5v-7Z" />
      <path d="M12 12v9M3 8.5l9 3.5 9-3.5" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 3h12l4 7-10 11L2 10 6 3Z" />
      <path d="M2 10h20M10 3l-2 7 4 11 4-11-2-7" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3.5" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35M16.5 3.7a3.5 3.5 0 0 1 0 6.6" />
    </svg>
  );
}

function SourceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v18M8 7l4-4 4 4M7 14c-2 0-4 1.5-4 4s4 3 9 3 9-1 9-3-2-4-4-4" />
    </svg>
  );
}

function TestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 3h6M10 3v6l-5.2 8.3A2.8 2.8 0 0 0 7.2 22h9.6a2.8 2.8 0 0 0 2.4-4.7L14 9V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3 4.5 6.5v5.2c0 4.6 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5.2 7.5-9.8V6.5L12 3Z" />
      <path d="m9.5 12 1.8 1.8 3.7-3.8" />
    </svg>
  );
}

function CatalogGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M14 3v5h5M8 13h8M8 17h5" />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
