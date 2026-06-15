import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

/**
 * Contexto de idioma nativo (sin librerías externas).
 * Guarda la preferencia en localStorage y sincroniza <html lang="..">.
 */
const LanguageContext = createContext(null);

const STORAGE_KEY = "chowpulse:lang";
const SUPPORTED = ["es", "en"];

function detectInitialLang() {
  if (typeof window === "undefined") return "es";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (window.navigator.language || "es").slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : "es";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  const setLang = useCallback((next) => {
    if (!SUPPORTED.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* almacenamiento no disponible: el cambio igual aplica en memoria */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "es" ? "en" : "es";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  // Mantiene el atributo lang del documento en sintonía (accesibilidad / SEO).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  return ctx;
}
