const API_BASE = "http://127.0.0.1:8000";

export const api = {
  // Authentification
  register: (data) => fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),
  
  login: (data) => fetch(`${API_BASE}/auth/login`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),

  changePassword: (data, token) => fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }),

  // Products
  getProducts: () => fetch(`${API_BASE}/products`),
  
  getProduct: async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) return response;
      
      const products = await response.json();
      console.log("🔍 Recherche produit ID:", productId, "dans:", products.map(p => p.id));
      
      const product = products.find(p => 
        p.id === productId || 
        p.id === String(productId) || 
        String(p.id) === String(productId)
      );
      
      console.log("📦 Produit trouvé:", product);
      
      if (product) {
        return {
          ok: true,
          json: async () => ({
            ...product,
            price: product.price_cents / 100 //conversion en euros
          })
        };
      } else {
        console.error("❌ Produit non trouvé pour ID:", productId);
        return {
          ok: false,
          status: 404,
          json: async () => ({ error: "Product not found" })
        };
      }
    } catch (error) {
      console.error("💥 Erreur getProduct:", error);
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: error.message })
      };
    }
  },

  // Cart
  addToCart: (token, product_id, qty = 1) => fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, product_id, qty })
  }),

  viewCart: (token) => fetch(`${API_BASE}/cart/view?token=${encodeURIComponent(token)}`),

  removeFromCart: (token, product_id, qty = 1) => fetch(`${API_BASE}/cart/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, product_id, qty })
  }),

  // Orders
  checkout: (token) => fetch(`${API_BASE}/orders/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  }),

  processPayment: (data, token) => fetch(`${API_BASE}/orders/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, token })
  }),

  listOrders: (token) => fetch(`${API_BASE}/orders/list?token=${encodeURIComponent(token)}`)
};