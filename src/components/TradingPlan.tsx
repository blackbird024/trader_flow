import { useState } from "react";
import { loadPlan, savePlan } from "../lib/storage";
import { quoteOfTheDay } from "../lib/quotes";

export function TradingPlan() {
  const [plan, setPlan] = useState(() => loadPlan());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(plan);
  const quote = quoteOfTheDay();

  function startEditing() {
    setDraft(plan);
    setEditing(true);
  }

  function handleSave() {
    const trimmed = draft.trim();
    setPlan(trimmed);
    savePlan(trimmed);
    setEditing(false);
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <p className="text-sm italic text-[var(--text-secondary)]">&ldquo;{quote}&rdquo;</p>

      <div className="mt-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Mi plan de trading</h2>
        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="text-xs font-medium text-[var(--series-1)] hover:underline"
          >
            {plan ? "Editar" : "Escribir mi plan"}
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-2">
          <textarea
            autoFocus
            className="w-full rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              "Ej: solo opero el horario de apertura de NY. Máximo 2% de riesgo por operación.\nMáxima pérdida diaria: 4%. Si la toco, cierro la plataforma por hoy.\nSolo entro con setups de Breakout o Pullback confirmados."
            }
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded bg-[var(--series-1)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : plan ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text-secondary)]">{plan}</p>
      ) : (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Todavía no escribiste tu plan. Tus reglas de riesgo, horarios y setups — para tenerlas siempre a mano.
        </p>
      )}
    </div>
  );
}
