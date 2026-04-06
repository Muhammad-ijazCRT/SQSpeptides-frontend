"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerSignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/customer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Could not create account");
        return;
      }
      router.push("/account/dashboard?welcome=1");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="su-name" className="block text-sm font-medium text-neutral-700">
          Full name
        </label>
        <input
          id="su-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>
      <div>
        <label htmlFor="su-email" className="block text-sm font-medium text-neutral-700">
          Email
        </label>
        <input
          id="su-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>
      <div>
        <label htmlFor="su-password" className="block text-sm font-medium text-neutral-700">
          Password
        </label>
        <input
          id="su-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
        <p className="mt-1 text-xs text-neutral-500">At least 8 characters.</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/account/login" className="font-semibold text-black underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
