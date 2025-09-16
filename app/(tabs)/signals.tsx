
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { colors, commonStyles, responsiveValues } from '../../styles/commonStyles';
import { useTradingData } from '../../hooks/useTradingData';
import { isTablet, isSmallDevice } from '../../utils/responsive';
import SignalCard from '../../components/SignalCard';
import Icon from '../../components/Icon';
import { TimeFrame, TradingMode } from '../../types/trading';

export default function SignalsScreen() {
  const {
    tradingSignals,
    isLoading,
    refreshData,
    executeTrade,
  } = useTradingData();

  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame | 'ALL'>('ALL');
  const [selectedMode, setSelectedMode] = useState<TradingMode | 'ALL'>('ALL');

  const timeframes: (TimeFrame | 'ALL')[] = ['ALL', '1m', '5m', '15m', '1h', '4h', '1d'];
  const modes: (TradingMode | 'ALL')[] = ['ALL', 'SCALPING', 'DAY_TRADING', 'SWING_TRADING'];

  const filteredSignals = tradingSignals.filter(signal => {
    const timeframeMatch = selectedTimeframe === 'ALL' || signal.timeframe === selectedTimeframe;
    const modeMatch = selectedMode === 'ALL' || signal.mode === selectedMode;
    return timeframeMatch && modeMatch;
  });

  const activeSignals = filteredSignals.filter(signal => signal.status === 'ACTIVE');
  const executedSignals = filteredSignals.filter(signal => signal.status === 'EXECUTED');

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Signals</Text>
        <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
          <Icon name="refresh" size={responsiveValues.scale(20)} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Timeframe:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.filterButton,
                  selectedTimeframe === timeframe && styles.filterButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedTimeframe === timeframe && styles.filterButtonTextActive
                ]}>
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
        {activeSignals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Signals</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeSignals.length}</Text>
              </View>
            </View>
            {activeSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onExecute={executeTrade}
              />
            ))}
          </View>
        )}

        {executedSignals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Executions</Text>
              <View style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.badgeText}>{executedSignals.length}</Text>
              </View>
            </View>
            {executedSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onExecute={executeTrade}
              />
            ))}
          </View>
        )}

        {filteredSignals.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="flash-off" size={responsiveValues.scale(48)} color={colors.grey} />
            <Text style={styles.emptyStateTitle}>No Signals Available</Text>
            <Text style={styles.emptyStateText}>
              The AI is analyzing market conditions. New signals will appear when opportunities are detected.
            </Text>
          </View>
        )}

        <View style={styles.aiInsight}>
          <View style={styles.aiInsightHeader}>
            <Icon name="bulb" size={responsiveValues.scale(20)} color="#FF9800" />
            <Text style={styles.aiInsightTitle}>AI Market Insight</Text>
          </View>
          <Text style={styles.aiInsightText}>
            Current market conditions show moderate volatility. The AI recommends waiting for clearer directional signals before entering new positions. Risk sentiment is neutral.
          </Text>
        </View>
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: responsiveValues.fonts.title,
    fontWeight: '800',
    color: colors.text,
  },
  refreshButton: {
    padding: responsiveValues.padding.xs,
  },
  filtersContainer: {
    paddingHorizontal: responsiveValues.padding.md,
    paddingVertical: responsiveValues.padding.sm,
    backgroundColor: colors.background,
  },
  filterLabel: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: responsiveValues.padding.xs,
  },
  filterRow: {
    flexDirection: 'row',
    gap: responsiveValues.padding.xs,
  },
  filterButton: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: responsiveValues.padding.sm,
    paddingVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(16),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterButtonText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.sm,
  },
  sectionTitle: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginRight: responsiveValues.padding.xs,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: responsiveValues.scale(10),
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    minWidth: responsiveValues.scale(20),
    alignItems: 'center',
  },
  badgeText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '700',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveValues.padding.xl * 2,
    paddingHorizontal: responsiveValues.padding.xl,
  },
  emptyStateTitle: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: responsiveValues.padding.md,
    marginBottom: responsiveValues.padding.xs,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: responsiveValues.fonts.sm * 1.4,
  },
  aiInsight: {
    backgroundColor: colors.backgroundAlt,
    margin: responsiveValues.padding.md,
    padding: responsiveValues.padding.md,
    borderRadius: responsiveValues.scale(12),
    borderLeftWidth: responsiveValues.scale(4),
    borderLeftColor: '#FF9800',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.xs,
  },
  aiInsightTitle: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
    marginLeft: responsiveValues.padding.xs,
  },
  aiInsightText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    lineHeight: responsiveValues.fonts.sm * 1.3,
  },
});
