import { useState, useId } from "react";
import { cn } from "../../lib/cn";

/**
 * Tooltip ligero y accesible.
 * Aparece al pasar el ratón (desktop), al enfocar con teclado y al tocar (móvil).
 */
export function Tooltip({ label, children, side = "top", className }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            "pointer-events-none absolute z-50 w-max max-w-[220px] rounded-xl bg-ink-800 px-3 py-2 text-center text-xs font-medium leading-snug text-white shadow-lg",
            side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
            side === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2",
            className
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
