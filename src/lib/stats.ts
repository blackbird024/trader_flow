import type { Trade } from "../types";

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
  };
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
