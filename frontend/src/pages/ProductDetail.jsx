import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../hooks/useTranslation";
import "./ProductDetail.css";

// Helpers to build image paths using acronym convention for tees/sweats
const teeImg = (code) => `/merch/TEESHIRT/${code}.png`; // e.g., BTF, WTB
const sweatImg = (code) => `/merch/SWEAT/${code}.png`; // e.g., BSF, WSB

const productMap = {
  "tee-noir": {
    title: "T‑Shirt Ironique",
    price: "€30,00",
    kind: "TEESHIRT",
    defaultColor: "noir",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: teeImg("BTF"), back: teeImg("BTB") },
      { key: "blanc", label: "Blanc", sw: "#fff", front: teeImg("WTF"), back: teeImg("WTB") },
    ],
  },
  "tee-blanc": {
    title: "T‑Shirt Ironique",
    price: "€30,00",
    kind: "TEESHIRT",
    defaultColor: "blanc",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: teeImg("BTF"), back: teeImg("BTB") },
      { key: "blanc", label: "Blanc", sw: "#fff", front: teeImg("WTF"), back: teeImg("WTB") },
    ],
  },
  "sweat-blanc": {
    title: "Sweat Sarcastique",
    price: "€60,00",
    kind: "SWEAT",
    defaultColor: "blanc",
    colors: [
      { key: "blanc", label: "Blanc", sw: "#fff", front: sweatImg("WSF"), back: sweatImg("WSB") },
      { key: "noir", label: "Noir", sw: "#111", front: sweatImg("BSF"), back: sweatImg("BSB") },
    ],
  },
  "sweat-noir": {
    title: "Sweat Sarcastique",
    price: "€60,00",
    kind: "SWEAT",
    defaultColor: "noir",
    colors: [
      { key: "blanc", label: "Blanc", sw: "#fff", front: sweatImg("WSF"), back: sweatImg("WSB") },
      { key: "noir", label: "Noir", sw: "#111", front: sweatImg("BSF"), back: sweatImg("BSB") },
    ],
  },
  "casquette-blanche": {
    title: "Vide Tête",
    price: "€20,00",
    kind: "CASQUETTE",
    defaultColor: "blanc",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/CASQUETTE/noir.png" },
      { key: "blanc", label: "Blanc", sw: "#fff", front: "/merch/CASQUETTE/blanc.png" },
      { key: "bleu", label: "Bleu marine", sw: "#0b2a4a", front: "/merch/CASQUETTE/bleum.png" },
    ],
  },
  "casquette-noire": {
    title: "Vide Tête",
    price: "€20,00",
    kind: "CASQUETTE",
    defaultColor: "noir",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/CASQUETTE/noir.png" },
      { key: "blanc", label: "Blanc", sw: "#fff", front: "/merch/CASQUETTE/blanc.png" },
      { key: "bleu", label: "Bleu marine", sw: "#0b2a4a", front: "/merch/CASQUETTE/bleum.png" },
    ],
  },
  "casquette-bleu": {
    title: "Vide Tête",
    price: "€20,00",
    kind: "CASQUETTE",
    defaultColor: "bleu",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/CASQUETTE/noir.png" },
      { key: "blanc", label: "Blanc", sw: "#fff", front: "/merch/CASQUETTE/blanc.png" },
      { key: "bleu", label: "Bleu marine", sw: "#0b2a4a", front: "/merch/CASQUETTE/bleum.png" },
    ],
  },
  "tasse-noire": {
    title: "ChatasTrophe",
    price: "€15,00",
    kind: "TASSE",
    defaultColor: "noir",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/TASSE/noir.png" },
      { key: "rouge", label: "Rouge", sw: "#c5212b", front: "/merch/TASSE/rouge.png" },
    ],
  },
  "tasse-rouge": {
    title: "ChatasTrophe",
    price: "€15,00",
    kind: "TASSE",
    defaultColor: "rouge",
    colors: [
      { key: "noir", label: "Noir", sw: "#111", front: "/merch/TASSE/noir.png" },
      { key: "rouge", label: "Rouge", sw: "#c5212b", front: "/merch/TASSE/rouge.png" },
    ],
  },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productMap[slug];
  const navigate = useNavigate();
  const { addItem, parseEuroToCents } = useCart();
  const { t } = useTranslation();

  const [colorKey, setColorKey] = useState(product?.defaultColor ?? "");
  const [showBack, setShowBack] = useState(false);

  const sel = useMemo(() => product?.colors.find((c) => c.key === colorKey) ?? product?.colors[0], [product, colorKey]);
  const mainSrc = showBack && sel?.back ? sel.back : sel?.front;

  useEffect(() => {
    if (sel?.front) {
      const img1 = new Image();
      img1.src = sel.front;
    }
    if (sel?.back) {
      const img2 = new Image();
      img2.src = sel.back;
    }
  }, [sel?.front, sel?.back]);

 
  useEffect(() => {
    if (product?.defaultColor) {
      setColorKey(product.defaultColor);
      setShowBack(false);
    }
  }, [slug]);

  const slugForColor = (baseSlug, color) => {
    if (!baseSlug) return baseSlug;
    if (baseSlug.startsWith("tee-")) {
      return `tee-${color}`; 
    }
    if (baseSlug.startsWith("sweat-")) {
      return `sweat-${color}`; 
    }
    if (baseSlug.startsWith("tasse-")) {
      const part = color === "noir" ? "noire" : color;
      return `tasse-${part}`; 
    }
    if (baseSlug.startsWith("casquette-")) {
      const dict = { blanc: "blanche", noir: "noire", bleu: "bleu" };
      const part = dict[color] ?? color;
      return `casquette-${part}`;
    }
    return baseSlug;
  };

  if (!product) {
    return (
      <section className="pdp-container">
        <div className="pdp-inner">
          <p>{t('messages.error') || 'Product not found.'}</p>
          <Link className="pdp-back" to="/products">{t('products.backToProducts')}</Link>
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
                onMouseEnter={() => setShowBack(false)}
                onFocus={() => setShowBack(false)}
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
                onMouseEnter={() => setShowBack(true)}
                onFocus={() => setShowBack(true)}
              >
                <img src={sel.back} alt={`${product.title} Back`} />
              </button>
            )}
          </div>
          <div className="pdp-stage">
            {sel?.front && (
              <img
                className={`pdp-img ${!showBack ? "show" : ""}`}
                src={sel.front}
                alt={`${product.title} ${sel?.label} Front`}
              />
            )}
            {sel?.back && (
              <img
                className={`pdp-img ${showBack ? "show" : ""}`}
                src={sel.back}
                alt={`${product.title} ${sel?.label} Back`}
              />
            )}
          </div>
        </div>

        <div className="pdp-info">
          <div className="pdp-note">{t('product.edition') || 'Autumn 2025 Edition'}</div>
          <h1 className="pdp-title">{product.title} – {sel?.label}</h1>
          <p className="pdp-price">{product.price}</p>

          <div className="pdp-section">
            <div className="pdp-section-title">{t('product.color')}</div>
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
                  onClick={() => {
                    const target = slugForColor(slug, c.key);
                    if (target && target !== slug) {
                      navigate(`/products/${target}`, { replace: false });
                    }
                    setColorKey(c.key);
                    setShowBack(false);
                  }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="pdp-actions">
            <button
              className="primary-btn"
              type="button"
              onClick={() => {
                const idMap = {
                  tee: "1",
                  sweat: "2",
                  casquette: "3",
                  tasse: "4",
                };
                const family = slug.split("-")[0];
                const id = idMap[family] || family;
                const priceCents = parseEuroToCents(product.price);
                addItem({
                  id,
                  name: `${product.title} – ${sel?.label}`,
                  priceCents,
                  slug,
                  colorKey,
                  image: sel?.front,
                }, 1);
              }}
            >
              Ajouter au panier
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
