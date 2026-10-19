"use client";

import { useId, useState } from "react";
import { notify } from "@/lib/notifications/notify";

export function ContactUsForm() {
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const formId = useId();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    notify.success("Thank you — we’ll get back to you as soon as possible.");
  }

  function fieldShell(name: string) {
    const active = focused === name;
    return [
      "rounded-xl border bg-white transition duration-200",
      active
        ? "border-[#C5A02B] shadow-[0_0_0_3px_rgba(197,160,43,0.16)]"
        : "border-neutral-200 hover:border-neutral-300",
    ].join(" ");
  }

  const inputClass =
    "w-full rounded-xl bg-transparent px-4 py-3.5 text-base text-neutral-950 outline-none placeholder:text-neutral-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Name <span className="text-red-500">*</span>
          </span>
          <div className={fieldShell("name")}>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              required
              placeholder="Your full name"
              autoComplete="name"
              className={inputClass}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Email <span className="text-red-500">*</span>
          </span>
          <div className={fieldShell("email")}>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-900">
          Subject <span className="text-red-500">*</span>
        </span>
        <div className={fieldShell("subject")}>
          <input
            id={`${formId}-subject`}
            name="subject"
            type="text"
            required
            placeholder="How can we help?"
            className={inputClass}
            onFocus={() => setFocused("subject")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-900">
          Message <span className="text-red-500">*</span>
        </span>
        <div className={fieldShell("message")}>
          <textarea
            id={`${formId}-message`}
            name="message"
            required
            rows={6}
            placeholder="Tell us more about your inquiry…"
            className={`${inputClass} min-h-[150px] resize-y`}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={sent}
        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A02B] to-[#8E701D] px-8 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(142,112,29,0.7)] transition duration-300 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A02B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[3.25rem] sm:text-[15px]"
      >
        <span>{sent ? "Message sent" : "Send Message"}</span>
        {!sent ? <ArrowIcon className="transition duration-300 group-hover:translate-x-0.5" /> : null}
      </button>
    </form>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
