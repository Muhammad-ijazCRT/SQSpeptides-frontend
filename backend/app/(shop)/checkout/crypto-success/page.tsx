import { CryptoCheckoutSuccessClient } from "@/components/store/crypto-checkout-success-client";

export const metadata = {
  title: "Crypto payment | SQSpeptides",
};

type Search = { searchParams: Promise<{ orderId?: string; confirmEmail?: string }> };

export default async function CryptoCheckoutSuccessPage({ searchParams }: Search) {
  const sp = await searchParams;
  const orderId = typeof sp.orderId === "string" ? sp.orderId : "";
  const confirmEmail = typeof sp.confirmEmail === "string" ? sp.confirmEmail : "";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <CryptoCheckoutSuccessClient orderId={orderId} confirmEmail={confirmEmail} />
    </div>
  );
}
