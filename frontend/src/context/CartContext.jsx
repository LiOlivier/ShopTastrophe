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
      console.log("🔄 Connexion détectée, chargement panier backend...");
      
      // D'abord charger le panier backend
      loadCartFromBackend().then((backendItems) => {
        // Ensuite, migrer le panier guest s'il y en a un ET s'il n'y a pas déjà d'items backend
        const guestKey = "cart:items:guest";
        const guestItems = load(guestKey);
        
        if (guestItems.length > 0 && (!backendItems || backendItems.length === 0)) {
          console.log("📦 Migration panier guest vers backend:", guestItems);
          migrateGuestCartToBackend(guestItems);
        } else if (guestItems.length > 0) {
          console.log("⚠️ Panier guest ignoré car panier backend existe déjà");
          // Nettoyer le panier guest car on utilise maintenant le panier backend
          try {
            localStorage.removeItem(guestKey);
          } catch (_) {}
        }
      });
    } else {
      console.log("🚪 Déconnexion détectée, passage en mode guest vide...");
      
      // Au logout: on passe en mode guest VIDE
      // Le panier backend reste intact pour la prochaine connexion
      setItems([]);
      
      // Nettoyer le localStorage guest pour éviter les conflits
      try {
        localStorage.removeItem("cart:items:guest");
      } catch (_) {}
    }
  }, [user, token]); // Pas d'items dans les dépendances

  const migrateGuestCartToBackend = async (guestItems) => {
    if (!token || !guestItems.length) return;
    
    try {
      for (const item of guestItems) {
        await api.addToCart(token, item.id, item.qty);
      }
      // Recharger le panier pour avoir la version unifiée
      await loadCartFromBackend();
      
      // Nettoyer le panier guest
      try {
        localStorage.removeItem("cart:items:guest");
      } catch (_) {}
    } catch (error) {
      console.error("Erreur migration panier guest:", error);
    }
  };

  // Helper: convertir les items backend en format frontend
  const mapBackendCartItems = async (cartData) => {
    return cartData.items.map((item) => {
      // Mapping avec les vraies images des produits
      const productImages = {
        "1": "/merch/TEESHIRT/BTF.png",        // T-Shirt Noir 
        "2": "/merch/SWEAT/WSF.png",           // Sweat Blanc  
        "3": "/merch/CASQUETTE/blanc.png",     // Casquette Blanche
        "4": "/merch/TASSE/noir.png",          // Tasse Noire
        "5": "/merch/TEESHIRT/T-shirt%20Blanc%20Recto.jpg"  // T-Shirt Blanc
      };
      
      const productNames = {
        "1": "T-Shirt Noir",
        "2": "Sweat Blanc",
        "3": "Casquette Blanche", 
        "4": "Tasse Noire",
        "5": "T-Shirt Blanc"
      };
      
      const productPrices = {
        "1": 3000,  // €30,00 - T-Shirt Noir
        "2": 6000,  // €60,00 - Sweat Blanc
        "3": 2000,  // €20,00 - Casquette Blanche
        "4": 1500,  // €15,00 - Tasse Noire
        "5": 2000   // €20,00 - T-Shirt Blanc
      };
      
      return {
        id: item.product_id,
        qty: item.quantity,
        name: productNames[item.product_id] || `Produit ${item.product_id}`,
        priceCents: productPrices[item.product_id] || 0,
        image: productImages[item.product_id] || null
      };
    });
  };

  // Helper: créer un item de fallback
  const createFallbackItem = (item) => ({
    id: item.product_id,
    qty: item.quantity,
    name: `Produit ${item.product_id}`,
    priceCents: 0
  });

  const loadCartFromBackend = async () => {
    if (!token) return [];
    try {
      const response = await api.viewCart(token);
      if (!response.ok) {
        throw new Error(`Erreur API viewCart: ${response.status} ${response.statusText}`);
      }
      
      const cartData = await response.json();
      console.log("📦 Panier backend reçu:", cartData);
      const backendItems = await mapBackendCartItems(cartData);
      console.log("✅ Items mappés:", backendItems);
      setItems(backendItems);
      return backendItems;
    } catch (error) {
      console.error("Erreur chargement panier:", error);
      // En cas d'erreur, on garde le panier local actuel
      return [];
    }
  };

  const addItem = async (item, qty = 1) => {
    // item: { id, name, priceCents, slug?, colorKey?, image? }
    if (!item || !item.id) return;
    const quantity = Math.max(1, qty|0);
    
    if (user && token) {
      // Utilisateur connecté : utiliser l'API backend avec optimistic update
      try {
        // Update optimiste local d'abord
        const optimisticItem = { ...item, qty: quantity };
        setItems((prev) => {
          const idx = prev.findIndex((it) => it.id === item.id && it.colorKey === item.colorKey);
          if (idx >= 0) {
            const copy = prev.slice();
            copy[idx] = { ...copy[idx], qty: Math.min(99, copy[idx].qty + quantity) };
            return copy;
          }
          return [...prev, optimisticItem];
        });

        const response = await api.addToCart(token, item.id, quantity);
        if (!response.ok) {
          throw new Error(`Erreur API addToCart: ${response.status} ${response.statusText}`);
        }
        
        // Synchroniser avec le backend pour s'assurer de la cohérence
        await loadCartFromBackend();
        setLastAdded({ ...item, qty: quantity });
        setConfirmOpen(true);
      } catch (error) {
        console.error("Erreur API addToCart:", error);
        // En cas d'erreur, recharger depuis le backend pour revenir à un état cohérent
        await loadCartFromBackend();
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
      // Utilisateur connecté : update optimiste puis API
      try {
        // Update optimiste local d'abord
        setItems((prev) => prev.filter((it) => !(it.id === id && it.colorKey === colorKey)));

        const response = await api.removeFromCart(token, id, 999); // Supprimer tout
        if (!response.ok) {
          throw new Error(`Erreur API removeFromCart: ${response.status} ${response.statusText}`);
        }
        
        // Synchroniser avec le backend
        await loadCartFromBackend();
      } catch (error) {
        console.error("Erreur suppression:", error);
        // En cas d'erreur, recharger depuis le backend
        await loadCartFromBackend();
      }
    } else {
      // Utilisateur non connecté : localStorage
      setItems((prev) => prev.filter((it) => !(it.id === id && it.colorKey === colorKey)));
    }
  };

  const updateQty = async (id, colorKey, qty) => {
    const q = Math.max(0, Math.min(99, qty|0));
    
    if (user && token) {
      // Update optimiste local d'abord
      const previousItems = items;
      setItems((prev) => prev
        .map((it) => (it.id === id && it.colorKey === colorKey ? { ...it, qty: q } : it))
        .filter((it) => it.qty > 0)
      );

      try {
        // Pour l'API backend, on calcule la différence et on ajuste
        const currentItem = previousItems.find(it => it.id === id && it.colorKey === colorKey);
        if (currentItem) {
          const diff = q - currentItem.qty;
          if (diff > 0) {
            const response = await api.addToCart(token, id, diff);
            if (!response.ok) {
              throw new Error(`Erreur API addToCart: ${response.status}`);
            }
          } else if (diff < 0) {
            const response = await api.removeFromCart(token, id, Math.abs(diff));
            if (!response.ok) {
              throw new Error(`Erreur API removeFromCart: ${response.status}`);
            }
          }
          // Synchroniser avec le backend
          await loadCartFromBackend();
        }
      } catch (error) {
        console.error("Erreur updateQty:", error);
        // En cas d'erreur, recharger depuis le backend
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

  const clear = async () => {
    if (user && token) {
      // Pour le backend, supprimer tous les items du panier
      try {
        // Update optimiste local d'abord
        setItems([]);

        for (const item of items) {
          const response = await api.removeFromCart(token, item.id, item.qty);
          if (!response.ok) {
            throw new Error(`Erreur API removeFromCart: ${response.status}`);
          }
        }
        // Pas besoin de recharger car on a déjà vidé localement
      } catch (error) {
        console.error("Erreur vidage panier:", error);
        // En cas d'erreur, recharger depuis le backend
        await loadCartFromBackend();
      }
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
    getItemQuantity: (id) => {
      const item = items.find(item => item.id === id);
      return item ? item.qty : 0;
    },
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
