"use client";

import { useCallback, useEffect, useState } from "react";
import type { AffiliateMe } from "./types";

export function useAffiliateMe() {
  const [data, setData] = useState<AffiliateMe | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async (opts?: { silent?: boolean }) => {
    setErr(null);
    if (!opts?.silent) setLoading(true);
    const res = await fetch("/api/customer/affiliate/me", { cache: "no-store" });
    if (!res.ok) {
      setErr("Could not load affiliate data.");
      setData(null);
      setLoading(false);
      return;
    }
    setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, err, loading, reload };
}
