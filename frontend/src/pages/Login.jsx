import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const success = await login({ email, password });
			if (success) {
				navigate("/");
			} else {
				setError("Identifiants invalides");
			}
		} catch (err) {
			setError("Erreur de connexion");
		}
	};

		return (
			<div className="login-page">
				<div className="login-card">
					<h1>Se connecter</h1>
					<form onSubmit={onSubmit}>
						<label>
							Email
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</label>
						<label>
							Mot de passe
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</label>
						{error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
						<button type="submit">Connexion</button>
					</form>
					<p className="secondary">
						Pas de compte ? <Link to="/register">Inscrivez-vous</Link>
					</p>
				</div>
			</div>
		);
}

