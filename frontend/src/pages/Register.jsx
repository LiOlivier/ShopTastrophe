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
		// Validation simple: mot de passe identique
		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}
		try {
			await register({ name, email, password });
			navigate("/");
		} catch (err) {
			setError("Impossible d'inscrire cet utilisateur");
		}
	};

		return (
			<div className="login-page">
				<div className="login-card">
					<h1>Inscription</h1>
					<form onSubmit={onSubmit}>
						<label>
							Nom
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
						<button type="submit" disabled={!password || password.length < 6 || password !== confirmPassword}>
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

