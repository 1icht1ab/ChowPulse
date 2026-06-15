// Helpers de presentación alineados con el esquema de Supabase.
// Reciben la función de traducción `t` para ser independientes del idioma.

// La edad se DERIVA de birth_date (nunca se guarda un número que envejece solo).
export function ageLabel(birth, t) {
  if (!birth) return t("age.unknown");
  const b = new Date(birth);
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  let months = now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const y = `${years} ${t(years === 1 ? "age.year" : "age.years")}`;
  const m = `${months} ${t(months === 1 ? "age.month" : "age.months")}`;
  if (years <= 0) return m;
  if (months === 0) return y;
  return `${y} ${t("age.and")} ${m}`;
}

export const speciesLabel = (s, t) => t(`species.${s}`);

export const dietTypeLabel = (type, t) => t(`diet.types.${type}`);

// Color de marca asociado a cada especie (para los iconos geométricos).
export const speciesColor = (s) =>
  ({ dog: "text-cta-500", cat: "text-brand-500", turtle: "text-health-500" }[s] || "text-ink-400");

// Token aleatorio no adivinable para la URL pública (espejo del trigger SQL).
export const genSlug = () => Math.random().toString(36).slice(2, 10);
