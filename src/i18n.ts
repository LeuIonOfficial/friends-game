// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define our supported languages
export const languages = {
  en: { nativeName: 'English' },
  ru: { nativeName: 'Русский' },
  ro: { nativeName: 'Română' },
};

// Import all translations
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationRO from './locales/ro.json';

// The translations
const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  ro: {
    translation: translationRO,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // Detect language from browser but don't automatically load it
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
