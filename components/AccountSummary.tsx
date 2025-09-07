
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AccountInfo } from '../types/trading';
import { colors } from '../styles/commonStyles';

interface AccountSummaryProps {
  accountInfo: AccountInfo;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ accountInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Summary</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.value}>${accountInfo.balance.toLocaleString()}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Equity</Text>
          <Text style={[
            styles.value,
            { color: accountInfo.equity >= accountInfo.balance ? '#4CAF50' : '#F44336' }
          ]}>
            ${accountInfo.equity.toLocaleString()}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Total Profit</Text>
          <Text style={[
            styles.value,
            { color: accountInfo.totalProfit >= 0 ? '#4CAF50' : '#F44336' }
          ]}>
            {accountInfo.totalProfit >= 0 ? '+' : ''}${accountInfo.totalProfit.toLocaleString()}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Win Rate</Text>
          <Text style={[
            styles.value,
            { color: accountInfo.winRate >= 70 ? '#4CAF50' : 
                     accountInfo.winRate >= 50 ? '#FF9800' : '#F44336' }
          ]}>
            {accountInfo.winRate.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});

export default AccountSummary;
