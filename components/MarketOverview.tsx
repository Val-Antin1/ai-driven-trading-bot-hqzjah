
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MarketData } from '../types/trading';
import { colors, responsiveValues } from '../styles/commonStyles';
import { isTablet, isSmallDevice, getGridColumns } from '../utils/responsive';

interface MarketOverviewProps {
  marketData: MarketData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData }) => {
  // Calculate item width based on screen size
  const itemWidth = isTablet() ? 140 : isSmallDevice() ? 110 : 120;
  const spacing = responsiveValues.padding.sm;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Overview</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.marketList}>
          {marketData.map((item, index) => (
            <View key={index} style={[styles.marketItem, { minWidth: itemWidth }]}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={styles.price}>{item.price.toFixed(4)}</Text>
              <View style={styles.changeContainer}>
                <Text style={[
                  styles.change,
                  { color: item.change >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(4)}
                </Text>
                <Text style={[
                  styles.changePercent,
                  { color: item.changePercent >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </Text>
              </View>
              <View style={styles.volumeContainer}>
                <Text style={styles.volumeLabel}>Vol:</Text>
                <Text style={styles.volume}>
                  {(item.volume / 1000000).toFixed(1)}M
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveValues.padding.xs,
  },
  title: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.sm,
    paddingHorizontal: responsiveValues.padding.md,
  },
  scrollContent: {
    paddingHorizontal: responsiveValues.padding.md,
  },
  marketList: {
    flexDirection: 'row',
    gap: responsiveValues.padding.sm,
  },
  marketItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.xs / 2,
  },
  price: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: responsiveValues.padding.xs / 2,
  },
  changeContainer: {
    alignItems: 'center',
    marginBottom: responsiveValues.padding.xs / 2,
  },
  change: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '500',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
    marginRight: responsiveValues.padding.xs / 2,
  },
  volume: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
    fontWeight: '500',
  },
});

export default MarketOverview;
