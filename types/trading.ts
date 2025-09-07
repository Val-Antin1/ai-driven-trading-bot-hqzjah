
export interface TradingSignal {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  timeframe: string;
  timestamp: Date;
  reasoning: string;
  status: 'ACTIVE' | 'EXECUTED' | 'CANCELLED';
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    ema12: number;
    ema26: number;
  };
  supportResistance: {
    support: number[];
    resistance: number[];
  };
}

export interface TradeHistory {
  id: string;
  asset: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
  timestamp: Date;
  duration: number; // in minutes
}

export interface RiskSettings {
  maxRiskPerTrade: number; // percentage
  dailyLossLimit: number; // percentage
  weeklyLossLimit: number; // percentage
  positionSizePercent: number; // percentage of account
  stopLossPercent: number; // percentage
  takeProfitPercent: number; // percentage
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  timeframes: string[];
  riskLevel: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  winRate: number;
  avgProfit: number;
}

export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  totalProfit: number;
  totalTrades: number;
  winRate: number;
}

export interface NewsEvent {
  id: string;
  title: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  currency: string;
  timestamp: Date;
  description: string;
}

export type AssetType = 'FOREX' | 'CRYPTO' | 'STOCKS' | 'INDICES' | 'COMMODITIES';
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
export type TradingMode = 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING';
