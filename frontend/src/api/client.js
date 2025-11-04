const API_BASE = "http://127.0.0.1:8000";

export const api = {
  // Auth
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

  // Products
  getProducts: () => fetch(`${API_BASE}/products`),

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

  listOrders: (token) => fetch(`${API_BASE}/orders/list?token=${encodeURIComponent(token)}`)
};