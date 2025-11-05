import "./About.css";
import { useTranslation } from "../hooks/useTranslation";

export default function About() {
  const { t } = useTranslation();
  return (
    <section className="about">
      <div className="about-container">
        <h1 className="about-title">{t('about.title')}</h1>

        <p>{t('about.paragraph1')}</p>

        <p>{t('about.paragraph2')}</p>

        <p>{t('about.paragraph3')}</p>

        <p>{t('about.paragraph4')}</p>
      </div>
    </section>
  );
}
