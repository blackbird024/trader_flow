import type { Trade } from "../types";
import { tradePnl } from "../lib/stats";
import { formatCurrency } from "../lib/format";

interface TradesTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

export function TradesTable({ trades, onEdit, onDelete }: TradesTableProps) {
  if (trades.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-8 text-center text-sm text-[var(--text-muted)]">
        No hay operaciones registradas todavía. Agrega una o importa un CSV.
      </div>
    );
  }

  const sorted = [...trades].sort((a, b) => b.exitDate.localeCompare(a.exitDate));

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-1)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-4 py-3 font-medium">Símbolo</th>
            <th className="px-4 py-3 font-medium">Lado</th>
            <th className="px-4 py-3 font-medium">Cantidad</th>
            <th className="px-4 py-3 font-medium">Entrada</th>
            <th className="px-4 py-3 font-medium">Salida</th>
            <th className="px-4 py-3 font-medium">Fecha salida</th>
            <th className="px-4 py-3 text-right font-medium">P&amp;L</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((trade) => {
            const pnl = tradePnl(trade);
            const isWin = pnl >= 0;
            return (
              <tr key={trade.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3 font-medium">{trade.symbol}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                      trade.side === "long"
                        ? "bg-[var(--status-good)]/10 text-[var(--status-good)]"
                        : "bg-[var(--status-critical)]/10 text-[var(--status-critical)]"
                    }`}
                  >
                    {trade.side === "long" ? "Largo" : "Corto"}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums">{trade.quantity}</td>
                <td className="px-4 py-3 tabular-nums">{trade.entryPrice}</td>
                <td className="px-4 py-3 tabular-nums">{trade.exitPrice}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{trade.exitDate}</td>
                <td
                  className={`px-4 py-3 text-right tabular-nums font-medium ${
                    isWin ? "text-[var(--status-good)]" : "text-[var(--status-critical)]"
                  }`}
                >
                  {formatCurrency(pnl)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onEdit(trade)}
                    className="mr-2 text-xs font-medium text-[var(--series-1)] hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(trade.id)}
                    className="text-xs font-medium text-[var(--status-critical)] hover:underline"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
