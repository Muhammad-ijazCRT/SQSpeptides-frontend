"use client";

import { useCallback, useEffect, useState } from "react";
import type { CustomerAddress, SavedCard } from "@/lib/api/customer-portal";
import {
  createAddress,
  createPaymentMethod,
  deleteAddress,
  deletePaymentMethod,
  fetchAddresses,
  fetchPaymentMethods,
  updateAddress,
  updatePaymentMethod,
  updateProfile,
} from "@/lib/api/customer-portal";

const cardShell =
  "rounded-2xl bg-white p-6 sm:p-8 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.1)] ring-1 ring-neutral-200/70";

export function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[] | null>(null);
  const [cards, setCards] = useState<SavedCard[] | null>(null);

  const [addrForm, setAddrForm] = useState({
    label: "Home",
    fullName: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "US",
    isDefault: false,
  });
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);

  const [cardForm, setCardForm] = useState({
    label: "Personal card",
    brand: "Visa",
    last4: "",
    expMonth: 12,
    expYear: new Date().getFullYear() + 2,
    isDefault: false,
  });

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/auth/customer/me", { cache: "no-store" });
    if (res.ok) {
      const p = (await res.json()) as { name: string; email: string };
      setName(p.name);
      setEmail(p.email);
    }
  }, []);

  const loadAll = useCallback(async () => {
    await loadProfile();
    try {
      setAddresses(await fetchAddresses());
    } catch {
      setAddresses([]);
    }
    try {
      setCards(await fetchPaymentMethods());
    } catch {
      setCards([]);
    }
  }, [loadProfile]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await updateProfile(name);
      setProfileMsg("Profile updated.");
      void loadProfile();
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  async function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingAddrId) {
        await updateAddress(editingAddrId, addrForm);
        setEditingAddrId(null);
      } else {
        await createAddress(addrForm);
      }
      setAddrForm({
        label: "Home",
        fullName: "",
        line1: "",
        city: "",
        postalCode: "",
        country: "US",
        isDefault: false,
      });
      setAddresses(await fetchAddresses());
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  }

  function startEdit(a: CustomerAddress) {
    setEditingAddrId(a.id);
    setAddrForm({
      label: a.label,
      fullName: a.fullName,
      line1: a.line1,
      city: a.city,
      postalCode: a.postalCode,
      country: a.country,
      isDefault: a.isDefault,
    });
  }

  async function submitCard(e: React.FormEvent) {
    e.preventDefault();
    if (cardForm.last4.length !== 4) {
      alert("Last 4 digits required (demo — never store real PANs).");
      return;
    }
    try {
      await createPaymentMethod(cardForm);
      setCardForm((c) => ({ ...c, last4: "", isDefault: false }));
      setCards(await fetchPaymentMethods());
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  }

  const input =
    "mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/25";

  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-700 text-lg font-bold text-white shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">Profile &amp; settings</h1>
            <p className="mt-1 text-sm text-neutral-600">Manage your account, addresses, and saved cards.</p>
          </div>
        </div>
      </header>

      <section className={cardShell}>
        <div className="border-b border-neutral-100 pb-5">
          <h2 className="text-lg font-semibold text-neutral-900">Personal info</h2>
          <p className="mt-1 text-sm text-neutral-500">Display name and login email.</p>
        </div>
        <form onSubmit={saveProfile} className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Name</span>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="block sm:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</span>
            <input className={`${input} cursor-not-allowed bg-neutral-100`} value={email} readOnly />
          </label>
          {profileMsg ? (
            <p
              className={`text-sm sm:col-span-2 ${profileMsg.includes("updated") ? "text-emerald-700" : "text-red-600"}`}
            >
              {profileMsg}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Save profile
            </button>
          </div>
        </form>
      </section>

      <section className={cardShell}>
        <div className="border-b border-neutral-100 pb-5">
          <h2 className="text-lg font-semibold text-neutral-900">Saved addresses</h2>
          <p className="mt-1 text-sm text-neutral-500">Used for checkout defaults.</p>
        </div>

        {addresses && addresses.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex flex-col justify-between gap-3 rounded-xl bg-gradient-to-b from-neutral-50 to-white p-4 ring-1 ring-neutral-200/80"
              >
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-neutral-900">
                    {a.label}
                    {a.isDefault ? (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                        Default
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">{a.fullName}</p>
                  <p className="text-sm text-neutral-600">
                    {a.line1}, {a.city} {a.postalCode}, {a.country}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <button type="button" className="font-medium text-blue-600 hover:underline" onClick={() => startEdit(a)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="font-medium text-red-600 hover:underline"
                    onClick={() => void deleteAddress(a.id).then(() => void loadAll())}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 rounded-xl border border-dashed border-neutral-300/90 bg-neutral-50/40 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            {editingAddrId ? "Edit address" : "Add a new address"}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">All fields are required for shipping validation.</p>
          <form onSubmit={submitAddress} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Label</span>
              <input className={input} value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} />
            </label>
            <label className="sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Full name</span>
              <input
                className={input}
                value={addrForm.fullName}
                onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Street address</span>
              <input
                className={input}
                value={addrForm.line1}
                onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })}
                required
              />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">City</span>
              <input className={input} value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Postal code</span>
              <input
                className={input}
                value={addrForm.postalCode}
                onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Country</span>
              <input
                className={input}
                value={addrForm.country}
                onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })}
                required
              />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={addrForm.isDefault}
                onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-[#D4AF37]"
              />
              <span className="text-sm text-neutral-700">Set as default shipping address</span>
            </label>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white"
              >
                {editingAddrId ? "Update address" : "Add address"}
              </button>
              {editingAddrId ? (
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-300 bg-white px-8 text-sm font-medium text-neutral-800"
                  onClick={() => {
                    setEditingAddrId(null);
                    setAddrForm({
                      label: "Home",
                      fullName: "",
                      line1: "",
                      city: "",
                      postalCode: "",
                      country: "US",
                      isDefault: false,
                    });
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className={cardShell}>
        <div className="border-b border-neutral-100 pb-5">
          <h2 className="text-lg font-semibold text-neutral-900">Payment methods</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Demo: masked card metadata only (last 4, brand, expiry). Do not enter real full card numbers.
          </p>
        </div>
        {cards && cards.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {cards.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-neutral-50/80 px-4 py-3 ring-1 ring-neutral-200/70"
              >
                <span className="text-sm text-neutral-800">
                  <strong className="text-black">{c.brand}</strong> ·••• {c.last4}{" "}
                  <span className="text-neutral-500">
                    exp {c.expMonth}/{c.expYear}
                  </span>
                  {c.isDefault ? (
                    <span className="ml-2 text-xs font-semibold text-blue-600">Default</span>
                  ) : null}
                </span>
                <div className="flex gap-3 text-sm">
                  {!c.isDefault ? (
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:underline"
                      onClick={() => void updatePaymentMethod(c.id, { isDefault: true }).then(() => void loadAll())}
                    >
                      Set default
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="font-medium text-red-600 hover:underline"
                    onClick={() => void deletePaymentMethod(c.id).then(() => void loadAll())}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 rounded-xl border border-dashed border-neutral-300/90 bg-neutral-50/40 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-neutral-900">Add card (masked)</h3>
          <form onSubmit={submitCard} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Label</span>
              <input className={input} value={cardForm.label} onChange={(e) => setCardForm({ ...cardForm, label: e.target.value })} />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Brand</span>
              <input className={input} value={cardForm.brand} onChange={(e) => setCardForm({ ...cardForm, brand: e.target.value })} />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Last 4 digits</span>
              <input
                className={input}
                maxLength={4}
                value={cardForm.last4}
                onChange={(e) => setCardForm({ ...cardForm, last4: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Exp month</span>
              <input
                type="number"
                min={1}
                max={12}
                className={input}
                value={cardForm.expMonth}
                onChange={(e) => setCardForm({ ...cardForm, expMonth: Number(e.target.value) })}
              />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Exp year</span>
              <input
                type="number"
                className={input}
                value={cardForm.expYear}
                onChange={(e) => setCardForm({ ...cardForm, expYear: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={cardForm.isDefault}
                onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-[#D4AF37]"
              />
              <span className="text-sm text-neutral-700">Default payment method</span>
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white sm:col-span-2"
            >
              Save payment method
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
