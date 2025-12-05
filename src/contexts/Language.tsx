import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  theme: "dark",
  language: "en",
  setLanguage: (lang: string) => {
    localStorage.setItem("appLanguage", lang);
    set({ language: lang });
  },
}));
