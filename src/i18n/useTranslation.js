import { useCallback } from "react";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";

// Resuelve una clave con notación de punto: get(obj, "diet.help.muscle")
function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

// Reemplaza {placeholders} por sus valores.
function interpolate(str, vars) {
  if (typeof str !== "string" || !vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, key) => (vars[key] != null ? String(vars[key]) : match));
}

/**
 * Hook personalizado de traducción.
 * @returns { t, lang, setLang, toggleLang }
 *   t("dashboard.title")                  -> texto del idioma actual
 *   t("alerts.vaccine", { days: 5 })      -> interpolación de variables
 * Si falta la clave en el idioma activo, hace fallback a 'es' y, si no, a la propia clave.
 */
export function useTranslation() {
  const { lang, setLang, toggleLang } = useLanguage();

  const t = useCallback(
    (key, vars) => {
      const value = resolve(translations[lang], key) ?? resolve(translations.es, key) ?? key;
      return interpolate(value, vars);
    },
    [lang]
  );

  return { t, lang, setLang, toggleLang };
}
