
import { MarketData } from '../types/trading';

export interface MarketStatus {
  isOpen: boolean;
  nextOpen?: Date;
  nextClose?: Date;
  timezone: string;
  reason?: string;
}

export interface LiveDataConfig {
  symbol: string;
  interval: number; // milliseconds
  enabled: boolean;
}

class MarketService {
  private liveDataIntervals: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Map<string, ((data: MarketData) => void)[]> = new Map();

  // Forex market hours (UTC)
  private forexMarketHours = {
    // Sunday 22:00 UTC to Friday 22:00 UTC
    openDay: 0, // Sunday
    openHour: 22,
    closeDay: 5, // Friday
    closeHour: 22,
  };

  // Crypto markets are 24/7
  private cryptoMarkets = ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD'];

  getMarketStatus(symbol: string): MarketStatus {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const currentDay = utcNow.getUTCDay();
    const currentHour = utcNow.getUTCHours();

    // Crypto markets are always open
    if (this.cryptoMarkets.includes(symbol)) {
      return {
        isOpen: true,
        timezone: 'UTC',
      };
    }

    // Forex market logic
    const isWeekend = currentDay === 6 || (currentDay === 0 && currentHour < 22);
    const isFridayAfterClose = currentDay === 5 && currentHour >= 22;
    
    if (isWeekend || isFridayAfterClose) {
      // Calculate next market open (Sunday 22:00 UTC)
      const nextOpen = new Date(utcNow);
      const daysUntilSunday = (7 - currentDay) % 7;
      nextOpen.setUTCDate(nextOpen.getUTCDate() + daysUntilSunday);
      nextOpen.setUTCHours(22, 0, 0, 0);
      
      if (currentDay === 0 && currentHour < 22) {
        // It's Sunday before market open
        nextOpen.setUTCDate(nextOpen.getUTCDate() - 7);
      }

      return {
        isOpen: false,
        nextOpen,
        timezone: 'UTC',
        reason: 'Forex markets are closed on weekends',
      };
    }

    // Market is open, calculate next close (Friday 22:00 UTC)
    const nextClose = new Date(utcNow);
    const daysUntilFriday = (5 - currentDay + 7) % 7;
    nextClose.setUTCDate(nextClose.getUTCDate() + daysUntilFriday);
    nextClose.setUTCHours(22, 0, 0, 0);

    return {
      isOpen: true,
      nextClose,
      timezone: 'UTC',
    };
  }

  startLiveData(config: LiveDataConfig, callback: (data: MarketData) => void): void {
    console.log(`Starting live data for ${config.symbol}`);
    
    // Add subscriber
    if (!this.subscribers.has(config.symbol)) {
      this.subscribers.set(config.symbol, []);
    }
    this.subscribers.get(config.symbol)!.push(callback);

    // Don't start multiple intervals for the same symbol
    if (this.liveDataIntervals.has(config.symbol)) {
      return;
    }

    const marketStatus = this.getMarketStatus(config.symbol);
    
    if (!marketStatus.isOpen && !this.cryptoMarkets.includes(config.symbol)) {
      console.log(`Market closed for ${config.symbol}, using historical data`);
      // Still provide updates with historical data simulation
      this.startHistoricalDataSimulation(config, callback);
      return;
    }

    // Start real-time data simulation
    const interval = setInterval(() => {
      const mockData = this.generateLiveData(config.symbol);
      
      // Notify all subscribers
      const subscribers = this.subscribers.get(config.symbol) || [];
      subscribers.forEach(cb => cb(mockData));
    }, config.interval);

    this.liveDataIntervals.set(config.symbol, interval);
  }

  stopLiveData(symbol: string, callback?: (data: MarketData) => void): void {
    console.log(`Stopping live data for ${symbol}`);
    
    if (callback) {
      // Remove specific subscriber
      const subscribers = this.subscribers.get(symbol) || [];
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    } else {
      // Remove all subscribers
      this.subscribers.delete(symbol);
    }

    // If no more subscribers, stop the interval
    const remainingSubscribers = this.subscribers.get(symbol) || [];
    if (remainingSubscribers.length === 0) {
      const interval = this.liveDataIntervals.get(symbol);
      if (interval) {
        clearInterval(interval);
        this.liveDataIntervals.delete(symbol);
      }
    }
  }

  private startHistoricalDataSimulation(config: LiveDataConfig, callback: (data: MarketData) => void): void {
    // Simulate slower updates for historical data
    const interval = setInterval(() => {
      const mockData = this.generateHistoricalData(config.symbol);
      callback(mockData);
    }, config.interval * 3); // 3x slower updates for historical data

    this.liveDataIntervals.set(config.symbol, interval);
  }

  private generateLiveData(symbol: string): MarketData {
    // Base prices for different symbols
    const basePrices: { [key: string]: number } = {
      'EURUSD': 1.0845,
      'GBPUSD': 1.2634,
      'BTCUSD': 43250.50,
      'ETHUSD': 2634.75,
      'USDJPY': 149.85,
      'AUDUSD': 0.6523,
    };

    const basePrice = basePrices[symbol] || 1.0000;
    
    // Generate realistic price movement
    const volatility = symbol.includes('USD') && !symbol.includes('BTC') && !symbol.includes('ETH') 
      ? 0.0002 // Lower volatility for forex
      : 0.002; // Higher volatility for crypto
    
    const change = (Math.random() - 0.5) * volatility;
    const newPrice = basePrice * (1 + change);
    
    return {
      symbol,
      price: newPrice,
      change: change * basePrice,
      changePercent: change * 100,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      high24h: newPrice * (1 + Math.random() * 0.01),
      low24h: newPrice * (1 - Math.random() * 0.01),
      timestamp: new Date(),
    };
  }

  private generateHistoricalData(symbol: string): MarketData {
    // Similar to live data but with smaller movements
    const basePrices: { [key: string]: number } = {
      'EURUSD': 1.0845,
      'GBPUSD': 1.2634,
      'BTCUSD': 43250.50,
      'ETHUSD': 2634.75,
      'USDJPY': 149.85,
      'AUDUSD': 0.6523,
    };

    const basePrice = basePrices[symbol] || 1.0000;
    const change = (Math.random() - 0.5) * 0.0001; // Much smaller movements
    const newPrice = basePrice * (1 + change);
    
    return {
      symbol,
      price: newPrice,
      change: change * basePrice,
      changePercent: change * 100,
      volume: Math.floor(Math.random() * 500000) + 100000,
      high24h: newPrice * (1 + Math.random() * 0.005),
      low24h: newPrice * (1 - Math.random() * 0.005),
      timestamp: new Date(),
    };
  }

  cleanup(): void {
    // Clear all intervals
    this.liveDataIntervals.forEach(interval => clearInterval(interval));
    this.liveDataIntervals.clear();
    this.subscribers.clear();
  }
}

export const marketService = new MarketService();
