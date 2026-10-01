import type { Account } from "../types";

interface AccountSelectorProps {
  accounts: Account[];
  value: string | "all";
  onChange: (value: string | "all") => void;
  onManage: () => void;
}

export function AccountSelector({ accounts, value, onChange, onManage }: AccountSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <select
        aria-label="Filtrar por cuenta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-[var(--border)] bg-[var(--surface-1)] px-2 py-1.5 text-xs text-[var(--text-secondary)]"
      >
        <option value="all">Todas las cuentas</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onManage}
        aria-label="Administrar cuentas"
        title="Administrar cuentas"
        className="rounded border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
      >
        ⚙
      </button>
    </div>
  );
}
