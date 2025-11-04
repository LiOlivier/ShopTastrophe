import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";

// Helpers to build image paths using acronym convention for tees/sweats
const teeImg = (code) => `/merch/TEESHIRT/${code}.png`; // e.g., BTF, WTB
const sweatImg = (code) => `/merch/SWEAT/${code}.png`; // e.g., BSF, WSB

const productMap = {
  "tee-noir": {
    title: "T‑Shirt",
    price: "€30,00",
    kind: "TEESHIRT",
    defaultColor: "noir",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: teeImg("BTF"), back: teeImg("BTB") },
      { key: "blanc", label: "Blanc", sw: "#fff", front: teeImg("WTF"), back: teeImg("WTB") },
    ],
  },
  "sweat-blanc": {
    title: "Sweat",
    price: "€60,00",
    kind: "SWEAT",
    defaultColor: "blanc",
    colors: [
      { key: "blanc", label: "Blanc", sw: "#fff", front: sweatImg("WSF"), back: sweatImg("WSB") },
      { key: "noir", label: "Noir", sw: "#111", front: sweatImg("BSF"), back: sweatImg("BSB") },
    ],
  },
  "casquette-blanche": {
    title: "Casquette",
    price: "€20,00",
    kind: "CASQUETTE",
    defaultColor: "blanc",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/CASQUETTE/noir.png" },
      { key: "blanc", label: "Blanc", sw: "#fff", front: "/merch/CASQUETTE/blanc.png" },
      { key: "bleu", label: "Bleu marine", sw: "#0b2a4a", front: "/merch/CASQUETTE/bleum.png" },
    ],
  },
  "tasse-noire": {
    title: "Tasse",
    price: "€15,00",
    kind: "TASSE",
    defaultColor: "noir",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/TASSE/noir.png" },
      { key: "rouge", label: "Rouge", sw: "#c5212b", front: "/merch/TASSE/rouge.png" },
    ],
  },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productMap[slug];

  const [colorKey, setColorKey] = useState(product?.defaultColor ?? "");
  const [showBack, setShowBack] = useState(false);

  const sel = useMemo(() => product?.colors.find((c) => c.key === colorKey) ?? product?.colors[0], [product, colorKey]);
  const mainSrc = showBack && sel?.back ? sel.back : sel?.front;

  if (!product) {
    return (
      <section className="pdp-container">
        <div className="pdp-inner">
          <p>Produit introuvable.</p>
          <Link className="pdp-back" to="/products">Revenir aux produits</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pdp-container">
      <nav className="pdp-breadcrumb">
        <Link to="/">Accueil</Link>
        <span> / </span>
        <Link to="/products">Produits</Link>
        <span> / </span>
        <span>{product.title}</span>
      </nav>

      <div className="pdp-inner">
        <div className="pdp-media">
          <div className="pdp-thumbs">
            {sel?.front && (
              <button
                type="button"
                aria-label="Vue Front"
                className={`thumb${!showBack ? " active" : ""}`}
                onClick={() => setShowBack(false)}
              >
                <img src={sel.front} alt={`${product.title} Front`} />
              </button>
            )}
            {sel?.back && (
              <button
                type="button"
                aria-label="Vue Back"
                className={`thumb${showBack ? " active" : ""}`}
                onClick={() => setShowBack(true)}
              >
                <img src={sel.back} alt={`${product.title} Back`} />
              </button>
            )}
          </div>

          {mainSrc && <img className="pdp-img" src={mainSrc} alt={`${product.title} ${sel?.label}`} />}
        </div>

        <div className="pdp-info">
          <h1 className="pdp-title">{product.title} – {sel?.label}</h1>
          <p className="pdp-price">{product.price}</p>

          <div className="pdp-section">
            <div className="pdp-section-title">Couleur</div>
            <div className="color-row">
              {product.colors.map((c) => (
                <button
                  key={c.key}
                  className={`swatch${c.key === colorKey ? " selected" : ""}`}
                  title={c.label}
                  style={{
                    background: c.sw,
                    borderColor: c.key === colorKey ? "#1e61a9" : "#2a2a2a",
                  }}
                  onClick={() => { setColorKey(c.key); setShowBack(false); }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="pdp-actions">
            <button className="primary-btn" type="button" onClick={() => console.log("Add to cart", slug, colorKey)}>
              Ajouter au panier
            </button>
          </div>

          <div className="pdp-note">Autumn 2025 Edition</div>
        </div>
      </div>
    </section>
  );
}
