
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, responsiveValues } from '../styles/commonStyles';
import { generateMockChartData } from '../data/mockData';
import { marketService } from '../services/marketService';
import { 
  getChartDimensions, 
  getResponsiveFontSizes, 
  getResponsivePadding,
  isTablet,
  isSmallDevice 
} from '../utils/responsive';
import Icon from './Icon';

interface TradingChartProps {
  symbol: string;
  timeframe: string;
  height?: number;
  showLiveUpgrade?: boolean;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol, 
  timeframe, 
  height,
  showLiveUpgrade = true
}) => {
  const chartData = generateMockChartData(symbol, timeframe);
  const chartDimensions = getChartDimensions();
  const fonts = getResponsiveFontSizes();
  const padding = getResponsivePadding();
  
  // Check market status
  const marketStatus = marketService.getMarketStatus(symbol);
  
  // Use provided height or responsive default
  const chartHeight = height || chartDimensions.height;
  const chartWidth = chartDimensions.width;

  // Adjust label frequency based on screen size
  const labelFrequency = isSmallDevice() ? 6 : isTablet() ? 3 : 5;

  const chartConfig = {
    backgroundColor: colors.backgroundAlt,
    backgroundGradientFrom: colors.backgroundAlt,
    backgroundGradientTo: colors.backgroundAlt,
    decimalPlaces: 4,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{symbol}</Text>
          <Text style={styles.timeframe}>{timeframe}</Text>
        </View>
        
        {!marketStatus.isOpen && !symbol.includes('BTC') && !symbol.includes('ETH') && (
          <View style={styles.statusBadge}>
            <Icon name="clock" size={responsiveValues.scale(12)} color={colors.error} />
            <Text style={styles.statusText}>CLOSED</Text>
          </View>
        )}
      </View>

      {showLiveUpgrade && (
        <View style={styles.upgradeNotice}>
          <Icon name="trending-up" size={responsiveValues.scale(16)} color={colors.primary} />
          <Text style={styles.upgradeText}>
            Upgrade to LiveTradingChart for real-time data and market status
          </Text>
        </View>
      )}

      {!marketStatus.isOpen && !symbol.includes('BTC') && !symbol.includes('ETH') && (
        <View style={styles.marketClosedBanner}>
          <Icon name="info" size={responsiveValues.scale(16)} color={colors.warning} />
          <Text style={styles.marketClosedText}>
            {marketStatus.reason || 'Market is currently closed'}
          </Text>
        </View>
      )}

      <LineChart
        data={{
          labels: chartData.labels.filter((_, index) => index % labelFrequency === 0),
          datasets: [
            {
              data: chartData.data,
              color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
              strokeWidth: isSmallDevice() ? 1.5 : 2,
            },
          ],
        }}
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
          return isSmallDevice() ? num.toFixed(2) : num.toFixed(4);
        }}
      />
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
    alignItems: 'center',
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
  timeframe: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '500',
    color: colors.grey,
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(6),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs / 2,
    backgroundColor: colors.error + '20',
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(4),
  },
  statusText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '600',
    color: colors.error,
  },
  upgradeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs / 2,
    backgroundColor: colors.primary + '20',
    padding: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(6),
    marginBottom: responsiveValues.padding.sm,
  },
  upgradeText: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.primary,
    fontWeight: '500',
    flex: 1,
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
    flex: 1,
  },
  chart: {
    borderRadius: responsiveValues.scale(12),
  },
});

export default TradingChart;
