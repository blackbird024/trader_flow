interface StatCardProps {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "critical";
  sublabel?: string;
}

const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  neutral: "text-[var(--text-primary)]",
  good: "text-[var(--status-good)]",
  critical: "text-[var(--status-critical)]",
};

export function StatCard({ label, value, tone = "neutral", sublabel }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <div className="truncate text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>
      <div
        title={value}
        className={`mt-1 truncate tabular-nums text-xl font-semibold sm:text-2xl ${toneClass[tone]}`}
      >
        {value}
      </div>
      {sublabel && <div className="mt-1 truncate text-xs text-[var(--text-secondary)]">{sublabel}</div>}
    </div>
  );
}
