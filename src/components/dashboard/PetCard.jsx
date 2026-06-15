import { Globe, Lock, Syringe, Stethoscope, Bug, Check } from "lucide-react";
import { SpeciesIcon } from "../icons/SpeciesIcon";
import { Badge } from "../ui/Badge";
import { Tooltip } from "../ui/Tooltip";
import { cn } from "../../lib/cn";
import { useTranslation } from "../../i18n/useTranslation";
import { speciesLabel, ageLabel, speciesColor } from "../../lib/format";

const ALERT_ICON = { vaccine: Syringe, checkup: Stethoscope, deworming: Bug };

/** Tarjeta de mascota: foto, especie (icono geométrico), perfil público y alertas rápidas. */
export function PetCard({ pet, selected, onSelect }) {
  const { t } = useTranslation();
  const publicLabel = pet.is_public ? t("pet.publicProfile") : t("pet.privateProfile");

  return (
    <button
      type="button"
      onClick={() => onSelect?.(pet)}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-3xl border bg-white text-left transition focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
        selected
          ? "border-brand-400 shadow-lg ring-2 ring-brand-200"
          : "border-ink-100 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
      )}
    >
      {/* Foto + indicadores superpuestos */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-ink-50">
        {pet.avatar_url ? (
          <img
            src={pet.avatar_url}
            alt={pet.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-ink-50">
            <SpeciesIcon species={pet.species} className={cn("h-20 w-20", speciesColor(pet.species))} />
          </span>
        )}

        {/* Indicador de perfil público */}
        <span className="absolute right-3 top-3">
          <Tooltip label={publicLabel}>
            <span
              aria-label={publicLabel}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur",
                pet.is_public ? "bg-brand-600/90 text-white" : "bg-white/85 text-ink-400"
              )}
            >
              {pet.is_public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </span>
          </Tooltip>
        </span>

        {/* Chip de especie con icono kawaii */}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur">
          <SpeciesIcon species={pet.species} className={cn("h-4 w-4", speciesColor(pet.species))} />
          <span className="text-xs font-semibold text-ink-700">{speciesLabel(pet.species, t)}</span>
        </span>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-extrabold leading-tight text-ink-800">{pet.name}</h3>
          <p className="truncate text-sm text-ink-400">
            {pet.breed} · {ageLabel(pet.birth_date, t)}
          </p>
        </div>

        {/* Alertas rápidas */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {pet.alerts?.length ? (
            pet.alerts.map((a) => (
              <Badge key={a.type} tone="cta" icon={ALERT_ICON[a.type] || Syringe}>
                {t(`alerts.${a.type}`, { days: a.days })}
              </Badge>
            ))
          ) : (
            <Badge tone="health" icon={Check}>
              {t("pet.allGood")}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
