import "./Mentions.css";
import { useTranslation } from "../hooks/useTranslation";

export default function Mentions() {
  const { t } = useTranslation();
  
  return (
    <section className="mentions">
      <div className="mentions-container">
        <h1 className="mentions-title">{t('legal.mentionsTitle')}</h1>
        
        <div className="mentions-content">
          <div className="mentions-section">
            <h2>{t('legal.mentionsEditor')}</h2>
            <p>{t('legal.mentionsEditorContent')}</p>
          </div>
          
          <div className="mentions-section">
            <h2>{t('legal.mentionsPurpose')}</h2>
            <p>{t('legal.mentionsPurposeContent')}</p>
          </div>
          
          <div className="mentions-section">
            <h2>{t('legal.mentionsHost')}</h2>
            <p>{t('legal.mentionsHostContent')}</p>
          </div>
          
          <div className="mentions-section">
            <h2>{t('legal.mentionsData')}</h2>
            <p>{t('legal.mentionsDataContent')}</p>
          </div>
          
          <div className="mentions-section">
            <h2>{t('legal.mentionsResponsability')}</h2>
            <p>{t('legal.mentionsResponsabilityContent')}</p>
          </div>
          
          <div className="mentions-contact">
            <p><strong>Contact:</strong> contact@shoptastrophe.test</p>
          </div>
        </div>
      </div>
    </section>
  );
}
