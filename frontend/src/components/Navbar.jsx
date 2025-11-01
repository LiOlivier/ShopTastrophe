// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Gauche - Logo */}
        <div className="navbar-logo">
          <Link to="/" className="brand">
            <img src="/logo.png" alt="ShopTastrophe" className="logo" />
          </Link>
        </div>

        {/* Centre - Liens */}
        <ul className="navbar-links" aria-label="Navigation principale">
          <li>
            <Link to="/" className="nav-link">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/home" className="nav-link">
              Produits
            </Link>
          </li>
          <li>
            <Link to="/orders" className="nav-link">
              Commandes
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
          <button title="Profil" className="icon-btn" aria-label="Profil">
            <img src="/profil.png" alt="Profil" className="icon-img" />
          </button>
        </div>
      </div>
    </nav>
  );
}
