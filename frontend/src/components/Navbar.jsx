// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-neutral-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Gauche - Logo */}
        <div className="text-2xl font-semibold tracking-tight">
          <Link to="/">ShopTastrophe 😏</Link>
        </div>

        {/* Centre - Liens */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-blue-400 transition">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/home" className="hover:text-blue-400 transition">
              Produits
            </Link>
          </li>
          <li>
            <Link to="/orders" className="hover:text-blue-400 transition">
              Commandes
            </Link>
          </li>
        </ul>

        {/* Droite - Icônes */}
        <div className="flex items-center gap-4 text-lg">
          <button title="Langue" className="hover:text-blue-400 transition">
            🌍
          </button>
          <button title="Profil" className="hover:text-blue-400 transition">
            👤
          </button>
          <button title="Panier" className="hover:text-blue-400 transition">
            🛍️
          </button>
        </div>
      </div>
    </nav>
  );
}
