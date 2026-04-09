"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AFFILIATE_REF_STORAGE_KEY } from "@/lib/store/site-access-storage";

/**
 * Persists `?ref=` on first load so checkout can attribute affiliate commission without carrying the query on every page.
 */
export function AffiliateRefCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const raw = searchParams.get("ref")?.trim();
    if (!raw || raw.length > 80) return;
    try {
      localStorage.setItem(AFFILIATE_REF_STORAGE_KEY, raw);
    } catch {
      /* ignore */
    }
  }, [searchParams]);

  return null;
}
