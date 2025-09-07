
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AccountInfo } from '../types/trading';
import { colors, responsiveValues } from '../styles/commonStyles';
import { isTablet } from '../utils/responsive';

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
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
    marginHorizontal: responsiveValues.padding.md,
  },
  title: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isTablet() ? responsiveValues.padding.sm : responsiveValues.padding.xs,
  },
  item: {
    width: isTablet() ? '48%' : '48%',
    marginBottom: responsiveValues.padding.sm,
  },
  label: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    marginBottom: responsiveValues.padding.xs / 2,
  },
  value: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '700',
    color: colors.text,
  },
});

export default AccountSummary;
