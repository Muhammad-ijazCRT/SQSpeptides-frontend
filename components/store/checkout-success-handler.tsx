"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/** Legacy redirect: `/?checkout=success&ref=orderId` → `/checkout/success?orderId=…` */
export function CheckoutSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (searchParams.get("checkout") !== "success") return;
    if (ran.current) return;
    ran.current = true;
    const ref = searchParams.get("ref");
    if (ref && ref !== "order") {
      router.replace(`/checkout/success?orderId=${encodeURIComponent(ref)}`, { scroll: false });
      return;
    }
    router.replace("/checkout/success", { scroll: false });
  }, [searchParams, router]);

  return null;
}
