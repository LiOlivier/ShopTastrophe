import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
	const { items, updateQty, removeItem, clear, totalCents } = useCart();
	const { user, isAuthenticated, token } = useAuth();
	const [isOrdering, setIsOrdering] = useState(false);
	const navigate = useNavigate();
	const isEmpty = items.length === 0;

	const handleCheckout = async () => {
		if (!isAuthenticated || !token) {
			alert("Veuillez vous connecter pour passer commande");
			return;
		}

		if (isEmpty) {
			alert("Votre panier est vide");
			return;
		}

		setIsOrdering(true);
		try {
			console.log("🛒 Début checkout...");
			const response = await api.checkout(token);
			
			if (response.ok) {
				const result = await response.json();
				console.log("✅ Commande validée:", result);
				
				alert(`Commande validée avec succès ! 🎉\nNuméro: ${result.order_id}\nTotal: ${(result.total / 100).toFixed(2)}€`);
				
				// Vider le panier après commande réussie
				clear();
				
				// Rediriger vers les commandes
				navigate("/orders");
			} else {
				const error = await response.text();
				console.error("❌ Erreur checkout:", error);
				alert(`Erreur lors de la commande: ${error}`);
			}
		} catch (error) {
			console.error("💥 Erreur checkout:", error);
			alert("Erreur de connexion lors de la commande");
		} finally {
			setIsOrdering(false);
		}
	};

		const address = (() => {
		if (!isAuthenticated || !user) return null;
		const parts = [
				user.address,
			user.location,
			[user.zip, user.state].filter(Boolean).join(" "),
			user.country,
		].filter(Boolean);
		return parts.join("\n");
	})();

	return (
		<section className="cart">
			<div className="cart-container">
				<h1 className="cart-title">Panier</h1>
				{isEmpty ? (
					<p className="cart-empty">Votre panier est vide pour l’instant.</p>
				) : (
								<div className="cart-grid">
						<ul className="cart-list" aria-label="Articles du panier">
							{items.map((it, idx) => (
								<li className="cart-item" key={`${it.id}-${it.colorKey}-${idx}`}>
									<img className="cart-thumb" src={it.image || "/merch/img/placeholder.png"} alt={it.name} />
									<div className="cart-info">
										<div className="cart-name">{it.name}</div>
										{it.colorKey ? <div className="cart-meta">Couleur: {it.colorKey}</div> : null}
										<div className="cart-price">{(it.priceCents / 100).toFixed(2)}€</div>
									</div>
									<div className="cart-qty">
										<label className="sr-only" htmlFor={`qty-${idx}`}>Quantité</label>
										<input
											id={`qty-${idx}`}
											type="number"
											min="0"
											max="99"
											value={it.qty}
											onChange={(e) => updateQty(it.id, it.colorKey, Number(e.target.value))}
										/>
									</div>
									<div className="cart-line-total">{((it.priceCents * it.qty) / 100).toFixed(2)}€</div>
									<button className="cart-remove" onClick={() => removeItem(it.id, it.colorKey)} aria-label="Retirer l'article">×</button>
								</li>
							))}
						</ul>
									<aside className="cart-summary">
										{address ? (
											<div className="address-block">
												<div className="address-title">Adresse de livraison</div>
												<pre className="address-text">{address}</pre>
											</div>
										) : null}
							<div className="summary-row">
								<span>Total</span>
								<strong>{(totalCents / 100).toFixed(2)}€</strong>
							</div>
							<button 
								className="primary-btn w-full" 
								type="button" 
								onClick={handleCheckout}
								disabled={isOrdering || !isAuthenticated}
							>
								{isOrdering ? "Commande en cours..." : "Valider la commande"}
							</button>
							<button className="btn-outline w-full" type="button" onClick={clear}>
								Vider le panier
							</button>
						</aside>
					</div>
				)}
			</div>
		</section>
	);
}

