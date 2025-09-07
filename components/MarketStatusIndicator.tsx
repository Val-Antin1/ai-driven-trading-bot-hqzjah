
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, responsiveValues } from '../styles/commonStyles';
import { marketService, MarketStatus } from '../services/marketService';
import Icon from './Icon';

interface MarketStatusIndicatorProps {
  symbols: string[];
}

const MarketStatusIndicator: React.FC<MarketStatusIndicatorProps> = ({ symbols }) => {
  const [marketStatuses, setMarketStatuses] = useState<{ [symbol: string]: MarketStatus }>({});

  useEffect(() => {
    const updateStatuses = () => {
      const statuses: { [symbol: string]: MarketStatus } = {};
      symbols.forEach(symbol => {
        statuses[symbol] = marketService.getMarketStatus(symbol);
      });
      setMarketStatuses(statuses);
    };

    updateStatuses();
    
    // Update every minute
    const interval = setInterval(updateStatuses, 60000);
    
    return () => clearInterval(interval);
  }, [symbols]);

  const getOverallStatus = (): { isAnyOpen: boolean; openCount: number; totalCount: number } => {
    const statuses = Object.values(marketStatuses);
    const openCount = statuses.filter(status => status.isOpen).length;
    
    return {
      isAnyOpen: openCount > 0,
      openCount,
      totalCount: statuses.length,
    };
  };

  const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const overall = getOverallStatus();

  if (Object.keys(marketStatuses).length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: overall.isAnyOpen ? colors.success : colors.error }
          ]} />
          <Text style={styles.statusTitle}>
            Markets: {overall.openCount}/{overall.totalCount} Open
          </Text>
        </View>
        
        {overall.isAnyOpen ? (
          <Icon name="trending-up" size={responsiveValues.scale(16)} color={colors.success} />
        ) : (
          <Icon name="clock" size={responsiveValues.scale(16)} color={colors.error} />
        )}
      </View>

      <View style={styles.marketsList}>
        {Object.entries(marketStatuses).map(([symbol, status]) => (
          <View key={symbol} style={styles.marketItem}>
            <View style={styles.marketInfo}>
              <Text style={styles.marketSymbol}>{symbol}</Text>
              <View style={[
                styles.marketStatusBadge,
                { backgroundColor: status.isOpen ? colors.success : colors.error }
              ]}>
                <Text style={styles.marketStatusText}>
                  {status.isOpen ? 'OPEN' : 'CLOSED'}
                </Text>
              </View>
            </View>
            
            {!status.isOpen && status.nextOpen && (
              <Text style={styles.nextOpenText}>
                Opens in {formatTimeUntil(status.nextOpen)}
              </Text>
            )}
            
            {status.isOpen && status.nextClose && (
              <Text style={styles.nextCloseText}>
                Closes in {formatTimeUntil(status.nextClose)}
              </Text>
            )}
          </View>
        ))}
      </View>

      {!overall.isAnyOpen && (
        <View style={styles.weekendNotice}>
          <Icon name="info" size={responsiveValues.scale(14)} color={colors.warning} />
          <Text style={styles.weekendNoticeText}>
            Forex markets are closed on weekends. Crypto markets remain active.
          </Text>
        </View>
      )}
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs,
  },
  statusDot: {
    width: responsiveValues.scale(8),
    height: responsiveValues.scale(8),
    borderRadius: responsiveValues.scale(4),
  },
  statusTitle: {
    fontSize: responsiveValues.fonts.md,
    fontWeight: '600',
    color: colors.text,
  },
  marketsList: {
    gap: responsiveValues.padding.xs,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveValues.padding.xs / 2,
  },
  marketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs,
  },
  marketSymbol: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '500',
    color: colors.text,
    minWidth: responsiveValues.scale(60),
  },
  marketStatusBadge: {
    paddingHorizontal: responsiveValues.padding.xs / 2,
    paddingVertical: responsiveValues.padding.xs / 4,
    borderRadius: responsiveValues.scale(3),
  },
  marketStatusText: {
    fontSize: responsiveValues.fonts.xs,
    fontWeight: '600',
    color: colors.white,
  },
  nextOpenText: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.error,
    fontWeight: '500',
  },
  nextCloseText: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.success,
    fontWeight: '500',
  },
  weekendNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveValues.padding.xs / 2,
    backgroundColor: colors.warning + '20',
    padding: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(6),
    marginTop: responsiveValues.padding.sm,
  },
  weekendNoticeText: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.warning,
    fontWeight: '500',
    flex: 1,
  },
});

export default MarketStatusIndicator;
