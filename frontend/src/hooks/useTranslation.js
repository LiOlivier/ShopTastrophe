import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    // Debug spécifique pour les clés legal
    if (key.startsWith('legal.cgv') || key.startsWith('legal.mentions')) {
      console.log(`🔍 Recherche de la clé: ${key}`);
      console.log(`🌍 Langue actuelle: ${language}`);
      console.log(`📚 Traductions disponibles pour legal:`, Object.keys(translations[language]?.legal || {}));
      console.log(`🎯 Valeur trouvée:`, translations[language]?.legal?.[key.split('.')[1]]);
    }
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`❌ Traduction manquante pour: ${key} (langue: ${language})`);
        return key; // Retourne la clé si la traduction n'existe pas
      }
    }
    
    return value || key;
  };
  
  return { t };
};