"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useToast } from "@/components/store/toast-context";

/** Reads `?checkout=success&ref=...` after checkout redirect; shows toast once and cleans the URL. */
export function CheckoutSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const noStorageRan = useRef(false);

  useEffect(() => {
    if (searchParams.get("checkout") !== "success") return;

    const ref = searchParams.get("ref") ?? "order";
    const dedupeKey = `sqspeptides_checkout_toast_${ref}`;
    let skipToast = false;

    try {
      if (sessionStorage.getItem(dedupeKey)) skipToast = true;
      else sessionStorage.setItem(dedupeKey, "1");
    } catch {
      if (noStorageRan.current) skipToast = true;
      noStorageRan.current = true;
    }

    if (skipToast) {
      router.replace("/", { scroll: false });
      return;
    }

    const msg =
      ref !== "order" ? `Order placed successfully. Reference: ${ref}` : "Order placed successfully.";
    showToast(msg, "success");

    try {
      sessionStorage.removeItem("sqspeptides_pending_checkout_v1");
    } catch {
      /* ignore */
    }

    router.replace("/", { scroll: false });
  }, [searchParams, router, showToast]);

  return null;
}
