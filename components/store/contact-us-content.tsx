import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ContactUsForm } from "@/components/store/contact-us-form";
import {
  SITE_ADDRESS_LINE1,
  SITE_ADDRESS_LINE2,
  SITE_SUPPORT_EMAIL,
} from "@/lib/site-business";
import { SQSPEPTIDES_LINKTREE } from "@/lib/store/social-links";

const CONTACT_HERO_IMAGE = "/contact-us/contact-us.png";

const SOCIAL_HUB = SQSPEPTIDES_LINKTREE[0]?.href ?? "https://linktr.ee";

const QUICK_LINKS = [
  {
    href: "/products-catalog",
    title: "Product Catalog",
    description: "Browse research-grade peptides & supplies",
    icon: "catalog" as const,
  },
  {
    href: "#send-message",
    title: "Order Support",
    description: "Help with orders, shipping & tracking",
    icon: "orders" as const,
  },
  {
    href: "/apply-wholesale",
    title: "Wholesale Inquiries",
    description: "Apply for wholesale pricing access",
    icon: "wholesale" as const,
  },
  {
    href: "/refund-policy",
    title: "Returns & Refunds",
    description: "Our return and refund policies",
    icon: "returns" as const,
  },
  {
    href: "/products-catalog",
    title: "Frequently Asked Questions",
    description: "Quick answers to common questions",
    icon: "faq" as const,
  },
] as const;

export function ContactUsContent() {
  return (
    <div className="bg-white text-neutral-950">
      {/*
        Hero framed like the reference: show vials + glass icon discs on the right,
        text on the open left. Wider aspect keeps icons above the fold under tall site chrome.
      */}
      <section className="relative isolate w-full overflow-hidden bg-[#faf8f4]">
        <div className="relative aspect-[5/4] w-full sm:aspect-[16/9] md:aspect-[2.35/1] lg:aspect-[2.5/1]">
          <Image
            src={CONTACT_HERO_IMAGE}
            alt="Laboratory vials and glass contact icons for SQSpeptides support"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[78%_68%] sm:object-[72%_60%] md:object-[68%_55%] lg:object-[62%_50%]"
          />

          {/* Left readability veil only — right side icons/vials stay crisp */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/80 via-white/35 to-transparent max-sm:from-white/92 max-sm:via-white/60 sm:from-white/55 sm:via-white/15 md:from-white/35 md:via-transparent"
          />

          <div className="absolute inset-0 z-10">
            <div className="mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-10">
              <div className="w-full max-w-[17.5rem] sm:max-w-sm md:max-w-md lg:max-w-lg">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C5A02B] sm:text-[11px] md:text-xs md:tracking-[0.38em]">
                  Get in touch
                </p>
                <h1 className="mt-2 text-[1.85rem] font-bold leading-[1.05] tracking-tight text-neutral-950 sm:mt-3 sm:text-4xl md:text-[2.85rem] lg:text-[3.4rem]">
                  Contact <span className="text-[#C5A02B]">Us</span>
                </h1>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-neutral-600 sm:mt-4 sm:text-[15px] md:text-base lg:text-lg">
                  We&apos;re here to help. Reach out with any questions about our products, orders, wholesale, or
                  general inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section id="contact-details" className="relative z-10 scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B] sm:h-11 sm:w-11">
                <MailIcon />
              </span>
              <h2 className="mt-4 text-base font-bold tracking-tight sm:text-lg">Email Us</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                For support and inquiries — we typically reply during business hours.
              </p>
              <a
                href={`mailto:${SITE_SUPPORT_EMAIL}`}
                className="mt-3 inline-block break-all text-sm font-semibold text-[#C5A02B] transition hover:text-[#8E701D] hover:underline"
              >
                {SITE_SUPPORT_EMAIL}
              </a>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B] sm:h-11 sm:w-11">
                <PinIcon />
              </span>
              <h2 className="mt-4 text-base font-bold tracking-tight sm:text-lg">Our Address</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                {SITE_ADDRESS_LINE1}, {SITE_ADDRESS_LINE2}, United States
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B] sm:h-11 sm:w-11">
                <GlobeIcon />
              </span>
              <h2 className="mt-4 text-base font-bold tracking-tight sm:text-lg">24/7 Online Store</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                Shop anytime with secure checkout — our catalog is available around the clock.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-6 lg:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B] sm:h-11 sm:w-11">
                <PeopleIcon />
              </span>
              <h2 className="mt-4 text-base font-bold tracking-tight sm:text-lg">Follow Us</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                Stay connected for updates and research resources.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <SocialLink href={SOCIAL_HUB} label="Instagram">
                  <InstagramIcon />
                </SocialLink>
                <SocialLink href={SOCIAL_HUB} label="Facebook">
                  <FacebookIcon />
                </SocialLink>
                <SocialLink href={SOCIAL_HUB} label="YouTube">
                  <YouTubeIcon />
                </SocialLink>
                <SocialLink href={SOCIAL_HUB} label="X">
                  <XIcon />
                </SocialLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Form + quick links */}
      <section
        id="send-message"
        className="scroll-mt-24 border-t border-black/[0.04] bg-white"
        aria-labelledby="send-message-heading"
      >
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
            <div className="lg:col-span-7 xl:col-span-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
                Send us a message
              </p>
              <h2
                id="send-message-heading"
                className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              >
                We&apos;d Love to Hear From You
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
              <div className="mt-7 sm:mt-9">
                <ContactUsForm />
              </div>
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-2xl bg-[#f5f0e6] p-5 sm:p-6 lg:sticky lg:top-28 lg:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
                  Quick links
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Need Help?</h3>

                <ul className="mt-5 space-y-0.5 sm:mt-6">
                  {QUICK_LINKS.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-xl px-1.5 py-2.5 transition hover:bg-white/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A02B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0e6] sm:gap-3.5 sm:px-2 sm:py-3"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A02B]/15 text-[#C5A02B] transition group-hover:bg-[#C5A02B]/25 sm:h-11 sm:w-11">
                          <QuickLinkIcon name={item.icon} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-neutral-950">{item.title}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-neutral-500">
                            {item.description}
                          </span>
                        </span>
                        <ChevronIcon className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-[#C5A02B]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A02B]/55 text-[#C5A02B] transition hover:bg-[#C5A02B] hover:text-white"
    >
      {children}
    </a>
  );
}

function QuickLinkIcon({ name }: { name: (typeof QUICK_LINKS)[number]["icon"] }) {
  switch (name) {
    case "catalog":
      return <CatalogIcon />;
    case "orders":
      return <OrdersIcon />;
    case "wholesale":
      return <WholesaleIcon />;
    case "returns":
      return <ReturnsIcon />;
    case "faq":
      return <FaqIcon />;
  }
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
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

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.5 7.2a3 3 0 0 0-2.1-2.1C18.6 4.6 12 4.6 12 4.6s-6.6 0-8.4.5A3 3 0 0 0 1.5 7.2 31.5 31.5 0 0 0 1 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 8.4.5 8.4.5s6.6 0 8.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 23 12a31.5 31.5 0 0 0-.5-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" />
    </svg>
  );
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

function CatalogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M14 3v5h5M8 13h8M8 17h5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function WholesaleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

function ReturnsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 2" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
