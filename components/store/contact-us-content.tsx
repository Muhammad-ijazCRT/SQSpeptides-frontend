import type { ReactNode } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { ContactUsForm } from "@/components/store/contact-us-form";
import { LinktreeIcon } from "@/components/store/linktree-icon";
import { ShopPageBanner } from "@/components/store/shop-page-banner";
import {
  SITE_ADDRESS_LINE1,
  SITE_ADDRESS_LINE2,
  SITE_BRAND_NAME,
  SITE_LEGAL_NAME,
  SITE_SUPPORT_EMAIL,
} from "@/lib/site-business";
import { SQSPEPTIDES_LINKTREE } from "@/lib/store/social-links";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-contact-serif",
});

const CONTACT_HERO_IMAGE = "/contact-us/contact-us.png";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=760+East+Main+Street,+Lewisville,+TX+75057&t=&z=15&ie=UTF8&iwloc=&output=embed";

const MAP_EXTERNAL_URL =
  "https://www.google.com/maps/search/?api=1&query=760+East+Main+Street,+Lewisville,+TX+75057";

type BlockTone = "electricGold" | "emerald" | "azure" | "coral" | "violet" | "cyan" | "magenta" | "lime";

/** Vibrant top-right radial washes — each fades as it expands. */
function makeWash(r: number, g: number, b: number) {
  return `radial-gradient(circle at 100% 0%, rgba(${r},${g},${b},0.55) 0%, rgba(${r},${g},${b},0.28) 26%, rgba(${r},${g},${b},0.1) 50%, transparent 72%)`;
}

const BLOCK_TONES: Record<
  BlockTone,
  { wash: string; glow: string; label: string; hoverBorder: string; hoverShadow: string }
> = {
  electricGold: {
    wash: makeWash(255, 196, 0),
    glow: "bg-[#ffc400]/45",
    label: "text-[#c48a00]",
    hoverBorder: "hover:border-[#ffc400]/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(255,196,0,0.55)]",
  },
  emerald: {
    wash: makeWash(16, 185, 129),
    glow: "bg-emerald-400/40",
    label: "text-emerald-700",
    hoverBorder: "hover:border-emerald-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(16,185,129,0.5)]",
  },
  azure: {
    wash: makeWash(56, 189, 248),
    glow: "bg-sky-400/40",
    label: "text-sky-700",
    hoverBorder: "hover:border-sky-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(56,189,248,0.5)]",
  },
  coral: {
    wash: makeWash(251, 113, 133),
    glow: "bg-rose-400/40",
    label: "text-rose-700",
    hoverBorder: "hover:border-rose-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(251,113,133,0.5)]",
  },
  violet: {
    wash: makeWash(167, 139, 250),
    glow: "bg-violet-400/40",
    label: "text-violet-700",
    hoverBorder: "hover:border-violet-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(167,139,250,0.5)]",
  },
  cyan: {
    wash: makeWash(34, 211, 238),
    glow: "bg-cyan-400/40",
    label: "text-cyan-700",
    hoverBorder: "hover:border-cyan-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(34,211,238,0.5)]",
  },
  magenta: {
    wash: makeWash(232, 121, 249),
    glow: "bg-fuchsia-400/40",
    label: "text-fuchsia-700",
    hoverBorder: "hover:border-fuchsia-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(232,121,249,0.5)]",
  },
  lime: {
    wash: makeWash(163, 230, 53),
    glow: "bg-lime-400/40",
    label: "text-lime-700",
    hoverBorder: "hover:border-lime-400/70",
    hoverShadow: "hover:shadow-[0_20px_40px_-22px_rgba(163,230,53,0.5)]",
  },
};

function cornerWash(tone: BlockTone) {
  return BLOCK_TONES[tone].wash;
}

function InfoBlock({
  label,
  children,
  href,
  tone = "electricGold",
}: {
  label: string;
  children: ReactNode;
  href?: string;
  tone?: BlockTone;
}) {
  const t = BLOCK_TONES[tone];
  const shellClass = [
    "group relative flex h-full min-h-[148px] flex-col overflow-hidden border border-neutral-200/90 bg-white px-6 py-7 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 sm:min-h-[160px] sm:px-8 sm:py-8",
    t.hoverBorder,
    t.hoverShadow,
  ].join(" ");

  const inner = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-100 transition duration-500 group-hover:brightness-105"
        style={{ background: t.wash }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-2xl transition duration-500 group-hover:scale-110 ${t.glow}`}
      />
      <div className="relative z-10 flex h-full flex-col">
        <p className={`text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px] ${t.label}`}>{label}</p>
        <div className="mt-3 flex flex-1 flex-col justify-center text-neutral-950">{children}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shellClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2`}
      >
        {inner}
      </a>
    );
  }

  return <div className={shellClass}>{inner}</div>;
}

