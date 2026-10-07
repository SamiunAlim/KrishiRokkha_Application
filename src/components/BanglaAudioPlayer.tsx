/**
 * Interactive Bangla Text-to-Speech (TTS) Audio Player.
 * Specially designed with large touch targets, visual soundwave indicator,
 * and clear Bangla feedback for farmers.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ttsService, TTSStatus } from '../services/ttsService';
import { BanglaStrings } from '../constants/banglaStrings';

/*interfacing function BanglaAudioPlayerProps*/

interface BanglaAudioPlayerProps {
  textToRead: string;
  title?: string;
}

/*exporting function BanglaAudioPlayer*/

export function BanglaAudioPlayer({ textToRead, title = BanglaStrings.listenAudio }: BanglaAudioPlayerProps) {
  const [status, setStatus] = useState<TTSStatus>('stopped');
  const [waveAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const unsubscribe = ttsService.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      ttsService.stop();
      unsubscribe();
    };
  }, []);

  // Animate soundwave while playing showing that with the functions.
  useEffect(() => {
    if (status === 'playing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1.25,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0.85,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.setValue(1);
    }
  }, [status, waveAnim]);

  // use handleTogglePlay as const

  const handleTogglePlay = async () => {
    if (status === 'playing') {
      await ttsService.stop();
    } else {
      await ttsService.speakBangla(textToRead);
    }
  };

  const isPlaying = status === 'playing';

  return (
    <View style={[styles.container, isPlaying && styles.containerActive]}>
      <View style={styles.leftSection}>
        <Animated.View
          style={[
            styles.iconWrapper,
            isPlaying ? styles.iconWrapperPlaying : styles.iconWrapperIdle,
            { transform: [{ scale: isPlaying ? waveAnim : 1 }] },
          ]}
        >
          <Ionicons
            name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
            size={24}
            color={isPlaying ? '#FFFFFF' : '#2E7D32'}
          />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.statusText}>
            {isPlaying ? BanglaStrings.playingAudio : 'পরামর্শ বাংলায় শুনতে চাপ দিন'}
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          isPlaying ? styles.stopButton : styles.playButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleTogglePlay}
        accessibilityLabel={isPlaying ? BanglaStrings.stopAudio : BanglaStrings.listenAudio}
      >
        <Ionicons
          name={isPlaying ? 'stop' : 'play'}
          size={18}
          color={isPlaying ? '#D32F2F' : '#FFFFFF'}
        />
        <Text style={[styles.buttonLabel, isPlaying ? styles.stopLabel : styles.playLabel]}>
          {isPlaying ? BanglaStrings.stopAudio : 'শুনুন'}
        </Text>
      </Pressable>
    </View>
  );
}
// CSS codes for styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F8F1',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    marginVertical: 10,
  },
  containerActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperIdle: {
    backgroundColor: '#E8F5E9',
  },
  iconWrapperPlaying: {
    backgroundColor: '#2E7D32',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#616161',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  playButton: {
    backgroundColor: '#2E7D32',
  },
  stopButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  playLabel: {
    color: '#FFFFFF',
  },
  stopLabel: {
    color: '#D32F2F',
  },
});
