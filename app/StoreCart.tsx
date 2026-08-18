"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { key: string; productId: string; name: string; price: number; image: string; color: string; size: string; qty: number };
type NewCartLine = Omit<CartLine, "key" | "qty">;
type CartContextValue = {
  items: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (value: boolean) => void;
  add: (item: NewCartLine, qty: number) => void;
  updateQuantity: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const storageKey = "mvla-store-cart-v2";
const StoreCartContext = createContext<CartContextValue | null>(null);

export function StoreCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setItems(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { setItems([]); }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(storageKey, JSON.stringify(items)); }, [hydrated, items]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    open,
    setOpen,
    add(item, qty) {
      const key = `${item.productId}-${item.color}-${item.size}`;
      setItems(current => current.some(line => line.key === key) ? current.map(line => line.key === key ? { ...line, qty: line.qty + qty } : line) : [...current, { ...item, key, qty }]);
      setOpen(true);
    },
    updateQuantity(key, qty) { setItems(current => qty <= 0 ? current.filter(line => line.key !== key) : current.map(line => line.key === key ? { ...line, qty } : line)); },
    remove(key) { setItems(current => current.filter(line => line.key !== key)); },
    clear() { setItems([]); },
  }), [items, open]);
  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
}

export function useStoreCart() {
  const value = useContext(StoreCartContext);
  if (!value) throw new Error("useStoreCart deve ser usado dentro de StoreCartProvider");
  return value;
}
