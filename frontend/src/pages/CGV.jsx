import "./CGV.css";
import { useTranslation } from "../hooks/useTranslation";

export default function CGV() {
  const { t } = useTranslation();
  
  return (
    <section className="cgv">
      <div className="cgv-container">
        <h1 className="cgv-title">{t('legal.cgvTitle')}</h1>
        <p className="cgv-intro">{t('legal.cgvIntro')}</p>
        
        <div className="cgv-content">
          <div className="cgv-note">
            <p><strong>{t('legal.cgvNote')}</strong></p>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvDefinitionsTitle')}</h2>
            <ul>
              <li>{t('legal.cgvClientDef')}</li>
              <li>{t('legal.cgvCommandeDef')}</li>
              <li>{t('legal.cgvProjetDef')}</li>
              <li>{t('legal.cgvProduitsDef')}</li>
            </ul>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvObjetTitle')}</h2>
            <p>{t('legal.cgvObjetContent')}</p>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvApplicationTitle')}</h2>
            <p>{t('legal.cgvApplicationContent')}</p>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvCommandesTitle')}</h2>
            <p>{t('legal.cgvCommandesContent')}</p>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvPrixTitle')}</h2>
            <p>{t('legal.cgvPrixContent')}</p>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvDonneesTitle')}</h2>
            <p>{t('legal.cgvDonneesContent')}</p>
          </div>
          
          <div className="cgv-article">
            <h2>{t('legal.cgvContactTitle')}</h2>
            <p>{t('legal.cgvContactContent')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
