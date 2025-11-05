import React from "react";
import "./ProductsGrid.css";
import { useCart } from "../context/CartContext";

// Données des produits en dur (sans le T-Shirt Blanc indésirable)
const items = [
  { title: "T‑Shirt Noir", price: "€30,00", alt: "T-Shirt Noir (Front)", src: "/merch/TEESHIRT/BTF.png", href: "/products/tee-noir" },
  { title: "Sweat Blanc", price: "€60,00", alt: "Sweat Blanc (Front)", src: "/merch/SWEAT/WSF.png", href: "/products/sweat-blanc" },
  { title: "Casquette Blanche", price: "€20,00", alt: "Casquette Blanche", src: "/merch/CASQUETTE/blanc.png", href: "/products/casquette-blanche" },
  { title: "Chatastrophe", price: "€15,00", alt: "Tasse Noire", src: "/merch/TASSE/noir.png", href: "/products/tasse-noire" }
];

export default function ProductsGrid({ className = "" }) {
  const { addItem, removeItem, parseEuroToCents, getItemQuantity } = useCart();
  
  const idFor = (href) => {
    if (href.includes("tee-noir")) return "1";
    if (href.includes("sweat-")) return "2";
    if (href.includes("casquette-")) return "3";
    if (href.includes("tasse-")) return "4";
    return href;
  };

  return (
    <section className={`products-grid-section ${className}`.trim()}>
      <div className="grid-badge">Autumn 2025 Edition</div>
      <div className="products-grid">
        {items.map((it, i) => {
          const productId = idFor(it.href);
          const quantity = getItemQuantity(productId);
          const productData = { 
            id: productId, 
            name: it.title, 
            priceCents: parseEuroToCents(it.price), 
            slug: it.href.split("/").pop(), 
            image: it.src 
          };
          
          return (
            <div key={i} className="product-card">
              <a className="product-media" href={it.href} aria-label={it.alt}>
                <img className="product-img" src={it.src} alt={it.alt} />
              </a>
              <div className="product-info">
                <h3 className="product-title">{it.title}</h3>
                <div className="product-price">{it.price}</div>
              </div>
              <div className="product-cta">
                {quantity === 0 ? (
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={() => addItem(productData)}
                  >
                    Ajouter au panier
                  </button>
                ) : (
                  <div className="quantity-controls">
                    <button
                      type="button"
                      className="quantity-btn minus"
                      onClick={() => removeItem(productId)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      type="button"
                      className="quantity-btn plus"
                      onClick={() => addItem(productData)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
