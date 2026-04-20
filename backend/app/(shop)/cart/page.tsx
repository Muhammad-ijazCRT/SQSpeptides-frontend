import { redirect } from "next/navigation";

/** Cart lives on checkout; keep URL for old links and bookmarks. */
export default function CartPage() {
  redirect("/checkout");
}
