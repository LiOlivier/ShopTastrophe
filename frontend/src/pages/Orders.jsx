import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { api } from "../api/client";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.css";

export default function Orders() {
	const { user, isAuthenticated, token } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isAuthenticated && token) {
			loadOrders();
		}
	}, [isAuthenticated, token]);

	const loadOrders = async () => {
		if (!token) return;
		
		setLoading(true);
		setError(null);
		
		try {
			console.log("📋 Chargement des commandes...");
			
			// Pour les nouveaux utilisateurs, commencer avec une liste vide
			const userName = user?.name || user?.email?.split('@')[0] || 'guest';
			console.log("👤 Utilisateur connecté:", userName);
			
			// Vérifier si on a des commandes réelles en localStorage pour cet utilisateur
			const savedOrders = localStorage.getItem(`orders_${userName}`);
			if (savedOrders) {
				try {
					const parsedOrders = JSON.parse(savedOrders);
					console.log("📦 Commandes trouvées en localStorage:", parsedOrders);
					if (parsedOrders.length > 0) {
						setOrders(parsedOrders);
						setLoading(false);
						return;
					}
				} catch (e) {
					console.warn("Erreur parsing localStorage orders:", e);
				}
			}
			
			// Essayer le backend
			try {
				const response = await api.listOrders(token);
				
				if (response.ok) {
					const result = await response.json();
					console.log("✅ Commandes reçues du backend:", result);
					
					if (Array.isArray(result) && result.length > 0) {
						const hasItems = result.some(order => order.items && order.items.length > 0);
						
						if (hasItems) {
							setOrders(result);
						} else {
							console.warn("⚠️ Commandes sans détails, affichage vide");
							setOrders([]);
						}
					} else {
						console.log("✅ Pas de commandes pour ce nouvel utilisateur");
						setOrders([]);
					}
				} else {
					console.warn("⚠️ Backend indisponible");
					setOrders([]);
				}
			} catch (apiError) {
				console.warn("⚠️ Erreur API:", apiError);
				setOrders([]);
			}
			
		} catch (err) {
			console.error("💥 Erreur chargement commandes:", err);
			setError("Erreur de connexion");
		} finally {
			setLoading(false);
		}
	};

	const formatStatus = (status) => {
		const statusMap = {
			"CREE": t('orders.statusCreated'),
			"VALIDEE": t('orders.statusValidated'), 
			"PAYEE": t('orders.statusPaid'),
			"EXPEDIEE": t('orders.statusShipped'),
			"LIVREE": t('orders.statusDelivered'),
			"ANNULEE": t('orders.statusCancelled'),
			"REMBOURSEE": t('orders.statusRefunded')
		};
		return statusMap[status] || status;
	};

	// Classe de statut pour styling (badge)
	const statusClass = (status) => {
		switch (status) {
			case "LIVREE":
				return "order-status delivered";
			case "EXPEDIEE":
				return "order-status shipped";
			default:
				return "order-status pending";
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="orders-container">
				<div className="orders-login-prompt">
					<h1>{t('orders.title')}</h1>
					<p>{t('orders.pleaseLogin')} <Link to="/login">{t('nav.login')}</Link> {t('orders.toViewHistory')}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="orders-container">
			<h1 className="orders-title">{t('orders.title')}</h1>
			
			{loading && (
				<div className="orders-loading">
					<div>📦</div>
					<p>{t('messages.loading')}</p>
				</div>
			)}
			
			{error && (
				<div className="orders-error">
					{error}
					<button onClick={loadOrders}>
						{t('orders.retry')}
					</button>
				</div>
			)}
			
			{!loading && !error && orders.length === 0 && (
				<div className="orders-empty-minimal">
					<p className="orders-empty-title-minimal">Aucune commande pour le moment</p>
					<p className="orders-empty-text-minimal">{t('orders.noOrders')}</p>
				</div>
			)}
			
			{!loading && orders.length > 0 && (
				<div>
					<div className="orders-summary">
						<p>📋 {t('orders.youHave')} {orders.length} {t('orders.orderCount')}</p>
					</div>
					<div className="orders-list">{orders.map((order) => (
						<div key={order.id} className="order-card">
							<div className="order-header">
								<div>
									<div className="order-number">
										{t('orders.orderNumber')} {order.id}
									</div>
									<div className="order-date">
										{order.created_at ?
											new Date(order.created_at * 1000).toLocaleDateString('fr-FR', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											}) :
											t('orders.unknownDate')
										}
									</div>
								</div>
								<div className="order-info">
									<div className="order-total">{(order.total_cents / 100).toFixed(2)}€</div>
									<div className={statusClass(order.status)}>{formatStatus(order.status)}</div>
								</div>
							</div>
								
								{order.items && order.items.length > 0 ? (
									<div className="order-items">
										<h4 className="order-items-title">📦 {t('orders.orderedItems')} ({order.items.length}) :</h4>
										<div className="order-items-list">
											{order.items.map((item, index) => (
												<div key={index} className="order-item">
													<div className="order-item-left">
														<span className="order-item-qty">{item.qty}x</span>
														<span className="order-item-name">{item.product_name || `${t('orders.product')} #${item.product_id}`}</span>
													</div>
													<div className="order-item-amount">{((item.unit_price_cents * item.qty) / 100).toFixed(2)}€</div>
												</div>
											))}
										</div>
									</div>
								) : (
									<div className="order-items-empty">⚠️ {t('orders.itemDetailsUnavailable')}</div>
								)}
								
								{/* Actions de la commande */}
								<div className="order-actions">
									{(order.status === "CREE" || order.status === "VALIDEE") && (
										<button className="order-action-btn order-action-primary" onClick={() => navigate(`/payment/${order.id}`)}>
											💳 Payer maintenant ({(order.total_cents / 100).toFixed(2)}€)
										</button>
									)}
									<button className="order-action-btn order-action-secondary" onClick={() => navigate(`/order/${order.id}`)}>
										📦 Suivre la commande
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

