"use client";

export function NewsletterForm() {
  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-stretch" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Lab email
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Enter lab email"
        className="min-w-0 flex-1 rounded-lg border border-white/20 bg-black/40 px-3.5 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#e0c04a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      >
        Notify me
      </button>
    </form>
  );
}
