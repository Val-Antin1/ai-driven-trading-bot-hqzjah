
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles, responsiveValues } from '../../styles/commonStyles';
import { useTradingData } from '../../hooks/useTradingData';
import { TradeHistory } from '../../types/trading';
import { isTablet, isSmallDevice } from '../../utils/responsive';
import Icon from '../../components/Icon';

export default function PortfolioScreen() {
  const { tradeHistory, accountInfo } = useTradingData();
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | 'ALL'>('1W');

  const periods = ['1D', '1W', '1M', 'ALL'];

  const filterTradesByPeriod = (trades: TradeHistory[], period: string) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case '1D':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return trades;
    }

    return trades.filter(trade => trade.timestamp >= cutoffDate);
  };

  const filteredTrades = filterTradesByPeriod(tradeHistory, selectedPeriod);
  const totalProfit = filteredTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = filteredTrades.filter(trade => trade.profit > 0);
  const losingTrades = filteredTrades.filter(trade => trade.profit < 0);
  const winRate = filteredTrades.length > 0 ? (winningTrades.length / filteredTrades.length) * 100 : 0;

  const TradeItem: React.FC<{ trade: TradeHistory }> = ({ trade }) => (
    <View style={styles.tradeItem}>
      <View style={styles.tradeHeader}>
        <View style={styles.tradeInfo}>
          <Text style={styles.tradeAsset}>{trade.asset}</Text>
          <View style={[
            styles.tradeType,
            { backgroundColor: trade.type === 'BUY' ? '#4CAF50' : '#F44336' }
          ]}>
            <Text style={styles.tradeTypeText}>{trade.type}</Text>
          </View>
        </View>
        <Text style={[
          styles.tradeProfit,
          { color: trade.profit >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.tradeDetails}>
        <View style={styles.tradeDetailRow}>
          <Text style={styles.tradeDetailLabel}>Entry:</Text>
          <Text style={styles.tradeDetailValue}>{trade.entryPrice.toFixed(4)}</Text>
        </View>
        <View style={styles.tradeDetailRow}>
          <Text style={styles.tradeDetailLabel}>Exit:</Text>
          <Text style={styles.tradeDetailValue}>{trade.exitPrice.toFixed(4)}</Text>
        </View>
        <View style={styles.tradeDetailRow}>
          <Text style={styles.tradeDetailLabel}>Return:</Text>
          <Text style={[
            styles.tradeDetailValue,
            { color: trade.profitPercent >= 0 ? '#4CAF50' : '#F44336' }
          ]}>
            {trade.profitPercent >= 0 ? '+' : ''}{trade.profitPercent.toFixed(2)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.tradeFooter}>
        <Text style={styles.tradeDate}>
          {trade.timestamp.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        <Text style={styles.tradeDuration}>
          {Math.floor(trade.duration / 60)}h {trade.duration % 60}m
        </Text>
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Performance Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total P&L</Text>
              <Text style={[
                styles.summaryValue,
                { color: totalProfit >= 0 ? '#4CAF50' : '#F44336' }
              ]}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Win Rate</Text>
              <Text style={[
                styles.summaryValue,
                { color: winRate >= 70 ? '#4CAF50' : winRate >= 50 ? '#FF9800' : '#F44336' }
              ]}>
                {winRate.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Trades</Text>
              <Text style={styles.summaryValue}>{filteredTrades.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Profit</Text>
              <Text style={styles.summaryValue}>
                ${filteredTrades.length > 0 ? (totalProfit / filteredTrades.length).toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.periodSelector}>
          <Text style={styles.periodLabel}>Period:</Text>
          <View style={styles.periodButtons}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period as any)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.tradesSection}>
          <View style={styles.tradesSectionHeader}>
            <Text style={styles.sectionTitle}>Trade History</Text>
            <View style={styles.tradesStats}>
              <View style={styles.statBadge}>
                <Icon name="trending-up" size={responsiveValues.scale(12)} color="#4CAF50" />
                <Text style={styles.statBadgeText}>{winningTrades.length}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: '#F44336' }]}>
                <Icon name="trending-down" size={responsiveValues.scale(12)} color="white" />
                <Text style={styles.statBadgeText}>{losingTrades.length}</Text>
              </View>
            </View>
          </View>

          {filteredTrades.length > 0 ? (
            filteredTrades.map((trade) => (
              <TradeItem key={trade.id} trade={trade} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="bar-chart-outline" size={responsiveValues.scale(48)} color={colors.grey} />
              <Text style={styles.emptyStateTitle}>No Trades Found</Text>
              <Text style={styles.emptyStateText}>
                No trades found for the selected period. Try selecting a different time range.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.riskMetrics}>
          <Text style={styles.sectionTitle}>Risk Metrics</Text>
          <View style={styles.riskGrid}>
            <View style={styles.riskItem}>
              <Icon name="shield-checkmark" size={responsiveValues.scale(20)} color="#4CAF50" />
              <Text style={styles.riskLabel}>Max Drawdown</Text>
              <Text style={styles.riskValue}>-3.2%</Text>
            </View>
            <View style={styles.riskItem}>
              <Icon name="trending-up" size={responsiveValues.scale(20)} color={colors.accent} />
              <Text style={styles.riskLabel}>Sharpe Ratio</Text>
              <Text style={styles.riskValue}>1.85</Text>
            </View>
            <View style={styles.riskItem}>
              <Icon name="analytics" size={responsiveValues.scale(20)} color="#FF9800" />
              <Text style={styles.riskLabel}>Profit Factor</Text>
              <Text style={styles.riskValue}>2.1</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: responsiveValues.padding.md,
    paddingVertical: responsiveValues.padding.md,
    backgroundColor: colors.backgroundAlt,
  },
  headerTitle: {
    fontSize: responsiveValues.fonts.title,
    fontWeight: '800',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.backgroundAlt,
    margin: responsiveValues.padding.md,
    padding: responsiveValues.padding.md,
    borderRadius: responsiveValues.scale(12),
  },
  summaryTitle: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isTablet() ? responsiveValues.padding.sm : responsiveValues.padding.xs,
  },
  summaryItem: {
    width: isTablet() ? '48%' : '48%',
    marginBottom: responsiveValues.padding.sm,
  },
  summaryLabel: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    marginBottom: responsiveValues.padding.xs / 2,
  },
  summaryValue: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
  },
  periodSelector: {
    paddingHorizontal: responsiveValues.padding.md,
    marginBottom: responsiveValues.padding.md,
  },
  periodLabel: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: responsiveValues.padding.xs,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: responsiveValues.padding.xs,
  },
  periodButton: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: responsiveValues.padding.md,
    paddingVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(20),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  periodButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  periodButtonText: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
  },
  periodButtonTextActive: {
    color: 'white',
  },
  tradesSection: {
    paddingHorizontal: responsiveValues.padding.md,
  },
  tradesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.sm,
  },
  sectionTitle: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
  },
  tradesStats: {
    flexDirection: 'row',
    gap: responsiveValues.padding.xs / 2,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(12),
  },
  statBadgeText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '700',
    color: 'white',
    marginLeft: responsiveValues.padding.xs / 2,
  },
  tradeItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
    marginBottom: responsiveValues.padding.xs,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.sm,
  },
  tradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradeAsset: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
    marginRight: responsiveValues.padding.xs,
  },
  tradeType: {
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(4),
  },
  tradeTypeText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '700',
    color: 'white',
  },
  tradeProfit: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
  },
  tradeDetails: {
    marginBottom: responsiveValues.padding.sm,
  },
  tradeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveValues.padding.xs / 2,
  },
  tradeDetailLabel: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
  },
  tradeDetailValue: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
  },
  tradeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tradeDate: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
  },
  tradeDuration: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveValues.padding.xl,
  },
  emptyStateTitle: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: responsiveValues.padding.sm,
    marginBottom: responsiveValues.padding.xs / 2,
  },
  emptyStateText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    textAlign: 'center',
  },
  riskMetrics: {
    backgroundColor: colors.backgroundAlt,
    margin: responsiveValues.padding.md,
    padding: responsiveValues.padding.md,
    borderRadius: responsiveValues.scale(12),
  },
  riskGrid: {
    flexDirection: isTablet() ? 'row' : 'row',
    justifyContent: 'space-around',
    marginTop: responsiveValues.padding.sm,
    flexWrap: isSmallDevice() ? 'wrap' : 'nowrap',
    gap: isSmallDevice() ? responsiveValues.padding.sm : 0,
  },
  riskItem: {
    alignItems: 'center',
    flex: isTablet() ? 1 : undefined,
    minWidth: isSmallDevice() ? '30%' : undefined,
  },
  riskLabel: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
    marginTop: responsiveValues.padding.xs / 2,
    marginBottom: responsiveValues.padding.xs / 2,
    textAlign: 'center',
  },
  riskValue: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '700',
    color: colors.text,
  },
});
