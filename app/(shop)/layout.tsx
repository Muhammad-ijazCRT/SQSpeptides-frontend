import { Suspense } from "react";
import { CartProvider } from "@/components/store/cart-context";
import { CheckoutSuccessHandler } from "@/components/store/checkout-success-handler";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { ToastProvider } from "@/components/store/toast-context";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <Suspense fallback={null}>
          <CheckoutSuccessHandler />
        </Suspense>
        <div className="flex min-h-screen flex-col bg-white text-black">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </ToastProvider>
    </CartProvider>
  );
}
