import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
        <button
          className="navbar-burger"
          aria-label={t('nav.menu')}
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <img src="/bar.png" alt={t('nav.menu')} className="burger-img" />
        </button>

        <div className="navbar-logo">
          <Link to="/" className="brand" aria-label={t('nav.home')}>
            <img src="/logo.png" alt="ShopTastrophe" className="logo" />
          </Link>
        </div>

        <ul className="navbar-links" aria-label="Navigation principale">
          <li>
            <Link to="/products" className="nav-link">
              {t('nav.products')}
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link to="/soutenir" className="nav-link">
              {t('nav.support')}
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              {t('nav.contact')}
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <button 
            title={t('nav.language')} 
            className="icon-btn" 
            aria-label={t('nav.language')}
            onClick={toggleLanguage}
          >
            <img
              src={language === 'fr' ? "/france.png" : "/en/en.png"}
              alt={language === 'fr' ? "Français" : "English"}
              className="icon-img"
            />
          </button>
          <button title={t('nav.cart')} className="icon-btn cart-btn" aria-label={t('nav.cart')} onClick={() => navigate("/cart") }>
            <img src="/sac.png" alt={t('nav.cart')} className="icon-img" />
            {count > 0 ? <span className="cart-badge" aria-label={`${count} ${t('cart.items')}`}>{count}</span> : null}
          </button>
          <button title={t('nav.profile')} className="icon-btn" aria-label={t('nav.profile')} onClick={onProfileClick}>
            <img src="/profil.png" alt={t('nav.profile')} className="icon-img profile-icon" />
          </button>
        </div>
      </div>

      <div
        className={`mobile-backdrop${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal={menuOpen ? "true" : "false"}
      >
        <Link to="/products" className="mobile-link" onClick={() => setMenuOpen(false)}>
          {t('nav.products')}
        </Link>
        <Link to="/about" className="mobile-link" onClick={() => setMenuOpen(false)}>
          {t('nav.about')}
        </Link>
        <Link to="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>
          {t('nav.contact')}
        </Link>
        <Link to="/soutenir" className="mobile-link" onClick={() => setMenuOpen(false)}>
          {t('nav.support')}
        </Link>
      </div>
    </nav>
  );
}
