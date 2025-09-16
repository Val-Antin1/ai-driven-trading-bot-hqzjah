
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

  const [appSettings, setAppSettings] = useState({
    tradingMode: 'DAY_TRADING' as TradingMode,
    primaryTimeframe: '1h' as TimeFrame,
    assetClasses: ['FOREX', 'CRYPTO'] as AssetType[],
    autoTrading: false,
    notifications: true,
  });

  const updateAppSettings = (newSettings: Partial<typeof appSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
    console.log('App settings updated:', newSettings);
  };

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

  const getAssetClass = (symbol: string): AssetType => {
    if (symbol.includes('USD') && symbol.length === 6) return 'FOREX';
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 'CRYPTO';
    // Add more complex logic for other asset types if needed
    return 'FOREX';
  };

  // Generate market-aware trading signals based on app settings
  useEffect(() => {
    const generateSignals = () => {
      const { assetClasses, tradingMode, autoTrading } = appSettings;

      const availableMarkets = marketData.filter(data => {
        const marketStatus = marketService.getMarketStatus(data.symbol);
        const assetClass = getAssetClass(data.symbol);
        return marketStatus.isOpen && assetClasses.includes(assetClass);
      });

      if (availableMarkets.length === 0) {
        return;
      }

      if (Math.random() < 0.1) { // 10% chance
        const randomMarket = availableMarkets[Math.floor(Math.random() * availableMarkets.length)];
        const signalType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const confidence = Math.floor(Math.random() * 30) + 70;

        let timeframes: TimeFrame[];
        if (tradingMode === 'SCALPING') timeframes = ['1m', '5m', '15m'];
        else if (tradingMode === 'DAY_TRADING') timeframes = ['15m', '30m', '1h'];
        else timeframes = ['4h', '1d', '1w'];
        
        const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];

        const newSignal: TradingSignal = {
          id: Date.now().toString(),
          type: signalType,
          asset: randomMarket.symbol,
          entryPrice: randomMarket.price,
          stopLoss: signalType === 'BUY' ? randomMarket.price * 0.98 : randomMarket.price * 1.02,
          takeProfit: signalType === 'BUY' ? randomMarket.price * 1.04 : randomMarket.price * 0.96,
          confidence,
          timeframe,
          mode: tradingMode,
          timestamp: new Date(),
          reasoning: `Signal based on ${tradingMode} strategy for ${randomMarket.symbol}`,
          status: 'ACTIVE',
        };

        setTradingSignals(prev => [newSignal, ...prev.slice(0, 9)]);
        console.log('Generated new signal:', newSignal);

        if (autoTrading && newSignal.confidence > 85) {
          console.log(`Auto-trading enabled, executing high-confidence signal for ${newSignal.asset}`);
          executeTrade(newSignal.id);
        }
      }
    };

    const signalInterval = setInterval(generateSignals, 10000); // Check every 10 seconds
    return () => clearInterval(signalInterval);
  }, [marketData, appSettings]);

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
      signalId: signal.id,
      asset: signal.asset,
      type: signal.type,
      entryPrice: signal.entryPrice,
      exitPrice: 0, // Will be updated when trade closes
      quantity: 100000, // Standard lot
      profit: 0, // Will be calculated when trade closes
      profitPercent: 0,
      timestamp: new Date(),
      duration: 0,
      status: 'OPEN',
    };
    
    setTradeHistory(prev => [newTrade, ...prev]);
    console.log('Trade executed for signal:', signalId);
    return true;
  };

  // Simulate trade closure and update account info
  useEffect(() => {
    const tradeClosureInterval = setInterval(() => {
      let closedTrade: TradeHistory | null = null;

      const newTradeHistory = tradeHistory.map(trade => {
        if (trade.status === 'OPEN' && Math.random() < 0.2) { // 20% chance to close
          const signal = tradingSignals.find(s => s.id === trade.signalId);
          if (!signal) return trade;

          const isProfit = Math.random() < 0.7; // 70% chance of winning trade
          const exitPrice = isProfit ? signal.takeProfit : signal.stopLoss;

          const profit = (exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'BUY' ? 1 : -1);
          const profitPercent = (profit / (trade.entryPrice * trade.quantity)) * 100;
          const duration = (new Date().getTime() - trade.timestamp.getTime()) / (1000 * 60);

          console.log(`Closing trade ${trade.id} for ${trade.asset} with profit ${profit.toFixed(2)}`);

          closedTrade = {
            ...trade,
            exitPrice,
            profit,
            profitPercent,
            duration,
            status: 'CLOSED' as const,
          };
          return closedTrade;
        }
        return trade;
      });

      if (closedTrade) {
        setTradeHistory(newTradeHistory);

        // Update account info
        setAccountInfo(prevInfo => {
          const newBalance = prevInfo.balance + (closedTrade as TradeHistory).profit;
          const allClosedTrades = newTradeHistory.filter(t => t.status === 'CLOSED');
          const winningTrades = allClosedTrades.filter(t => t.profit > 0).length;
          const newWinRate = allClosedTrades.length > 0 ? (winningTrades / allClosedTrades.length) * 100 : 0;

          return {
            ...prevInfo,
            balance: newBalance,
            equity: newBalance, // Simplified for now
            totalProfit: prevInfo.totalProfit + (closedTrade as TradeHistory).profit,
            totalTrades: allClosedTrades.length,
            winRate: newWinRate,
          };
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(tradeClosureInterval);
  }, [tradeHistory, tradingSignals]);

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
    appSettings,
    isLoading,
    lastDataUpdate,
    refreshData,
    updateRiskSettings,
    updateAppSettings,
    addTradingSignal,
    executeTrade,
    getMarketStatus,
  };
};
