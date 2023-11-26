import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import translationRU from "@/locales/ru/translation.json";
import translationEN from "@/locales/en/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
};

i18n.use(LanguageDetector).use(initReactI18next).use(Backend).init({
  debug: true,
  fallbackLng: "en",
  resources,
});

export default i18n;
