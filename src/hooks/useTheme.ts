"use client";

import { useEffect, useState } from "react";
import i18n from "@/i18n/i18n";

export type Theme = "Light" | "Dark" | "System default";
export type Accent = "Blue" | "Violet" | "Slate Gray";
export type Language = "English" | "Spanish" | "French" | "Japanese";
export type SessionTimeout = "1 minute" | "15 minutes" | "30 minutes" | "60 minutes";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("Dark");
  const [accent, setAccent] = useState<Accent>("Blue");
  const [language, setLanguage] = useState<Language>("English");
  const [sessionTimeout, setSessionTimeout] = useState<SessionTimeout>("1 minute");

  // INITIAL LOAD: read values from localStorage (use consistent keys)
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "Dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const savedAccent = (localStorage.getItem("accent") as Accent) || "Blue";
    setAccent(savedAccent);
    applyAccent(savedAccent);

    const savedLang = (localStorage.getItem("appLanguage") as Language) || "English";
    setLanguage(savedLang);
    // do not call i18n.changeLanguage here to avoid double-init issues;
    // call updateLanguage when user explicitly changes language or component bootstraps i18n.

    const savedTimeout = (localStorage.getItem("sessionTimeout") as SessionTimeout) || "1 minute";
    setSessionTimeout(savedTimeout);
  }, []);

  // THEME
  const applyTheme = (selected: Theme) => {
    const root = document.documentElement;
    if (selected === "Dark") {
      root.classList.add("dark");
    } else if (selected === "Light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.classList.add("dark");
      else root.classList.remove("dark");
    }
  };
  const updateTheme = (selected: Theme) => {
    setTheme(selected);
    localStorage.setItem("theme", selected);
    applyTheme(selected);
  };

  // ACCENT
  const accentMap: Record<Accent, string> = {
    Blue: "#3b82f6",
    Violet: "#8b5cf6",
    "Slate Gray": "#64748b",
  };
  const applyAccent = (selectedAccent: Accent) => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", accentMap[selectedAccent]);
  };
  const updateAccent = (selectedAccent: Accent) => {
    setAccent(selectedAccent);
    localStorage.setItem("accent", selectedAccent);
    applyAccent(selectedAccent);
  };

  // LANGUAGE
  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("appLanguage", lang); // single key used across app
    i18n.changeLanguage(lang);
  };

  // SESSION TIMEOUT
  const updateSessionTimeout = (value: SessionTimeout) => {
    setSessionTimeout(value);
    localStorage.setItem("sessionTimeout", value);
  };

  return {
    theme,
    updateTheme,
    accent,
    updateAccent,
    language,
    updateLanguage,
    sessionTimeout,
    updateSessionTimeout,
  };
}
