
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RiskSettings } from '../types/trading';
import { colors } from '../styles/commonStyles';
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
  const [tempSettings, setTempSettings] = useState(riskSettings);

  const handleSave = () => {
    onUpdateSettings(tempSettings);
    setIsEditing(false);
    console.log('Risk settings saved');
  };

  const handleCancel = () => {
    setTempSettings(riskSettings);
    setIsEditing(false);
  };

  const updateTempSetting = (key: keyof RiskSettings, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempSettings(prev => ({ ...prev, [key]: numValue }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Risk Management</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Icon name="create-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
        ) : (
          <View style={styles.editButtons}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Icon name="close" size={18} color="#F44336" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Icon name="checkmark" size={18} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Max Risk per Trade (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.maxRiskPerTrade.toString()}
              onChangeText={(value) => updateTempSetting('maxRiskPerTrade', value)}
              keyboardType="numeric"
              placeholder="2"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.maxRiskPerTrade}%</Text>
          )}
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Daily Loss Limit (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.dailyLossLimit.toString()}
              onChangeText={(value) => updateTempSetting('dailyLossLimit', value)}
              keyboardType="numeric"
              placeholder="5"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.dailyLossLimit}%</Text>
          )}
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Position Size (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.positionSizePercent.toString()}
              onChangeText={(value) => updateTempSetting('positionSizePercent', value)}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.positionSizePercent}%</Text>
          )}
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Stop Loss (%)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempSettings.stopLossPercent.toString()}
              onChangeText={(value) => updateTempSetting('stopLossPercent', value)}
              keyboardType="numeric"
              placeholder="2"
              placeholderTextColor={colors.grey}
            />
          ) : (
            <Text style={styles.value}>{riskSettings.stopLossPercent}%</Text>
          )}
        </View>
      </View>

      <View style={styles.warningContainer}>
        <Icon name="warning" size={16} color="#FF9800" />
        <Text style={styles.warningText}>
          Keep risk per trade below 2% to protect your capital
        </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  editButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 12,
  },
  saveButton: {
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 8,
    flex: 1,
  },
});

export default RiskManagement;
