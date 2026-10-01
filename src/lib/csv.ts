import type { Trade, TradeSide } from "../types";

const COLUMNS = [
  "symbol",
  "side",
  "quantity",
  "entryPrice",
  "exitPrice",
  "entryDate",
  "exitDate",
  "fees",
  "notes",
] as const;

export function tradesToCsv(trades: Trade[]): string {
  const rows = trades.map((trade) =>
    COLUMNS.map((col) => escapeCsvValue(String(trade[col] ?? ""))).join(","),
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
  errors: string[];
}

export function csvToTrades(csv: string): CsvParseResult {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const errors: string[] = [];
  if (lines.length < 2) {
    return { trades: [], errors: ["El archivo no tiene filas de datos."] };
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const trades: Trade[] = [];

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

    trades.push({
      id: crypto.randomUUID(),
      symbol: row.symbol.trim().toUpperCase(),
      side: side as TradeSide,
      quantity,
      entryPrice,
      exitPrice,
      entryDate: row.entryDate.trim(),
      exitDate: row.exitDate.trim(),
      fees: Number.isNaN(fees) ? 0 : fees,
      notes: row.notes?.trim() || undefined,
    });
  }

  return { trades, errors };
}
