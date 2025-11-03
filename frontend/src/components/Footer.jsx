import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-socials" aria-hidden>
            <div className="social-list">
              <a href="#" className="social-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M23 4.5c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.3-.8.5-1.8.9-2.9 1.1C18.9 3 17.6 2.5 16.2 2.5c-2.5 0-4.5 2-4.5 4.5 0 .3 0 .6.1.9C7.7 8 4.1 6.1 1.9 3.2c-.4.7-.6 1.5-.6 2.4 0 1.6.8 3 2.1 3.8-.6 0-1.2-.2-1.7-.5v.1c0 2.3 1.6 4.2 3.7 4.6-.4.1-.9.2-1.3.2-.3 0-.6 0-.9-.1.6 1.9 2.4 3.3 4.6 3.3C6.9 18.9 4.6 19.7 2 19.7c-.5 0-1-.1-1.5-.2C1.9 21.2 4.4 22 7.1 22c8.6 0 13.3-7.1 13.3-13.3v-.6c.9-.7 1.6-1.6 2.2-2.6-.8.4-1.6.7-2.5.8z" fill="#cfdfe3"/>
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="#cfdfe3" strokeWidth="1.2" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="#cfdfe3" strokeWidth="1.2" fill="none"/>
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M22 7.2s-.2-1.6-.8-2.3c-.8-1-1.8-1-2.2-1.1C15.6 3.5 12 3.5 12 3.5h-.1s-3.6 0-6.9.2c-.4 0-1.4.1-2.2 1.1C1.9 5.6 2 7.2 2 7.2S2 9 2 10.8v2.4C2 15 2 16.8 2 16.8s.2 1.6.8 2.3c.8 1 1.9 1 2.4 1.1 1.8.2 7.2.2 7.2.2s3.6 0 6.9-.2c.4 0 1.4-.1 2.2-1.1.6-.7.8-2.3.8-2.3S22 15 22 13.2v-2.4C22 9 22 7.2 22 7.2z" fill="#cfdfe3"/>
                  <path d="M10 14.2V9.8l4.5 2.2L10 14.2z" fill="#cfdfe3"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>CATALOGUE</h4>
            <ul>
              <li>
                <a href="/catalogue">Autumn 2025 Edition</a>
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
                <a href="/privacy">Politique de Confidentialité</a>
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
