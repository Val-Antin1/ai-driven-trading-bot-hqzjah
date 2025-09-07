
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TradingSignal } from '../types/trading';
import { colors, responsiveValues } from '../styles/commonStyles';
import { isTablet, isSmallDevice } from '../utils/responsive';
import Icon from './Icon';

interface SignalCardProps {
  signal: TradingSignal;
  onExecute: (signalId: string) => void;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, onExecute }) => {
  const signalColor = signal.type === 'BUY' ? '#4CAF50' : '#F44336';
  const confidenceColor = signal.confidence >= 80 ? '#4CAF50' : 
                         signal.confidence >= 60 ? '#FF9800' : '#F44336';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.signalInfo}>
          <View style={[styles.signalType, { backgroundColor: signalColor }]}>
            <Text style={styles.signalTypeText}>{signal.type}</Text>
          </View>
          <Text style={styles.asset}>{signal.asset}</Text>
        </View>
        <View style={styles.confidence}>
          <Text style={[styles.confidenceText, { color: confidenceColor }]}>
            {signal.confidence}%
          </Text>
        </View>
      </View>

      <View style={styles.priceInfo}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Entry:</Text>
          <Text style={styles.priceValue}>{signal.entryPrice.toFixed(4)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Stop Loss:</Text>
          <Text style={[styles.priceValue, { color: '#F44336' }]}>
            {signal.stopLoss.toFixed(4)}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Take Profit:</Text>
          <Text style={[styles.priceValue, { color: '#4CAF50' }]}>
            {signal.takeProfit.toFixed(4)}
          </Text>
        </View>
      </View>

      <Text style={styles.reasoning}>{signal.reasoning}</Text>

      <View style={styles.footer}>
        <View style={styles.timeInfo}>
          <Text style={styles.timeframe}>{signal.timeframe}</Text>
          <Text style={styles.timestamp}>
            {signal.timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        
        {signal.status === 'ACTIVE' && (
          <TouchableOpacity 
            style={[styles.executeButton, { backgroundColor: signalColor }]}
            onPress={() => onExecute(signal.id)}
          >
            <Icon name="play" size={responsiveValues.scale(16)} color="white" />
            <Text style={styles.executeButtonText}>Execute</Text>
          </TouchableOpacity>
        )}
        
        {signal.status === 'EXECUTED' && (
          <View style={styles.executedBadge}>
            <Icon name="checkmark-circle" size={responsiveValues.scale(16)} color="#4CAF50" />
            <Text style={styles.executedText}>Executed</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
    borderLeftWidth: responsiveValues.scale(4),
    borderLeftColor: colors.accent,
  },
  header: {
    flexDirection: isTablet() ? 'row' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.sm,
    flexWrap: isSmallDevice() ? 'wrap' : 'nowrap',
  },
  signalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: isSmallDevice() ? 1 : undefined,
  },
  signalType: {
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(6),
    marginRight: responsiveValues.padding.xs,
  },
  signalTypeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: responsiveValues.fonts.xs,
  },
  asset: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
  },
  confidence: {
    alignItems: 'center',
    marginTop: isSmallDevice() ? responsiveValues.padding.xs : 0,
  },
  confidenceText: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
  },
  priceInfo: {
    marginBottom: responsiveValues.padding.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveValues.padding.xs / 2,
  },
  priceLabel: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
  },
  priceValue: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
  },
  reasoning: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    fontStyle: 'italic',
    marginBottom: responsiveValues.padding.sm,
    lineHeight: responsiveValues.fonts.sm * 1.4,
  },
  footer: {
    flexDirection: isSmallDevice() ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallDevice() ? 'flex-start' : 'center',
    gap: isSmallDevice() ? responsiveValues.padding.xs : 0,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeframe: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.text,
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveValues.padding.xs,
    paddingVertical: responsiveValues.padding.xs / 2,
    borderRadius: responsiveValues.scale(4),
    marginRight: responsiveValues.padding.xs,
  },
  timestamp: {
    fontSize: responsiveValues.fonts.xs,
    color: colors.grey,
  },
  executeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveValues.padding.sm,
    paddingVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(6),
  },
  executeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: responsiveValues.fonts.xs,
    marginLeft: responsiveValues.padding.xs / 2,
  },
  executedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  executedText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: responsiveValues.fonts.xs,
    marginLeft: responsiveValues.padding.xs / 2,
  },
});

export default SignalCard;
