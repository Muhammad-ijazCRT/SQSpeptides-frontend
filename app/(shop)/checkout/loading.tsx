export default function CheckoutLoading() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-neutral-100 to-neutral-50 py-10 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="mt-6 h-8 w-64 max-w-full animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-3/4 max-w-xl animate-pulse rounded bg-neutral-200" />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:order-2">
            <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/90" />
          </div>
          <div className="space-y-4 lg:col-span-7 lg:order-1">
            <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-200" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-11 animate-pulse rounded-lg bg-neutral-200" />
              <div className="h-11 animate-pulse rounded-lg bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
