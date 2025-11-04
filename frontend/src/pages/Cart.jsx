import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

export default function Cart() {
	const { items, updateQty, removeItem, clear, totalCents } = useCart();
	const { user, isAuthenticated } = useAuth();
	const isEmpty = items.length === 0;

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
							<button className="primary-btn w-full" type="button" onClick={() => alert("Checkout à implémenter")}>
								Valider la commande
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

