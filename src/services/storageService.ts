/**
 * Offline Storage Service using AsyncStorage / SQLite.
 * Manages local scan records, sync queue for cloud sync, user settings, and statistics.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiseaseInfo, getDiseaseById } from './labels';
import { ScanLocation } from './locationService';

export interface ScanRecord {
  id: string;
  timestamp: number;
  formattedDateBn: string;
  imageUri: string;
  diseaseId: string;
  cropBn: string;
  diseaseBn: string;
  isHealthy: boolean;
  confidencePercent: number;
  severity: 'low' | 'medium' | 'high';
  location?: ScanLocation | null;
  syncStatus: 'synced' | 'pending' | 'failed';
  notes?: string;
}

const STORAGE_KEYS = {
  SCANS: '@crop_disease_scans_v1',
  SYNC_QUEUE: '@crop_disease_sync_queue_v1',
  SETTINGS: '@crop_disease_settings_v1',
};

// Seed default initial demo scans if storage is empty for fresh install
const DEFAULT_INITIAL_SCANS: ScanRecord[] = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    formattedDateBn: '২ ঘণ্টা আগে',
    imageUri: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=400',
    diseaseId: 'tomato_late_blight',
    cropBn: 'টমেটো',
    diseaseBn: 'টমেটোর নাবি ধসা (লেফট ব্লাইট)',
    isHealthy: false,
    confidencePercent: 92,
    severity: 'high',
    location: {
      latitude: 23.8103,
      longitude: 90.4125,
      district: 'ঢাকা',
      formattedAddress: 'ঢাকা, বাংলাদেশ',
    },
    syncStatus: 'synced',
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    formattedDateBn: 'গতকাল',
    imageUri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    diseaseId: 'rice_healthy',
    cropBn: 'ধান',
    diseaseBn: 'সুস্থ ধান গাছ',
    isHealthy: true,
    confidencePercent: 96,
    severity: 'low',
    location: {
      latitude: 24.3636,
      longitude: 88.6241,
      district: 'রাজশাহী',
      formattedAddress: 'রাজশাহী, বাংলাদেশ',
    },
    syncStatus: 'synced',
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    formattedDateBn: '৩ দিন আগে',
    imageUri: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    diseaseId: 'potato_late_blight',
    cropBn: 'আলু',
    diseaseBn: 'আলুর নাবি ধসা (লেট ব্লাইট)',
    isHealthy: false,
    confidencePercent: 89,
    severity: 'high',
    location: {
      latitude: 25.7439,
      longitude: 89.2752,
      district: 'রংপুর',
      formattedAddress: 'রংপুর, বাংলাদেশ',
    },
    syncStatus: 'pending',
  },
];

class StorageService {
  /**
   * Fetch all saved scans sorted with newest first
   */
  public async getScans(): Promise<ScanRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SCANS);
      if (!data) {
        // Initialize with default demo items
        await this.saveAllScans(DEFAULT_INITIAL_SCANS);
        return DEFAULT_INITIAL_SCANS;
      }
      const parsed: ScanRecord[] = JSON.parse(data);
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error loading scans from local storage:', error);
      return DEFAULT_INITIAL_SCANS;
    }
  }

  /**
   * Save a new scan record locally and queue for cloud sync
   */
  public async saveScan(
    disease: DiseaseInfo,
    confidencePercent: number,
    imageUri: string,
    location?: ScanLocation | null
  ): Promise<ScanRecord> {
    const scans = await this.getScans();
    
    const newRecord: ScanRecord = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      formattedDateBn: 'এখনই',
      imageUri,
      diseaseId: disease.id,
      cropBn: disease.cropBn,
      diseaseBn: disease.diseaseBn,
      isHealthy: disease.isHealthy,
      confidencePercent,
      severity: disease.severity,
      location,
      syncStatus: 'pending',
    };

    const updated = [newRecord, ...scans];
    await this.saveAllScans(updated);
    await this.addToSyncQueue(newRecord.id);

    return newRecord;
  }

  /**
   * Delete a scan record by ID
   */
  public async deleteScan(id: string): Promise<boolean> {
    try {
      const scans = await this.getScans();
      const filtered = scans.filter((s) => s.id !== id);
      await this.saveAllScans(filtered);
      return true;
    } catch (error) {
      console.error('Error deleting scan:', error);
      return false;
    }
  }

  /**
   * Clear all stored local cache and history
   */
  public async clearAllCache(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SCANS);
      await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  /**
   * Mark a record as synced
   */
  public async markRecordSynced(id: string): Promise<void> {
    const scans = await this.getScans();
    const updated = scans.map((s) => (s.id === id ? { ...s, syncStatus: 'synced' as const } : s));
    await this.saveAllScans(updated);
    await this.removeFromSyncQueue(id);
  }

  /**
   * Get IDs of scans waiting to be synced to Firebase
   */
  public async getSyncQueue(): Promise<string[]> {
    try {
      const queue = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  }

  private async addToSyncQueue(id: string): Promise<void> {
    const queue = await this.getSyncQueue();
    if (!queue.includes(id)) {
      queue.push(id);
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    }
  }

  private async removeFromSyncQueue(id: string): Promise<void> {
    const queue = await this.getSyncQueue();
    const updated = queue.filter((item) => item !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(updated));
  }

  private async saveAllScans(scans: ScanRecord[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  }
}

export const storageService = new StorageService();
