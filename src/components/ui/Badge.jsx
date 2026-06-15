import { cn } from "../../lib/cn";

const tones = {
  health: "bg-health-50 text-health-700 ring-health-200",
  cta: "bg-cta-50 text-cta-700 ring-cta-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  ink: "bg-ink-50 text-ink-600 ring-ink-200",
};

/** Píldora de estado: vacuna pendiente, al día, público, rol, etc. */
export function Badge({ children, tone = "ink", icon: Icon, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />}
      {children}
    </span>
  );
}