export function ContactUsContent() {
  const heading = playfair.className;

  return (
    <div className={`${playfair.variable} bg-white text-black`}>
      <div className="bg-black py-2.5 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-red-500 sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-2 px-3">
          <span aria-hidden>⚠️</span>
          <span>For research purposes only / Not for human consumption</span>
          <span aria-hidden>⚠️</span>
        </span>
      </div>

      <ShopPageBanner
        brandClassName={heading}
        breadcrumbLabel="Contact Us"
        eyebrow="Direct support for your research bench"
        title="Contact Us"
        intro="Reach our team for order status, wholesale applications, batch documentation, and general inquiries. We reply by email during business hours—clear questions get the fastest path to an answer."
        imageSrc={CONTACT_HERO_IMAGE}
        imageAlt="SQSpeptides research support — contact our laboratory team"
        primaryCta={{ href: "#send-message", label: "Send a message" }}
        secondaryCta={{ href: "#contact-details", label: "View details" }}
      />

      <section id="contact-details" className="scroll-mt-24 border-t border-black/5 bg-[#faf8f3]">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a7b1a] sm:text-[11px]">
              Get in touch
            </p>
            <h2 className={`mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl ${heading}`}>
              Contact Us
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg">
              Whether you need help with an order, wholesale onboarding, or batch documentation, our support desk is
              here for qualified research professionals. Share a clear subject and any order reference so we can route
              your request quickly and respond with accurate next steps.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12">
            <InfoBlock label="Days open" tone="electricGold">
              <p className={`text-2xl font-bold tracking-tight sm:text-3xl ${heading}`}>Monday–Friday</p>
              <p className="mt-2 text-sm text-neutral-600">Closed weekends &amp; major U.S. holidays</p>
            </InfoBlock>
            <InfoBlock label="Business hours" tone="emerald">
              <p className={`text-2xl font-bold tracking-tight sm:text-3xl ${heading}`}>9:00 a.m.–5:00 p.m.</p>
              <p className="mt-2 text-sm text-neutral-600">Central Time (CT)</p>
            </InfoBlock>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-5">
            <InfoBlock label="Brand &amp; company" tone="azure">
              <p className={`text-2xl font-bold tracking-tight sm:text-3xl ${heading}`}>{SITE_BRAND_NAME}</p>
              <p className="mt-2 text-base font-medium text-neutral-700">{SITE_LEGAL_NAME}</p>
            </InfoBlock>
            <InfoBlock label="Location &amp; email" tone="coral">
              <p className="text-base font-semibold leading-snug text-neutral-950 sm:text-lg">
                {SITE_ADDRESS_LINE1}
                <br />
                {SITE_ADDRESS_LINE2}
              </p>
              <a
                href={`mailto:${SITE_SUPPORT_EMAIL}`}
                className="mt-3 inline-block text-base font-semibold text-rose-700 transition hover:text-rose-800 hover:underline"
              >
                {SITE_SUPPORT_EMAIL}
              </a>
            </InfoBlock>
          </div>

          <div className="mt-10 lg:mt-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a7b1a] sm:text-[11px]">
              Social &amp; links
            </p>
            <h3 className={`mt-2 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl ${heading}`}>
              Follow &amp; explore
            </h3>
            <p className="mt-2 max-w-xl text-sm text-neutral-600 sm:text-base">
              Official profiles, community hubs, and key pages — same block layout as our contact details.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {SQSPEPTIDES_LINKTREE.map((item, index) => (
              <InfoBlock
                key={item.href}
                label="Linktree"
                href={item.href}
                tone={index === 0 ? "violet" : "cyan"}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-neutral-800 ring-1 ring-black/10 transition group-hover:bg-white">
                    <LinktreeIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xl font-bold tracking-tight sm:text-2xl ${heading}`}>{item.label}</p>
                    <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-700 transition group-hover:text-neutral-950">
                      Open hub →
                    </p>
                  </div>
                </div>
              </InfoBlock>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
            <InfoBlock label="About the brand" tone="magenta">
              <p className={`text-xl font-bold tracking-tight sm:text-2xl ${heading}`}>About SQSpeptides</p>
              <p className="mt-2 text-sm text-neutral-600">Our story, standards, and research focus.</p>
              <Link
                href="/about-us"
                className="mt-3 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia-700 transition hover:text-fuchsia-800"
              >
                Read about us →
              </Link>
            </InfoBlock>
            <InfoBlock label="Policies" tone="lime">
              <p className={`text-xl font-bold tracking-tight sm:text-2xl ${heading}`}>Privacy &amp; Terms</p>
              <p className="mt-2 text-sm text-neutral-600">How we handle data and site use.</p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-[0.16em]">
                <Link href="/privacy-policy" className="text-lime-700 transition hover:text-lime-800">
                  Privacy →
                </Link>
                <Link href="/terms" className="text-lime-700 transition hover:text-lime-800">
                  Terms →
                </Link>
              </p>
            </InfoBlock>
          </div>
        </div>
      </section>

      <section
        id="send-message"
        className="relative scroll-mt-24 overflow-hidden border-t border-black/5 bg-[#faf8f3]"
        aria-labelledby="send-message-heading"
      >
        <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a7b1a] sm:text-[11px]">
              Send us a message
            </p>
            <h2
              id="send-message-heading"
              className={`mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl ${heading}`}
            >
              We&apos;re here to help
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg">
              Have a question or need assistance? Fill out the form and we&apos;ll get back to you as soon as possible.
              Include your order number if your inquiry is about shipment or documentation.
            </p>
          </div>

          <div className="relative mt-10 w-full lg:mt-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
              style={{ background: cornerWash("electricGold") }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#ffc400]/30 blur-3xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/85 px-5 py-8 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <div className="mb-8 flex items-center gap-3 border-b border-neutral-100 pb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-950 text-[#D4AF37]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6Z" />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#9a7b1a]">Inquiry form</p>
                  <p className={`text-lg font-bold text-neutral-950 sm:text-xl ${heading}`}>Tell us how we can help</p>
                </div>
              </div>
              <ContactUsForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
