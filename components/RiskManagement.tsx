
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RiskSettings } from '../types/trading';
import { colors, responsiveValues } from '../styles/commonStyles';
import { isTablet } from '../utils/responsive';
import Icon from './Icon';

interface RiskManagementProps {
  riskSettings: RiskSettings;
  onUpdateSettings: (settings: Partial<RiskSettings>) => void;
}

const RiskManagement: React.FC<RiskManagementProps> = ({ 
  riskSettings, 
  onUpdateSettings 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<RiskSettings>(riskSettings);

  const handleSave = () => {
    onUpdateSettings(tempSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(riskSettings);
    setIsEditing(false);
  };

  const updateTempSetting = (key: keyof RiskSettings, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempSettings(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Risk Management</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Icon name="create" size={responsiveValues.scale(20)} color={colors.accent} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Icon name="close" size={responsiveValues.scale(16)} color="#F44336" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Icon name="checkmark" size={responsiveValues.scale(16)} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.grid}>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Max Risk per Trade (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.maxRiskPerTrade.toString()}
              onChangeText={(value) => updateTempSetting('maxRiskPerTrade', value)}
              keyboardType="numeric"
              placeholder="2.0"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.maxRiskPerTrade}%</Text>
          )}
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Daily Loss Limit (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.dailyLossLimit.toString()}
              onChangeText={(value) => updateTempSetting('dailyLossLimit', value)}
              keyboardType="numeric"
              placeholder="5.0"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.dailyLossLimit}%</Text>
          )}
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Max Open Positions</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.maxOpenPositions.toString()}
              onChangeText={(value) => updateTempSetting('maxOpenPositions', value)}
              keyboardType="numeric"
              placeholder="5"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.maxOpenPositions}</Text>
          )}
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Stop Loss (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.stopLossPercent.toString()}
              onChangeText={(value) => updateTempSetting('stopLossPercent', value)}
              keyboardType="numeric"
              placeholder="2.0"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.stopLossPercent}%</Text>
          )}
        </View>
      </View>

      {isEditing && (
        <View style={styles.warningContainer}>
          <Icon name="warning" size={responsiveValues.scale(16)} color="#FF9800" />
          <Text style={styles.warningText}>
            Changes will affect future trades. Current positions remain unchanged.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: responsiveValues.padding.md,
    marginVertical: responsiveValues.padding.xs,
    borderRadius: responsiveValues.scale(12),
    padding: responsiveValues.padding.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveValues.padding.md,
  },
  title: {
    fontSize: responsiveValues.fonts.xl,
    fontWeight: '700',
    color: colors.text,
  },
  editButton: {
    padding: responsiveValues.padding.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: responsiveValues.padding.xs,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: responsiveValues.scale(20),
    padding: responsiveValues.padding.xs,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: responsiveValues.scale(20),
    padding: responsiveValues.padding.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isTablet() ? responsiveValues.padding.sm : responsiveValues.padding.xs,
  },
  settingItem: {
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
  input: {
    backgroundColor: colors.background,
    borderRadius: responsiveValues.scale(8),
    padding: responsiveValues.padding.sm,
    fontSize: responsiveValues.fonts.lg,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: responsiveValues.padding.sm,
    borderRadius: responsiveValues.scale(8),
    marginTop: responsiveValues.padding.sm,
  },
  warningText: {
    fontSize: responsiveValues.fonts.sm,
    color: colors.grey,
    marginLeft: responsiveValues.padding.xs,
    flex: 1,
    lineHeight: responsiveValues.fonts.sm * 1.3,
  },
});

export default RiskManagement;
