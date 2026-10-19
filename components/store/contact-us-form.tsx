"use client";

import { useId, useState } from "react";

export function ContactUsForm() {
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const formId = useId();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  function fieldShell(name: string) {
    const active = focused === name;
    return [
      "relative rounded-xl border bg-white/90 transition duration-300",
      active
        ? "border-[#D4AF37] shadow-[0_0_0_3px_rgba(212,175,55,0.18)]"
        : "border-neutral-200 shadow-sm hover:border-neutral-300",
    ].join(" ");
  }

  const inputClass =
    "w-full bg-transparent px-4 py-3.5 text-base text-neutral-950 outline-none placeholder:text-neutral-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600">
            Full name
          </span>
          <div className={fieldShell("name")}>
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
              <UserIcon />
            </span>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              required
              placeholder="Your name"
              autoComplete="name"
              className={`${inputClass} pl-11`}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600">
            Email address
          </span>
          <div className={fieldShell("email")}>
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
              <MailIcon />
            </span>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className={`${inputClass} pl-11`}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600">
          Subject
        </span>
        <div className={fieldShell("subject")}>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
            <DocIcon />
          </span>
          <input
            id={`${formId}-subject`}
            name="subject"
            type="text"
            required
            placeholder="Order support, wholesale, documentation…"
            className={`${inputClass} pl-11`}
            onFocus={() => setFocused("subject")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600">
          Your message
        </span>
        <div className={`${fieldShell("message")} min-h-[160px]`}>
          <span className="pointer-events-none absolute left-3.5 top-4 text-neutral-400" aria-hidden>
            <ChatIcon />
          </span>
          <textarea
            id={`${formId}-message`}
            name="message"
            required
            rows={6}
            placeholder="Share details, order numbers, or documents you need help with…"
            className={`${inputClass} min-h-[160px] resize-y pl-11 pt-3.5`}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </label>

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-neutral-500 sm:max-w-sm sm:text-[13px]">
          <LockIcon className="mt-0.5 shrink-0 text-[#9a7b1a]" />
          <span>Your information is secure and used only to respond to your inquiry.</span>
        </p>
        <button
          type="submit"
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 bg-neutral-950 px-8 text-xs font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#D4AF37] hover:text-black sm:w-auto sm:min-w-[200px]"
        >
          <span>Send message</span>
          <SendIcon className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {sent ? (
        <p
          className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-center text-sm font-medium text-neutral-900"
          role="status"
        >
          Thank you — we&apos;ll get back to you as soon as possible.
        </p>
      ) : null}
    </form>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 4h7l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M15 4v4h4M9 13h6M9 17h4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H7l-4 3v-3.5A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}
