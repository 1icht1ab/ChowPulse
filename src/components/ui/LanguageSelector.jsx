import { Languages } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";
import { LANGUAGES } from "../../i18n/translations";
import { cn } from "../../lib/cn";

/**
 * Selector de idioma tipo píldora segmentada (ES / EN) con indicador deslizante.
 * Minimalista y geométrico; el cambio es instantáneo (vía contexto, sin recargar).
 */
export function LanguageSelector() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white p-1 shadow-sm"
    >
      <Languages className="ml-1 h-4 w-4 text-brand-400" strokeWidth={2.2} aria-hidden="true" />
      <div className="relative flex">
        {/* Indicador deslizante */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 rounded-full bg-brand-600 shadow transition-transform duration-300 ease-out",
            lang === "en" && "translate-x-full"
          )}
        />
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            aria-label={t("lang.switchTo", { lang: t(`lang.${l.code}`) })}
            className={cn(
              "relative z-10 w-10 rounded-full px-2 py-1 text-xs font-bold transition-colors duration-200",
              lang === l.code ? "text-white" : "text-ink-500 hover:text-ink-700"
            )}
          >
            {l.short}
          </button>
        ))}
      </div>
    </div>
  );
}
