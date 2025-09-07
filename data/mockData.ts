
import { TradingSignal, MarketData, TechnicalIndicators, TradeHistory, NewsEvent, TradingStrategy } from '../types/trading';

export const mockMarketData: MarketData[] = [
  {
    symbol: 'EURUSD',
    price: 1.0845,
    change: 0.0012,
    changePercent: 0.11,
    volume: 1250000,
    high24h: 1.0867,
    low24h: 1.0823,
    timestamp: new Date(),
  },
  {
    symbol: 'GBPUSD',
    price: 1.2634,
    change: -0.0023,
    changePercent: -0.18,
    volume: 980000,
    high24h: 1.2678,
    low24h: 1.2612,
    timestamp: new Date(),
  },
  {
    symbol: 'BTCUSD',
    price: 43250.50,
    change: 1250.30,
    changePercent: 2.98,
    volume: 2500000,
    high24h: 43890.00,
    low24h: 41980.00,
    timestamp: new Date(),
  },
  {
    symbol: 'ETHUSD',
    price: 2634.75,
    change: -45.25,
    changePercent: -1.69,
    volume: 1800000,
    high24h: 2698.50,
    low24h: 2598.30,
    timestamp: new Date(),
  },
];

export const mockTechnicalIndicators: TechnicalIndicators = {
  rsi: 68.5,
  macd: {
    macd: 0.0012,
    signal: 0.0008,
    histogram: 0.0004,
  },
  movingAverages: {
    sma20: 1.0832,
    sma50: 1.0798,
    ema12: 1.0841,
    ema26: 1.0825,
  },
  supportResistance: {
    support: [1.0820, 1.0795, 1.0765],
    resistance: [1.0865, 1.0890, 1.0920],
  },
};

export const mockTradingSignals: TradingSignal[] = [
  {
    id: '1',
    type: 'BUY',
    asset: 'EURUSD',
    entryPrice: 1.0845,
    stopLoss: 1.0820,
    takeProfit: 1.0890,
    confidence: 85,
    timeframe: '1h',
    timestamp: new Date(),
    reasoning: 'RSI oversold, MACD bullish crossover, price above EMA20',
    status: 'ACTIVE',
  },
  {
    id: '2',
    type: 'SELL',
    asset: 'GBPUSD',
    entryPrice: 1.2634,
    stopLoss: 1.2665,
    takeProfit: 1.2580,
    confidence: 72,
    timeframe: '4h',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    reasoning: 'Resistance at 1.2670, bearish divergence on RSI',
    status: 'ACTIVE',
  },
];

export const mockTradeHistory: TradeHistory[] = [
  {
    id: '1',
    asset: 'EURUSD',
    type: 'BUY',
    entryPrice: 1.0798,
    exitPrice: 1.0834,
    quantity: 100000,
    profit: 360,
    profitPercent: 3.3,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 180,
  },
  {
    id: '2',
    asset: 'BTCUSD',
    type: 'SELL',
    entryPrice: 44200,
    exitPrice: 43800,
    quantity: 0.1,
    profit: 40,
    profitPercent: 0.9,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 45,
  },
  {
    id: '3',
    asset: 'GBPUSD',
    type: 'BUY',
    entryPrice: 1.2580,
    exitPrice: 1.2545,
    quantity: 50000,
    profit: -175,
    profitPercent: -2.8,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 120,
  },
];

export const mockNewsEvents: NewsEvent[] = [
  {
    id: '1',
    title: 'Federal Reserve Interest Rate Decision',
    impact: 'HIGH',
    currency: 'USD',
    timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000),
    description: 'FOMC meeting expected to maintain current rates',
  },
  {
    id: '2',
    title: 'ECB Monetary Policy Statement',
    impact: 'HIGH',
    currency: 'EUR',
    timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'European Central Bank policy announcement',
  },
  {
    id: '3',
    title: 'Non-Farm Payrolls',
    impact: 'HIGH',
    currency: 'USD',
    timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    description: 'US employment data release',
  },
];

export const mockTradingStrategies: TradingStrategy[] = [
  {
    id: '1',
    name: 'Scalping Pro',
    description: 'Quick trades on 1-5 minute timeframes',
    timeframes: ['1m', '5m'],
    riskLevel: 'AGGRESSIVE',
    winRate: 68,
    avgProfit: 0.8,
  },
  {
    id: '2',
    name: 'Day Trader',
    description: 'Intraday trades on 15m-1h timeframes',
    timeframes: ['15m', '30m', '1h'],
    riskLevel: 'MODERATE',
    winRate: 72,
    avgProfit: 1.5,
  },
  {
    id: '3',
    name: 'Swing Master',
    description: 'Multi-day trades on 4h-daily timeframes',
    timeframes: ['4h', '1d'],
    riskLevel: 'CONSERVATIVE',
    winRate: 78,
    avgProfit: 3.2,
  },
];

// Generate mock chart data
export const generateMockChartData = (symbol: string, timeframe: string) => {
  const basePrice = mockMarketData.find(m => m.symbol === symbol)?.price || 1.0845;
  const data = [];
  const labels = [];
  
  for (let i = 30; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 0.02;
    const price = basePrice * (1 + variation);
    data.push(price);
    
    const date = new Date(Date.now() - i * 60 * 60 * 1000);
    labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }
  
  return { labels, data };
};
