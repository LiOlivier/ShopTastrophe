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
									<div style={{ color: "#666", fontSize: "0.9rem" }}>
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
								<div style={{ textAlign: "right" }}>
									<div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
										{(order.total_cents / 100).toFixed(2)}€
									</div>
									<div style={{
										color: order.status === "LIVREE" ? "green" : "orange",
										fontSize: "0.9rem",
										fontWeight: "bold"
									}}>
										{formatStatus(order.status)}
									</div>
								</div>
							</div>
								
								{order.items && order.items.length > 0 ? (
									<div style={{ borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
										<h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "#333" }}>
											📦 {t('orders.orderedItems')} ({order.items.length}) :
										</h4>
										<div style={{ display: "grid", gap: "0.5rem" }}>
											{order.items.map((item, index) => (
												<div key={index} style={{ 
													display: "flex", 
													justifyContent: "space-between", 
													alignItems: "center",
													padding: "0.75rem",
													backgroundColor: "#ffffff",
													border: "1px solid #e0e0e0",
													borderRadius: "6px",
													fontSize: "0.95rem"
												}}>
													<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
														<span style={{ 
															fontWeight: "bold", 
															color: "#007bff",
															minWidth: "30px"
														}}>
															{item.qty}x
														</span>
														<span style={{ fontWeight: "500" }}>
															{item.product_name || `${t('orders.product')} #${item.product_id}`}
														</span>
													</div>
													<div style={{ 
														fontWeight: "bold",
														color: "#28a745"
													}}>
														{((item.unit_price_cents * item.qty) / 100).toFixed(2)}€
													</div>
												</div>
											))}
										</div>
									</div>
								) : (
									<div style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", color: "#999", fontStyle: "italic" }}>
										⚠️ {t('orders.itemDetailsUnavailable')}
									</div>
								)}
								
								{/* Actions de la commande */}
								<div style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", marginTop: "1rem" }}>
									<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
										{/* Bouton de paiement pour les commandes créées ou validées */}
										{(order.status === "CREE" || order.status === "VALIDEE") && (
											<button
												onClick={() => navigate(`/payment/${order.id}`)}
												style={{
													backgroundColor: "#28a745",
													color: "white",
													border: "none",
													padding: "0.75rem 1.5rem",
													borderRadius: "8px",
													fontSize: "1rem",
													fontWeight: "bold",
													cursor: "pointer",
													transition: "background-color 0.3s",
													flex: "1",
													minWidth: "200px"
												}}
												onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
												onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
											>
												💳 Payer maintenant ({(order.total_cents / 100).toFixed(2)}€)
											</button>
										)}
										
										{/* Bouton de suivi pour toutes les commandes */}
										<button
											onClick={() => navigate(`/order/${order.id}`)}
											style={{
												backgroundColor: "#007bff",
												color: "white",
												border: "none",
												padding: "0.75rem 1.5rem",
												borderRadius: "8px",
												fontSize: "1rem",
												fontWeight: "bold",
												cursor: "pointer",
												transition: "background-color 0.3s",
												flex: "1",
												minWidth: "200px"
											}}
											onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
											onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
										>
											📦 Suivre la commande
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

