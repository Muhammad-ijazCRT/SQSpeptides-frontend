import Image from "next/image";
import Link from "next/link";
import { BusinessAddress } from "@/components/store/business-address";
import { ContactUsForm } from "@/components/store/contact-us-form";
import { LinktreeLinks } from "@/components/store/linktree-links";

/** Lab / researcher — placeholder; swap URL when you have brand photography. */
const LAB_HERO_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=85";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=760+East+Main+Street,+Lewisville,+TX+75057&t=&z=15&ie=UTF8&iwloc=&output=embed";

const MAP_EXTERNAL_URL =
  "https://www.google.com/maps/search/?api=1&query=760+East+Main+Street,+Lewisville,+TX+75057";

export function ContactUsContent() {
  return (
    <div className="bg-white text-black">
      <div className="bg-black py-2.5 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-red-500 sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-2 px-3">
          <span aria-hidden>⚠️</span>
          <span>For research purposes only / Not for human consumption</span>
          <span aria-hidden>⚠️</span>
        </span>
      </div>

      <section className="relative isolate min-h-[min(92dvh,900px)] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="contact-hero-bg-motion absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-full w-full">
              <Image
                src={LAB_HERO_IMAGE}
                alt=""
                fill
                className="scale-105 object-cover blur-[2px] motion-reduce:blur-none motion-reduce:scale-100"
                sizes="100vw"
                priority
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-white/55" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/35 to-neutral-200/40"
            aria-hidden
          />
        </div>

        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:px-10 lg:py-20">
          <div className="contact-card-enter flex-1 lg:max-w-md lg:self-center xl:max-w-lg">
            <div className="h-full rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] sm:p-10">
              <h2 className="text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Contact us</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                For order support, wholesale applications, batch documentation, and general inquiries. We respond by email during
                business hours.
              </p>

              <div className="mt-8">
                <BusinessAddress variant="inline" />
              </div>

              <h3 className="mt-10 text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Hours</h3>
              <ul className="mt-4 space-y-1 text-base font-medium text-neutral-900">
                <li>Monday–Friday</li>
                <li>9:00 a.m.–5:00 p.m. Central Time</li>
              </ul>

              <h3 className="mt-10 text-base font-bold uppercase tracking-[0.15em] text-[#D4AF37] sm:text-lg">Social &amp; links</h3>
              <p className="mt-2 text-sm text-neutral-600">Official profiles and updates via our Linktree.</p>
              <LinktreeLinks variant="contact" />

              <p className="mt-8 text-sm text-neutral-600">
                <Link href="/about-us" className="font-semibold text-[#b8962e] hover:underline">
                  About SQSpeptides
                </Link>
                {" · "}
                <Link href="/privacy-policy" className="font-semibold text-[#b8962e] hover:underline">
                  Privacy
                </Link>
                {" · "}
                <Link href="/terms" className="font-semibold text-[#b8962e] hover:underline">
                  Terms
                </Link>
              </p>
            </div>
          </div>

          <div className="contact-card-enter-delay flex-1 lg:self-center">
            <div className="rounded-2xl border border-yellow-400/80 bg-[#FFEB3B] p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.2)] sm:p-10 lg:min-h-[500px]">
              <h2 className="text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Send a message</h2>
              <p className="mt-4 text-base leading-relaxed text-black sm:text-[1.05rem]">
                Use the form below for the fastest routing. Include your order number if your question is about shipment or
                documentation. We reply by email—please use an address you check regularly.
              </p>
              <ContactUsForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-100" aria-label="Location map">
        <div className="relative aspect-[21/9] min-h-[300px] w-full sm:min-h-[380px] lg:aspect-auto lg:min-h-[440px]">
          <iframe
            title="SQSpeptides — 760 East Main Street, Lewisville, TX"
            src={MAP_EMBED_SRC}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-5 sm:top-5">
            <div className="pointer-events-auto max-w-[260px] rounded-lg border border-neutral-200 bg-white p-3 shadow-lg sm:max-w-xs sm:p-4">
              <p className="text-sm font-medium leading-snug text-neutral-900">
                760 East Main Street
                <br />
                Lewisville, TX 75057
              </p>
              <Link
                href={MAP_EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-blue-700 underline hover:text-blue-900"
              >
                View larger map
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
