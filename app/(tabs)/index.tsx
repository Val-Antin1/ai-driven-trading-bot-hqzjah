
import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors, commonStyles, responsiveValues } from '../../styles/commonStyles';
import { useTradingData } from '../../hooks/useTradingData';
import { isTablet, isSmallDevice } from '../../utils/responsive';
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
  const snapPoints = isTablet() ? ['20%', '40%', '80%'] : ['25%', '50%', '90%'];

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
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>AI Trading Bot</Text>
            <Text style={styles.headerSubtitle}>
              {activeSignals.length} active signals
            </Text>
          </View>
          <TouchableOpacity onPress={openBottomSheet} style={styles.infoButton}>
            <Icon name="information-circle" size={responsiveValues.scale(24)} color={colors.accent} />
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
              />
              <View style={styles.signalContainer}>
                <SignalCard 
                  signal={latestSignal} 
                  onExecute={executeTrade}
                />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Analysis</Text>
            <TradingChart 
              symbol="EURUSD" 
              timeframe="1h"
            />
          </View>

          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={responsiveValues.scale(20)} color="#4CAF50" />
              <Text style={styles.statLabel}>Win Rate</Text>
              <Text style={styles.statValue}>{accountInfo.winRate.toFixed(1)}%</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="flash" size={responsiveValues.scale(20)} color={colors.accent} />
              <Text style={styles.statLabel}>Active Signals</Text>
              <Text style={styles.statValue}>{activeSignals.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="bar-chart" size={responsiveValues.scale(20)} color="#FF9800" />
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
                <Icon name="checkmark-circle" size={responsiveValues.scale(16)} color="#4CAF50" />
                <Text style={styles.featureText}>Real-time market analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={responsiveValues.scale(16)} color="#4CAF50" />
                <Text style={styles.featureText}>Risk management tools</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={responsiveValues.scale(16)} color="#4CAF50" />
                <Text style={styles.featureText}>Multi-timeframe signals</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={responsiveValues.scale(16)} color="#4CAF50" />
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
    paddingHorizontal: responsiveValues.padding.md,
    paddingVertical: responsiveValues.padding.md,
    backgroundColor: colors.backgroundAlt,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: responsiveValues.fonts.title,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    marginTop: responsiveValues.padding.xs / 2,
  },
  infoButton: {
    padding: responsiveValues.padding.xs,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
  },
  sectionTitle: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.sm,
  },
  signalContainer: {
    marginTop: responsiveValues.padding.xs,
  },
  quickStats: {
    flexDirection: isTablet() ? 'row' : 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.md,
    borderRadius: responsiveValues.scale(12),
    paddingVertical: responsiveValues.padding.lg,
    flexWrap: isSmallDevice() ? 'wrap' : 'nowrap',
    gap: isSmallDevice() ? responsiveValues.padding.sm : 0,
  },
  statItem: {
    alignItems: 'center',
    flex: isTablet() ? 1 : undefined,
    minWidth: isSmallDevice() ? '30%' : undefined,
  },
  statLabel: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
    marginTop: responsiveValues.padding.xs / 2,
    marginBottom: responsiveValues.padding.xs / 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
  },
  bottomSheetContent: {
    padding: responsiveValues.padding.lg,
  },
  bottomSheetTitle: {
    fontSize: responsiveValues.fonts.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.sm,
  },
  bottomSheetText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    lineHeight: responsiveValues.fonts.sm * 1.4,
    marginBottom: responsiveValues.padding.md,
  },
  featureList: {
    marginTop: responsiveValues.padding.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.xs,
  },
  featureText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.text,
    marginLeft: responsiveValues.padding.xs,
  },
});
