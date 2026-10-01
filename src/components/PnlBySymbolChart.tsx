import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SymbolPnl } from "../lib/stats";
import { chartColors } from "../lib/chartColors";
import { formatCurrency } from "../lib/format";
import type { ResolvedTheme } from "../hooks/useTheme";

interface PnlBySymbolChartProps {
  data: SymbolPnl[];
  theme: ResolvedTheme;
}

function SymbolTooltip({
  active,
  payload,
  colors,
}: {
  active?: boolean;
  payload?: Array<{ payload: SymbolPnl }>;
  colors: ReturnType<typeof chartColors>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-sm"
      style={{ background: colors.surface, borderColor: colors.gridline, color: colors.textSecondary }}
    >
      <div className="font-medium">{point.symbol}</div>
      <div className="tabular-nums" style={{ color: point.pnl >= 0 ? colors.good : colors.critical }}>
        {formatCurrency(point.pnl)}
      </div>
      <div style={{ color: colors.textMuted }}>{point.trades} operaciones</div>
    </div>
  );
}

export function PnlBySymbolChart({ data, theme }: PnlBySymbolChartProps) {
  const colors = chartColors(theme);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-muted)]">
        Sin operaciones todavía.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
        <XAxis
          type="number"
          tick={{ fill: colors.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v)}
        />
        <YAxis
          type="category"
          dataKey="symbol"
          tick={{ fill: colors.textSecondary, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <Tooltip cursor={{ fill: colors.gridline, opacity: 0.4 }} content={<SymbolTooltip colors={colors} />} />
        <Bar dataKey="pnl" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry) => (
            <Cell key={entry.symbol} fill={entry.pnl >= 0 ? colors.good : colors.critical} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
