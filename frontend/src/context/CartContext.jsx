import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// 
const parseEuroToCents = (priceStr) => {
  if (typeof priceStr === "number") return Math.round(priceStr * 100);
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9,\.]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  return Math.round(isNaN(value) ? 0 : value * 100);
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = useMemo(() => `cart:items:${user?.email || "guest"}`, [user?.email]);

  const load = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  };

  const save = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  };

  // Initial load (handles migration from legacy key "cart:items")
  const [items, setItems] = useState(() => {
    const legacy = load("cart:items");
    const current = load(storageKey);
    // If user just logged in and has no saved cart, migrate legacy cart
    if (legacy.length && (!current || current.length === 0)) {
      // cleanup legacy key after migration
      try { localStorage.removeItem("cart:items"); } catch (_) {}
      return legacy;
    }
    return current || [];
  });

  // Modal: last added item and visibility
  const [lastAdded, setLastAdded] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Persist for the current user namespace
  useEffect(() => {
    save(storageKey, items);
  }, [items, storageKey]);

  // When the logged-in user changes, reload items from that namespace.
  // If a guest cart exists, keep it on logout and merge it into the user cart on next login.
  useEffect(() => {
    const guestKey = "cart:items:guest";
    if (!user) {
      // Switching to guest: load guest cart (do not clear it)
      const guest = load(guestKey);
      setItems(Array.isArray(guest) ? guest : []);
      return;
    }
    // User logged in: merge guest cart into user cart once
    const userItems = Array.isArray(load(storageKey)) ? load(storageKey) : [];
    const guestItems = Array.isArray(load(guestKey)) ? load(guestKey) : [];
    if (guestItems.length) {
      const merged = mergeCarts(userItems, guestItems);
      setItems(merged);
      // clear guest cart after merge
      try { localStorage.removeItem(guestKey); } catch (_) {}
      save(storageKey, merged);
    } else {
      setItems(userItems);
    }
  }, [storageKey, user]);

  const addItem = (item, qty = 1) => {
    // item: { id, name, priceCents, slug?, colorKey?, image? }
    if (!item || !item.id) return;
    const quantity = Math.max(1, qty|0);
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === item.id && it.colorKey === item.colorKey);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = { ...copy[idx], qty: Math.min(99, copy[idx].qty + quantity) };
        // set modal content to the updated line
        setLastAdded(copy[idx]);
        setConfirmOpen(true);
        return copy;
      }
      const next = { ...item, qty: quantity };
      setLastAdded(next);
      setConfirmOpen(true);
      return [...prev, next];
    });
  };

  const removeItem = (id, colorKey) => {
    setItems((prev) => prev.filter((it) => !(it.id === id && it.colorKey === colorKey)));
  };

  const updateQty = (id, colorKey, qty) => {
    const q = Math.max(0, Math.min(99, qty|0));
    setItems((prev) => prev
      .map((it) => (it.id === id && it.colorKey === colorKey ? { ...it, qty: q } : it))
      .filter((it) => it.qty > 0)
    );
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);
  const totalCents = useMemo(() => items.reduce((acc, it) => acc + it.priceCents * it.qty, 0), [items]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    count,
    totalCents,
    parseEuroToCents,
    // modal state
    lastAdded,
    confirmOpen,
    closeConfirm: () => setConfirmOpen(false),
  }), [items, count, totalCents, lastAdded, confirmOpen]);

  // --- helpers ---
  function mergeCarts(target, source) {
    // merge by (id, colorKey): sum quantities up to 99
    const keyOf = (it) => `${it.id}::${it.colorKey ?? ""}`;
    const map = new Map();
    for (const it of target || []) map.set(keyOf(it), { ...it });
    for (const it of source || []) {
      const k = keyOf(it);
      if (!map.has(k)) map.set(k, { ...it });
      else map.set(k, { ...map.get(k), qty: Math.min(99, (map.get(k).qty || 0) + (it.qty || 0)) });
    }
    return Array.from(map.values());
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
