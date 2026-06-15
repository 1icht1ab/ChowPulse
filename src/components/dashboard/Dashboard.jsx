import { Plus, PawPrint, HeartHandshake } from "lucide-react";
import { HouseholdSwitcher } from "./HouseholdSwitcher";
import { PetCard } from "./PetCard";
import { LanguageSelector } from "../ui/LanguageSelector";
import { Tooltip } from "../ui/Tooltip";
import { useTranslation } from "../../i18n/useTranslation";

/** Vista general: saludo, modo cuidador, selector de idioma, selector de Hogar y grid de mascotas. */
export function Dashboard({ households, householdId, onHouseholdChange, pets, selectedPetId, onSelectPet }) {
  const { t } = useTranslation();

  return (
    <section>
      {/* ===== Header principal ===== */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-500">
              <PawPrint className="h-4 w-4" /> {t("dashboard.greeting")}
            </p>
            <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-ink-800 sm:text-3xl">
              {t("dashboard.title")}
            </h1>
          </div>

          {/* Indicador de Modo Cuidador + Selector de idioma (ES / EN) */}
          <div className="flex items-center gap-2">
            <Tooltip label={t("caregiverMode.hint")}>
              <span className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 ring-1 ring-inset ring-brand-100 sm:inline-flex">
                <HeartHandshake className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-semibold text-brand-700">{t("caregiverMode.label")}</span>
              </span>
            </Tooltip>
            <LanguageSelector />
          </div>
        </div>

        <HouseholdSwitcher households={households} value={householdId} onChange={onHouseholdChange} />
      </div>

      {/* ===== Grid de mascotas ===== */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-400">
          {t("dashboard.petsInHousehold")}
          <span className="rounded-full bg-cta-100 px-2 py-0.5 text-xs font-bold text-cta-700">{pets.length}</span>
        </h2>
        {/* Acceso rápido con micro-interacción */}
        <button
          type="button"
          aria-label={t("a11y.addPet")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-cta-500 text-white shadow-md shadow-cta-500/30 transition-transform hover:rotate-90 hover:bg-cta-600 focus-visible:ring-2 focus-visible:ring-cta-400"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            selected={pet.id === selectedPetId}
            onSelect={(p) => onSelectPet(p.id)}
          />
        ))}

        {/* Tarjeta para añadir mascota (CTA naranja) */}
        <button
          type="button"
          className="flex min-h-[14rem] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-cta-200 bg-cta-50/40 p-6 text-cta-600 transition hover:border-cta-300 hover:bg-cta-50 focus-visible:ring-2 focus-visible:ring-cta-400"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cta-500 text-white shadow-lg shadow-cta-500/30">
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <span className="font-bold">{t("dashboard.addPet")}</span>
          <span className="text-center text-xs text-cta-500/80">{t("dashboard.addPetSub")}</span>
        </button>
      </div>
    </section>
  );
}
