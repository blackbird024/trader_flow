import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { NewTrade, Trade } from "./types";
import { loadTrades, saveTrades } from "./lib/storage";
import { buildSampleTrades } from "./lib/sampleData";
import { computeEquityCurve, computeMonthlyPnl, computePnlBySymbol, computeStats } from "./lib/stats";
import { csvToTrades, tradesToCsv } from "./lib/csv";
import { formatCurrency, formatNumber, formatPercent } from "./lib/format";
import { filterTradesByRange, type DateRangePreset } from "./lib/dateRange";
import { useTheme } from "./hooks/useTheme";
import { StatCard } from "./components/StatCard";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { TradesTable } from "./components/TradesTable";
import { TradeFormModal } from "./components/TradeFormModal";

const EquityChart = lazy(() => import("./components/EquityChart").then((m) => ({ default: m.EquityChart })));
const PnlBySymbolChart = lazy(() =>
  import("./components/PnlBySymbolChart").then((m) => ({ default: m.PnlBySymbolChart })),
);
const MonthlyPnlChart = lazy(() =>
  import("./components/MonthlyPnlChart").then((m) => ({ default: m.MonthlyPnlChart })),
);

function ChartFallback() {
  return (
    <div className="flex h-56 items-center justify-center text-sm text-[var(--text-muted)]">Cargando gráfico…</div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [trades, setTrades] = useState<Trade[]>(() => loadTrades());
  const [range, setRange] = useState<DateRangePreset>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveTrades(trades);
  }, [trades]);

  const filteredTrades = useMemo(() => filterTradesByRange(trades, range), [trades, range]);
  const stats = useMemo(() => computeStats(filteredTrades), [filteredTrades]);
  const equityCurve = useMemo(() => computeEquityCurve(filteredTrades), [filteredTrades]);
  const pnlBySymbol = useMemo(() => computePnlBySymbol(filteredTrades), [filteredTrades]);
  const monthlyPnl = useMemo(() => computeMonthlyPnl(filteredTrades), [filteredTrades]);

  function handleSave(trade: NewTrade, id?: string) {
    if (id) {
      setTrades((prev) => prev.map((t) => (t.id === id ? { ...trade, id } : t)));
    } else {
      setTrades((prev) => [...prev, { ...trade, id: crypto.randomUUID() }]);
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (confirm("¿Borrar esta operación?")) {
      setTrades((prev) => prev.filter((t) => t.id !== id));
    }
  }

  function handleLoadSample() {
    setTrades(buildSampleTrades());
  }

  function handleClearAll() {
    if (confirm("Esto borrará todas tus operaciones guardadas. ¿Continuar?")) {
      setTrades([]);
    }
  }

  function handleExport() {
    const csv = tradesToCsv(filteredTrades);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "traderflow-trades.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = csvToTrades(String(reader.result ?? ""));
      if (result.trades.length > 0) {
        setTrades((prev) => [...prev, ...result.trades]);
      }
      if (result.errors.length > 0) {
        setImportMessage(
          `Importadas ${result.trades.length} operaciones. ${result.errors.length} filas con errores.`,
        );
      } else {
        setImportMessage(`Importadas ${result.trades.length} operaciones.`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const streakLabel = (() => {
    const count = Math.abs(stats.currentStreak);
    if (count === 0) return "—";
    const isWin = stats.currentStreak > 0;
    const noun = count === 1 ? (isWin ? "ganada" : "perdida") : isWin ? "ganadas" : "perdidas";
    return `${count} ${noun}`;
  })();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">TraderFlow</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Registra tus operaciones y analiza el rendimiento de tu operativa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter value={range} onChange={setRange} />
          <button
            onClick={toggle}
            className="rounded border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? "Modo claro" : "Modo oscuro"}
          </button>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-8">
        <StatCard
          label="P&L total"
          value={formatCurrency(stats.totalPnl)}
          tone={stats.totalPnl >= 0 ? "good" : "critical"}
        />
        <StatCard label="Operaciones" value={String(stats.totalTrades)} />
        <StatCard label="Win rate" value={formatPercent(stats.winRate)} />
        <StatCard
          label="Profit factor"
          value={stats.profitFactor === null ? "—" : formatNumber(stats.profitFactor)}
        />
        <StatCard label="Ganancia media" value={formatCurrency(stats.avgWin)} tone="good" />
        <StatCard label="Pérdida media" value={formatCurrency(-stats.avgLoss)} tone="critical" />
        <StatCard
          label="Racha actual"
          value={streakLabel}
          tone={stats.currentStreak > 0 ? "good" : stats.currentStreak < 0 ? "critical" : "neutral"}
        />
        <StatCard
          label="Mejor racha"
          value={String(stats.bestWinStreak)}
          sublabel={`Peor: ${stats.worstLossStreak} seguidas`}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4 lg:col-span-3">
          <h2 className="text-sm font-semibold">Curva de equity</h2>
          <p className="text-xs text-[var(--text-muted)]">P&amp;L acumulado por fecha de cierre</p>
          <div className="mt-2">
            <Suspense fallback={<ChartFallback />}>
              <EquityChart data={equityCurve} theme={theme} />
            </Suspense>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">P&amp;L por símbolo</h2>
          <p className="text-xs text-[var(--text-muted)]">Resultado acumulado por instrumento</p>
          <div className="mt-2">
            <Suspense fallback={<ChartFallback />}>
              <PnlBySymbolChart data={pnlBySymbol} theme={theme} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
          <h2 className="text-sm font-semibold">P&amp;L mensual</h2>
          <p className="text-xs text-[var(--text-muted)]">Resultado acumulado por mes de cierre</p>
          <div className="mt-2">
            <Suspense fallback={<ChartFallback />}>
              <MonthlyPnlChart data={monthlyPnl} theme={theme} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Operaciones</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="rounded bg-[var(--series-1)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              + Nueva operación
            </button>
            <button
              onClick={handleImportClick}
              className="rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
            >
              Importar CSV
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
            <button
              onClick={handleExport}
              disabled={filteredTrades.length === 0}
              className="rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-1)] disabled:opacity-40"
            >
              Exportar CSV
            </button>
            {trades.length === 0 && (
              <button
                onClick={handleLoadSample}
                className="rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
              >
                Cargar datos de ejemplo
              </button>
            )}
            {trades.length > 0 && (
              <button
                onClick={handleClearAll}
                className="rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--status-critical)] hover:bg-[var(--surface-1)]"
              >
                Borrar todo
              </button>
            )}
          </div>
        </div>

        {importMessage && (
          <p className="mt-2 text-xs text-[var(--text-secondary)]" role="status">
            {importMessage}
          </p>
        )}

        {range !== "all" && trades.length > filteredTrades.length && (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Mostrando {filteredTrades.length} de {trades.length} operaciones en este rango.
          </p>
        )}

        <div className="mt-3">
          <TradesTable
            trades={filteredTrades}
            onEdit={(trade) => {
              setEditing(trade);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </section>

      {showForm && (
        <TradeFormModal
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
