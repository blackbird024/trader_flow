import type { Account, Trade } from "../types";

export function tradePnl(trade: Trade): number {
  const direction = trade.side === "long" ? 1 : -1;
  const gross = (trade.exitPrice - trade.entryPrice) * trade.quantity * direction;
  return gross - trade.fees;
}

export interface TradeStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number; // 0-100
  totalPnl: number;
  grossProfit: number;
  grossLoss: number; // positive number
  profitFactor: number | null; // null when no losses to divide by
  avgWin: number;
  avgLoss: number; // positive number
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  expectancy: number; // average pnl per trade
  currentStreak: number; // positive = wins in a row, negative = losses in a row
  bestWinStreak: number;
  worstLossStreak: number; // positive number, longest losing streak
}

export function computeStats(trades: Trade[]): TradeStats {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: null,
      avgWin: 0,
      avgLoss: 0,
      bestTrade: null,
      worstTrade: null,
      expectancy: 0,
      currentStreak: 0,
      bestWinStreak: 0,
      worstLossStreak: 0,
    };
  }

  let wins = 0;
  let losses = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let totalPnl = 0;
  let bestTrade = trades[0];
  let worstTrade = trades[0];
  let bestPnl = tradePnl(trades[0]);
  let worstPnl = bestPnl;

  for (const trade of trades) {
    const pnl = tradePnl(trade);
    totalPnl += pnl;
    if (pnl >= 0) {
      wins += 1;
      grossProfit += pnl;
    } else {
      losses += 1;
      grossLoss += Math.abs(pnl);
    }
    if (pnl > bestPnl) {
      bestPnl = pnl;
      bestTrade = trade;
    }
    if (pnl < worstPnl) {
      worstPnl = pnl;
      worstTrade = trade;
    }
  }

  const { currentStreak, bestWinStreak, worstLossStreak } = computeStreaks(trades);

  return {
    totalTrades: trades.length,
    wins,
    losses,
    winRate: (wins / trades.length) * 100,
    totalPnl,
    grossProfit,
    grossLoss,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    avgWin: wins > 0 ? grossProfit / wins : 0,
    avgLoss: losses > 0 ? grossLoss / losses : 0,
    bestTrade,
    worstTrade,
    expectancy: totalPnl / trades.length,
    currentStreak,
    bestWinStreak,
    worstLossStreak,
  };
}

function computeStreaks(trades: Trade[]): {
  currentStreak: number;
  bestWinStreak: number;
  worstLossStreak: number;
} {
  const sorted = [...trades].sort((a, b) => a.exitDate.localeCompare(b.exitDate));

  let bestWinStreak = 0;
  let worstLossStreak = 0;
  let runWin = 0;
  let runLoss = 0;

  for (const trade of sorted) {
    if (tradePnl(trade) >= 0) {
      runWin += 1;
      runLoss = 0;
    } else {
      runLoss += 1;
      runWin = 0;
    }
    bestWinStreak = Math.max(bestWinStreak, runWin);
    worstLossStreak = Math.max(worstLossStreak, runLoss);
  }

  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const isWin = tradePnl(sorted[i]) >= 0;
    if (currentStreak === 0) {
      currentStreak = isWin ? 1 : -1;
    } else if ((currentStreak > 0) === isWin) {
      currentStreak += isWin ? 1 : -1;
    } else {
      break;
    }
  }

  return { currentStreak, bestWinStreak, worstLossStreak };
}

export interface EquityPoint {
  date: string;
  cumulativePnl: number;
  tradePnl: number;
}

export function computeEquityCurve(trades: Trade[]): EquityPoint[] {
  const sorted = [...trades].sort((a, b) => a.exitDate.localeCompare(b.exitDate));
  let cumulative = 0;
  return sorted.map((trade) => {
    const pnl = tradePnl(trade);
    cumulative += pnl;
    return { date: trade.exitDate, cumulativePnl: cumulative, tradePnl: pnl };
  });
}

export interface MonthlyPnl {
  month: string; // yyyy-mm
  label: string; // short display label
  pnl: number;
  trades: number;
}

export function computeMonthlyPnl(trades: Trade[]): MonthlyPnl[] {
  const map = new Map<string, MonthlyPnl>();
  for (const trade of trades) {
    const month = trade.exitDate.slice(0, 7); // yyyy-mm
    const pnl = tradePnl(trade);
    const existing = map.get(month);
    if (existing) {
      existing.pnl += pnl;
      existing.trades += 1;
    } else {
      const [year, monthNum] = month.split("-");
      const label = new Date(Number(year), Number(monthNum) - 1, 1).toLocaleDateString("es-ES", {
        month: "short",
        year: "2-digit",
      });
      map.set(month, { month, label, pnl, trades: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export interface SymbolPnl {
  symbol: string;
  pnl: number;
  trades: number;
}

export function computePnlBySymbol(trades: Trade[]): SymbolPnl[] {
  const map = new Map<string, SymbolPnl>();
  for (const trade of trades) {
    const pnl = tradePnl(trade);
    const existing = map.get(trade.symbol);
    if (existing) {
      existing.pnl += pnl;
      existing.trades += 1;
    } else {
      map.set(trade.symbol, { symbol: trade.symbol, pnl, trades: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.pnl - a.pnl);
}

export interface StrategyPnl {
  strategy: string;
  pnl: number;
  trades: number;
}

const NO_STRATEGY_LABEL = "Sin estrategia";

export function computePnlByStrategy(trades: Trade[]): StrategyPnl[] {
  const map = new Map<string, StrategyPnl>();
  for (const trade of trades) {
    const key = trade.strategy?.trim() || NO_STRATEGY_LABEL;
    const pnl = tradePnl(trade);
    const existing = map.get(key);
    if (existing) {
      existing.pnl += pnl;
      existing.trades += 1;
    } else {
      map.set(key, { strategy: key, pnl, trades: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.pnl - a.pnl);
}

export interface AccountBreakdown {
  account: Account;
  stats: TradeStats;
}

export function computeAccountBreakdown(trades: Trade[], accounts: Account[]): AccountBreakdown[] {
  return accounts
    .map((account) => ({
      account,
      stats: computeStats(trades.filter((t) => t.accountId === account.id)),
    }))
    .sort((a, b) => b.stats.totalPnl - a.stats.totalPnl);
}
