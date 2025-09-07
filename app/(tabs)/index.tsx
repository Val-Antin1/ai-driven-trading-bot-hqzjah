
import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTradingData } from '../../hooks/useTradingData';
import TradingChart from '../../components/TradingChart';
import MarketOverview from '../../components/MarketOverview';
import AccountSummary from '../../components/AccountSummary';
import SignalCard from '../../components/SignalCard';
import Icon from '../../components/Icon';

export default function DashboardScreen() {
  const {
    marketData,
    tradingSignals,
    accountInfo,
    isLoading,
    refreshData,
    executeTrade,
  } = useTradingData();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['25%', '50%', '90%'];

  const handleSheetChanges = (index: number) => {
    console.log('Bottom sheet changed to index:', index);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const activeSignals = tradingSignals.filter(signal => signal.status === 'ACTIVE');
  const latestSignal = activeSignals[0];

  return (
    <GestureHandlerRootView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>AI Trading Bot</Text>
            <Text style={styles.headerSubtitle}>
              {activeSignals.length} active signals
            </Text>
          </View>
          <TouchableOpacity onPress={openBottomSheet} style={styles.infoButton}>
            <Icon name="information-circle" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              tintColor={colors.accent}
            />
          }
        >
          <MarketOverview marketData={marketData} />
          
          <AccountSummary accountInfo={accountInfo} />

          {latestSignal && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Latest Signal</Text>
              <TradingChart 
                symbol={latestSignal.asset} 
                timeframe={latestSignal.timeframe}
                height={200}
              />
              <SignalCard 
                signal={latestSignal} 
                onExecute={executeTrade}
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Analysis</Text>
            <TradingChart 
              symbol="EURUSD" 
              timeframe="1h"
              height={180}
            />
          </View>

          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.statLabel}>Win Rate</Text>
              <Text style={styles.statValue}>{accountInfo.winRate.toFixed(1)}%</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="flash" size={20} color={colors.accent} />
              <Text style={styles.statLabel}>Active Signals</Text>
              <Text style={styles.statValue}>{activeSignals.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="bar-chart" size={20} color="#FF9800" />
              <Text style={styles.statLabel}>Total Trades</Text>
              <Text style={styles.statValue}>{accountInfo.totalTrades}</Text>
            </View>
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: colors.backgroundAlt }}
          handleIndicatorStyle={{ backgroundColor: colors.grey }}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>AI Trading Assistant</Text>
            <Text style={styles.bottomSheetText}>
              Our AI analyzes market data using advanced technical indicators including RSI, MACD, and Moving Averages to generate high-confidence trading signals.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Real-time market analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Risk management tools</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Multi-timeframe signals</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>News sentiment analysis</Text>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 2,
  },
  infoButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  bottomSheetText: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
});
