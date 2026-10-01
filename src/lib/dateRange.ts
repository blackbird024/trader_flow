import type { Trade } from "../types";

export type DateRangePreset = "7d" | "30d" | "90d" | "all";

export const DATE_RANGE_OPTIONS: Array<{ value: DateRangePreset; label: string }> = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "all", label: "Todo" },
];

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function filterTradesByRange(trades: Trade[], preset: DateRangePreset): Trade[] {
  if (preset === "all") return trades;
  const cutoff = preset === "7d" ? daysAgoIso(7) : preset === "30d" ? daysAgoIso(30) : daysAgoIso(90);
  return trades.filter((trade) => trade.exitDate >= cutoff);
}
