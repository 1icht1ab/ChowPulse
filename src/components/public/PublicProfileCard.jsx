import { useState } from "react";
import { Globe, Lock, Link2, Check, Copy, Sparkles, ShieldCheck } from "lucide-react";
import { SpeciesIcon } from "../icons/SpeciesIcon";
import { Switch } from "../ui/Switch";
import { HelpPopover } from "../ui/HelpPopover";
import { cn } from "../../lib/cn";
import { useTranslation } from "../../i18n/useTranslation";
import { speciesLabel, ageLabel, speciesColor } from "../../lib/format";

const PUBLIC_BASE = "https://chowpulse.app/p/";

/** Vista previa del perfil público + copiar enlace + switch de visibilidad (bilingüe). */
export function PublicProfileCard({ pet, onToggle }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const isPublic = pet.is_public;
  const url = pet.public_slug ? `${PUBLIC_BASE}${pet.public_slug}` : `${PUBLIC_BASE}…`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* el navegador puede bloquear el portapapeles; el feedback visual igual se muestra */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
      {/* Cabecera con switch de visibilidad */}
      <header className="flex items-start justify-between gap-3 border-b border-ink-100 bg-gradient-to-br from-brand-50 to-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <Globe className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="flex items-center gap-2 text-base font-extrabold text-ink-800">
              {t("publicProfile.title")}
              <HelpPopover title={t("publicProfile.help.title")}>
                <p>{t("publicProfile.help.intro", { name: pet.name })}</p>
                <ul className="space-y-1">
                  <li>✅ {t("publicProfile.help.item1")}</li>
                  <li>✅ {t("publicProfile.help.item2")}</li>
                </ul>
                <p className="flex items-start gap-2 rounded-xl bg-health-50 p-2.5 text-health-700">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t("publicProfile.help.privacyNote")}</span>
                </p>
              </HelpPopover>
            </h3>
            <p className="text-sm text-ink-400">
              {isPublic ? t("publicProfile.visiblePublic") : t("publicProfile.visiblePrivate")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Switch
            checked={isPublic}
            onChange={(v) => onToggle?.(pet.id, v)}
            label={t("publicProfile.toggleLabel")}
            tone="brand"
          />
          <span className={cn("text-xs font-semibold", isPublic ? "text-brand-600" : "text-ink-400")}>
            {isPublic ? t("publicProfile.public") : t("publicProfile.private")}
          </span>
        </div>
      </header>

      <div className="p-5">
        {/* Recordatorio de privacidad — alinea la UI con el backend:
            get_public_pet() jamás expone historial médico ni dietas. */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-health-50 px-3 py-2 text-xs font-medium text-health-700 ring-1 ring-inset ring-health-200">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          {t("publicProfile.privacyStrip")}
        </div>

        {/* Vista previa (cómo lo ve el público) */}
        <div className="relative">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
            {t("publicProfile.preview")}
          </p>
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-ink-100 bg-cream transition",
              !isPublic && "opacity-40 grayscale"
            )}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
                {pet.avatar_url ? (
                  <img src={pet.avatar_url} alt={pet.name} className="h-full w-full object-cover" />
                ) : (
                  <SpeciesIcon species={pet.species} className={cn("h-12 w-12", speciesColor(pet.species))} />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xl font-extrabold text-ink-800">{pet.name}</h4>
                  <Sparkles className="h-4 w-4 text-cta-400" />
                </div>
                <p className="text-sm text-ink-500">
                  {speciesLabel(pet.species, t)} · {pet.breed}
                </p>
                <p className="text-xs text-ink-400">{ageLabel(pet.birth_date, t)}</p>
              </div>
            </div>
            {pet.bio && <p className="px-4 pb-2 text-sm leading-relaxed text-ink-500">{pet.bio}</p>}
            {pet.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                {pet.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-health-50 px-2.5 py-1 text-xs font-semibold text-health-700 ring-1 ring-inset ring-health-200"
                  >
                    🐾 {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Capa cuando está en privado */}
          {!isPublic && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-fadeIn flex items-center gap-2 rounded-full bg-ink-800/90 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                <Lock className="h-4 w-4" /> {t("publicProfile.inPrivate")}
              </span>
            </div>
          )}
        </div>

        {/* Enlace + copiar */}
        <div className="mt-5">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-400">
            <Link2 className="h-3.5 w-3.5" /> {t("publicProfile.shareLink")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={url}
              aria-label={t("publicProfile.shareLink")}
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 truncate rounded-xl border border-ink-100 bg-ink-50 px-3 py-2.5 text-sm text-ink-500 focus-visible:ring-2 focus-visible:ring-brand-300"
            />
            <button
              type="button"
              onClick={copyLink}
              disabled={!isPublic}
              className={cn(
                "flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold text-white shadow-lg transition focus-visible:ring-2 focus-visible:ring-offset-2",
                copied
                  ? "bg-health-500 shadow-health-500/30 focus-visible:ring-health-400"
                  : "bg-cta-500 shadow-cta-500/30 hover:bg-cta-600 focus-visible:ring-cta-400",
                !isPublic && "cursor-not-allowed opacity-50 shadow-none"
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t("publicProfile.copied") : t("publicProfile.copy")}
            </button>
          </div>
          {/* Feedback accesible para lectores de pantalla */}
          <span aria-live="polite" className="sr-only">
            {copied ? t("publicProfile.copiedSr") : ""}
          </span>
          {!isPublic && <p className="mt-2 text-xs text-ink-400">{t("publicProfile.activateToShare")}</p>}
        </div>
      </div>
    </article>
  );
}
