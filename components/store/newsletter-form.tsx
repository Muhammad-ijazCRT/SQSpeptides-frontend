"use client";

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col gap-2 sm:flex-col"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter lab email"
        className="w-full rounded border border-white/30 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 outline-none focus:border-white"
      />
      <button
        type="submit"
        className="w-full rounded bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-100"
      >
        Notify me
      </button>
    </form>
  );
}
