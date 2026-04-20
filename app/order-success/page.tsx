import Link from "next/link";

type Search = { searchParams: Promise<{ orderId?: string; ref?: string; status?: string }> };

export const metadata = {
  title: "Order success | SQSpeptides",
};

export default async function OrderSuccessPage({ searchParams }: Search) {
  const sp = await searchParams;
  const orderId = typeof sp.orderId === "string" ? sp.orderId : "";
  const ref = typeof sp.ref === "string" ? sp.ref : "";
  const status = typeof sp.status === "string" ? sp.status : "pending";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-black">Thanks for your payment</h1>
      <p className="mt-3 text-sm text-neutral-600">
        We received your PayRam checkout return. Your payment status is currently <span className="font-semibold">{status}</span>.
      </p>
      {orderId ? (
        <p className="mt-4 text-xs text-neutral-500">
          Order ID: <span className="select-all font-mono">{orderId}</span>
        </p>
      ) : null}
      {ref ? (
        <p className="mt-2 text-xs text-neutral-500">
          Reference: <span className="select-all font-mono">{ref}</span>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/account/orders"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D4AF37] px-6 text-sm font-bold text-black hover:bg-[#c9a432]"
        >
          View orders
        </Link>
        <Link href="/cart" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-neutral-700 hover:underline">
          Back to cart
        </Link>
      </div>
    </div>
  );
}
