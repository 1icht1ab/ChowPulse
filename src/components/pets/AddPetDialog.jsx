import { useState, useEffect } from "react";
import { X, PawPrint, Loader2 } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";
import { cn } from "../../lib/cn";

const SPECIES = ["dog", "cat", "reptile", "bird", "rabbit", "fish", "other"];
const SEXES = ["male", "female", "unknown"];
const inputCls =
  "w-full rounded-xl border border-ink-100 bg-ink-50 px-3 py-2 text-sm text-ink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-400">
        {label}
        {required && <span className="text-cta-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const EMPTY = { name: "", species: "dog", breed: "", sex: "unknown", birth_date: "", bio: "", avatar_url: "" };

/** Modal para añadir una mascota. `onSubmit(values)` hace la inserción (real o mock) en App. */
export function AddPetDialog({ open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        breed: form.breed || null,
        bio: form.bio || null,
        avatar_url: form.avatar_url || null,
        birth_date: form.birth_date || null,
      });
      setForm(EMPTY);
      onClose();
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <div
        role="dialog"
        aria-label={t("addPetForm.title")}
        className="animate-fadeIn max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cta-500 text-white">
              <PawPrint className="h-4 w-4" strokeWidth={2.4} />
            </span>
            {t("addPetForm.title")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("addPetForm.cancel")}
            className="rounded-lg p-1 text-ink-300 transition hover:bg-ink-50 hover:text-ink-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Field label={t("addPetForm.name")} required>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("addPetForm.species")}>
              <select value={form.species} onChange={(e) => set("species", e.target.value)} className={inputCls}>
                {SPECIES.map((s) => (
                  <option key={s} value={s}>
                    {t(`species.${s}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("addPetForm.sex")}>
              <select value={form.sex} onChange={(e) => set("sex", e.target.value)} className={inputCls}>
                {SEXES.map((s) => (
                  <option key={s} value={s}>
                    {t(`sex.${s}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("addPetForm.breed")}>
              <input value={form.breed} onChange={(e) => set("breed", e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("addPetForm.birthDate")}>
              <input
                type="date"
                value={form.birth_date}
                onChange={(e) => set("birth_date", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label={t("addPetForm.photoUrl")}>
            <input
              type="url"
              value={form.avatar_url}
              onChange={(e) => set("avatar_url", e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          <Field label={t("addPetForm.bio")}>
            <textarea rows={2} value={form.bio} onChange={(e) => set("bio", e.target.value)} className={cn(inputCls, "resize-none")} />
          </Field>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 font-semibold text-ink-600 transition hover:bg-ink-50 disabled:opacity-60"
            >
              {t("addPetForm.cancel")}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cta-500 px-4 py-2.5 font-bold text-white shadow-lg shadow-cta-500/30 transition hover:bg-cta-600 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("addPetForm.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
