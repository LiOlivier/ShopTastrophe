import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./AddToCartModal.css";

export default function AddToCartModal() {
  const navigate = useNavigate();
  const { confirmOpen, closeConfirm, lastAdded } = useCart();

  // Close with Escape
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeConfirm(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, closeConfirm]);

  if (!confirmOpen) return null;
  const price = lastAdded ? (lastAdded.priceCents / 100).toFixed(2) + "€" : "";

  return (
    <div className="atc-backdrop" role="dialog" aria-modal="true" onClick={closeConfirm}>
      <div className="atc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="atc-head">Produit ajouté à ton panier !</div>
        <div className="atc-body">
          {lastAdded?.image ? (
            <img className="atc-thumb" src={lastAdded.image} alt={lastAdded.name} />
          ) : null}
          <div className="atc-info">
            <div className="atc-name">{lastAdded?.name}</div>
            {typeof lastAdded?.colorKey !== "undefined" && (
              <div className="atc-meta">Taille/Couleur: {String(lastAdded.colorKey || "—")}</div>
            )}
            <div className="atc-price">{price}</div>
          </div>
        </div>
        <div className="atc-actions">
          <button className="primary-btn" onClick={() => { closeConfirm(); navigate("/cart"); }}>
            Passer ma commande
          </button>
          <button className="btn-outline" onClick={closeConfirm}>Continuer mes achats</button>
        </div>
      </div>
    </div>
  );
}
