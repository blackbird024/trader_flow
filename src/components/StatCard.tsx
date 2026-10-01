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
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>
      <div className={`mt-1 tabular-nums text-2xl font-semibold ${toneClass[tone]}`}>{value}</div>
      {sublabel && <div className="mt-1 text-xs text-[var(--text-secondary)]">{sublabel}</div>}
    </div>
  );
}
