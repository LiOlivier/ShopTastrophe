import "./Footer.css";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-socials" aria-hidden>
            <div className="social-list">
              <a href="https://twitter.com/ShopTastrophe" className="social-btn" aria-label="Twitter">
                <img src="/icone/twitter.svg" alt="Twitter" />
              </a>
              <a href="https://www.instagram.com/ShopTastrophe" className="social-btn" aria-label="Instagram">
                <img src="/icone/instagram.svg" alt="Instagram" />
              </a>
              <a href="https://www.youtube.com/@nvtsu6929" className="social-btn" aria-label="YouTube">
                <img src="/icone/youtube.svg" alt="YouTube" />
              </a>
              <a href="https://www.tiktok.com/@shoptastrophe?lang=fr" className="social-btn" aria-label="TikTok">
                <img src="/icone/tiktok.svg" alt="TikTok" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('footer.links')}</h4>
            <ul>
              <li>
                <Link to="/products">Autumn 2025 Edition</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.legal')}</h4>
            <ul>
              <li>
                <Link to="/faq">{t('faq.title') || 'FAQ'}</Link>
              </li>
              <li>
                <Link to="/contact">{t('nav.contact')}</Link>
              </li>
              <li>
                <Link to="/mentions">{t('footer.mentions')}</Link>
              </li>
              <li>
                <Link to="/cgv">{t('footer.cgv') || 'CGV'}</Link>
              </li>
              <li>
                <Link to="/soutenir">{t('nav.support')}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-payments">
            <h4>{t('footer.followUs')}</h4>
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

        <div className="footer-copy">© {year} ShopTastrophe. {t('footer.legal') === 'Legal Notice' ? 'All rights reserved.' : 'Tous droits réservés.'}</div>
      </div>
    </footer>
  );
}
