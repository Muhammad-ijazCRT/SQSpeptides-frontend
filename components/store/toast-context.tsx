"use client";

import { useMemo } from "react";
import { notify, type NotifyType } from "@/lib/notifications/notify";

type ToastType = NotifyType;

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

/**
 * Thin compatibility wrapper around the centralized `notify` helpers.
 * The global ToastContainer lives in the root layout via AppToaster.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useToast(): ToastContextValue {
  return useMemo(
    () => ({
      showToast(message: string, type: ToastType = "success") {
        notify[type](message);
      },
    }),
    []
  );
}
