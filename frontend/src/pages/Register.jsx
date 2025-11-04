import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		console.log("🚀 Tentative d'inscription...", { email, password: "***" });
		
		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}
		
		try {
			console.log("📡 Appel API register...");
			const success = await register({ 
				email, 
				password, 
				first_name: name, 
				last_name: "User",
				address: "Adresse par défaut"
			});
			
			console.log("📋 Résultat register:", success);
			
			if (success) {
				console.log("✅ Inscription réussie, redirection...");
				navigate("/");
			} else {
				setError("Impossible d'inscrire cet utilisateur");
			}
		} catch (err) {
			console.error("💥 Erreur inscription:", err);
			setError("Erreur d'inscription");
		}
	};

		return (
			<div className="login-page">
				<div className="login-card">
					<h1>Inscription</h1>
					

					
					<form onSubmit={onSubmit}>
						<label>
							Prénom
							<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
						</label>
						<label>
							Email
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</label>
						<label>
							Mot de passe
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</label>
						<label>
							Confirmer le mot de passe
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</label>
						{error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
						<button type="submit">
							Créer un compte
						</button>

					</form>
					<p className="secondary">
						Déjà inscrit ? <Link to="/login">Se connecter</Link>
					</p>
				</div>
			</div>
		);
}

