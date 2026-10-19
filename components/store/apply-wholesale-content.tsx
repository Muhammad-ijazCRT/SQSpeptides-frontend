import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ApplyWholesaleForm } from "@/components/store/apply-wholesale-form";
import { SITE_SUPPORT_EMAIL } from "@/lib/site-business";

const WHOLESALE_HERO_IMAGE = "/apply-wholesale.png";

const BENEFITS = [
  {
    title: "Volume Pricing",
    description: "Competitive wholesale rates for qualified research institutions and labs.",
    icon: "pricing" as const,
  },
  {
    title: "Priority Fulfillment",
    description: "Faster processing and shipping for approved wholesale accounts.",
    icon: "fulfillment" as const,
  },
  {
    title: "Dedicated Support",
    description: "Direct access to our team for orders, docs, and account questions.",
    icon: "support" as const,
  },
  {
    title: "Research Grade Only",
    description: "Products sold strictly for laboratory research — not for human use.",
    icon: "lab" as const,
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Submit Application",
    description: "Share your lab details, promotion plans, and payment preference.",
  },
  {
    step: "02",
    title: "Account Review",
    description: "Our team verifies eligibility and documentation within a few business days.",
  },
  {
    step: "03",
    title: "Start Ordering",
    description: "Once approved, unlock wholesale pricing and place orders online.",
  },
] as const;

const SIDEBAR_LINKS = [
  {
    href: "/products-catalog",
    title: "Browse Catalog",
    description: "Explore research-grade peptides & supplies",
    icon: "catalog" as const,
  },
  {
    href: "/contact-us",
    title: "Contact Support",
    description: "Questions before you apply? Reach out",
    icon: "contact" as const,
  },
  {
    href: "/about-us",
    title: "About SQSpeptides",
    description: "Learn how we support research labs",
    icon: "about" as const,
  },
  {
    href: `mailto:${SITE_SUPPORT_EMAIL}`,
    title: "Email Us Directly",
    description: SITE_SUPPORT_EMAIL,
    icon: "email" as const,
  },
] as const;

export function ApplyWholesaleContent() {
  return (
    <div className="bg-white text-neutral-950">
      {/* Hero — same framing language as Contact Us */}
      <section className="relative isolate w-full overflow-hidden bg-[#faf8f4]">
        <div className="relative aspect-[5/4] w-full sm:aspect-[16/9] md:aspect-[2.35/1] lg:aspect-[2.5/1]">
          <Image
            src={WHOLESALE_HERO_IMAGE}
            alt="SQSpeptides laboratory research environment for wholesale partners"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[72%_48%] sm:object-[68%_45%] md:object-[62%_42%] lg:object-[58%_40%]"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent max-sm:from-white/94 max-sm:via-white/65 sm:from-white/60 sm:via-white/18 md:from-white/40 md:via-transparent"
          />

          <div className="absolute inset-0 z-10">
            <div className="mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-10">
              <div className="w-full max-w-[17.5rem] sm:max-w-sm md:max-w-md lg:max-w-lg">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C5A02B] sm:text-[11px] md:text-xs md:tracking-[0.38em]">
                  Partner with us
                </p>
                <h1 className="mt-2 text-[1.85rem] font-bold leading-[1.05] tracking-tight text-neutral-950 sm:mt-3 sm:text-4xl md:text-[2.85rem] lg:text-[3.4rem]">
                  Apply for <span className="text-[#C5A02B]">Wholesale</span>
                </h1>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-neutral-600 sm:mt-4 sm:text-[15px] md:text-base lg:text-lg">
                  Register for wholesale pricing designed for qualified research laboratories and
                  institutional buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit cards */}
      <section className="relative z-10 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {BENEFITS.map((item) => (
              <article
                key={item.title}
                className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B] sm:h-11 sm:w-11">
                  <BenefitIcon name={item.icon} />
                </span>
                <h2 className="mt-4 text-base font-bold tracking-tight sm:text-lg">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-black/[0.04] bg-[#faf8f4]" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
              Simple process
            </p>
            <h2
              id="how-it-works-heading"
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            >
              How Wholesale Works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
              Three clear steps from application to approved wholesale ordering.
            </p>
          </div>

          <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {STEPS.map((item) => (
              <li
                key={item.step}
                className="relative rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6 lg:p-7"
              >
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#C5A02B]">
                  Step {item.step}
                </span>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Form + sidebar */}
      <section
        id="wholesale-application"
        className="scroll-mt-24 border-t border-black/[0.04] bg-white"
        aria-labelledby="wholesale-application-heading"
      >
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
            <div className="lg:col-span-7 xl:col-span-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
                Application form
              </p>
              <h2
                id="wholesale-application-heading"
                className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              >
                Register a Wholesale Account
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
                Complete the form below. We&apos;ll review your application and follow up with next
                steps.
              </p>
              <div className="mt-7 sm:mt-9">
                <ApplyWholesaleForm />
              </div>
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-2xl bg-[#f5f0e6] p-5 sm:p-6 lg:sticky lg:top-28 lg:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
                  Helpful links
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Before You Apply</h3>

                <ul className="mt-5 space-y-0.5 sm:mt-6">
                  {SIDEBAR_LINKS.map((item) => (
                    <li key={item.title}>
                      <SidebarLink href={item.href} title={item.title} description={item.description}>
                        <SidebarIcon name={item.icon} />
                      </SidebarLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl border border-[#C5A02B]/25 bg-white/70 p-4 sm:mt-7 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C5A02B]">Note</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Wholesale accounts are reserved for qualified research buyers. Products are for
                    laboratory use only — not for human consumption.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function SidebarLink({
  href,
  title,
  description,
  children,
}: {
  href: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const className =
    "group flex items-center gap-3 rounded-xl px-1.5 py-2.5 transition hover:bg-white/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A02B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0e6] sm:gap-3.5 sm:px-2 sm:py-3";

  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A02B]/15 text-[#C5A02B] transition group-hover:bg-[#C5A02B]/25 sm:h-11 sm:w-11">
        {children}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-neutral-950">{title}</span>
        <span className="mt-0.5 block break-all text-xs leading-snug text-neutral-500">{description}</span>
      </span>
      <ChevronIcon className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-[#C5A02B]" />
    </>
  );

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

function BenefitIcon({ name }: { name: (typeof BENEFITS)[number]["icon"] }) {
  switch (name) {
    case "pricing":
      return <PricingIcon />;
    case "fulfillment":
      return <FulfillmentIcon />;
    case "support":
      return <SupportIcon />;
    case "lab":
      return <LabIcon />;
  }
}

function SidebarIcon({ name }: { name: (typeof SIDEBAR_LINKS)[number]["icon"] }) {
  switch (name) {
    case "catalog":
      return <CatalogIcon />;
    case "contact":
      return <ContactIcon />;
    case "about":
      return <AboutIcon />;
    case "email":
      return <EmailIcon />;
  }
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v18M16.5 7.5c0-1.9-2-3.5-4.5-3.5S7.5 5.6 7.5 7.5 9.5 11 12 11s4.5 1.6 4.5 3.5-2 3.5-4.5 3.5-4.5-1.6-4.5-3.5" />
    </svg>
  );
}

function FulfillmentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" />
      <circle cx="7" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3.5" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35M16.5 3.7a3.5 3.5 0 0 1 0 6.6" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 3h6M10 3v6.5L5.2 18a2.5 2.5 0 0 0 2.1 3.8h9.4a2.5 2.5 0 0 0 2.1-3.8L14 9.5V3" />
      <path d="M8.5 14h7" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M14 3v5h5M8 13h8M8 17h5" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5V17M12 7.5h.01" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
