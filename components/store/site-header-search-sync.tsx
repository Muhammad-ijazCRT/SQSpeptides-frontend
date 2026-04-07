"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Prefills header search from `?q=` when the search panel opens (requires Suspense parent). */
export function SiteHeaderSearchSync({ onQuery }: { onQuery: (q: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onQuery(searchParams.get("q")?.trim() ?? "");
  }, [searchParams, onQuery]);
  return null;
}
