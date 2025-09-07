
import { useState, useEffect } from 'react';
import { TradingSignal, MarketData, TradeHistory, NewsEvent, AccountInfo, RiskSettings } from '../types/trading';
import { mockMarketData, mockTradingSignals, mockTradeHistory, mockNewsEvents } from '../data/mockData';
import { marketService } from '../services/marketService';

export const useTradingData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>(mockMarketData);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>(mockTradingSignals);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>(mockTradeHistory);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(mockNewsEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date());

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

  // Enhanced real-time data updates with market awareness
  useEffect(() => {
    console.log('Initializing trading data with market awareness');
    
    const updateMarketData = () => {
      setMarketData(prevData => 
        prevData.map(item => {
          const marketStatus = marketService.getMarketStatus(item.symbol);
          
          // Different update patterns based on market status
          let priceVariation;
          if (marketStatus.isOpen) {
            // Normal market hours - more volatile
            priceVariation = (Math.random() - 0.5) * 0.002;
          } else {
            // Market closed - minimal movement (historical data simulation)
            priceVariation = (Math.random() - 0.5) * 0.0005;
          }
          
          const newPrice = item.price * (1 + priceVariation);
          const change = newPrice - item.price;
          const changePercent = (change / item.price) * 100;
          
          return {
            ...item,
            price: newPrice,
            change: change,
            changePercent: changePercent,
            timestamp: new Date(),
          };
        })
      );
      setLastDataUpdate(new Date());
    };

    // Initial update
    updateMarketData();
    
    // Set up interval for updates
    const interval = setInterval(updateMarketData, 3000); // 3 second updates
    
    return () => clearInterval(interval);
  }, []);

  // Generate market-aware trading signals
  useEffect(() => {
    const generateSignals = () => {
      const openMarkets = marketData.filter(data => {
        const status = marketService.getMarketStatus(data.symbol);
        return status.isOpen;
      });
      
      if (openMarkets.length === 0) {
        console.log('No markets open, skipping signal generation');
        return;
      }
      
      // Randomly generate new signals for open markets
      if (Math.random() < 0.1) { // 10% chance every interval
        const randomMarket = openMarkets[Math.floor(Math.random() * openMarkets.length)];
        const signalType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        const newSignal: TradingSignal = {
          id: Date.now().toString(),
          type: signalType,
          asset: randomMarket.symbol,
          entryPrice: randomMarket.price,
          stopLoss: signalType === 'BUY' 
            ? randomMarket.price * 0.98 
            : randomMarket.price * 1.02,
          takeProfit: signalType === 'BUY' 
            ? randomMarket.price * 1.04 
            : randomMarket.price * 0.96,
          confidence,
          timeframe: ['1h', '4h', '1d'][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          reasoning: `Market analysis indicates ${signalType.toLowerCase()} opportunity based on technical indicators`,
          status: 'ACTIVE',
        };
        
        setTradingSignals(prev => [newSignal, ...prev.slice(0, 9)]); // Keep last 10 signals
        console.log('Generated new trading signal:', newSignal);
      }
    };
    
    const signalInterval = setInterval(generateSignals, 30000); // Check every 30 seconds
    
    return () => clearInterval(signalInterval);
  }, [marketData]);

  const refreshData = async () => {
    setIsLoading(true);
    console.log('Refreshing trading data with market status check...');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check market status for each symbol and update accordingly
      const updatedMarketData = mockMarketData.map(data => {
        const marketStatus = marketService.getMarketStatus(data.symbol);
        
        if (marketStatus.isOpen) {
          // Market open - fresh live data
          const variation = (Math.random() - 0.5) * 0.01;
          return {
            ...data,
            price: data.price * (1 + variation),
            change: data.change + variation * data.price,
            changePercent: data.changePercent + variation * 100,
            timestamp: new Date(),
          };
        } else {
          // Market closed - return with minimal changes
          return {
            ...data,
            timestamp: new Date(),
          };
        }
      });
      
      setMarketData(updatedMarketData);
      setTradingSignals([...mockTradingSignals]);
      setLastDataUpdate(new Date());
      
      console.log('Trading data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing trading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRiskSettings = (newSettings: Partial<RiskSettings>) => {
    setRiskSettings(prev => ({ ...prev, ...newSettings }));
    console.log('Risk settings updated:', newSettings);
  };

  const addTradingSignal = (signal: Omit<TradingSignal, 'id' | 'timestamp'>) => {
    // Check if market is open for this asset
    const marketStatus = marketService.getMarketStatus(signal.asset);
    
    if (!marketStatus.isOpen && !signal.asset.includes('BTC') && !signal.asset.includes('ETH')) {
      console.warn(`Cannot add signal for ${signal.asset} - market is closed`);
      return false;
    }
    
    const newSignal: TradingSignal = {
      ...signal,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setTradingSignals(prev => [newSignal, ...prev]);
    console.log('New trading signal added:', newSignal);
    return true;
  };

  const executeTrade = (signalId: string) => {
    const signal = tradingSignals.find(s => s.id === signalId);
    if (!signal) {
      console.error('Signal not found:', signalId);
      return false;
    }
    
    // Check if market is open
    const marketStatus = marketService.getMarketStatus(signal.asset);
    if (!marketStatus.isOpen && !signal.asset.includes('BTC') && !signal.asset.includes('ETH')) {
      console.warn(`Cannot execute trade for ${signal.asset} - market is closed`);
      return false;
    }
    
    setTradingSignals(prev => 
      prev.map(s => 
        s.id === signalId 
          ? { ...s, status: 'EXECUTED' as const }
          : s
      )
    );
    
    // Add to trade history
    const newTrade: TradeHistory = {
      id: Date.now().toString(),
      asset: signal.asset,
      type: signal.type,
      entryPrice: signal.entryPrice,
      exitPrice: signal.entryPrice, // Will be updated when trade closes
      quantity: 100000, // Standard lot
      profit: 0, // Will be calculated when trade closes
      profitPercent: 0,
      timestamp: new Date(),
      duration: 0,
    };
    
    setTradeHistory(prev => [newTrade, ...prev]);
    console.log('Trade executed for signal:', signalId);
    return true;
  };

  const getMarketStatus = (symbol: string) => {
    return marketService.getMarketStatus(symbol);
  };

  return {
    marketData,
    tradingSignals,
    tradeHistory,
    newsEvents,
    accountInfo,
    riskSettings,
    isLoading,
    lastDataUpdate,
    refreshData,
    updateRiskSettings,
    addTradingSignal,
    executeTrade,
    getMarketStatus,
  };
};
