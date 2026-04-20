"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, Product } from "@/lib/store/types";
import { normalizeProduct } from "@/lib/store/normalize-product";

const STORAGE_KEY = "sqspeptides-store-cart";

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, qty?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadInitial(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const lines: CartLine[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const r = row as { product?: unknown; quantity?: unknown };
      const product = normalizeProduct(r.product);
      const qty = typeof r.quantity === "number" ? r.quantity : Number(r.quantity);
      if (!product || !Number.isFinite(qty) || qty < 1) continue;
      lines.push({ product, quantity: Math.min(99, Math.floor(qty)) });
    }
    return lines;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadInitial());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((product: Product, qty = 1) => {
    const p = normalizeProduct(product) ?? product;
    const q = Math.min(99, Math.max(1, Math.floor(qty)));
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === p.id);
      if (i === -1) return [...prev, { product: p, quantity: q }];
      const next = [...prev];
      next[i] = { ...next[i], quantity: Math.min(99, next[i].quantity + q) };
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.product.id !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.product.id === productId ? { ...l, quantity } : l))
    );
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.product.price * l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      addItem,
      setQuantity,
      removeLine,
      clearCart,
      itemCount,
      subtotal,
    }),
    [lines, addItem, setQuantity, removeLine, clearCart, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
