import { ApplyWholesaleForm } from "@/components/store/apply-wholesale-form";

export function ApplyWholesaleContent() {
  return (
    <div className="min-h-[60vh] bg-neutral-100 text-black">
      <div className="bg-[#b91c1c] py-2 text-center text-[11px] font-bold uppercase tracking-wide text-white sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-2 px-2">
          <span aria-hidden>⚠️</span>
          <span>For Research Purposes Only / Not For Human Consumption</span>
          <span aria-hidden>⚠️</span>
        </span>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="contact-card-enter">
          <h1 className="text-center text-xl font-bold text-black sm:text-2xl">Register a new wholesale account</h1>
          <div className="mt-10 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <ApplyWholesaleForm />
          </div>
        </div>
      </div>
    </div>
  );
}
