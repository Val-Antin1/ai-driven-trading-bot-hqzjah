
import { useState, useEffect } from 'react';
import { TradingSignal, MarketData, TradeHistory, NewsEvent, AccountInfo, RiskSettings } from '../types/trading';
import { mockMarketData, mockTradingSignals, mockTradeHistory, mockNewsEvents } from '../data/mockData';

export const useTradingData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>(mockMarketData);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>(mockTradingSignals);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>(mockTradeHistory);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(mockNewsEvents);
  const [isLoading, setIsLoading] = useState(false);

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    balance: 10000,
    equity: 10225,
    margin: 500,
    freeMargin: 9725,
    marginLevel: 2045,
    totalProfit: 225,
    totalTrades: 15,
    winRate: 73.3,
  });

  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    maxRiskPerTrade: 2,
    dailyLossLimit: 5,
    weeklyLossLimit: 10,
    positionSizePercent: 1,
    stopLossPercent: 2,
    takeProfitPercent: 4,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.001),
          change: item.change + (Math.random() - 0.5) * 0.0005,
          timestamp: new Date(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    console.log('Refreshing trading data...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update with fresh mock data
    setMarketData([...mockMarketData]);
    setTradingSignals([...mockTradingSignals]);
    
    setIsLoading(false);
    console.log('Trading data refreshed');
  };

  const updateRiskSettings = (newSettings: Partial<RiskSettings>) => {
    setRiskSettings(prev => ({ ...prev, ...newSettings }));
    console.log('Risk settings updated:', newSettings);
  };

  const addTradingSignal = (signal: Omit<TradingSignal, 'id' | 'timestamp'>) => {
    const newSignal: TradingSignal = {
      ...signal,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setTradingSignals(prev => [newSignal, ...prev]);
    console.log('New trading signal added:', newSignal);
  };

  const executeTrade = (signalId: string) => {
    setTradingSignals(prev => 
      prev.map(signal => 
        signal.id === signalId 
          ? { ...signal, status: 'EXECUTED' as const }
          : signal
      )
    );
    console.log('Trade executed for signal:', signalId);
  };

  return {
    marketData,
    tradingSignals,
    tradeHistory,
    newsEvents,
    accountInfo,
    riskSettings,
    isLoading,
    refreshData,
    updateRiskSettings,
    addTradingSignal,
    executeTrade,
  };
};
