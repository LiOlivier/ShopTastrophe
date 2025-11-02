import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">ShopTastrophe</div>
          <nav className="footer-nav">
            <Link to="/">Accueil</Link>
            <Link to="/orders">Commandes</Link>
            <Link to="/cart">Panier</Link>
            <Link to="/profile">Profil</Link>
          </nav>
        </div>
        <div className="footer-bottom">© {year} ShopTastrophe. Tous droits réservés.</div>
      </div>
    </footer>
  );
}
