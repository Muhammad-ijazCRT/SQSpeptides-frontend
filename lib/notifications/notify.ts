"use client";

import { toast, type Id, type ToastOptions, type UpdateOptions } from "react-toastify";

export type NotifyType = "success" | "error" | "warning" | "info";

const BASE: ToastOptions = {
  position: "top-right",
  autoClose: 4500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

function toastIdFor(type: string, message: string): string {
  return `${type}:${message.slice(0, 160)}`;
}

function show(type: NotifyType, message: string, options?: ToastOptions): Id {
  const toastId = options?.toastId ?? toastIdFor(type, message);
  if (toast.isActive(toastId)) {
    return toastId as Id;
  }

  const opts: ToastOptions = {
    ...BASE,
    toastId,
    ...options,
  };

  switch (type) {
    case "success":
      return toast.success(message, opts);
    case "error":
      return toast.error(message, { autoClose: 6000, ...opts });
    case "warning":
      return toast.warning(message, opts);
    case "info":
      return toast.info(message, opts);
    default:
      return toast(message, opts);
  }
}

export const notify = {
  success(message: string, options?: ToastOptions): Id {
    return show("success", message, options);
  },
  error(message: string, options?: ToastOptions): Id {
    return show("error", message, options);
  },
  warning(message: string, options?: ToastOptions): Id {
    return show("warning", message, options);
  },
  info(message: string, options?: ToastOptions): Id {
    return show("info", message, options);
  },
  loading(message: string, options?: ToastOptions): Id {
    const toastId = options?.toastId ?? toastIdFor("loading", message);
    if (toast.isActive(toastId)) {
      return toastId as Id;
    }
    return toast.loading(message, {
      ...BASE,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      toastId,
      ...options,
    });
  },
  dismiss(id?: Id): void {
    toast.dismiss(id);
  },
  update(id: Id, options: UpdateOptions): void {
    toast.update(id, options);
  },
  promise: toast.promise.bind(toast) as typeof toast.promise,
};
