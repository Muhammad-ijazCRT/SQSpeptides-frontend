import type { Metadata } from "next";
import { CartProvider } from "@/components/store/cart-context";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
