import { cn } from "../../lib/cn";

/** Interruptor accesible (role="switch", navegable por teclado). */
export function Switch({ checked, onChange, label, id, tone = "health", disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2",
        checked
          ? tone === "health"
            ? "bg-health-500 focus-visible:ring-health-400"
            : "bg-cta-500 focus-visible:ring-cta-400"
          : "bg-ink-200 focus-visible:ring-ink-300",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
