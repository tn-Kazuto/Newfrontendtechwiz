'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDictionary } from '../utils/adminTranslations';

interface AdminLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof TranslationDictionary) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en'); // Default is English per requirements

  useEffect(() => {
    const saved = localStorage.getItem('admin_lang') as Language;
    if (saved === 'en' || saved === 'vi') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('admin_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'vi' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: keyof TranslationDictionary): string => {
    return translations[language]?.[key] || translations.en[key] || String(key);
  };

  return (
    <AdminLanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </AdminLanguageContext.Provider>
  );
};

export const useAdminLanguage = () => {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return context;
};
