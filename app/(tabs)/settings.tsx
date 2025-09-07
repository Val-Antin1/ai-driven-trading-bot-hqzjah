
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors, commonStyles, responsiveValues } from '../../styles/commonStyles';
import { useTradingData } from '../../hooks/useTradingData';
import { isTablet, isSmallDevice } from '../../utils/responsive';
import RiskManagement from '../../components/RiskManagement';
import Icon from '../../components/Icon';
import { TimeFrame, TradingMode, AssetType } from '../../types/trading';

export default function SettingsScreen() {
  const { riskSettings, updateRiskSettings } = useTradingData();
  
  const [notifications, setNotifications] = useState(true);
  const [autoTrading, setAutoTrading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1h');
  const [selectedMode, setSelectedMode] = useState<TradingMode>('DAY_TRADING');
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>(['FOREX', 'CRYPTO']);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = isTablet() ? ['20%', '40%', '80%'] : ['25%', '50%', '90%'];

  const timeframes: TimeFrame[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
  const tradingModes: { key: TradingMode; label: string; description: string }[] = [
    { key: 'SCALPING', label: 'Scalping', description: 'Quick trades, 1-5 minute timeframes' },
    { key: 'DAY_TRADING', label: 'Day Trading', description: 'Intraday trades, 15m-1h timeframes' },
    { key: 'SWING_TRADING', label: 'Swing Trading', description: 'Multi-day trades, 4h-daily timeframes' },
  ];
  const assetTypes: { key: AssetType; label: string }[] = [
    { key: 'FOREX', label: 'Forex' },
    { key: 'CRYPTO', label: 'Cryptocurrency' },
    { key: 'STOCKS', label: 'Stocks' },
    { key: 'INDICES', label: 'Indices' },
    { key: 'COMMODITIES', label: 'Commodities' },
  ];

  const handleAssetToggle = (asset: AssetType) => {
    setSelectedAssets(prev => 
      prev.includes(asset) 
        ? prev.filter(a => a !== asset)
        : [...prev, asset]
    );
  };

  const handleAutoTradingToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Auto Trading',
        'Auto trading will execute signals automatically based on your risk settings. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => setAutoTrading(true) },
        ]
      );
    } else {
      setAutoTrading(false);
    }
  };

  const openStrategySheet = () => {
    bottomSheetRef.current?.expand();
  };

  const SettingItem: React.FC<{
    title: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }> = ({ title, subtitle, icon, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon as any} size={responsiveValues.scale(20)} color={colors.accent} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-forward" size={responsiveValues.scale(16)} color={colors.grey} />}
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <RiskManagement 
            riskSettings={riskSettings}
            onUpdateSettings={updateRiskSettings}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trading Configuration</Text>
            
            <SettingItem
              title="Trading Strategy"
              subtitle={`${selectedMode.replace('_', ' ')} • ${selectedTimeframe}`}
              icon="flash"
              onPress={openStrategySheet}
            />

            <SettingItem
              title="Auto Trading"
              subtitle={autoTrading ? 'Enabled' : 'Disabled'}
              icon="play-circle"
              rightComponent={
                <Switch
                  value={autoTrading}
                  onValueChange={handleAutoTradingToggle}
                  trackColor={{ false: colors.grey, true: colors.accent }}
                  thumbColor={autoTrading ? 'white' : '#f4f3f4'}
                />
              }
            />

            <View style={styles.assetSelection}>
              <Text style={styles.assetSelectionTitle}>Asset Classes</Text>
              <View style={styles.assetGrid}>
                {assetTypes.map(({ key, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.assetButton,
                      selectedAssets.includes(key) && styles.assetButtonActive
                    ]}
                    onPress={() => handleAssetToggle(key)}
                  >
                    <Text style={[
                      styles.assetButtonText,
                      selectedAssets.includes(key) && styles.assetButtonTextActive
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <SettingItem
              title="Push Notifications"
              subtitle="Receive trading signals and alerts"
              icon="notifications"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.grey, true: colors.accent }}
                  thumbColor={notifications ? 'white' : '#f4f3f4'}
                />
              }
            />

            <SettingItem
              title="Signal Alerts"
              subtitle="High confidence signals only"
              icon="flash"
            />

            <SettingItem
              title="Risk Warnings"
              subtitle="Daily loss limit notifications"
              icon="warning"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <SettingItem
              title="Broker Integration"
              subtitle="Connect MT4/MT5 or cTrader"
              icon="link"
            />

            <SettingItem
              title="Backup Settings"
              subtitle="Save your configuration"
              icon="cloud-upload"
            />

            <SettingItem
              title="Export Data"
              subtitle="Download trade history"
              icon="download"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <SettingItem
              title="Help Center"
              subtitle="Trading guides and tutorials"
              icon="help-circle"
            />

            <SettingItem
              title="Contact Support"
              subtitle="Get help with your account"
              icon="mail"
            />

            <SettingItem
              title="App Version"
              subtitle="1.0.0"
              icon="information-circle"
            />
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: colors.backgroundAlt }}
          handleIndicatorStyle={{ backgroundColor: colors.grey }}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Trading Strategy</Text>
            
            <View style={styles.strategySection}>
              <Text style={styles.strategyLabel}>Trading Mode</Text>
              {tradingModes.map(({ key, label, description }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.strategyOption,
                    selectedMode === key && styles.strategyOptionActive
                  ]}
                  onPress={() => setSelectedMode(key)}
                >
                  <View style={styles.strategyOptionContent}>
                    <Text style={[
                      styles.strategyOptionTitle,
                      selectedMode === key && styles.strategyOptionTitleActive
                    ]}>
                      {label}
                    </Text>
                    <Text style={styles.strategyOptionDescription}>
                      {description}
                    </Text>
                  </View>
                  {selectedMode === key && (
                    <Icon name="checkmark-circle" size={responsiveValues.scale(20)} color={colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.strategySection}>
              <Text style={styles.strategyLabel}>Primary Timeframe</Text>
              <View style={styles.timeframeGrid}>
                {timeframes.map((timeframe) => (
                  <TouchableOpacity
                    key={timeframe}
                    style={[
                      styles.timeframeButton,
                      selectedTimeframe === timeframe && styles.timeframeButtonActive
                    ]}
                    onPress={() => setSelectedTimeframe(timeframe)}
                  >
                    <Text style={[
                      styles.timeframeButtonText,
                      selectedTimeframe === timeframe && styles.timeframeButtonTextActive
                    ]}>
                      {timeframe}
                    </Text>
                  </TouchableOpacity>
                ))}
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
  section: {
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
  },
  sectionTitle: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveValues.padding.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: responsiveValues.padding.sm,
    flex: 1,
  },
  settingTitle: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '600',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    marginTop: responsiveValues.padding.xs / 2,
  },
  assetSelection: {
    marginTop: responsiveValues.padding.md,
  },
  assetSelectionTitle: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: responsiveValues.padding.sm,
  },
  assetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveValues.padding.xs,
  },
  assetButton: {
    backgroundColor: colors.background,
    paddingHorizontal: responsiveValues.padding.sm,
    paddingVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(20),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  assetButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  assetButtonText: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
  },
  assetButtonTextActive: {
    color: 'white',
  },
  bottomSheetContent: {
    padding: responsiveValues.padding.lg,
  },
  bottomSheetTitle: {
    fontSize: responsiveValues.fonts.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: responsiveValues.padding.lg,
  },
  strategySection: {
    marginBottom: responsiveValues.padding.xl,
  },
  strategyLabel: {
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: responsiveValues.padding.sm,
  },
  strategyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: responsiveValues.padding.md,
    borderRadius: responsiveValues.scale(12),
    marginBottom: responsiveValues.padding.xs,
    borderWidth: 1,
    borderColor: colors.background,
  },
  strategyOptionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.background,
  },
  strategyOptionContent: {
    flex: 1,
  },
  strategyOptionTitle: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
  },
  strategyOptionTitleActive: {
    color: colors.accent,
  },
  strategyOptionDescription: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    marginTop: responsiveValues.padding.xs / 2,
  },
  timeframeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveValues.padding.xs,
  },
  timeframeButton: {
    backgroundColor: colors.background,
    paddingHorizontal: responsiveValues.padding.md,
    paddingVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(20),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  timeframeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  timeframeButtonText: {
    fontSize: responsiveValues.fonts.sm,
    fontWeight: '600',
    color: colors.text,
  },
  timeframeButtonTextActive: {
    color: 'white',
  },
});
