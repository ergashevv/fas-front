import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: "uz",
      setLanguage: (lang) => set({ currentLanguage: lang }),
    }),
    {
      name: "language-storage",
    }
  )
);
