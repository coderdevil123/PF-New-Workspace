import React, { createContext, useContext, useEffect, useState } from 'react';

import en from '../i18n/en.json';
import fr from '../i18n/fr.json';

type Language = 'en' | 'fr';

const dictionaries: Record<Language, any> = {
  en,
  fr,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const userKey = `language:${localStorage.getItem('user_email')}`;

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(userKey) as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(userKey, language);
  }, [language]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value = dictionaries[language];

    for (const k of keys) {
      value = value?.[k];
      if (!value) return key; // fallback
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
