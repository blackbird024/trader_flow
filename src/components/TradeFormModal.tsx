import { useState, type FormEvent } from "react";
import type { NewTrade, Trade, TradeSide } from "../types";

interface TradeFormModalProps {
  initial?: Trade | null;
  onClose: () => void;
  onSave: (trade: NewTrade, id?: string) => void;
}

const emptyForm = {
  symbol: "",
  side: "long" as TradeSide,
  quantity: "",
  entryPrice: "",
  exitPrice: "",
  entryDate: "",
  exitDate: "",
  fees: "0",
  notes: "",
};

export function TradeFormModal({ initial, onClose, onSave }: TradeFormModalProps) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          symbol: initial.symbol,
          side: initial.side,
          quantity: String(initial.quantity),
          entryPrice: String(initial.entryPrice),
          exitPrice: String(initial.exitPrice),
          entryDate: initial.entryDate,
          exitDate: initial.exitDate,
          fees: String(initial.fees),
          notes: initial.notes ?? "",
        }
      : emptyForm,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const quantity = Number(form.quantity);
    const entryPrice = Number(form.entryPrice);
    const exitPrice = Number(form.exitPrice);
    const fees = Number(form.fees || 0);

    if (!form.symbol.trim()) return setError("El símbolo es obligatorio.");
    if ([quantity, entryPrice, exitPrice, fees].some((n) => Number.isNaN(n))) {
      return setError("Cantidad, precios y comisión deben ser números.");
    }
    if (!form.entryDate || !form.exitDate) return setError("Completa ambas fechas.");

    onSave(
      {
        symbol: form.symbol.trim().toUpperCase(),
        side: form.side,
        quantity,
        entryPrice,
        exitPrice,
        entryDate: form.entryDate,
        exitDate: form.exitDate,
        fees,
        notes: form.notes.trim() || undefined,
      },
      initial?.id,
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-5 shadow-lg">
        <h2 className="text-base font-semibold">{initial ? "Editar operación" : "Nueva operación"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-3">
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Símbolo
            <input
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              placeholder="AAPL"
            />
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Lado
            <select
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
              value={form.side}
              onChange={(e) => setForm({ ...form, side: e.target.value as TradeSide })}
            >
              <option value="long">Largo</option>
              <option value="short">Corto</option>
            </select>
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Cantidad
            <input
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm tabular-nums"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              inputMode="decimal"
            />
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Comisión
            <input
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm tabular-nums"
              value={form.fees}
              onChange={(e) => setForm({ ...form, fees: e.target.value })}
              inputMode="decimal"
            />
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Precio entrada
            <input
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm tabular-nums"
              value={form.entryPrice}
              onChange={(e) => setForm({ ...form, entryPrice: e.target.value })}
              inputMode="decimal"
            />
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Precio salida
            <input
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm tabular-nums"
              value={form.exitPrice}
              onChange={(e) => setForm({ ...form, exitPrice: e.target.value })}
              inputMode="decimal"
            />
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Fecha entrada
            <input
              type="date"
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
              value={form.entryDate}
              onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
            />
          </label>
          <label className="col-span-1 text-xs text-[var(--text-secondary)]">
            Fecha salida
            <input
              type="date"
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
              value={form.exitDate}
              onChange={(e) => setForm({ ...form, exitDate: e.target.value })}
            />
          </label>
          <label className="col-span-2 text-xs text-[var(--text-secondary)]">
            Notas (opcional)
            <textarea
              className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          {error && <p className="col-span-2 text-xs text-[var(--status-critical)]">{error}</p>}

          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
