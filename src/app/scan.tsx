/**
 * Scan Screen with Live Camera Viewfinder & Gallery Image Picker.
 * Integrates:
 * - expo-camera CameraView with front/back toggle & flash toggle
 * - expo-image-picker for photo gallery selection
 * - Automatic GPS location capture (expo-location)
 * - On-device AI inference execution (tfliteService)
 * - Bangla guidance and permission requests
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BanglaStrings } from '../constants/banglaStrings';
import { tfliteService } from '../services/tfliteService';
import { locationService } from '../services/locationService';
import { PermissionPrompt } from '../components/PermissionPrompt';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // If permission is still determining or denied
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <PermissionPrompt
        icon="camera-outline"
        title={BanglaStrings.cameraPermissionTitle}
        description={BanglaStrings.cameraPermissionDesc}
        buttonText={BanglaStrings.grantPermission}
        onRequestPermission={requestPermission}
      />
    );
  }

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const processImageAndNavigate = async (imageUri: string) => {
    setIsProcessing(true);
    try {
      // 1. Fetch GPS location in background
      const location = await locationService.getCurrentScanLocation();

      // 2. Run on-device TFLite inference
      const detection = await tfliteService.detectDisease(imageUri);

      // 3. Navigate to result screen with metadata
      router.replace({
        pathname: '/result',
        params: {
          diseaseId: detection.disease.id,
          imageUri: detection.processedImageUri,
          confidence: detection.confidencePercent.toString(),
          locationDistrict: location?.district || '',
          locationSubdistrict: location?.subdistrict || '',
          latitude: location?.latitude?.toString() || '',
          longitude: location?.longitude?.toString() || '',
        },
      });
    } catch (error) {
      console.error('Detection pipeline error:', error);
      Alert.alert('ত্রুটি', BanglaStrings.errorModelInference);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapturePhoto = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      if (photo?.uri) {
        await processImageAndNavigate(photo.uri);
      }
    } catch (error) {
      console.error('Take picture error:', error);
      Alert.alert('ত্রুটি', BanglaStrings.errorNoImage);
    }
  };

  const handlePickFromGallery = async () => {
    if (isProcessing) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        await processImageAndNavigate(selectedUri);
      }
    } catch (error) {
      console.error('Gallery pick error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Camera View */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />

      {/* Top action bar */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.iconCircle}
          onPress={() => router.back()}
          disabled={isProcessing}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.topTitle}>{BanglaStrings.scanCrop}</Text>

        <Pressable
          style={[styles.iconCircle, flash === 'on' && styles.iconActive]}
          onPress={toggleFlash}
          disabled={isProcessing}
          accessibilityLabel="Flash toggle"
        >
          <Ionicons
            name={flash === 'on' ? 'flash' : 'flash-off-outline'}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      {/* Viewfinder Alignment overlay */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {/* Target Corner Guides */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Processing state or Guide text */}
          {isProcessing ? (
            <View style={styles.processingBox}>
              <ActivityIndicator size="large" color="#81C784" />
              <Text style={styles.processingText}>{BanglaStrings.processingImage}</Text>
              <Text style={styles.processingSubtext}>{BanglaStrings.aiDiagnosing}</Text>
            </View>
          ) : (
            <View style={styles.centerHint}>
              <Ionicons name="leaf-outline" size={48} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.centerHintText}>{BanglaStrings.alignLeafInFrame}</Text>
            </View>
          )}
        </View>

        {!isProcessing && (
          <Text style={styles.subInstruction}>{BanglaStrings.cameraTip}</Text>
        )}
      </View>

      {/* Bottom control dock */}
      <View style={styles.bottomControls}>
        {/* Gallery button */}
        <Pressable
          style={styles.sideButton}
          onPress={handlePickFromGallery}
          disabled={isProcessing}
          accessibilityLabel="Pick from gallery"
        >
          <Ionicons name="images-outline" size={26} color="#FFFFFF" />
          <Text style={styles.sideButtonLabel}>গ্যালারি</Text>
        </Pressable>

        {/* Shutter capture button */}
        <Pressable
          style={({ pressed }) => [
            styles.captureButton,
            pressed && styles.captureButtonPressed,
            isProcessing && styles.captureButtonDisabled,
          ]}
          onPress={handleCapturePhoto}
          disabled={isProcessing}
          accessibilityLabel="Capture photo"
        >
          <View style={styles.captureInner}>
            <Ionicons name="camera" size={32} color="#FFFFFF" />
          </View>
        </Pressable>

        {/* Flip camera facing */}
        <Pressable
          style={styles.sideButton}
          onPress={toggleFacing}
          disabled={isProcessing}
          accessibilityLabel="Flip camera"
        >
          <Ionicons name="camera-reverse-outline" size={26} color="#FFFFFF" />
          <Text style={styles.sideButtonLabel}>ঘোরান</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    zIndex: 10,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: '#2E7D32',
  },
  viewfinderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  viewfinder: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(129, 199, 132, 0.6)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#81C784',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 24,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 24,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 24,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 24,
  },
  centerHint: {
    alignItems: 'center',
    gap: 12,
  },
  centerHintText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subInstruction: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  processingBox: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 24,
    borderRadius: 16,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  processingSubtext: {
    fontSize: 13,
    color: '#A5D6A7',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingBottom: 48,
    paddingTop: 16,
  },
  sideButton: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  sideButtonLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#81C784',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  captureButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});