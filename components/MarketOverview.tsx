
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MarketData } from '../types/trading';
import { colors } from '../styles/commonStyles';

interface MarketOverviewProps {
  marketData: MarketData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.marketList}>
          {marketData.map((item, index) => (
            <View key={index} style={styles.marketItem}>
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
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  marketList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  marketItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  changeContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: 11,
    fontWeight: '500',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 10,
    color: colors.grey,
    marginRight: 2,
  },
  volume: {
    fontSize: 10,
    color: colors.grey,
    fontWeight: '500',
  },
});

export default MarketOverview;
