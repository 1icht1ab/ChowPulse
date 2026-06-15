import { useState, useRef, useEffect, useId } from "react";
import { HelpCircle, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Cuadro de ayuda "?" — pensado para personas poco familiarizadas con la tecnología.
 * Botón redondo morado que despliega una tarjeta con título + explicación clara y empática.
 * Se cierra al hacer clic fuera o con la tecla Escape.
 */
export function HelpPopover({ title, children, label = "Más ayuda", align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1"
      >
        <HelpCircle className="h-4 w-4" strokeWidth={2.4} />
      </button>

      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={title}
          className={cn(
            "animate-fadeIn absolute top-full z-50 mt-2 w-72 rounded-2xl border border-ink-100 bg-white p-4 text-left shadow-xl ring-1 ring-black/5",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="mb-1.5 flex items-start justify-between gap-3">
            <h4 className="text-sm font-extrabold text-ink-800">{title}</h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar ayuda"
              className="-mr-1 -mt-1 rounded-lg p-1 text-ink-300 transition hover:bg-ink-50 hover:text-ink-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm leading-relaxed text-ink-500">{children}</div>
        </div>
      )}
    </span>
  );
}
