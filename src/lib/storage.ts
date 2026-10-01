import type { Account, Trade } from "../types";

const TRADES_KEY = "traderflow.trades.v1";
const ACCOUNTS_KEY = "traderflow.accounts.v1";
const PLAN_KEY = "traderflow.plan.v1";
const DEFAULT_ACCOUNT_NAME = "Cuenta principal";

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — edits stay in-memory for this session
  }
}

export function saveTrades(trades: Trade[]): void {
  writeJson(TRADES_KEY, trades);
}

export function saveAccounts(accounts: Account[]): void {
  writeJson(ACCOUNTS_KEY, accounts);
}

export function loadPlan(): string {
  try {
    return localStorage.getItem(PLAN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function savePlan(plan: string): void {
  try {
    localStorage.setItem(PLAN_KEY, plan);
  } catch {
    // storage unavailable — the edit stays in-memory for this session
  }
}

/**
 * Loads trades and accounts together. Trades saved before multi-account
 * support (or imported without an accountId) are migrated onto a new
 * default account so nothing is silently dropped.
 */
export function loadData(): { trades: Trade[]; accounts: Account[] } {
  const rawTrades = readJson<unknown>(TRADES_KEY);
  const trades: Trade[] = Array.isArray(rawTrades) ? (rawTrades as Trade[]) : [];
  const rawAccounts = readJson<unknown>(ACCOUNTS_KEY);
  let accounts: Account[] = Array.isArray(rawAccounts) ? (rawAccounts as Account[]) : [];

  const orphanTrades = trades.filter((t) => !t.accountId);
  if (orphanTrades.length > 0) {
    const defaultAccount: Account =
      accounts[0] ?? { id: crypto.randomUUID(), name: DEFAULT_ACCOUNT_NAME };
    if (accounts.length === 0) accounts = [defaultAccount];
    for (const trade of orphanTrades) trade.accountId = defaultAccount.id;
    saveTrades(trades);
    saveAccounts(accounts);
  }

  return { trades, accounts };
}
