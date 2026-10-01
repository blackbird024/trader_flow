import type { Account, Trade } from "../types";

export function buildSampleData(): { trades: Trade[]; accounts: Account[] } {
  const accounts: Account[] = [
    { id: crypto.randomUUID(), name: "Apex 50K #1" },
    { id: crypto.randomUUID(), name: "Apex 100K #1" },
  ];
  const [apex50, apex100] = accounts;

  const raw: Array<Omit<Trade, "id">> = [
    { accountId: apex50.id, symbol: "AAPL", side: "long", quantity: 50, entryPrice: 178.2, exitPrice: 184.5, entryDate: "2026-08-04", exitDate: "2026-08-06", fees: 2.5 },
    { accountId: apex50.id, symbol: "TSLA", side: "short", quantity: 20, entryPrice: 251.1, exitPrice: 244.3, entryDate: "2026-08-07", exitDate: "2026-08-07", fees: 3.1 },
    { accountId: apex100.id, symbol: "NVDA", side: "long", quantity: 15, entryPrice: 118.4, exitPrice: 112.9, entryDate: "2026-08-10", exitDate: "2026-08-12", fees: 2.0 },
    { accountId: apex50.id, symbol: "MSFT", side: "long", quantity: 30, entryPrice: 410.0, exitPrice: 418.75, entryDate: "2026-08-13", exitDate: "2026-08-14", fees: 2.8 },
    { accountId: apex100.id, symbol: "EURUSD", side: "long", quantity: 10000, entryPrice: 1.082, exitPrice: 1.0795, entryDate: "2026-08-15", exitDate: "2026-08-15", fees: 1.5 },
    { accountId: apex50.id, symbol: "AAPL", side: "short", quantity: 40, entryPrice: 186.0, exitPrice: 188.9, entryDate: "2026-08-18", exitDate: "2026-08-19", fees: 2.2 },
    { accountId: apex100.id, symbol: "TSLA", side: "long", quantity: 25, entryPrice: 238.5, exitPrice: 249.1, entryDate: "2026-08-20", exitDate: "2026-08-21", fees: 3.0 },
    { accountId: apex50.id, symbol: "NVDA", side: "long", quantity: 20, entryPrice: 109.2, exitPrice: 121.6, entryDate: "2026-08-24", exitDate: "2026-08-27", fees: 2.4 },
    { accountId: apex100.id, symbol: "BTCUSD", side: "long", quantity: 0.4, entryPrice: 61200, exitPrice: 59800, entryDate: "2026-08-28", exitDate: "2026-08-29", fees: 4.0 },
    { accountId: apex50.id, symbol: "MSFT", side: "short", quantity: 18, entryPrice: 421.0, exitPrice: 415.4, entryDate: "2026-09-01", exitDate: "2026-09-02", fees: 2.1 },
    { accountId: apex100.id, symbol: "EURUSD", side: "short", quantity: 12000, entryPrice: 1.0788, exitPrice: 1.0821, entryDate: "2026-09-03", exitDate: "2026-09-03", fees: 1.6 },
    { accountId: apex50.id, symbol: "AAPL", side: "long", quantity: 35, entryPrice: 190.5, exitPrice: 197.3, entryDate: "2026-09-05", exitDate: "2026-09-08", fees: 2.3 },
    { accountId: apex100.id, symbol: "BTCUSD", side: "long", quantity: 0.3, entryPrice: 58500, exitPrice: 62100, entryDate: "2026-09-09", exitDate: "2026-09-11", fees: 3.8 },
    { accountId: apex50.id, symbol: "NVDA", side: "short", quantity: 12, entryPrice: 124.0, exitPrice: 119.8, entryDate: "2026-09-12", exitDate: "2026-09-12", fees: 2.0 },
    { accountId: apex100.id, symbol: "TSLA", side: "long", quantity: 22, entryPrice: 247.0, exitPrice: 240.2, entryDate: "2026-09-15", exitDate: "2026-09-16", fees: 2.9 },
  ];

  const trades = raw.map((trade) => ({ ...trade, id: crypto.randomUUID() }));
  return { trades, accounts };
}
