import Image from "next/image";
import Link from "next/link";
import { ContactUsForm } from "@/components/store/contact-us-form";
import { LinktreeLinks } from "@/components/store/linktree-links";

/** Lab / researcher — placeholder; swap URL when you have brand photography. */
const LAB_HERO_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=85";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=262+Chapman+Rd%2C+Ste+240%2C+Newark%2C+DE+19702&t=&z=15&ie=UTF8&iwloc=&output=embed";

const MAP_EXTERNAL_URL =
  "https://www.google.com/maps/search/?api=1&query=262+Chapman+Rd%2C+Ste+240%2C+Newark%2C+DE+19702";

export function ContactUsContent() {
  return (
    <div className="bg-white text-black">
      {/* Reference: thin black bar, red warning text */}
      <div className="bg-black py-2.5 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-red-500 sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-2 px-3">
          <span aria-hidden>⚠️</span>
          <span>For Research Purposes Only / Not For Human Consumption</span>
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
          {/* Left: contact details — white card */}
          <div className="contact-card-enter flex-1 lg:max-w-md lg:self-center xl:max-w-lg">
            <div className="h-full rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] sm:p-10">
              <h2 className="text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Contact us</h2>

              <ul className="mt-8 space-y-6 text-base text-neutral-900">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-neutral-500" aria-hidden>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <a href="mailto:support@sqspeptides.com" className="break-all font-medium hover:underline">
                    support@sqspeptides.com
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-neutral-500" aria-hidden>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="font-medium leading-relaxed">262 Chapman Rd, Ste 240 Newark DE 19702</span>
                </li>
              </ul>

              <h3 className="mt-10 text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Socials</h3>
              <ul className="mt-4 space-y-3 text-base">
                <li className="flex items-center gap-3">
                  <span className="text-neutral-500" aria-hidden>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </span>
                  <span className="font-medium">@SQSpeptides</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-neutral-500" aria-hidden>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                  <span className="font-medium">@sqspeptides</span>
                </li>
              </ul>

              <h3 className="mt-10 text-base font-bold uppercase tracking-[0.15em] text-[#D4AF37] sm:text-lg">Link in bio</h3>
              <p className="mt-2 text-sm text-neutral-600">TikTok, Telegram, Discord, and more via Linktree.</p>
              <LinktreeLinks variant="contact" />

              <h3 className="mt-10 text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Hours</h3>
              <ul className="mt-4 space-y-1 text-base font-medium text-neutral-900">
                <li>Monday - Sunday</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>

          {/* Right: bright yellow form card */}
          <div className="contact-card-enter-delay flex-1 lg:self-center">
            <div className="rounded-2xl border border-yellow-400/80 bg-[#FFEB3B] p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.2)] sm:p-10 lg:min-h-[500px]">
              <h2 className="text-base font-bold uppercase tracking-[0.15em] text-black sm:text-lg">Get in touch</h2>
              <p className="mt-4 text-base leading-relaxed text-black sm:text-[1.05rem]">
                We would love to hear from you and answer any questions you may have. You can contact us by filling out the
                form below, sending us an email, or calling us on our phone number. We will get back to you as soon as
                possible.
              </p>
              <ContactUsForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-100" aria-label="Location map">
        <div className="relative aspect-[21/9] min-h-[300px] w-full sm:min-h-[380px] lg:aspect-auto lg:min-h-[440px]">
          <iframe
            title="SQSpeptides — 262 Chapman Rd, Newark, DE"
            src={MAP_EMBED_SRC}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-5 sm:top-5">
            <div className="pointer-events-auto max-w-[240px] rounded-lg border border-neutral-200 bg-white p-3 shadow-lg sm:max-w-xs sm:p-4">
              <p className="text-sm font-medium leading-snug text-neutral-900">
                262 Chapman Rd, Ste 240
                <br />
                Newark, DE 19702
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
