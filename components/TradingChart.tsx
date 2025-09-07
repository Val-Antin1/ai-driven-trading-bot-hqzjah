
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, responsiveValues } from '../styles/commonStyles';
import { generateMockChartData } from '../data/mockData';
import { 
  getChartDimensions, 
  getResponsiveFontSizes, 
  getResponsivePadding,
  isTablet,
  isSmallDevice 
} from '../utils/responsive';

interface TradingChartProps {
  symbol: string;
  timeframe: string;
  height?: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol, 
  timeframe, 
  height 
}) => {
  const chartData = generateMockChartData(symbol, timeframe);
  const chartDimensions = getChartDimensions();
  const fonts = getResponsiveFontSizes();
  const padding = getResponsivePadding();
  
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
        <Text style={styles.title}>{symbol}</Text>
        <Text style={styles.timeframe}>{timeframe}</Text>
      </View>
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
  chart: {
    borderRadius: responsiveValues.scale(12),
  },
});

export default TradingChart;
