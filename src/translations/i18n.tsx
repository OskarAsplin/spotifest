import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations.json';

export const resources = {
  en: {
    translation: translations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

export default i18n;
