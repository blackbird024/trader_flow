export type TradeSide = "long" | "short";

export interface Account {
  id: string;
  name: string; // e.g. "Apex 50K #1"
}

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  side: TradeSide;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  entryDate: string; // ISO date, yyyy-mm-dd
  exitDate: string; // ISO date, yyyy-mm-dd
  fees: number;
  notes?: string;
}

export type NewTrade = Omit<Trade, "id">;
