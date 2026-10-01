import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyPnl } from "../lib/stats";
import { chartColors } from "../lib/chartColors";
import { formatCurrency } from "../lib/format";
import type { ResolvedTheme } from "../hooks/useTheme";

interface MonthlyPnlChartProps {
  data: MonthlyPnl[];
  theme: ResolvedTheme;
}

function MonthlyTooltip({
  active,
  payload,
  colors,
}: {
  active?: boolean;
  payload?: Array<{ payload: MonthlyPnl }>;
  colors: ReturnType<typeof chartColors>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-sm"
      style={{ background: colors.surface, borderColor: colors.gridline, color: colors.textSecondary }}
    >
      <div className="font-medium">{point.label}</div>
      <div className="tabular-nums" style={{ color: point.pnl >= 0 ? colors.good : colors.critical }}>
        {formatCurrency(point.pnl)}
      </div>
      <div style={{ color: colors.textMuted }}>{point.trades} operaciones</div>
    </div>
  );
}

export function MonthlyPnlChart({ data, theme }: MonthlyPnlChartProps) {
  const colors = chartColors(theme);

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-[var(--text-muted)]">
        Sin operaciones todavía.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={colors.gridline} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: colors.textMuted, fontSize: 11 }}
          axisLine={{ stroke: colors.gridline }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: colors.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v)}
          width={72}
        />
        <Tooltip cursor={{ fill: colors.gridline, opacity: 0.4 }} content={<MonthlyTooltip colors={colors} />} />
        <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((entry) => (
            <Cell key={entry.month} fill={entry.pnl >= 0 ? colors.good : colors.critical} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
