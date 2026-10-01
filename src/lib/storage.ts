import type { Trade } from "../types";

const STORAGE_KEY = "traderflow.trades.v1";

export function loadTrades(): Trade[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTrades(trades: Trade[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch {
    // storage unavailable (private mode, quota) — edits stay in-memory for this session
  }
}
