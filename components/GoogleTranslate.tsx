'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

/**
 * Read the current Google Translate target language from the 'googtrans' cookie.
 * Value format: /en/vi or /auto/vi or /en/en
 */
export function getCurrentGoogleLanguage(): 'en' | 'vi' {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/googtrans=\/(?:[a-zA-Z0-9_-]+)\/([a-zA-Z]{2})/i);
  return match && match[1].toLowerCase() === 'vi' ? 'vi' : 'en';
}

/**
 * Smoothly trigger Google Translate language change without UI lag or glitches.
 */
export function setGoogleLanguage(lang: 'en' | 'vi') {
  if (typeof window === 'undefined') return;
  loadGoogleTranslateScript();
  const hostname = window.location.hostname;

  if (lang === 'en') {
    // Clear cookies across paths & domains to restore original English
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
    document.cookie = 'googtrans=/en/en; path=/;';
  } else {
    // Set to target language (e.g. Vietnamese)
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname};`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=.${hostname};`;
  }

  // Trigger Google combo select element if already loaded
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (combo) {
    combo.value = lang;
    combo.dispatchEvent(new Event('change'));
    window.dispatchEvent(new CustomEvent('googtrans_change', { detail: lang }));
  } else {
    // If element is not yet ready, reload smoothly so cookie applies immediately
    window.location.reload();
  }
}

/**
 * Custom React hook to interact with Google Translate in components
 */
export function useGoogleLanguage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'vi'>('en');

  useEffect(() => {
    setCurrentLang(getCurrentGoogleLanguage());

    const handleCustomChange = (e: any) => {
      if (e.detail) {
        setCurrentLang(e.detail);
      }
    };

    window.addEventListener('googtrans_change', handleCustomChange);
    return () => {
      window.removeEventListener('googtrans_change', handleCustomChange);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'vi' : 'en';
    setCurrentLang(nextLang);
    setGoogleLanguage(nextLang);
  };

  return {
    language: currentLang,
    toggleLanguage,
    setLanguage: (lang: 'en' | 'vi') => {
      setCurrentLang(lang);
      setGoogleLanguage(lang);
    },
  };
}

export function loadGoogleTranslateScript() {
  if (typeof document === 'undefined') return;
  const scriptId = 'google-translate-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }
}

export const GoogleTranslate = () => {
  useEffect(() => {
    // Define global callback for Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,vi',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // If user already requested Vietnamese, load immediately
    if (getCurrentGoogleLanguage() === 'vi') {
      loadGoogleTranslateScript();
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ display: 'none', position: 'absolute', top: -9999, left: -9999, opacity: 0 }}
    />
  );
};
