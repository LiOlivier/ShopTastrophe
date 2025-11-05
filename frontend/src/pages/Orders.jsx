import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Orders() {
	const { user, isAuthenticated, token } = useAuth();
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
			const response = await api.listOrders(token);
			
			if (response.ok) {
				const result = await response.json();
				console.log("✅ Commandes reçues:", result);
				
				// Si c'est un tableau, c'est la liste des commandes
				if (Array.isArray(result)) {
					setOrders(result);
				} else if (result.message) {
					// Message "Aucune commande trouvée"
					setOrders([]);
				}
			} else {
				const errorText = await response.text();
				setError(`Erreur lors du chargement: ${errorText}`);
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
			"CREE": "Créée",
			"VALIDEE": "Validée", 
			"PAYEE": "Payée",
			"EXPEDIEE": "Expédiée",
			"LIVREE": "Livrée",
			"ANNULEE": "Annulée",
			"REMBOURSEE": "Remboursée"
		};
		return statusMap[status] || status;
	};

	if (!isAuthenticated) {
		return (
			<div style={{ padding: "2rem", textAlign: "center" }}>
				<h1>Mes commandes</h1>
				<p>Veuillez vous <Link to="/login">connecter</Link> pour voir l'historique de vos commandes.</p>
			</div>
		);
	}

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Mes commandes</h1>
			
			{loading && <p>Chargement des commandes...</p>}
			
			{error && (
				<div style={{ color: "red", marginBottom: "1rem" }}>
					{error}
					<button onClick={loadOrders} style={{ marginLeft: "1rem" }}>
						Réessayer
					</button>
				</div>
			)}
			
			{!loading && !error && orders.length === 0 && (
				<div style={{ textAlign: "center", padding: "2rem" }}>
					<p>Aucune commande pour le moment.</p>
					<Link to="/products" style={{ color: "blue", textDecoration: "underline" }}>
						Découvrir nos produits
					</Link>
				</div>
			)}
			
			{!loading && orders.length > 0 && (
				<div>
					<p>Vous avez {orders.length} commande(s)</p>
					<div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
						{orders.map((order) => (
							<div 
								key={order.id} 
								style={{ 
									border: "1px solid #ddd", 
									borderRadius: "8px", 
									padding: "1rem",
									backgroundColor: "#f9f9f9"
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
									<div>
										<strong>Commande #{order.id}</strong>
										<div style={{ color: "#666", fontSize: "0.9rem" }}>
											{order.created_at && new Date(order.created_at).toLocaleDateString('fr-FR')}
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
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

