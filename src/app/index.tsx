/**
 * Home Screen for Bangladeshi Farmers.
 * Features:
 * - Direct "Scan Crop" CTA with high visibility
 * - Dynamic recent scan history loaded from offline storage
 * - Quick action cards: History, Treatment Guide, Helpline, Settings
 * - Agricultural call center hotline integration (১৬১২৩)
 * - Offline sync status banner
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  RefreshControl,
  Image,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { BanglaStrings } from '../constants/banglaStrings';
import { storageService, ScanRecord } from '../services/storageService';
import { SyncIndicator } from '../components/SyncIndicator';
import { StatusBadge } from '../components/StatusBadge';

export default function HomeScreen() {
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const scans = await storageService.getScans();
    setRecentScans(scans.slice(0, 4));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCallHelpline = () => {
    Linking.openURL('tel:16123').catch((err) => {
      console.warn('Cannot open phone dialer:', err);
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>{BanglaStrings.appName}</Text>
          <Text style={styles.appSubtitle}>{BanglaStrings.appTagline}</Text>
        </View>
        <Pressable
          style={styles.settingsIconButton}
          onPress={() => router.push('/settings' as any)}
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={24} color="#2E7D32" />
        </Pressable>
      </View>

      {/* Sync / Offline Banner */}
      <SyncIndicator />

      {/* Hero banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroIconWrapper}>
          <Text style={styles.heroEmoji}>🌿</Text>
        </View>
        <Text style={styles.heroTitle}>{BanglaStrings.welcomeFarmer}</Text>
        <Text style={styles.heroText}>{BanglaStrings.heroTitle}</Text>
      </View>

      {/* Scan CTA Button */}
      <Pressable
        style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
        onPress={() => router.push('/scan')}
      >
        <View style={styles.scanIconCircle}>
          <Ionicons name="camera" size={26} color="#2E7D32" />
        </View>
        <View style={styles.scanTextContainer}>
          <Text style={styles.scanButtonText}>{BanglaStrings.scanCrop}</Text>
          <Text style={styles.scanButtonSubtext}>ক্যামেরা দিয়ে ছবি তুলুন</Text>
        </View>
        <Ionicons name="arrow-forward-circle" size={28} color="#FFFFFF" />
      </Pressable>

      {/* Quick actions grid */}
      <View style={styles.quickActions}>
        <Pressable style={styles.quickCard} onPress={() => router.push('/history')}>
          <View style={[styles.quickIconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="time" size={24} color="#2E7D32" />
          </View>
          <Text style={styles.quickLabel}>{BanglaStrings.history}</Text>
        </Pressable>

        <Pressable style={styles.quickCard} onPress={() => router.push('/treatment-guide' as any)}>
          <View style={[styles.quickIconCircle, { backgroundColor: '#E1F5FE' }]}>
            <Ionicons name="book" size={24} color="#0288D1" />
          </View>
          <Text style={styles.quickLabel}>{BanglaStrings.treatment}</Text>
        </Pressable>

        <Pressable style={styles.quickCard} onPress={() => router.push('/settings' as any)}>
          <View style={[styles.quickIconCircle, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#ED6C02" />
          </View>
          <Text style={styles.quickLabel}>{BanglaStrings.settings}</Text>
        </Pressable>
      </View>

      {/* Helpline Banner */}
      <Pressable
        style={({ pressed }) => [styles.helplineCard, pressed && styles.helplineCardPressed]}
        onPress={handleCallHelpline}
      >
        <View style={styles.helplineIcon}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.helplineInfo}>
          <Text style={styles.helplineTitle}>{BanglaStrings.helplineCall}</Text>
          <Text style={styles.helplineDesc}>{BanglaStrings.helplineDesc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#2E7D32" />
      </Pressable>

      {/* Recent scans header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{BanglaStrings.recentScans}</Text>
        {recentScans.length > 0 && (
          <Pressable onPress={() => router.push('/history')}>
            <Text style={styles.viewAllText}>{BanglaStrings.viewAll}</Text>
          </Pressable>
        )}
      </View>

      {/* Recent scan list or empty state */}
      {recentScans.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={44} color="#A5D6A7" />
          <Text style={styles.emptyStateText}>{BanglaStrings.noRecentScans}</Text>
        </View>
      ) : (
        recentScans.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.recentItem, pressed && styles.recentItemPressed]}
            onPress={() =>
              router.push({
                pathname: '/result',
                params: {
                  diseaseId: item.diseaseId,
                  imageUri: item.imageUri,
                  confidence: item.confidencePercent.toString(),
                  locationDistrict: item.location?.district || '',
                },
              })
            }
          >
            {item.imageUri.startsWith('http') || item.imageUri.startsWith('file://') ? (
              <Image source={{ uri: item.imageUri }} style={styles.thumbnailImage} />
            ) : (
              <View style={styles.thumbnail}>
                <Ionicons
                  name={item.isHealthy ? 'leaf' : 'alert'}
                  size={24}
                  color={item.isHealthy ? '#2E7D32' : '#D32F2F'}
                />
              </View>
            )}

            <View style={styles.recentInfo}>
              <Text style={styles.recentCrop}>{item.cropBn}</Text>
              <Text style={styles.recentDisease} numberOfLines={1}>
                {item.diseaseBn}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={12} color="#9E9E9E" />
                <Text style={styles.recentTime}>{item.formattedDateBn}</Text>
                {item.location?.district && (
                  <>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Ionicons name="location-outline" size={12} color="#9E9E9E" />
                    <Text style={styles.recentLocation}>{item.location.district}</Text>
                  </>
                )}
              </View>
            </View>

            <StatusBadge isHealthy={item.isHealthy} severity={item.severity} size="small" />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 15,
    color: '#616161',
    marginTop: 2,
    fontWeight: '500',
  },
  settingsIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F8F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBanner: {
    backgroundColor: '#F1F8F1',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  heroIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  heroText: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 22,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 7,
  },
  scanButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  scanIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  scanButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scanButtonSubtext: {
    fontSize: 12,
    color: '#E8F5E9',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  quickIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '700',
  },
  helplineCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  helplineCardPressed: {
    opacity: 0.85,
  },
  helplineIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  helplineInfo: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  helplineDesc: {
    fontSize: 12,
    color: '#616161',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#F9FBF9',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    gap: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  recentItemPressed: {
    backgroundColor: '#F1F8F1',
  },
  thumbnail: {
    width: 52,
    height: 52,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  thumbnailImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 14,
  },
  recentInfo: {
    flex: 1,
  },
  recentCrop: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 2,
  },
  recentDisease: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentTime: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  dotSeparator: {
    fontSize: 11,
    color: '#BDBDBD',
  },
  recentLocation: {
    fontSize: 11,
    color: '#757575',
  },
});