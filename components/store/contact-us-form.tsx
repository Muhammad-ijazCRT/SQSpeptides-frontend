"use client";

import { useState } from "react";

export function ContactUsForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-black shadow-sm placeholder:text-neutral-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/15";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" type="text" required placeholder="Name" className={inputClass} autoComplete="name" />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required placeholder="Email" className={inputClass} autoComplete="email" />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Subject</span>
        <input name="subject" type="text" required placeholder="Subject" className={inputClass} />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Message"
          className={`${inputClass} min-h-[140px] resize-y`}
        />
      </label>
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="submit"
          className="min-h-12 w-full max-w-[200px] rounded-md bg-black px-10 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-md transition hover:bg-neutral-900"
        >
          Submit
        </button>
        {sent ? (
          <p className="text-center text-sm font-medium text-black" role="status">
            Thank you — we&apos;ll get back to you as soon as possible.
          </p>
        ) : null}
      </div>
    </form>
  );
}
