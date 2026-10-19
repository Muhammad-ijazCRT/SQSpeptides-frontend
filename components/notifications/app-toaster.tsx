"use client";

import { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";

/**
 * Client-only ToastContainer to avoid Next.js hydration mismatches.
 * Mounts after first paint; notify() calls before mount are queued by react-toastify.
 */
export function AppToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ToastContainer
      position="top-right"
      autoClose={4500}
      limit={5}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Slide}
      theme="light"
      className="sqs-toast-container"
      toastClassName="sqs-toast"
    />
  );
}
