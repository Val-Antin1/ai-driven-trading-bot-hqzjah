
import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useTradingData } from '../../hooks/useTradingData';
import { isTablet, isSmallDevice } from '../../utils/responsive';
import { colors, commonStyles, responsiveValues } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import LiveTradingChart from '../../components/LiveTradingChart';
import MarketStatusIndicator from '../../components/MarketStatusIndicator';
import AccountSummary from '../../components/AccountSummary';
import SignalCard from '../../components/SignalCard';
import MarketOverview from '../../components/MarketOverview';

const DashboardScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {
    marketData,
    tradingSignals,
    accountInfo,
    newsEvents,
    isLoading,
    refreshData,
    executeTrade,
  } = useTradingData();

  const handleSheetChanges = (index: number) => {
    console.log('Bottom sheet changed to index:', index);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // Get major trading symbols for market status
  const majorSymbols = ['EURUSD', 'GBPUSD', 'BTCUSD', 'ETHUSD'];

  return (
    <GestureHandlerRootView style={commonStyles.flex1}>
      <View style={commonStyles.container}>
        <ScrollView
          style={commonStyles.flex1}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
              <Text style={styles.title}>Trading Dashboard</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={openBottomSheet}
            >
              <Icon name="settings" size={responsiveValues.scale(24)} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Market Status Indicator */}
          <MarketStatusIndicator symbols={majorSymbols} />

          {/* Account Summary */}
          <AccountSummary accountInfo={accountInfo} />

          {/* Live Trading Charts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Charts</Text>
            <LiveTradingChart 
              symbol="EURUSD" 
              timeframe="1h" 
              updateInterval={2000}
            />
            <LiveTradingChart 
              symbol="BTCUSD" 
              timeframe="1h" 
              updateInterval={3000}
            />
          </View>

          {/* Market Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            <MarketOverview marketData={marketData} />
          </View>

          {/* Recent Signals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Signals</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {tradingSignals.slice(0, 3).map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onExecute={executeTrade}
              />
            ))}
          </View>

          {/* Upcoming News */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming News</Text>
            {newsEvents.slice(0, 3).map((event) => (
              <View key={event.id} style={styles.newsCard}>
                <View style={styles.newsHeader}>
                  <Text style={styles.newsTitle}>{event.title}</Text>
                  <View style={[
                    styles.impactBadge,
                    event.impact === 'HIGH' && styles.impactBadgeHigh,
                    event.impact === 'MEDIUM' && styles.impactBadgeMedium,
                  ]}>
                    <Text style={styles.impactBadgeText}>{event.impact}</Text>
                  </View>
                </View>
                <Text style={styles.newsTime}>
                  {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </View>

          {/* Bottom padding for safe area */}
          <View style={{ height: responsiveValues.padding.xl }} />
        </ScrollView>

        {/* Bottom Sheet for Quick Actions */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['25%', '50%']}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: colors.backgroundAlt }}
          handleIndicatorStyle={{ backgroundColor: colors.grey }}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Quick Actions</Text>
            
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton}>
                <Icon name="trending-up" size={responsiveValues.scale(24)} color={colors.primary} />
                <Text style={styles.quickActionText}>New Signal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <Icon name="bar-chart" size={responsiveValues.scale(24)} color={colors.primary} />
                <Text style={styles.quickActionText}>Analysis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <Icon name="settings" size={responsiveValues.scale(24)} color={colors.primary} />
                <Text style={styles.quickActionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveValues.padding.lg,
    paddingTop: responsiveValues.padding.lg,
    paddingBottom: responsiveValues.padding.md,
  },
  greeting: {
    fontSize: responsiveValues.fonts.md,
    color: colors.grey,
    fontWeight: '500',
  },
  title: {
    fontSize: responsiveValues.fonts.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: responsiveValues.padding.xs / 2,
  },
  settingsButton: {
    padding: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(8),
    backgroundColor: colors.backgroundAlt,
  },
  section: {
    paddingHorizontal: responsiveValues.padding.lg,
    marginBottom: responsiveValues.padding.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.md,
  },
  sectionTitle: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  bottomSheetContent: {
    flex: 1,
    padding: responsiveValues.padding.lg,
  },
  bottomSheetTitle: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.lg,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: responsiveValues.padding.md,
    borderRadius: responsiveValues.scale(12),
    backgroundColor: colors.background,
    minWidth: responsiveValues.scale(80),
  },
  quickActionText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.text,
    fontWeight: '600',
    marginTop: responsiveValues.padding.xs,
    textAlign: 'center',
  },
  newsCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
    marginBottom: responsiveValues.padding.xs,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.xs,
  },
  newsTitle: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(4),
    backgroundColor: colors.grey,
  },
  impactBadgeHigh: {
    backgroundColor: '#F44336',
  },
  impactBadgeMedium: {
    backgroundColor: '#FF9800',
  },
  impactBadgeText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '700',
    color: 'white',
  },
  newsTime: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
  },
});

export default DashboardScreen;
