import React from "react";
import "./ProductsGrid.css";

const items = [
  { title: "T‑Shirt Noir", price: "€30,00", alt: "T-Shirt Noir (Front)", src: "/merch/TEESHIRT/BTF.png", href: "/products/tee-noir" },
  { title: "Sweat Blanc", price: "€60,00", alt: "Sweat Blanc (Front)", src: "/merch/SWEAT/WSF.png", href: "/products/sweat-blanc" },
  { title: "Casquette Blanche", price: "€20,00", alt: "Casquette Blanche", src: "/merch/CASQUETTE/blanc.png", href: "/products/casquette-blanche" },
  { title: "Tasse Noire", price: "€15,00", alt: "Tasse Noire", src: "/merch/TASSE/noir.png", href: "/products/tasse-noire" }
];

export default function ProductsGrid({ className = "" }) {
  return (
    <section className={`products-grid-section ${className}`.trim()}>
      <div className="grid-badge">Autumn 2025 Edition</div>
      <div className="products-grid">
        {items.map((it, i) => (
          <div key={i} className="product-card">
            <a className="product-media" href={it.href} aria-label={it.alt}>
              <img className="product-img" src={it.src} alt={it.alt} />
            </a>
            <div className="product-info">
              <h3 className="product-title">{it.title}</h3>
              <div className="product-price">{it.price}</div>
            </div>
            {/* CTA that reveals on hover */}
            <div className="product-cta">
              <button
                type="button"
                className="add-to-cart-btn"
                onClick={() => console.log("Ajouter au panier:", it.title)}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
