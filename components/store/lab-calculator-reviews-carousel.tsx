"use client";

import { useState } from "react";

type Review = { name: string; date: string; text: string };

export function LabCalculatorReviewsCarousel({ reviews, headingFont }: { reviews: Review[]; headingFont: string }) {
  const [index, setIndex] = useState(0);
  const n = reviews.length;
  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);
  const r = reviews[index];

  return (
    <section className="bg-black py-16 text-white lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <h2 className={`text-center text-3xl font-bold md:text-4xl ${headingFont}`}>Product Reviews</h2>

        <div className="relative mx-auto mt-14 max-w-3xl lg:max-w-none">
          <div className="lg:hidden">
            <blockquote className="min-h-[220px] rounded-lg border border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm">
              <div className="text-[#D4AF37]">★★★★★</div>
              <p className="mt-4 text-sm leading-relaxed text-white/85">&ldquo;{r.text}&rdquo;</p>
              <footer className="mt-6 text-sm">
                <span className="font-semibold text-white">{r.name}</span>
                <span className="text-white/50"> — {r.date}</span>
              </footer>
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-xl text-white transition hover:bg-white/10"
                aria-label="Previous review"
              >
                ‹
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full transition ${i === index ? "bg-[#D4AF37]" : "bg-white/30"}`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-xl text-white transition hover:bg-white/10"
                aria-label="Next review"
              >
                ›
              </button>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {reviews.map((rev) => (
              <blockquote
                key={rev.name}
                className="flex flex-col rounded-lg border border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm"
              >
                <div className="text-[#D4AF37]">★★★★★</div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/85">&ldquo;{rev.text}&rdquo;</p>
                <footer className="mt-6 text-sm">
                  <span className="font-semibold text-white">{rev.name}</span>
                  <span className="text-white/50"> — {rev.date}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
