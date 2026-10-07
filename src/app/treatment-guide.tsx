/**
 * Crop Disease & Treatment Guide Encyclopedia Screen.
 * Allows farmers to browse, search, and listen to treatments for all common crop diseases in Bangla.
 */

import React, { useState, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BanglaStrings } from '../constants/banglaStrings';
import { getAllDiseases, DiseaseInfo } from '../services/labels';
import { StatusBadge } from '../components/StatusBadge';

export default function TreatmentGuideScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('সকল');

  const allDiseases = useMemo(() => getAllDiseases(), []);

  const cropsList = useMemo(() => {
    const crops = new Set(allDiseases.map((d) => d.cropBn));
    return ['সকল', ...Array.from(crops)];
  }, [allDiseases]);

  const filteredDiseases = useMemo(() => {
    return allDiseases.filter((d) => {
      const matchesSearch =
        d.cropBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.diseaseBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.diseaseEn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCrop = selectedCrop === 'সকল' || d.cropBn === selectedCrop;

      return matchesSearch && matchesCrop;
    });
  }, [allDiseases, searchQuery, selectedCrop]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{BanglaStrings.treatment}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#757575" />
        <TextInput
          style={styles.searchInput}
          placeholder="ফসলের বা রোগের নাম লিখুন (যেমন: ধান, টমেটো)..."
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9E9E9E" />
          </Pressable>
        )}
      </View>

      {/* Crop Filter Horizontal Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cropChipsContainer}
        contentContainerStyle={styles.cropChipsContent}
      >
        {cropsList.map((crop) => (
          <Pressable
            key={crop}
            style={[styles.cropChip, selectedCrop === crop && styles.cropChipActive]}
            onPress={() => setSelectedCrop(crop)}
          >
            <Text style={[styles.cropChipText, selectedCrop === crop && styles.cropChipTextActive]}>
              {crop}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Disease Encyclopedia List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredDiseases.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>কোনো রোগ বা বালাই খুঁজে পাওয়া যায়নি</Text>
          </View>
        ) : (
          filteredDiseases.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.diseaseCard, pressed && styles.diseaseCardPressed]}
              onPress={() =>
                router.push({
                  pathname: '/result',
                  params: {
                    diseaseId: item.id,
                    confidence: '95',
                  },
                })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.cropEmojiWrapper}>
                  <Text style={styles.cropEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.cropName}>{item.cropBn}</Text>
                  <Text style={styles.diseaseName}>{item.diseaseBn}</Text>
                  <Text style={styles.diseaseNameEn}>{item.diseaseEn}</Text>
                </View>
                <StatusBadge isHealthy={item.isHealthy} severity={item.severity} size="small" />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.treatmentPreview}>
                <Text style={styles.previewLabel}>প্রধান প্রতিকার:</Text>
                <Text style={styles.previewText} numberOfLines={2}>
                  {item.chemicalTreatmentBn[0] || item.organicTreatmentBn[0] || 'নিয়মিত পরিচর্যা করুন।'}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.readMoreText}>সম্পূর্ণ চিকিৎসা ও লক্ষণ দেখুন</Text>
                <Ionicons name="arrow-forward" size={16} color="#2E7D32" />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  cropChipsContainer: {
    maxHeight: 52,
    marginVertical: 10,
  },
  cropChipsContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  cropChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cropChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  cropChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#616161',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  diseaseCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  diseaseCardPressed: {
    backgroundColor: '#F1F8F1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cropEmojiWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmoji: {
    fontSize: 26,
  },
  headerInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
    marginTop: 2,
  },
  diseaseNameEn: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  treatmentPreview: {
    gap: 4,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#616161',
  },
  previewText: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#757575',
  },
});
