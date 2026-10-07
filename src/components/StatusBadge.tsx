/**
 * StatusBadge component displaying Health vs Disease status and Severity levels in Bangla.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BanglaStrings } from '../constants/banglaStrings';

interface StatusBadgeProps {
  isHealthy: boolean;
  severity?: 'low' | 'medium' | 'high';
  size?: 'small' | 'medium' | 'large';
}

export function StatusBadge({ isHealthy, severity = 'low', size = 'medium' }: StatusBadgeProps) {
  if (isHealthy) {
    return (
      <View style={[styles.badge, styles.healthyBadge, size === 'large' && styles.badgeLarge]}>
        <Ionicons name="checkmark-circle" size={size === 'large' ? 18 : 14} color="#2E7D32" />
        <Text style={[styles.healthyText, size === 'large' && styles.textLarge]}>
          {BanglaStrings.healthyStatus}
        </Text>
      </View>
    );
  }

  const getSeverityStyle = () => {
    switch (severity) {
      case 'high':
        return {
          bg: styles.dangerBadge,
          text: styles.dangerText,
          iconColor: '#D32F2F',
          label: `${BanglaStrings.infectedStatus} (${BanglaStrings.severityHigh})`,
        };
      case 'medium':
        return {
          bg: styles.warningBadge,
          text: styles.warningText,
          iconColor: '#ED6C02',
          label: `${BanglaStrings.infectedStatus} (${BanglaStrings.severityMedium})`,
        };
      case 'low':
      default:
        return {
          bg: styles.warningBadge,
          text: styles.warningText,
          iconColor: '#ED6C02',
          label: `${BanglaStrings.infectedStatus} (${BanglaStrings.severityLow})`,
        };
    }
  };

  const styleConfig = getSeverityStyle();

  return (
    <View style={[styles.badge, styleConfig.bg, size === 'large' && styles.badgeLarge]}>
      <Ionicons name="alert-circle" size={size === 'large' ? 18 : 14} color={styleConfig.iconColor} />
      <Text style={[styleConfig.text, size === 'large' && styles.textLarge]}>
        {styleConfig.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 24,
    gap: 8,
  },
  healthyBadge: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  healthyText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '700',
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  warningText: {
    color: '#ED6C02',
    fontSize: 13,
    fontWeight: '700',
  },
  dangerBadge: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  dangerText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '700',
  },
  textLarge: {
    fontSize: 15,
  },
});
