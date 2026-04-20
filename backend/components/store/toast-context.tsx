"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { Toaster, toast as sonnerToast } from "sonner";

type ToastType = "success" | "error";

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    if (type === "error") {
      sonnerToast.error(message);
    } else {
      sonnerToast.success(message);
    }
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4500}
        gap={10}
        visibleToasts={5}
        toastOptions={{
          classNames: {
            toast:
              "!font-sans !text-[15px] !shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] !border !rounded-xl",
            title: "!font-semibold !leading-snug",
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
