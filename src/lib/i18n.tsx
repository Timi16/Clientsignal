"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

import en from "./translations/en.json";
import es from "./translations/es.json";
import yo from "./translations/yo.json";
import ig from "./translations/ig.json";
import ha from "./translations/ha.json";

/* ===== Types ===== */
export type Locale = "en" | "es" | "yo" | "ig" | "ha";
type Translations = typeof en;

const TRANSLATIONS: Record<Locale, Translations> = { en, es, yo, ig, ha };

export const LANGUAGES: { code: Locale; name: string; native: string; flag: string }[] = [
  { code: "en", name: "English",  native: "English",  flag: "🇬🇧" },
  { code: "es", name: "Spanish",  native: "Español",  flag: "🇪🇸" },
  { code: "yo", name: "Yoruba",   native: "Yorùbá",   flag: "🇳🇬" },
  { code: "ig", name: "Igbo",     native: "Igbo",     flag: "🇳🇬" },
  { code: "ha", name: "Hausa",    native: "Hausa",    flag: "🇳🇬" },
];

const STORAGE_KEY = "clientsignal-lang";

/* ===== Context ===== */
interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  showSelector: boolean;
  setShowSelector: (v: boolean) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
  showSelector: false,
  setShowSelector: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

/* ===== Provider ===== */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [showSelector, setShowSelector] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && TRANSLATIONS[stored]) {
      setLocaleState(stored);
    } else {
      // First visit — show the language selector popup
      setShowSelector(true);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const t = TRANSLATIONS[locale];

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, showSelector, setShowSelector }}>
      {children}
    </I18nContext.Provider>
  );
}
