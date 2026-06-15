import { useState } from "react";
import { LifeBuoy, X, MousePointerClick, ShieldCheck, Utensils } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

/** Botón flotante de ayuda global (?). Tono empático para usuarios no técnicos (bilingüe). */
export function FloatingHelp() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={t("floatingHelp.title")}
          className="animate-fadeIn fixed bottom-40 right-4 z-50 w-[18rem] rounded-3xl border border-ink-100 bg-white p-5 shadow-2xl ring-1 ring-black/5 lg:bottom-24 lg:right-6"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{t("floatingHelp.eyebrow")}</p>
              <h4 className="text-base font-extrabold text-ink-800">{t("floatingHelp.title")}</h4>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t("floatingHelp.close")}
              className="rounded-lg p-1 text-ink-300 transition hover:bg-ink-50 hover:text-ink-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="space-y-3 text-sm text-ink-500">
            <li className="flex gap-2.5">
              <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {t("floatingHelp.item1")}
            </li>
            <li className="flex gap-2.5">
              <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-cta-500" />
              {t("floatingHelp.item2")}
            </li>
            <li className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-health-500" />
              {t("floatingHelp.item3")}
            </li>
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("floatingHelp.open")}
        aria-expanded={open}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cta-500 text-white shadow-xl shadow-cta-500/30 transition hover:bg-cta-600 focus-visible:ring-4 focus-visible:ring-cta-300 lg:bottom-6 lg:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <LifeBuoy className="h-6 w-6" strokeWidth={2.2} />}
      </button>
    </>
  );
}
