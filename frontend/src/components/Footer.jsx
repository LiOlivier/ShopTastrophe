import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-socials" aria-hidden>
            <div className="social-list">
              <a href="#" className="social-btn" aria-label="Twitter">
                <img src="/icone/twitter.svg" alt="Twitter" />
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <img src="/icone/instagram.svg" alt="Instagram" />
              </a>
              <a href="#" className="social-btn" aria-label="YouTube">
                <img src="/icone/youtube.svg" alt="YouTube" />
              </a>
              <a href="#" className="social-btn" aria-label="TikTok">
                <img src="/icone/tiktok.svg" alt="TikTok" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>CATALOGUE</h4>
            <ul>
              <li>
                <Link to="/products">Autumn 2025 Edition</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>INFORMATIONS</h4>
            <ul>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/mentions">Mentions Légales</a>
              </li>
              <li>
                <a href="/cgv">Conditions Générales de Vente</a>
              </li>
              <li>
                <a href="/soutenir">Nous soutenir</a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-payments">
            <h4>MODES DE PAIEMENT</h4>
            <div className="payments">
              <span className="pay-icon" title="Apple Pay" aria-hidden>
                <img src="/icone/applepay.svg" alt="Apple Pay" />
              </span>
              <span className="pay-icon" title="VISA" aria-hidden>
                <img src="/icone/visa.svg" alt="Visa" />
              </span>
              <span className="pay-icon" title="Mastercard" aria-hidden>
                <img src="/icone/mastercard.svg" alt="Mastercard" />
              </span>
              <span className="pay-icon" title="PayPal" aria-hidden>
                <img src="/icone/paypal.svg" alt="PayPal" />
              </span>
            </div>
          </div>
        </div>

        <div className="footer-copy">© {year} ShopTastrophe. Tous droits réservés.</div>
      </div>
    </footer>
  );
}
