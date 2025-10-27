import { translations, Language, TranslationKey } from "./translations";
import { useLanguage } from "@/store/useLanguage";

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    return translations[currentLanguage as Language]?.[key] || translations.uz[key] || key;
  };
  
  return { t, currentLanguage };
};
