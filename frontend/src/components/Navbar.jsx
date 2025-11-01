// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const onProfileClick = () => {
    if (!isAuthenticated) navigate("/login");
    else navigate("/profile");
  };

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Gauche - Logo */}
        <div className="navbar-logo">
          <Link to="/" className="brand" aria-label="Accueil">
            <img src="/logo.png" alt="ShopTastrophe" className="logo" />
          </Link>
        </div>

        {/* Centre - Liens */}
        <ul className="navbar-links" aria-label="Navigation principale">
          <li>
            <Link to="/home" className="nav-link">
              Catalogues
            </Link>
          </li>
          <li>
            <Link to="/orders" className="nav-link">
              Commandes
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              À propos
            </Link>
          </li>
        </ul>

        {/* Droite - Icônes */}
        <div className="navbar-actions">
          <button title="Langue" className="icon-btn" aria-label="Langue">
            <img
              src="/fr.png"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/france.png";
              }}
              alt="Langue"
              className="icon-img"
            />
          </button>
            <button title="Panier" className="icon-btn" aria-label="Panier">
            <img src="/sac.png" alt="Panier" className="icon-img" />
          </button>
          <button title="Profil" className="icon-btn" aria-label="Profil" onClick={onProfileClick}>
            <img src="/profil.png" alt="Profil" className="icon-img profile-icon" />
          </button>
          {/* Plus de menu déroulant: on redirige vers une page dédiée */}
        </div>
      </div>
    </nav>
  );
}
