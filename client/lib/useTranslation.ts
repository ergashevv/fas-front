import { translations, Language, TranslationKey } from "./translations";
import { useLanguage } from "@/store/useLanguage";

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: string): string => {
    // Support nested keys like "login.title"
    const keys = key.split('.');
    let value: any = translations[currentLanguage as Language];
    
    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    // Fallback to Uzbek if not found
    if (!value) {
      value = translations.uz;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          value = key; // Return key itself if not found
          break;
        }
      }
    }
    
    return value || key;
  };
  
  return { t, currentLanguage };
};
