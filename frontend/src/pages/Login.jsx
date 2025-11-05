import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import "./Auth.css";

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
    const { t } = useTranslation();

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const success = await login({ email, password });
			if (success) {
				navigate("/");
			} else {
				setError(t('messages.error') || 'Invalid credentials');
			}
		} catch (err) {
			setError(t('messages.error'));
		}
	};

		return (
			<div className="login-page">
				<div className="login-card">
					<h1>{t('auth.login')}</h1>
					<form onSubmit={onSubmit}>
						<label>
							{t('auth.email')}
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</label>
						<label>
							{t('auth.password')}
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</label>
						{error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
						<button type="submit">{t('auth.loginButton')}</button>
					</form>
					<p className="secondary">
						{t('auth.noAccount')} <Link to="/register">{t('auth.registerLink')}</Link>
					</p>
				</div>
			</div>
		);
}

