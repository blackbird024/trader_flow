import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EquityPoint } from "../lib/stats";
import { chartColors } from "../lib/chartColors";
import { formatCurrency } from "../lib/format";
import type { ResolvedTheme } from "../hooks/useTheme";

interface EquityChartProps {
  data: EquityPoint[];
  theme: ResolvedTheme;
}

function EquityTooltip({
  active,
  payload,
  colors,
}: {
  active?: boolean;
  payload?: Array<{ payload: EquityPoint }>;
  colors: ReturnType<typeof chartColors>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const isGain = point.tradePnl >= 0;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-sm"
      style={{ background: colors.surface, borderColor: colors.gridline, color: colors.textSecondary }}
    >
      <div className="font-medium" style={{ color: colors.textSecondary }}>
        {point.date}
      </div>
      <div className="mt-1 tabular-nums" style={{ color: isGain ? colors.good : colors.critical }}>
        Operación: {formatCurrency(point.tradePnl)}
      </div>
      <div className="tabular-nums" style={{ color: colors.textSecondary }}>
        Acumulado: {formatCurrency(point.cumulativePnl)}
      </div>
    </div>
  );
}

export function EquityChart({ data, theme }: EquityChartProps) {
  const colors = chartColors(theme);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-muted)]">
        Sin operaciones cerradas todavía.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={colors.gridline} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: colors.textMuted, fontSize: 11 }}
          axisLine={{ stroke: colors.gridline }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: colors.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v)}
          width={80}
        />
        <Tooltip
          cursor={{ stroke: colors.textMuted, strokeDasharray: "3 3" }}
          content={<EquityTooltip colors={colors} />}
        />
        <Line
          type="monotone"
          dataKey="cumulativePnl"
          stroke={colors.series1}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
