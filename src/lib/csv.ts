import type { Account, Trade, TradeSide } from "../types";

const COLUMNS = [
  "account",
  "symbol",
  "side",
  "quantity",
  "entryPrice",
  "exitPrice",
  "entryDate",
  "exitDate",
  "fees",
  "strategy",
  "notes",
] as const;

export function tradesToCsv(trades: Trade[], accounts: Account[]): string {
  const accountName = new Map(accounts.map((a) => [a.id, a.name]));
  const rows = trades.map((trade) =>
    COLUMNS.map((col) =>
      escapeCsvValue(col === "account" ? (accountName.get(trade.accountId) ?? "") : String(trade[col] ?? "")),
    ).join(","),
  );
  return [COLUMNS.join(","), ...rows].join("\n");
}

function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

export interface CsvParseResult {
  trades: Trade[];
  newAccounts: Account[];
  errors: string[];
}

/**
 * Parses a CSV export back into trades. The `account` column is matched
 * against existing accounts by name (case-insensitive); unknown names
 * become new accounts, returned in `newAccounts` so the caller can persist
 * them alongside the trades. Rows with no account default to `fallbackAccountId`.
 */
export function csvToTrades(csv: string, accounts: Account[], fallbackAccountId: string): CsvParseResult {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const errors: string[] = [];
  if (lines.length < 2) {
    return { trades: [], newAccounts: [], errors: ["El archivo no tiene filas de datos."] };
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const trades: Trade[] = [];
  const newAccounts: Account[] = [];
  const byName = new Map(accounts.map((a) => [a.name.toLowerCase(), a]));

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((col, idx) => {
      row[col] = values[idx] ?? "";
    });

    const side = row.side?.toLowerCase().trim();
    if (side !== "long" && side !== "short") {
      errors.push(`Fila ${i + 1}: side debe ser "long" o "short" (recibido "${row.side}").`);
      continue;
    }
    const quantity = Number(row.quantity);
    const entryPrice = Number(row.entryPrice);
    const exitPrice = Number(row.exitPrice);
    const fees = Number(row.fees || 0);
    if (!row.symbol || [quantity, entryPrice, exitPrice].some((n) => Number.isNaN(n))) {
      errors.push(`Fila ${i + 1}: datos numéricos inválidos o símbolo vacío.`);
      continue;
    }
    if (!row.entryDate || !row.exitDate) {
      errors.push(`Fila ${i + 1}: faltan fechas de entrada/salida.`);
      continue;
    }

    const accountName = row.account?.trim();
    let accountId = fallbackAccountId;
    if (accountName) {
      const existing = byName.get(accountName.toLowerCase());
      if (existing) {
        accountId = existing.id;
      } else {
        const created: Account = { id: crypto.randomUUID(), name: accountName };
        byName.set(accountName.toLowerCase(), created);
        newAccounts.push(created);
        accountId = created.id;
      }
    }

    trades.push({
      id: crypto.randomUUID(),
      accountId,
      symbol: row.symbol.trim().toUpperCase(),
      side: side as TradeSide,
      quantity,
      entryPrice,
      exitPrice,
      entryDate: row.entryDate.trim(),
      exitDate: row.exitDate.trim(),
      fees: Number.isNaN(fees) ? 0 : fees,
      strategy: row.strategy?.trim() || undefined,
      notes: row.notes?.trim() || undefined,
    });
  }

  return { trades, newAccounts, errors };
}
