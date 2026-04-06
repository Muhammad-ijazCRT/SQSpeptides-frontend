/** Client calls to Next.js BFF (cookie auth). */

export type CustomerOrder = {
  id: string;
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; slug: string; imageUrl?: string | null };
  }[];
};

export type CustomerAddress = {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WishlistRow = {
  id: string;
  createdAt: string;
  product: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    rating: number;
  };
};

export type SavedCard = {
  id: string;
  label: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  createdAt: string;
};

export async function fetchMyOrders(): Promise<CustomerOrder[]> {
  const res = await fetch("/api/customer/orders", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function fetchMyOrder(id: string): Promise<CustomerOrder> {
  const res = await fetch(`/api/customer/orders/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function updateProfile(name: string) {
  const res = await fetch("/api/customer/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Update failed");
  return data;
}

export async function fetchAddresses() {
  const res = await fetch("/api/customer/addresses", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load addresses");
  return res.json() as Promise<CustomerAddress[]>;
}

export async function createAddress(body: Record<string, unknown>) {
  const res = await fetch("/api/customer/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Failed");
  return data;
}

export async function updateAddress(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/customer/addresses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Failed");
  return data;
}

export async function deleteAddress(id: string) {
  const res = await fetch(`/api/customer/addresses/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}

export async function fetchWishlist() {
  const res = await fetch("/api/customer/wishlist", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load wishlist");
  return res.json() as Promise<WishlistRow[]>;
}

export async function addWishlistProduct(productId: string) {
  const res = await fetch("/api/customer/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error((d as { message?: string }).message ?? "Could not add");
  }
}

export async function removeWishlistProduct(productId: string) {
  await fetch(`/api/customer/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
}

export async function fetchPaymentMethods() {
  const res = await fetch("/api/customer/payment-methods", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cards");
  return res.json() as Promise<SavedCard[]>;
}

export async function createPaymentMethod(body: Record<string, unknown>) {
  const res = await fetch("/api/customer/payment-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Failed");
  return data;
}

export async function updatePaymentMethod(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/customer/payment-methods/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Failed");
  return data;
}

export async function deletePaymentMethod(id: string) {
  await fetch(`/api/customer/payment-methods/${encodeURIComponent(id)}`, { method: "DELETE" });
}
