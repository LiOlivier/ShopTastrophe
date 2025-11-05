import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import "./Newsletter.css";

export default function Newsletter() {
  const { t } = useTranslation();
  
  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email");
    alert(`${t('newsletter.thanks')} ${email}`);
    form.reset();
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-container">
        <h2 id="newsletter-title" className="newsletter-title">{t('newsletter.title')}</h2>
        <p className="newsletter-subtitle">{t('newsletter.subtitle')}</p>
        <form className="newsletter-form" onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder={t('newsletter.placeholder')}
            className="newsletter-input"
            required
          />
          <button type="submit" className="newsletter-btn">{t('newsletter.button')}</button>
        </form>
      </div>
    </section>
  );
}
