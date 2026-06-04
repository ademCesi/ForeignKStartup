import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../assets/lang/en.json';
import fr from '../assets/lang/fr.json';
import kr from '../assets/lang/kr.json';


i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    kr: { translation: kr }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
