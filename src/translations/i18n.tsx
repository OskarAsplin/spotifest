import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

export default i18n;
