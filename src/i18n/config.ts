import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';
import hiTranslations from './hi.json';
import teTranslations from './te.json';
import knTranslations from './kn.json';

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  te: { translation: teTranslations },
  kn: { translation: knTranslations },
};

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
