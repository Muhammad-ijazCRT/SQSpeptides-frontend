import { CartProvider } from "@/components/store/cart-context";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
