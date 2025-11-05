import "./Soutenir.css";
import { useTranslation } from "../hooks/useTranslation";

export default function Soutenir() {
  const { t } = useTranslation();
  return (
    <section className="support">
      <div className="support-container">
        <h1 className="support-title">{t('support.title')}</h1>
        <p className="support-intro">{t('support.intro')}</p>

        <div className="support-grid">
          <div className="support-card">
            <h2>{t('support.supportProject')}</h2>
            <p>{t('support.helpWith')}</p>
            <ul className="support-why">
              <li>{t('support.hosting')}</li>
              <li>{t('support.prototypes')}</li>
              <li>{t('support.expenses')}</li>
            </ul>
            <form
              className="donate"
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* PayPal Payments Standard donation */}
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="liolivier98@gmail.com" />
              <input type="hidden" name="currency_code" value="EUR" />
              <input type="hidden" name="item_name" value="Support ShopTastrophe" />

              <div className="custom-amount">
                <label htmlFor="don-amount">{t('support.enterAmount')}</label>
                <input
                  id="don-amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="€"
                />
              </div>
              <button className="btn-primary" type="submit">Support</button>
            </form>
          </div>

          <div className="support-card feedback">
            <h2>{t('support.ideasFeedback')}</h2>
            <p>{t('support.feedbackText')}</p>
            <a className="btn-primary" href="/contact">{t('support.writeToProject')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
