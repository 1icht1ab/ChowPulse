/**
 * Barra plana segmentada por colores para la composición de la dieta.
 * segments: [{ key, label, pct, grams, color }]
 */
export function SegmentedBar({ segments, ariaLabel }) {
  const fallback = segments.map((s) => `${s.label} ${s.pct}%`).join(", ");

  return (
    <div>
      <div
        className="flex h-6 w-full overflow-hidden rounded-full bg-ink-100 ring-1 ring-inset ring-ink-200/60"
        role="img"
        aria-label={ariaLabel || fallback}
      >
        {segments.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.pct}% · ${s.grams} g`}
            className="h-full shrink-0 transition-[width] duration-500"
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
          />
        ))}
      </div>

      {/* Leyenda */}
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 shrink-0 rounded-md" style={{ backgroundColor: s.color }} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-tight text-ink-700">{s.label}</span>
              <span className="text-xs text-ink-400">
                {s.pct}% · {s.grams} g
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
