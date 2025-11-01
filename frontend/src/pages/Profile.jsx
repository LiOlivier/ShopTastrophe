import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: 24 }}>
      <h1>Profil utilisateur</h1>
      <div style={{ marginTop: 12 }}>
        <div><strong>Nom:</strong> {user?.name || "-"}</div>
        <div><strong>Email:</strong> {user?.email}</div>
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button onClick={() => navigate("/orders")}>Mes commandes</button>
        <button onClick={() => navigate("/")}>Retour à l'accueil</button>
        <button onClick={() => { logout(); navigate("/"); }} style={{ color: "#b91c1c" }}>Se déconnecter</button>
      </div>
    </div>
  );
}
