import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import "./Cart.css";

export default function Cart() {
	const { items, updateQty, removeItem, clear, totalCents } = useCart();
	const { user, isAuthenticated, token } = useAuth();
	const { t } = useTranslation();
	const [isOrdering, setIsOrdering] = useState(false);
	const navigate = useNavigate();
	const isEmpty = items.length === 0;

	const handleCheckout = async () => {
		if (!isAuthenticated || !token) {
			alert(t('auth.login') + ' ' + (t('messages.error') || ''));
			return;
		}

		if (isEmpty) {
			alert(t('cart.empty'));
			return;
		}

		setIsOrdering(true);
		try {
			console.log("🛒 Début checkout...");
			
			try {
				const response = await api.checkout(token);
				
				if (response.ok) {
					const result = await response.json();
					console.log("✅ Commande validée:", result);
					
					// Vider le panier après commande réussie
					clear();
					
					// Rediriger vers la page de paiement avec l'ID de la commande
					navigate(`/payment/${result.order_id}`);
				} else {
					const error = await response.text();
					console.error("❌ Erreur checkout:", error);
					alert(`${t('messages.error')}: ${error}`);
				}
			} catch (apiError) {
				console.warn("⚠️ Backend indisponible, simulation de commande:", apiError);
				
				// Calcul du total
				const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
				const simulatedOrderId = "CMD-" + Date.now();
				
				// Créer la commande simulée
				const simulatedOrder = {
					id: simulatedOrderId,
					status: "VALIDEE",
					total_cents: Math.round(total * 100),
					created_at: Date.now() / 1000,
					items: items.map(item => ({
						product_id: item.id,
						product_name: item.name,
						unit_price_cents: Math.round(item.price * 100),
						qty: item.quantity
					}))
				};
				
				// Sauvegarder dans localStorage pour l'utilisateur
				const userName = user?.name || user?.email?.split('@')[0] || 'guest';
				const userKey = `orders_${userName}`;
				const existingOrders = JSON.parse(localStorage.getItem(userKey) || '[]');
				existingOrders.push(simulatedOrder);
				localStorage.setItem(userKey, JSON.stringify(existingOrders));
				
				alert(`${t('messages.success')} 🎉\n(Backend indisponible)\n${t('orders.orderNumber') || 'Order'}: ${simulatedOrderId}\nTotal: ${total.toFixed(2)}€`);
				
				// Vider le panier
				clear();
				
				// Rediriger vers les commandes
				navigate("/orders");
			}
		} catch (error) {
			console.error("💥 Erreur checkout:", error);
			alert(t('messages.error'));
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
				<h1 className="cart-title">{t('cart.title')}</h1>
				{isEmpty ? (
					<p className="cart-empty">{t('cart.empty')}</p>
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
										<button 
											className="qty-btn minus"
											onClick={() => updateQty(it.id, it.colorKey, Math.max(0, it.qty - 1))}
											aria-label="Diminuer la quantité"
										>
											-
										</button>
										<span className="qty-display">{it.qty}</span>
										<button 
											className="qty-btn plus"
											onClick={() => updateQty(it.id, it.colorKey, it.qty + 1)}
											aria-label="Augmenter la quantité"
										>
											+
										</button>
									</div>
									<div className="cart-line-total">{((it.priceCents * it.qty) / 100).toFixed(2)}€</div>
									<button className="cart-remove" onClick={() => removeItem(it.id, it.colorKey)} aria-label="Retirer l'article">×</button>
								</li>
							))}
						</ul>
									<aside className="cart-summary">
										{address ? (
											<div className="address-block">
												<div className="address-title">{t('profile.personalInfo') || 'Address'}</div>
												<pre className="address-text">{address}</pre>
											</div>
										) : null}
							<div className="summary-row">
								<span>{t('cart.total') || 'Total'}</span>
								<strong>{(totalCents / 100).toFixed(2)}€</strong>
							</div>
							<button 
								className="primary-btn w-full" 
								type="button" 
								onClick={handleCheckout}
								disabled={isOrdering || !isAuthenticated}
							>
								{isOrdering ? (t('messages.loading') || 'Processing...') : (t('cart.checkout') || 'Checkout')}
							</button>
							<button className="btn-outline w-full" type="button" onClick={clear}>
								{t('cart.clear') || 'Clear cart'}
							</button>
						</aside>
					</div>
				)}
			</div>
		</section>
	);
}

