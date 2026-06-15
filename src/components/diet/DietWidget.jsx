import { Utensils, Scale, Clock, Soup, Lightbulb } from "lucide-react";
import { SegmentedBar } from "./SegmentedBar";
import { HelpPopover } from "../ui/HelpPopover";
import { Badge } from "../ui/Badge";
import { useTranslation } from "../../i18n/useTranslation";
import { dietTypeLabel } from "../../lib/format";

// Colores de cada componente, tomados de la paleta de marca (las etiquetas se traducen).
const SEG_COLOR = {
  muscle: "#f4701f", // naranja
  bone: "#9ba9c9", // azul marino claro
  organs: "#6d45d0", // púrpura
  veg: "#5fe0c6", // teal claro
  kibble: "#14a88f", // teal
};

/** Widget nutricional: dieta activa de la mascota + desglose visual + ayuda empática (bilingüe). */
export function DietWidget({ pet }) {
  const { t } = useTranslation();
  const diet = pet.diet;
  const perMeal = Math.round(diet.daily_grams / diet.meals_per_day);
  const hasBreakdown = Array.isArray(diet.composition) && diet.composition.length > 0;

  const segments = hasBreakdown
    ? diet.composition.map((c) => ({
        key: c.key,
        label: t(`diet.segments.${c.key}`),
        color: SEG_COLOR[c.key],
        pct: c.pct,
        grams: Math.round((diet.daily_grams * c.pct) / 100),
      }))
    : [];

  const ariaLabel = t("diet.ariaComposition", {
    list: segments.map((s) => `${s.label} ${s.pct}%`).join(", "),
  });

  return (
    <article className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
      {/* Cabecera */}
      <header className="flex items-start justify-between gap-3 border-b border-ink-100 bg-gradient-to-br from-cta-50 to-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cta-500 text-white shadow-lg shadow-cta-500/30">
            <Utensils className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-ink-800">{t("diet.title")}</h3>
            <p className="text-sm text-ink-400">{t("diet.activeOf", { name: pet.name })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="cta">{dietTypeLabel(diet.type, t)}</Badge>
          <HelpPopover title={hasBreakdown ? t("diet.help.titleBreakdown") : t("diet.help.titleSimple")}>
            {hasBreakdown ? (
              <>
                <p>{t("diet.help.barfMeaning")}</p>
                <ul className="space-y-1">
                  <li>🟠 {t("diet.help.muscle")}</li>
                  <li>🔵 {t("diet.help.bone")}</li>
                  <li>🟣 {t("diet.help.organs")}</li>
                  <li>🟢 {t("diet.help.vegKibble")}</li>
                </ul>
                <p className="rounded-xl bg-cta-50 p-2.5 text-cta-700">
                  <strong>{t("diet.help.howToServe")}</strong>
                  {t("diet.help.howToServeText", { meals: diet.meals_per_day })}
                </p>
              </>
            ) : (
              <p>{t("diet.help.simple", { grams: perMeal })}</p>
            )}
          </HelpPopover>
        </div>
      </header>

      <div className="space-y-5 p-5">
        {/* Cifras clave */}
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Scale} label={t("diet.totalDaily")} value={`${diet.daily_grams} g`} />
          <Stat icon={Clock} label={t("diet.mealsPerDay")} value={diet.meals_per_day} />
          <Stat icon={Soup} label={t("diet.perMeal")} value={`${perMeal} g`} />
        </div>

        {/* Desglose visual o vista simple */}
        {hasBreakdown ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-ink-700">{t("diet.composition")}</h4>
              <span className="text-xs text-ink-400">{t("diet.over", { grams: diet.daily_grams })}</span>
            </div>
            <SegmentedBar segments={segments} ariaLabel={ariaLabel} />
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl bg-health-50 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-health-600" />
            <p className="text-sm text-health-700">{t("diet.simpleNote", { grams: perMeal })}</p>
          </div>
        )}

        {/* Tip empático dinámico */}
        {hasBreakdown && (
          <div className="flex items-start gap-3 rounded-2xl border border-brand-100/70 bg-brand-50 p-4">
            <span className="text-lg leading-none">💡</span>
            <p className="text-xs font-medium leading-relaxed text-ink-600">
              <strong className="text-brand-700">{t("diet.tipForPet", { name: pet.name })}</strong>
              {t("diet.tipSplit", { meals: diet.meals_per_day })}
              {diet.type === "barf" ? t("diet.tipBarf") : t("diet.tipMixed")}
            </p>
          </div>
        )}

        {/* Micro-copy de cierre, cálido y tranquilizador */}
        <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-400">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta-400" />
          {t("diet.closing", { name: pet.name })}
        </p>
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-ink-400" />
      <p className="mt-1 text-lg font-extrabold leading-none text-ink-800">{value}</p>
      <p className="mt-1 text-[0.7rem] font-medium text-ink-400">{label}</p>
    </div>
  );
}
