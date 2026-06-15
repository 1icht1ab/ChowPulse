import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, Check, Home, ShieldCheck, PencilLine, Eye, Users } from "lucide-react";
import { HelpPopover } from "../ui/HelpPopover";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/cn";
import { useTranslation } from "../../i18n/useTranslation";

// Metadatos visuales por rol (el texto se traduce vía i18n).
const ROLE_META = {
  owner: { icon: ShieldCheck, tone: "brand" },
  caregiver: { icon: PencilLine, tone: "cta" },
  viewer: { icon: Eye, tone: "ink" },
};
const ROLE_ORDER = ["owner", "caregiver", "viewer"];

/** Selector de Hogar (presentacional): la lista llega por props desde App. */
export function HouseholdSwitcher({ households, value, onChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = households.find((h) => h.id === value) || households[0];
  const currentRole = ROLE_META[current?.role] ?? ROLE_META.caregiver;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!current) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full min-w-[15rem] items-center gap-3 rounded-2xl border border-ink-100 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-brand-200 focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Home className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">
              {t("household.activeLabel")}
            </span>
            <span className="block truncate font-bold text-ink-800">{current.name}</span>
          </span>
          <span className="hidden sm:block">
            <Badge tone={currentRole.tone} icon={currentRole.icon}>
              {t(`household.roles.${current.role}`)}
            </Badge>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-ink-400" />
        </button>

        {open && (
          <ul
            role="listbox"
            className="animate-fadeIn absolute left-0 top-full z-40 mt-2 w-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5"
          >
            {households.map((h) => {
              const activeItem = h.id === value;
              return (
                <li key={h.id} role="option" aria-selected={activeItem}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(h.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition",
                      activeItem ? "bg-brand-50" : "hover:bg-ink-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        activeItem ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"
                      )}
                    >
                      <Home className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink-800">{h.name}</span>
                      <span className="flex items-center gap-1 text-xs text-ink-400">
                        <Users className="h-3 w-3" />
                        {h.members != null ? `${t("household.members", { count: h.members })} · ` : ""}
                        {t(`household.roles.${h.role}`)}
                      </span>
                    </span>
                    {activeItem && <Check className="h-4 w-4 text-brand-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <HelpPopover title={t("household.help.title")} align="left">
        <p>{t("household.help.intro")}</p>
        <ul className="space-y-1.5">
          {ROLE_ORDER.map((role) => {
            const Icon = ROLE_META[role].icon;
            return (
              <li key={role} className="flex gap-2">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <span>
                  <strong className="text-ink-700">{t(`household.roles.${role}`)}:</strong>{" "}
                  {t(`household.roleDesc.${role}`)}
                </span>
              </li>
            );
          })}
        </ul>
      </HelpPopover>
    </div>
  );
}
