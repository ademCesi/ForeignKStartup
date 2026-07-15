import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ko from './locales/ko.json';

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
const supportedLanguage = ['en', 'fr', 'ko'].includes(deviceLanguage) ? deviceLanguage : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ko: { translation: ko },
  },
  lng: supportedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
