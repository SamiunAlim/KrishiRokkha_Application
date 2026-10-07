/**
 * Result Screen displaying AI diagnosis, treatment advice, and Bangla TTS Audio player.
 */

import React, { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Share,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BanglaStrings } from '../constants/banglaStrings';
import { getDiseaseById, DiseaseInfo } from '../services/labels';
import { storageService } from '../services/storageService';
import { BanglaAudioPlayer } from '../components/BanglaAudioPlayer';
import { StatusBadge } from '../components/StatusBadge';

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    diseaseId?: string;
    imageUri?: string;
    confidence?: string;
    locationDistrict?: string;
    locationSubdistrict?: string;
    latitude?: string;
    longitude?: string;
  }>();

  const diseaseId = params.diseaseId || 'tomato_late_blight';
  const imageUri = params.imageUri || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=400';
  const confidencePercent = params.confidence ? parseInt(params.confidence, 10) : 92;
  const locationDistrict = params.locationDistrict || 'বাংলাদেশ';

  const [disease, setDisease] = useState<DiseaseInfo>(() => getDiseaseById(diseaseId));
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDisease(getDiseaseById(diseaseId));
  }, [diseaseId]);

  const handleSaveToHistory = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    try {
      await storageService.saveScan(
        disease,
        confidencePercent,
        imageUri,
        params.latitude
          ? {
              latitude: parseFloat(params.latitude),
              longitude: parseFloat(params.longitude || '0'),
              district: locationDistrict,
              subdistrict: params.locationSubdistrict || '',
              formattedAddress: `${params.locationSubdistrict ? params.locationSubdistrict + ', ' : ''}${locationDistrict}`,
            }
          : null
      );
      setIsSaved(true);
      Alert.alert('সংরক্ষিত', BanglaStrings.savedSuccess);
    } catch (error) {
      console.error('Error saving scan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareResult = async () => {
    try {
      const shareMessage = `🌾 কৃষি রক্ষা - ফসলের রোগ নির্ণয়\n\nফসল: ${disease.cropBn}\nরোগ: ${disease.diseaseBn} (${disease.diseaseEn})\nঅবস্থা: ${disease.isHealthy ? 'সুস্থ' : 'আক্রান্ত'}\nনিশ্চিততা: ${confidencePercent}%\n\nচিকিৎসা পরামর্শ:\n${disease.chemicalTreatmentBn.join('\n')}\n\nকৃষি রক্ষা অ্যাপের মাধ্যমে নির্ণীত।`;
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top action bar */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.replace('/')}
          accessibilityLabel="Home"
        >
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </Pressable>
        <Text style={styles.topTitle}>{BanglaStrings.resultTitle}</Text>
        <Pressable
          style={styles.iconButton}
          onPress={handleShareResult}
          accessibilityLabel="Share"
        >
          <Ionicons name="share-social-outline" size={24} color="#2E7D32" />
        </Pressable>
      </View>

      {/* Captured Image Preview */}
      <View style={styles.imageContainer}>
        {imageUri.startsWith('http') || imageUri.startsWith('file://') ? (
          <Image source={{ uri: imageUri }} style={styles.capturedImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageEmoji}>{disease.emoji}</Text>
            <Text style={styles.imagePlaceholderText}>স্ক্যানকৃত ছবি</Text>
          </View>
        )}
      </View>

      {/* Primary Diagnosis Header */}
      <View style={styles.diagnosisCard}>
        <View style={styles.badgeRow}>
          <StatusBadge isHealthy={disease.isHealthy} severity={disease.severity} size="large" />
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {BanglaStrings.confidence} {confidencePercent}%
            </Text>
          </View>
        </View>

        <Text style={styles.cropTag}>{disease.cropBn}</Text>
        <Text style={styles.diseaseName}>{disease.diseaseBn}</Text>
        <Text style={styles.diseaseNameEn}>{disease.diseaseEn}</Text>

        {disease.scientificName && (
          <Text style={styles.scientificName}>জীবাণু: {disease.scientificName}</Text>
        )}

        {/* Location tag */}
        <View style={styles.locationTagRow}>
          <Ionicons name="location" size={14} color="#616161" />
          <Text style={styles.locationTagText}>
            {BanglaStrings.locationCaptured}: {locationDistrict}
          </Text>
        </View>
      </View>

      {/* Audio Player (Reads diagnosis and treatment aloud in Bangla) */}
      <BanglaAudioPlayer
        textToRead={disease.audioSummaryBn}
        title="বাংলায় পরামর্শ শুনুন"
      />

      {/* Healthy Crop notice or Full Disease Guidance */}
      {disease.isHealthy ? (
        <View style={[styles.infoCard, styles.healthyCard]}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="shield-checkmark" size={22} color="#2E7D32" />
            <Text style={[styles.infoCardLabel, { color: '#2E7D32' }]}>ফসলের সার্বিক অবস্থা</Text>
          </View>
          <Text style={styles.infoCardText}>{BanglaStrings.healthyDesc}</Text>
        </View>
      ) : (
        <>
          {/* Symptoms Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="information-circle" size={20} color="#2E7D32" />
              <Text style={styles.infoCardLabel}>{BanglaStrings.diseaseDetails}</Text>
            </View>
            <View style={styles.listBlock}>
              {disease.symptomsBn.map((symptom, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Chemical Treatment Guidance */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="medkit" size={20} color="#D32F2F" />
              <Text style={[styles.infoCardLabel, { color: '#D32F2F' }]}>
                {BanglaStrings.chemicalTreatment}
              </Text>
            </View>
            <View style={styles.listBlock}>
              {disease.chemicalTreatmentBn.map((treatment, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#D32F2F' }]} />
                  <Text style={styles.bulletText}>{treatment}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Organic / Natural Remedies */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="leaf" size={20} color="#2E7D32" />
              <Text style={styles.infoCardLabel}>{BanglaStrings.organicTreatment}</Text>
            </View>
            <View style={styles.listBlock}>
              {disease.organicTreatmentBn.map((organic, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{organic}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Prevention Tips */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="shield-outline" size={20} color="#ED6C02" />
              <Text style={[styles.infoCardLabel, { color: '#ED6C02' }]}>
                {BanglaStrings.preventionTips}
              </Text>
            </View>
            <View style={styles.listBlock}>
              {disease.preventionBn.map((prev, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#ED6C02' }]} />
                  <Text style={styles.bulletText}>{prev}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <Pressable
          style={[styles.saveButton, isSaved && styles.saveButtonSaved]}
          onPress={handleSaveToHistory}
          disabled={isSaved || isSaving}
        >
          <Ionicons
            name={isSaved ? 'checkmark-circle' : 'bookmark-outline'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.saveButtonText}>
            {isSaved ? 'সংরক্ষিত হয়েছে' : BanglaStrings.save}
          </Text>
        </Pressable>

        <Pressable
          style={styles.newScanButton}
          onPress={() => router.replace('/scan')}
        >
          <Ionicons name="camera" size={20} color="#2E7D32" />
          <Text style={styles.newScanText}>{BanglaStrings.scanNow}</Text>
        </Pressable>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingBottom: 16,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F8F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F1F8F1',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageEmoji: {
    fontSize: 54,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: '#81C784',
    fontWeight: '600',
  },
  diagnosisCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confidenceBadge: {
    backgroundColor: '#F1F8F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  confidenceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cropTag: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 2,
    lineHeight: 32,
  },
  diseaseNameEn: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  scientificName: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 10,
  },
  locationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  locationTagText: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  healthyCard: {
    backgroundColor: '#F1F8F1',
    borderColor: '#C8E6C9',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoCardLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E7D32',
  },
  infoCardText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
  },
  listBlock: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginTop: 6,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonSaved: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  newScanButton: {
    flex: 1,
    backgroundColor: '#F1F8F1',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  newScanText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '700',
  },
});
