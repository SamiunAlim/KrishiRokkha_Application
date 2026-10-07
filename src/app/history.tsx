/**
 * History Screen displaying past scans from offline SQLite / AsyncStorage.
 * Features:
 * - Real-time statistics counters (Total, Infected, Healthy)
 * - Status filter tabs (All, Infected, Healthy)
 * - Delete record with Bangla confirmation dialog
 * - Navigation to result diagnosis
 * - Floating Camera Action Button
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BanglaStrings } from '../constants/banglaStrings';
import { storageService, ScanRecord } from '../services/storageService';
import { StatusBadge } from '../components/StatusBadge';

type FilterType = 'all' | 'sick' | 'healthy';

export default function HistoryScreen() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadScans = useCallback(async () => {
    const list = await storageService.getScans();
    setScans(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadScans();
    }, [loadScans])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScans();
    setRefreshing(false);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      BanglaStrings.delete,
      `আপনি কি "${title}" এর রেকর্ডটি মুছে ফেলতে চান?`,
      [
        { text: BanglaStrings.cancel, style: 'cancel' },
        {
          text: BanglaStrings.confirm,
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteScan(id);
            await loadScans();
          },
        },
      ]
    );
  };

  const sickCount = scans.filter((i) => !i.isHealthy).length;
  const healthyCount = scans.filter((i) => i.isHealthy).length;

  const filteredScans = scans.filter((item) => {
    if (filter === 'sick') return !item.isHealthy;
    if (filter === 'healthy') return item.isHealthy;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Green Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{BanglaStrings.myScans}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <Pressable
          style={[styles.summaryCard, filter === 'all' && styles.summaryCardActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.summaryNumber}>{scans.length}</Text>
          <Text style={styles.summaryLabel}>{BanglaStrings.totalScans}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.summaryCard,
            styles.summaryCardSick,
            filter === 'sick' && styles.summaryCardSickActive,
          ]}
          onPress={() => setFilter('sick')}
        >
          <Text style={[styles.summaryNumber, styles.summaryNumberRed]}>{sickCount}</Text>
          <Text style={styles.summaryLabel}>{BanglaStrings.sickCount}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.summaryCard,
            styles.summaryCardHealthy,
            filter === 'healthy' && styles.summaryCardHealthyActive,
          ]}
          onPress={() => setFilter('healthy')}
        >
          <Text style={[styles.summaryNumber, styles.summaryNumberGreen]}>{healthyCount}</Text>
          <Text style={styles.summaryLabel}>{BanglaStrings.healthyCount}</Text>
        </Pressable>
      </View>

      {/* Filter Tab Chips */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            {BanglaStrings.allFilter} ({scans.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, filter === 'sick' && styles.filterChipActive]}
          onPress={() => setFilter('sick')}
        >
          <Text style={[styles.filterText, filter === 'sick' && styles.filterTextActive]}>
            {BanglaStrings.sickFilter} ({sickCount})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, filter === 'healthy' && styles.filterChipActive]}
          onPress={() => setFilter('healthy')}
        >
          <Text style={[styles.filterText, filter === 'healthy' && styles.filterTextActive]}>
            {BanglaStrings.healthyFilter} ({healthyCount})
          </Text>
        </Pressable>
      </View>

      {/* History List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />
        }
      >
        {filteredScans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={56} color="#BDBDBD" />
            <Text style={styles.emptyTitle}>{BanglaStrings.emptyHistoryTitle}</Text>
            <Text style={styles.emptyDesc}>{BanglaStrings.emptyHistoryDesc}</Text>
          </View>
        ) : (
          filteredScans.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.historyItem, pressed && styles.historyItemPressed]}
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
              {/* Thumbnail */}
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

              {/* Info */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemCrop}>{item.cropBn}</Text>
                <Text style={styles.itemDisease} numberOfLines={1}>
                  {item.diseaseBn}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={12} color="#9E9E9E" />
                  <Text style={styles.itemTime}>{item.formattedDateBn}</Text>
                  {item.location?.district && (
                    <>
                      <Text style={styles.dot}>•</Text>
                      <Ionicons name="location-outline" size={12} color="#9E9E9E" />
                      <Text style={styles.itemLocation}>{item.location.district}</Text>
                    </>
                  )}
                </View>
              </View>

              {/* Status Badge & Delete Icon */}
              <View style={styles.rightSection}>
                <StatusBadge isHealthy={item.isHealthy} severity={item.severity} size="small" />
                <Pressable
                  style={styles.deleteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id, item.diseaseBn);
                  }}
                  hitSlop={10}
                >
                  <Ionicons name="trash-outline" size={18} color="#9E9E9E" />
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button (New Scan) */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/scan')}
        accessibilityLabel="Scan new crop"
      >
        <Ionicons name="camera" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: '#F1F8F1',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryCardActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  summaryCardSick: {
    borderTopWidth: 3,
    borderTopColor: '#D32F2F',
  },
  summaryCardSickActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#D32F2F',
  },
  summaryCardHealthy: {
    borderTopWidth: 3,
    borderTopColor: '#2E7D32',
  },
  summaryCardHealthyActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212121',
  },
  summaryNumberRed: {
    color: '#D32F2F',
  },
  summaryNumberGreen: {
    color: '#2E7D32',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#616161',
    marginTop: 2,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#616161',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 90,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  historyItemPressed: {
    backgroundColor: '#F1F8F1',
  },
  thumbnail: {
    width: 54,
    height: 54,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbnailImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemCrop: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 2,
  },
  itemDisease: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTime: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  dot: {
    fontSize: 11,
    color: '#BDBDBD',
  },
  itemLocation: {
    fontSize: 11,
    color: '#757575',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#424242',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'center',
    maxWidth: 260,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
