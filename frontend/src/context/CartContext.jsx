import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../api/client";

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
  const { user, token } = useAuth();
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
    if (user && token) {
      // Si connecté, ne pas charger depuis localStorage
      return [];
    }
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

  // Persist for the current user namespace (seulement si pas connecté)
  useEffect(() => {
    if (!user || !token) {
      save(storageKey, items);
    }
  }, [items, storageKey, user, token]);

  // Charger le panier depuis le backend quand l'utilisateur se connecte
  useEffect(() => {
    if (user && token) {
      loadCartFromBackend();
    } else {
      // Switching to guest: load guest cart
      const guestKey = "cart:items:guest";
      const guest = load(guestKey);
      setItems(Array.isArray(guest) ? guest : []);
    }
  }, [user, token]);

  const loadCartFromBackend = async () => {
    if (!token) return;
    try {
      const response = await api.viewCart(token);
      if (response.ok) {
        const cartData = await response.json();
        // Convertir le format backend vers frontend
        const backendItems = cartData.items.map(item => ({
          id: item.product_id,
          qty: item.quantity,
          name: `Produit ${item.product_id}`, // Placeholder
          priceCents: 0 // Sera mis à jour quand on récupère les produits
        }));
        setItems(backendItems);
      }
    } catch (error) {
      console.error("Erreur chargement panier:", error);
    }
  };

  const addItem = async (item, qty = 1) => {
    // item: { id, name, priceCents, slug?, colorKey?, image? }
    if (!item || !item.id) return;
    const quantity = Math.max(1, qty|0);
    
    if (user && token) {
      // Utilisateur connecté : utiliser l'API backend
      try {
        const response = await api.addToCart(token, item.id, quantity);
        if (response.ok) {
          // Recharger le panier depuis le backend
          await loadCartFromBackend();
          setLastAdded({ ...item, qty: quantity });
          setConfirmOpen(true);
        } else {
          console.error("Erreur ajout panier:", await response.text());
        }
      } catch (error) {
        console.error("Erreur API:", error);
      }
    } else {
      // Utilisateur non connecté : utiliser localStorage
      setItems((prev) => {
        const idx = prev.findIndex((it) => it.id === item.id && it.colorKey === item.colorKey);
        if (idx >= 0) {
          const copy = prev.slice();
          copy[idx] = { ...copy[idx], qty: Math.min(99, copy[idx].qty + quantity) };
          setLastAdded(copy[idx]);
          setConfirmOpen(true);
          return copy;
        }
        const next = { ...item, qty: quantity };
        setLastAdded(next);
        setConfirmOpen(true);
        return [...prev, next];
      });
    }
  };

  const removeItem = async (id, colorKey) => {
    if (user && token) {
      // Utilisateur connecté : utiliser l'API backend
      try {
        const response = await api.removeFromCart(token, id, 999); // Supprimer tout
        if (response.ok) {
          await loadCartFromBackend();
        }
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    } else {
      // Utilisateur non connecté : localStorage
      setItems((prev) => prev.filter((it) => !(it.id === id && it.colorKey === colorKey)));
    }
  };

  const updateQty = async (id, colorKey, qty) => {
    const q = Math.max(0, Math.min(99, qty|0));
    
    if (user && token) {
      // Pour l'API backend, on calcule la différence et on ajuste
      const currentItem = items.find(it => it.id === id && it.colorKey === colorKey);
      if (currentItem) {
        const diff = q - currentItem.qty;
        if (diff > 0) {
          await api.addToCart(token, id, diff);
        } else if (diff < 0) {
          await api.removeFromCart(token, id, Math.abs(diff));
        }
        await loadCartFromBackend();
      }
    } else {
      // localStorage
      setItems((prev) => prev
        .map((it) => (it.id === id && it.colorKey === colorKey ? { ...it, qty: q } : it))
        .filter((it) => it.qty > 0)
      );
    }
  };

  const clear = () => {
    if (user && token) {
      // Pour le backend, on devrait avoir une API clear, pour l'instant on fait rien
      setItems([]);
    } else {
      setItems([]);
    }
  };

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
