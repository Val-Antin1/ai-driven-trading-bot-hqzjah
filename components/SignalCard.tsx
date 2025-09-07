
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TradingSignal } from '../types/trading';
import { colors } from '../styles/commonStyles';
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
            <Icon name="play" size={16} color="white" />
            <Text style={styles.executeButtonText}>Execute</Text>
          </TouchableOpacity>
        )}
        
        {signal.status === 'EXECUTED' && (
          <View style={styles.executedBadge}>
            <Icon name="checkmark-circle" size={16} color="#4CAF50" />
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  signalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  signalTypeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  asset: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  confidence: {
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceInfo: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.grey,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reasoning: {
    fontSize: 13,
    color: colors.grey,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeframe: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: colors.grey,
  },
  executeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  executeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  executedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  executedText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default SignalCard;
