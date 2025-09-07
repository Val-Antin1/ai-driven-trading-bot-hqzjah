
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTradingData } from '../../hooks/useTradingData';
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
    // For now, we'll just filter by timeframe since we don't have mode in our signal data
    return timeframeMatch;
  });

  const activeSignals = filteredSignals.filter(signal => signal.status === 'ACTIVE');
  const executedSignals = filteredSignals.filter(signal => signal.status === 'EXECUTED');

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Signals</Text>
        <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color={colors.accent} />
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
            <Icon name="flash-off" size={48} color={colors.grey} />
            <Text style={styles.emptyStateTitle}>No Signals Available</Text>
            <Text style={styles.emptyStateText}>
              The AI is analyzing market conditions. New signals will appear when opportunities are detected.
            </Text>
          </View>
        )}

        <View style={styles.aiInsight}>
          <View style={styles.aiInsightHeader}>
            <Icon name="bulb" size={20} color="#FF9800" />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  refreshButton: {
    padding: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterButtonText: {
    fontSize: 12,
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
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  aiInsight: {
    backgroundColor: colors.backgroundAlt,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  aiInsightText: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 18,
  },
});
