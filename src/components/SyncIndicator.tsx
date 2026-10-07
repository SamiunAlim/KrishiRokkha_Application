/**
 * SyncIndicator component showing real-time network connectivity and cloud sync status.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { networkService } from '../services/networkService';
import { firebaseService } from '../services/firebaseService';
import { storageService } from '../services/storageService';
import { BanglaStrings } from '../constants/banglaStrings';

// exporting function SyncIndicator

export function SyncIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshStatus = async () => {
    const queue = await storageService.getSyncQueue();
    setPendingCount(queue.length);
  };

  useEffect(() => {
    const unsub = networkService.subscribe((online) => {
      setIsOnline(online);
      refreshStatus();
    });

    refreshStatus();
    const interval = setInterval(refreshStatus, 5000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    await firebaseService.syncPendingRecords();
    await refreshStatus();
    setIsSyncing(false);
  };

  if (isOnline && pendingCount === 0) {
    return null; // Clean state: everything synced
  }

  return (
    <View style={[styles.container, isOnline ? styles.pendingContainer : styles.offlineContainer]}>
      <View style={styles.left}>
        <Ionicons
          name={isOnline ? 'cloud-upload-outline' : 'cloud-offline-outline'}
          size={18}
          color={isOnline ? '#ED6C02' : '#D32F2F'}
        />
        <Text style={[styles.text, isOnline ? styles.pendingText : styles.offlineText]}>
          {isOnline
            ? `${pendingCount} ${BanglaStrings.pendingSync}`
            : BanglaStrings.offlineMode}
        </Text>
      </View>

      {isOnline && pendingCount > 0 && (
        <Pressable style={styles.syncBtn} onPress={handleManualSync} disabled={isSyncing}>
          {isSyncing ? (
            <ActivityIndicator size="small" color="#2E7D32" />
          ) : (
            <Text style={styles.syncBtnText}>{BanglaStrings.syncNow}</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

// Adding styles in CSS codes

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  offlineContainer: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  pendingContainer: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  offlineText: {
    color: '#D32F2F',
  },
  pendingText: {
    color: '#ED6C02',
  },
  syncBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
