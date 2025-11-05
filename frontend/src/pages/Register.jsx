import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import PasswordInput from "../components/PasswordInput";
import "./Auth.css";

export default function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
    const { t } = useTranslation();

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		console.log("🚀 Tentative d'inscription...", { email, password: "***" });
		
		if (password !== confirmPassword) {
			setError(t('auth.confirmPassword') + ' ' + (t('messages.error') || ''));
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
				setError(t('messages.error'));
			}
		} catch (err) {
			console.error("💥 Erreur inscription:", err);
			setError(t('messages.error'));
		}
	};

		return (
			<div className="login-page">
				<div className="login-card auth-form">
					<h1>{t('auth.register')}</h1>
					
					<form onSubmit={onSubmit}>
						<label>
							{t('auth.name')}
							<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
						</label>
						<label>
							{t('auth.email')}
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</label>
						<PasswordInput
							label={t('auth.password')}
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<PasswordInput
							label={t('auth.confirmPassword')}
							name="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						{error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
						<button type="submit">
							{t('auth.registerButton')}
						</button>
					</form>
					<p className="secondary">
						{t('auth.alreadyAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
					</p>
				</div>
			</div>
		);
}

