
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../styles/commonStyles';
import { generateMockChartData } from '../data/mockData';

interface TradingChartProps {
  symbol: string;
  timeframe: string;
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol, 
  timeframe, 
  height = 220 
}) => {
  const chartData = generateMockChartData(symbol, timeframe);

  const chartConfig = {
    backgroundColor: colors.backgroundAlt,
    backgroundGradientFrom: colors.backgroundAlt,
    backgroundGradientTo: colors.backgroundAlt,
    decimalPlaces: 4,
    color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(227, 227, 227, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.grey,
      strokeOpacity: 0.1,
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
          labels: chartData.labels.filter((_, index) => index % 5 === 0),
          datasets: [
            {
              data: chartData.data,
              color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 40}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  timeframe: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chart: {
    borderRadius: 12,
  },
});

export default TradingChart;
