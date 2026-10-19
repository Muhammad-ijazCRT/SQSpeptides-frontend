/** Spotlight / Popular badge — pinned to the top-right of the product image. */
export function PopularProductBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute right-2 top-2 z-20 inline-flex items-center gap-1.5 rounded-full bg-neutral-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] shadow-md backdrop-blur-sm sm:right-3 sm:top-3 sm:px-3 sm:text-[11px] ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-3 w-3 shrink-0 fill-current sm:h-3.5 sm:w-3.5"
      >
        <path d="M12 2.5l2.85 6.36 6.9.74-5.2 4.68 1.47 6.72L12 17.77l-5.99 3.23 1.47-6.72-5.2-4.68 6.9-.74L12 2.5z" />
      </svg>
      Popular
    </span>
  );
}
