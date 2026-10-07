/**
 * Main Layout with Stack navigation, Status bar, ErrorBoundary, and global push notification setup.
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { firebaseService } from '../services/firebaseService';

export default function RootLayout() {
  useEffect(() => {
    // Attempt push notification registration for outbreak alerts
    firebaseService.registerForPushNotifications();
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="scan" options={{ animation: 'fade' }} />
        <Stack.Screen name="result" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="treatment-guide" />
      </Stack>
    </ErrorBoundary>
  );
}
