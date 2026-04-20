import { redirect } from "next/navigation";

/** Storefront card checkout lives on `/checkout` (payment step). This path keeps older links working. */
export default function CardRedirectPage() {
  redirect("/checkout");
}
