import { useEffect, useState } from "react";

export default function Home() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				setError("");
				const resp = await fetch("http://localhost:8000/products");
				if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
				const data = await resp.json();
				setProducts(data);
			} catch (e) {
				setError(e.message || String(e));
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div>
			<h1>🛍️ ShopTastrophe 😏</h1>
			<h2>Produits disponibles</h2>
			{loading && <p>Chargement…</p>}
			{error && <p style={{ color: "crimson" }}>Erreur: {error}</p>}
			{!loading && !error && (
				products.length ? (
					<ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
						{products.map((p) => (
							<li key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
								<div style={{ fontWeight: 600 }}>{p.name}</div>
								<div style={{ color: "#555" }}>{p.description}</div>
								<div style={{ marginTop: 6 }}>{(p.price_cents / 100).toFixed(2)} €</div>
							</li>
						))}
					</ul>
				) : (
					<p>Aucun produit.</p>
				)
			)}
		</div>
	);
}

