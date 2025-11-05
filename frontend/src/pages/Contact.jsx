import "./Contact.css";
import { useTranslation } from "../hooks/useTranslation";

export default function Contact() {
  const { t } = useTranslation();
  
  return (
    <section className="contact">
      <div className="contact-container">
        <h1 className="contact-title">{t('contact.title')}</h1>
        <p className="contact-intro">{t('contact.intro')}</p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="name">{t('contact.name')}</label>
            <input id="name" name="name" type="text" placeholder={t('contact.namePlaceholder')} required />
          </div>
          <div className="form-row">
            <label htmlFor="email">{t('contact.email')}</label>
            <input id="email" name="email" type="email" placeholder={t('contact.emailPlaceholder')} required />
          </div>
          <div className="form-row">
            <label htmlFor="message">{t('contact.message')}</label>
            <textarea id="message" name="message" rows={5} placeholder={t('contact.messagePlaceholder')} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{t('contact.send')}</button>
          </div>
        </form>
        <div className="contact-alt">
          <p>{t('contact.altText')} <a href="mailto:contact@shoptastrophe.test">contact@shoptastrophe.test</a>.</p>
        </div>
      </div>
    </section>
  );
}
