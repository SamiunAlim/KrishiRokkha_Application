/**
 * Bangla Text-to-Speech (TTS) Service using expo-speech.
 * Specially calibrated for Bengali farmers with clear pronunciation, moderate speed,
 * and state management (Playing, Paused, Stopped).
 */

import * as Speech from 'expo-speech';

export type TTSStatus = 'stopped' | 'playing' | 'paused';

class TTSService {
  private currentStatus: TTSStatus = 'stopped';
  private onStatusChangeCallbacks: Array<(status: TTSStatus) => void> = [];

  /**
   * Reads Bangla text aloud.
   * Prioritizes 'bn-BD' (Bangladesh) and 'bn-IN' (West Bengal) speech synthesis voices.
   */
  public async speakBangla(
    text: string,
    onDone?: () => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      // If already speaking, stop first
      await this.stop();

      this.setStatus('playing');

      Speech.speak(text, {
        language: 'bn-BD', // Bangla (Bangladesh)
        pitch: 1.0,
        rate: 0.85, // Slightly slower speed for clearer understanding by rural farmers
        onDone: () => {
          this.setStatus('stopped');
          if (onDone) onDone();
        },
        onStopped: () => {
          this.setStatus('stopped');
        },
        onError: (err) => {
          console.warn('TTS Error, trying secondary bn voice:', err);
          // Fallback to generic Bangla or default
          Speech.speak(text, {
            language: 'bn',
            pitch: 1.0,
            rate: 0.85,
            onDone: () => {
              this.setStatus('stopped');
              if (onDone) onDone();
            },
            onError: (fallbackErr) => {
              this.setStatus('stopped');
              if (onError) onError(fallbackErr);
            },
          });
        },
      });
    } catch (error) {
      this.setStatus('stopped');
      console.error('Speech synthesis failure:', error);
      if (onError) onError(error);
    }
  }

  /**
   * Stops any ongoing speech playback
   */
  public async stop(): Promise<void> {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }
      this.setStatus('stopped');
    } catch (error) {
      this.setStatus('stopped');
    }
  }

  /**
   * Checks whether the speech engine is currently active
   */
  public async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return this.currentStatus === 'playing';
    }
  }

  /**
   * Subscribe to status changes (playing, paused, stopped)
   */
  public onStatusChange(callback: (status: TTSStatus) => void): () => void {
    this.onStatusChangeCallbacks.push(callback);
    callback(this.currentStatus);
    return () => {
      this.onStatusChangeCallbacks = this.onStatusChangeCallbacks.filter((cb) => cb !== callback);
    };
  }

  private setStatus(status: TTSStatus) {
    this.currentStatus = status;
    this.onStatusChangeCallbacks.forEach((cb) => cb(status));
  }
}

export const ttsService = new TTSService();
