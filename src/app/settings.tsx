/**
 * Settings and Offline Data Management Screen.
 * Features:
 * - Local cache manager & clear cache
 * - Manual cloud sync trigger & status
 * - Outbreak alert push notification registration info
 * - Agricultural institutional emergency contacts & hotline (১৬১২৩)
 * - Version & AI model architecture metadata
 */

import React, { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BanglaStrings } from '../constants/banglaStrings';
import { storageService } from '../services/storageService';
import { firebaseService } from '../services/firebaseService';
import { networkService } from '../services/networkService';

export default function SettingsScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const loadStatus = async () => {
    setIsOnline(networkService.getIsOnline());
    const queue = await storageService.getSyncQueue();
    setPendingSyncCount(queue.length);
  };

  useEffect(() => {
    loadStatus();
    const unsub = networkService.subscribe((online) => {
      setIsOnline(online);
      loadStatus();
    });
    return unsub;
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) {
      Alert.alert('অফলাইন', BanglaStrings.networkOfflineAlert);
      return;
    }
    setIsSyncing(true);
    const result = await firebaseService.syncPendingRecords();
    await loadStatus();
    setIsSyncing(false);
    Alert.alert(
      'সিঙ্ক সম্পন্ন',
      result.successCount > 0
        ? `${result.successCount} টি রেকর্ড ক্লাউডে সফলভাবে সংরক্ষিত হয়েছে।`
        : 'সকল রেকর্ড ইতিমধ্যে ক্লাউডের সাথে সিঙ্ক করা আছে।'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      BanglaStrings.clearCache,
      BanglaStrings.clearCacheConfirm,
      [
        { text: BanglaStrings.cancel, style: 'cancel' },
        {
          text: 'হ্যাঁ, মুছুন',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            await storageService.clearAllCache();
            await loadStatus();
            setIsClearing(false);
            Alert.alert('সফল', BanglaStrings.cacheCleared);
          },
        },
      ]
    );
  };

  const openDialer = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
      console.warn('Dialer error:', err);
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </Pressable>
        <Text style={styles.headerTitle}>{BanglaStrings.settingsTitle}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Offline & Cloud Sync Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{BanglaStrings.syncStatus}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name={isOnline ? 'cloud-done' : 'cloud-offline'}
                size={24}
                color={isOnline ? '#2E7D32' : '#D32F2F'}
              />
              <View>
                <Text style={styles.cardItemTitle}>
                  {isOnline ? 'ইন্টারনেট সংযোগ চালু' : 'অফলাইন মোড'}
                </Text>
                <Text style={styles.cardItemSubtitle}>
                  {pendingSyncCount > 0
                    ? `${pendingSyncCount} ${BanglaStrings.pendingSync}`
                    : BanglaStrings.allSynced}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.actionBtn, (!isOnline || isSyncing) && styles.actionBtnDisabled]}
            onPress={handleManualSync}
            disabled={!isOnline || isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="sync" size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>{BanglaStrings.syncNow}</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Local Storage & Cache */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{BanglaStrings.storageInfo}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="hardware-chip-outline" size={24} color="#2E7D32" />
              <View>
                <Text style={styles.cardItemTitle}>অন-ডিভাইস স্টোরেজ</Text>
                <Text style={styles.cardItemSubtitle}>
                  স্ক্যান ও মডেল ডেটা সরাসরি আপনার ডিভাইসে ক্যাশ করা থাকে।
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.outlineDangerBtn}
            onPress={handleClearCache}
            disabled={isClearing}
          >
            <Ionicons name="trash-outline" size={18} color="#D32F2F" />
            <Text style={styles.outlineDangerText}>{BanglaStrings.clearCache}</Text>
          </Pressable>
        </View>
      </View>

      {/* Emergency Helpline Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{BanglaStrings.emergencyContacts}</Text>

        <View style={styles.card}>
          <Pressable style={styles.contactRow} onPress={() => openDialer('16123')}>
            <View style={styles.contactIconCircle}>
              <Ionicons name="call" size={20} color="#2E7D32" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{BanglaStrings.helplineCall}</Text>
              <Text style={styles.contactNumber}>টোল ফ্রি সরকারি কৃষি সেবা</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.contactRow} onPress={() => openDialer('0255028420')}>
            <View style={[styles.contactIconCircle, { backgroundColor: '#E1F5FE' }]}>
              <Ionicons name="business" size={20} color="#0288D1" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{BanglaStrings.daeBangladesh}</Text>
              <Text style={styles.contactNumber}>খামারবাড়ি, ঢাকা</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.contactRow} onPress={() => openDialer('0249272005')}>
            <View style={[styles.contactIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="leaf" size={20} color="#ED6C02" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{BanglaStrings.brri}</Text>
              <Text style={styles.contactNumber}>গাজীপুর</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
          </Pressable>
        </View>
      </View>

      {/* About App & Model */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{BanglaStrings.aboutApp}</Text>
        <View style={styles.card}>
          <Text style={styles.aboutAppName}>{BanglaStrings.appName}</Text>
          <Text style={styles.aboutVersion}>{BanglaStrings.version}</Text>
          <Text style={styles.aboutModel}>{BanglaStrings.modelInfo}</Text>
          <Text style={styles.aboutDesc}>
            বাংলাদেশের কৃষকদের জন্য তৈরিকৃত এআইভিত্তিক ফসলের রোগ ও বালাই নির্ণয়কারী মোবাইল অ্যাপ্লিকেশন।
          </Text>
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F8F1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  row: {
    marginBottom: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  cardItemSubtitle: {
    fontSize: 13,
    color: '#616161',
    marginTop: 2,
    lineHeight: 18,
  },
  actionBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  outlineDangerBtn: {
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineDangerText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },
  contactNumber: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 4,
  },
  aboutAppName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 2,
  },
  aboutVersion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 4,
  },
  aboutModel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 10,
  },
  aboutDesc: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
  },
});
