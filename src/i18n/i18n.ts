"use client"; 
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import jp from "./locales/jp.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      English: { translation: en },
      Japanese: { translation: jp },
      Spanish: { translation: es },
      French: { translation: fr },
    },
    lng: typeof window !== "undefined"
      ? localStorage.getItem("appLanguage") || "English"
      : "English",
    fallbackLng: "English",
    interpolation: { escapeValue: false },
  });

export default i18n;
