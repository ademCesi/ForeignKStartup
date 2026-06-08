import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../assets/lang/en.json';
import fr from '../assets/lang/fr.json';
import ko from '../assets/lang/ko.json';
import es from '../assets/lang/es.json';
import ru from '../assets/lang/ru.json';
import zh from '../assets/lang/zh.json';
import pt from '../assets/lang/pt.json';
import ja from '../assets/lang/ja.json';
import hi from '../assets/lang/hi.json';
import ar from '../assets/lang/ar.json';

const savedLang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ko: { translation: ko },
    es: { translation: es },
    ru: { translation: ru },
    zh: { translation: zh },
    pt: { translation: pt },
    ja: { translation: ja },
    hi: { translation: hi },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: savedLang,
  interpolation: { escapeValue: false }
});

export default i18n;
