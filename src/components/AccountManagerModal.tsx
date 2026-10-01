import { useEffect, useRef, useState } from "react";
import type { Account } from "../types";

interface AccountManagerModalProps {
  accounts: Account[];
  tradeCountByAccount: Record<string, number>;
  onClose: () => void;
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function AccountManagerModal({
  accounts,
  tradeCountByAccount,
  onClose,
  onAdd,
  onRename,
  onDelete,
}: AccountManagerModalProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
  }

  function startEditing(account: Account) {
    setEditingId(account.id);
    setEditingName(account.name);
  }

  function commitEditing() {
    const name = editingName.trim();
    if (editingId && name) onRename(editingId, name);
    setEditingId(null);
  }

  function handleDelete(account: Account) {
    const count = tradeCountByAccount[account.id] ?? 0;
    const message =
      count > 0
        ? `"${account.name}" tiene ${count} operacion${count === 1 ? "" : "es"}. Al borrar la cuenta también se borran esas operaciones. ¿Continuar?`
        : `¿Borrar la cuenta "${account.name}"?`;
    if (confirm(message)) onDelete(account.id);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-manager-title"
        className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-5 shadow-lg"
      >
        <h2 id="account-manager-title" className="text-base font-semibold">
          Cuentas
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Una por cada cuenta que operás (por ejemplo, cada cuenta de Apex).
        </p>

        <ul className="mt-3 space-y-1">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex items-center justify-between gap-2 rounded border border-[var(--border)] px-2.5 py-1.5"
            >
              {editingId === account.id ? (
                <input
                  autoFocus
                  className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-1 text-sm"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={commitEditing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEditing();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEditing(account)}
                  className="min-w-0 flex-1 truncate text-left text-sm hover:underline"
                  title="Renombrar"
                >
                  {account.name}
                </button>
              )}
              <span className="shrink-0 text-xs text-[var(--text-muted)]">
                {tradeCountByAccount[account.id] ?? 0}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(account)}
                className="shrink-0 text-xs font-medium text-[var(--status-critical)] hover:underline"
              >
                Borrar
              </button>
            </li>
          ))}
          {accounts.length === 0 && (
            <li className="rounded border border-dashed border-[var(--border)] px-2.5 py-3 text-center text-xs text-[var(--text-muted)]">
              Todavía no tenés cuentas.
            </li>
          )}
        </ul>

        <div className="mt-3 flex gap-2">
          <input
            ref={firstFieldRef}
            className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-sm"
            placeholder="Nombre de la cuenta (ej. Apex 50K #2)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="shrink-0 rounded bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Agregar
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
