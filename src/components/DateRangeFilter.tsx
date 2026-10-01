import { DATE_RANGE_OPTIONS, type DateRangePreset } from "../lib/dateRange";

interface DateRangeFilterProps {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por rango de fechas"
      className="inline-flex rounded border border-[var(--border)] p-0.5"
    >
      {DATE_RANGE_OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-[var(--series-1)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
