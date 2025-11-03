// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
        {/* Burger (mobile seulement) */}
        <button
          className="navbar-burger"
          aria-label="Ouvrir le menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <img src="/bar.png" alt="Menu" className="burger-img" />
        </button>

        {/* Logo (gauche en desktop, centré en mobile via CSS) */}
        <div className="navbar-logo">
          <Link to="/" className="brand" aria-label="Accueil">
            <img src="/logo.png" alt="ShopTastrophe" className="logo" />
          </Link>
        </div>

        {/* Liens (desktop) */}
        <ul className="navbar-links" aria-label="Navigation principale">
          <li>
            <Link to="/home" className="nav-link">
              Catalogues
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              À propos
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>

        {/* Icônes (droite) */}
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
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="false"
      >
        <Link to="/home" className="mobile-link" onClick={() => setMenuOpen(false)}>
          Catalogues
        </Link>
        <Link to="/about" className="mobile-link" onClick={() => setMenuOpen(false)}>
          À propos
        </Link>
        <Link to="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
      </div>
    </nav>
  );
}
