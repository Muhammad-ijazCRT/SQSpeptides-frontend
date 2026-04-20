"use client";

import { useState } from "react";

export type LargeFaqItem = { q: string; a: string };

type Props = {
  items: LargeFaqItem[];
  title: string;
  /** Optional class on the section heading (e.g. Playfair on Popular Peptides). */
  headingClassName?: string;
  /** Outer section classes (background, padding, borders). */
  sectionClassName?: string;
  /** Optional short line under the title. */
  subtitle?: string;
};

export function LargeFaqSection({
  items,
  title,
  headingClassName = "",
  sectionClassName = "border-t border-neutral-200 bg-white py-16 sm:py-20 lg:py-24",
  subtitle,
}: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:max-w-5xl lg:px-10">
        <h2
          className={`text-center text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-[2.35rem] md:leading-tight ${headingClassName}`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:text-lg">{subtitle}</p>
        ) : null}
        <ul className="mt-10 space-y-3 sm:mt-12 sm:space-y-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <div
                  className={`overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-shadow ${
                    isOpen ? "shadow-md ring-1 ring-neutral-200/80" : "hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold leading-snug text-black sm:text-lg sm:leading-snug">{item.q}</span>
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-lg font-medium text-neutral-600 sm:h-10 sm:w-10"
                      aria-hidden
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-neutral-100 px-5 pb-6 pt-0 sm:px-7 sm:pb-7">
                      <p className="pt-4 text-base leading-relaxed text-neutral-600 sm:text-lg sm:leading-relaxed">{item.a}</p>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
