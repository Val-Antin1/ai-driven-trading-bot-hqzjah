
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, responsiveValues } from '../styles/commonStyles';
import { marketService, MarketStatus } from '../services/marketService';
import { MarketData } from '../types/trading';
import { 
  getChartDimensions, 
  getResponsiveFontSizes, 
  getResponsivePadding,
  isTablet,
  isSmallDevice 
} from '../utils/responsive';
import Icon from './Icon';

interface LiveTradingChartProps {
  symbol: string;
  timeframe: string;
  height?: number;
  updateInterval?: number;
}

interface ChartDataPoint {
  price: number;
  timestamp: Date;
}

const LiveTradingChart: React.FC<LiveTradingChartProps> = ({ 
  symbol, 
  timeframe, 
  height,
  updateInterval = 2000 // 2 seconds default
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const chartDataRef = useRef<ChartDataPoint[]>([]);
  
  const chartDimensions = getChartDimensions();
  const fonts = getResponsiveFontSizes();
  const padding = getResponsivePadding();
  
  const chartHeight = height || chartDimensions.height;
  const chartWidth = chartDimensions.width;
  const labelFrequency = isSmallDevice() ? 6 : isTablet() ? 3 : 5;

  useEffect(() => {
    console.log(`Initializing live chart for ${symbol}`);
    
    // Check market status
    const status = marketService.getMarketStatus(symbol);
    setMarketStatus(status);
    
    // Initialize with some historical data
    initializeChartData();
    
    // Start live data if enabled
    if (status.isOpen || symbol.includes('BTC') || symbol.includes('ETH')) {
      startLiveUpdates();
    }
    
    return () => {
      stopLiveUpdates();
    };
  }, [symbol, updateInterval]);

  const initializeChartData = () => {
    const initialData: ChartDataPoint[] = [];
    const basePrice = getBasePrice(symbol);
    
    // Generate 30 initial data points
    for (let i = 29; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.01;
      const price = basePrice * (1 + variation);
      const timestamp = new Date(Date.now() - i * 60 * 1000); // 1 minute intervals
      
      initialData.push({ price, timestamp });
    }
    
    setChartData(initialData);
    chartDataRef.current = initialData;
  };

  const startLiveUpdates = () => {
    console.log(`Starting live updates for ${symbol}`);
    setIsLive(true);
    
    const handleLiveData = (data: MarketData) => {
      const newDataPoint: ChartDataPoint = {
        price: data.price,
        timestamp: data.timestamp,
      };
      
      // Update chart data (keep last 30 points)
      const updatedData = [...chartDataRef.current, newDataPoint].slice(-30);
      chartDataRef.current = updatedData;
      setChartData(updatedData);
      setLastUpdate(new Date());
      
      console.log(`Live data update for ${symbol}: ${data.price.toFixed(4)}`);
    };
    
    marketService.startLiveData(
      { symbol, interval: updateInterval, enabled: true },
      handleLiveData
    );
  };

  const stopLiveUpdates = () => {
    console.log(`Stopping live updates for ${symbol}`);
    setIsLive(false);
    marketService.stopLiveData(symbol);
  };

  const toggleLiveUpdates = () => {
    if (isLive) {
      stopLiveUpdates();
    } else {
      const status = marketService.getMarketStatus(symbol);
      if (!status.isOpen && !symbol.includes('BTC') && !symbol.includes('ETH')) {
        Alert.alert(
          'Market Closed',
          `${symbol} market is currently closed. ${status.reason || 'Trading will resume when the market opens.'}`,
          [
            { text: 'Show Historical Data', onPress: startLiveUpdates },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else {
        startLiveUpdates();
      }
    }
  };

  const getBasePrice = (symbol: string): number => {
    const basePrices: { [key: string]: number } = {
      'EURUSD': 1.0845,
      'GBPUSD': 1.2634,
      'BTCUSD': 43250.50,
      'ETHUSD': 2634.75,
      'USDJPY': 149.85,
      'AUDUSD': 0.6523,
    };
    return basePrices[symbol] || 1.0000;
  };

  const formatPrice = (price: number): string => {
    if (symbol.includes('JPY')) {
      return price.toFixed(2);
    } else if (symbol.includes('BTC') || symbol.includes('ETH')) {
      return price.toFixed(2);
    } else {
      return price.toFixed(4);
    }
  };

  const getStatusColor = (): string => {
    if (!marketStatus) return colors.grey;
    return marketStatus.isOpen ? colors.success : colors.error;
  };

  const getStatusText = (): string => {
    if (!marketStatus) return 'Loading...';
    
    if (marketStatus.isOpen) {
      return isLive ? 'LIVE' : 'PAUSED';
    } else {
      return 'CLOSED';
    }
  };

  const chartConfig = {
    backgroundColor: colors.backgroundAlt,
    backgroundGradientFrom: colors.backgroundAlt,
    backgroundGradientTo: colors.backgroundAlt,
    decimalPlaces: symbol.includes('BTC') || symbol.includes('ETH') ? 0 : 4,
    color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(227, 227, 227, ${opacity})`,
    style: {
      borderRadius: responsiveValues.scale(16),
    },
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.grey,
      strokeOpacity: 0.1,
    },
    propsForLabels: {
      fontSize: fonts.xs,
    },
  };

  const chartDisplayData = {
    labels: chartData
      .filter((_, index) => index % labelFrequency === 0)
      .map(point => point.timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })),
    datasets: [
      {
        data: chartData.map(point => point.price),
        color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
        strokeWidth: isSmallDevice() ? 1.5 : 2,
      },
    ],
  };

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{symbol}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
        
        <View style={styles.priceSection}>
          <Text style={styles.price}>{formatPrice(currentPrice)}</Text>
          <Text style={[
            styles.change,
            { color: priceChange >= 0 ? colors.success : colors.error }
          ]}>
            {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)} ({priceChangePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: isLive ? colors.error : colors.success }]}
          onPress={toggleLiveUpdates}
        >
          <Icon 
            name={isLive ? 'pause' : 'play'} 
            size={responsiveValues.scale(16)} 
            color={colors.white} 
          />
          <Text style={styles.controlButtonText}>
            {isLive ? 'Pause' : 'Start'} Live
          </Text>
        </TouchableOpacity>

        {lastUpdate && (
          <Text style={styles.lastUpdate}>
            Last: {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
      </View>

      {!marketStatus?.isOpen && !symbol.includes('BTC') && !symbol.includes('ETH') && (
        <View style={styles.marketClosedBanner}>
          <Icon name="info" size={responsiveValues.scale(16)} color={colors.warning} />
          <Text style={styles.marketClosedText}>
            Market closed - Showing historical data
          </Text>
        </View>
      )}

      {chartData.length > 0 && (
        <LineChart
          data={chartDisplayData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          formatYLabel={(value) => {
            const num = parseFloat(value);
            return formatPrice(num);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsiveValues.padding.sm,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs,
  },
  title: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(4),
  },
  statusText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '600',
    color: colors.white,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
  },
  change: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.sm,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs / 2,
    paddingHorizontal: responsiveValues.padding.sm,
    paddingVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(6),
  },
  controlButtonText: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.white,
  },
  lastUpdate: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
  },
  marketClosedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs / 2,
    backgroundColor: colors.warning + '20',
    padding: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(6),
    marginBottom: responsiveValues.padding.sm,
  },
  marketClosedText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.warning,
    fontWeight: '500',
  },
  chart: {
    borderRadius: responsiveValues.scale(12),
  },
});

export default LiveTradingChart;
