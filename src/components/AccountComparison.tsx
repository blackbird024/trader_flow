import type { AccountBreakdown } from "../lib/stats";
import { formatCurrency, formatNumber, formatPercent } from "../lib/format";

interface AccountComparisonProps {
  breakdown: AccountBreakdown[];
  onSelect: (accountId: string) => void;
}

export function AccountComparison({ breakdown, onSelect }: AccountComparisonProps) {
  if (breakdown.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-8 text-center text-sm text-[var(--text-muted)]">
        Todavía no tenés cuentas. Agregá una desde el selector de arriba.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-1)]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-4 py-3 font-medium">Cuenta</th>
            <th className="px-4 py-3 text-right font-medium">Operaciones</th>
            <th className="px-4 py-3 text-right font-medium">Win rate</th>
            <th className="px-4 py-3 text-right font-medium">Profit factor</th>
            <th className="px-4 py-3 text-right font-medium">P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map(({ account, stats }) => (
            <tr key={account.id} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => onSelect(account.id)}
                  className="text-left hover:underline"
                  title="Ver solo esta cuenta"
                >
                  {account.name}
                </button>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{stats.totalTrades}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {stats.totalTrades > 0 ? formatPercent(stats.winRate) : "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {stats.profitFactor === null ? "—" : formatNumber(stats.profitFactor)}
              </td>
              <td
                className={`px-4 py-3 text-right tabular-nums font-medium ${
                  stats.totalPnl >= 0 ? "text-[var(--status-good)]" : "text-[var(--status-critical)]"
                }`}
              >
                {formatCurrency(stats.totalPnl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
