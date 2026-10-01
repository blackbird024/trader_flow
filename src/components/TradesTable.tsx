import { useMemo, useState } from "react";
import type { Trade } from "../types";
import { tradePnl } from "../lib/stats";
import { formatCurrency } from "../lib/format";

interface TradesTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

type SortKey = "symbol" | "side" | "quantity" | "entryPrice" | "exitPrice" | "exitDate" | "pnl";
type SortDirection = "asc" | "desc";

const COLUMNS: Array<{ key: SortKey; label: string; align?: "right" }> = [
  { key: "symbol", label: "Símbolo" },
  { key: "side", label: "Lado" },
  { key: "quantity", label: "Cantidad" },
  { key: "entryPrice", label: "Entrada" },
  { key: "exitPrice", label: "Salida" },
  { key: "exitDate", label: "Fecha salida" },
  { key: "pnl", label: "P&L", align: "right" },
];

function sortValue(trade: Trade, key: SortKey): string | number {
  if (key === "pnl") return tradePnl(trade);
  return trade[key];
}

export function TradesTable({ trades, onEdit, onDelete }: TradesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("exitDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sorted = useMemo(() => {
    const copy = [...trades];
    copy.sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [trades, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection(key === "exitDate" ? "desc" : "asc");
    }
  }

  if (trades.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-8 text-center text-sm text-[var(--text-muted)]">
        No hay operaciones en este rango. Agrega una, importa un CSV o cambia el filtro de fechas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-1)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {COLUMNS.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-medium ${col.align === "right" ? "text-right" : ""}`}>
                <button
                  type="button"
                  onClick={() => handleSort(col.key)}
                  className={`inline-flex items-center gap-1 hover:text-[var(--text-secondary)] ${
                    col.align === "right" ? "flex-row-reverse" : ""
                  }`}
                  aria-label={`Ordenar por ${col.label}`}
                >
                  {col.label}
                  {sortKey === col.key && <span aria-hidden="true">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </button>
              </th>
            ))}
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
