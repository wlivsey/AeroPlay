import * as Speech from 'expo-speech';

export interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  voice?: string;
}

class TTSService {
  private defaultOptions: TTSOptions = {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.9,
  };

  private isSpeaking = false;
  private currentUtterance: string | null = null;

  async speak(text: string, options?: TTSOptions): Promise<void> {
    if (this.isSpeaking) {
      await this.stop();
    }

    const speechOptions = {
      ...this.defaultOptions,
      ...options,
      onDone: () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
      },
      onStopped: () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
      },
      onError: (error: any) => {
        console.error('TTS Error:', error);
        this.isSpeaking = false;
        this.currentUtterance = null;
      },
    };

    this.isSpeaking = true;
    this.currentUtterance = text;

    Speech.speak(text, speechOptions);
  }

  async speakLandmarkFact(landmarkName: string, fact: string, side?: 'left' | 'right'): Promise<void> {
    const sideText = side ? `on the ${side} side` : '';
    const fullText = `Look out your window ${sideText}! ${landmarkName}. ${fact}`;

    await this.speak(fullText, {
      rate: 0.85, // Slightly slower for clarity
    });
  }

  async speakGameInstruction(instruction: string): Promise<void> {
    await this.speak(instruction, {
      pitch: 1.1, // Slightly higher pitch for game excitement
      rate: 0.95,
    });
  }

  async speakAchievement(achievement: string): Promise<void> {
    await this.speak(`Congratulations! You've earned ${achievement}!`, {
      pitch: 1.2,
      rate: 0.9,
    });
  }

  async stop(): Promise<void> {
    if (this.isSpeaking) {
      Speech.stop();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  async pause(): Promise<void> {
    if (this.isSpeaking) {
      Speech.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.currentUtterance && !this.isSpeaking) {
      Speech.resume();
      this.isSpeaking = true;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    return await Speech.getAvailableVoicesAsync();
  }

  setDefaultLanguage(language: string): void {
    this.defaultOptions.language = language;
  }

  setDefaultRate(rate: number): void {
    this.defaultOptions.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  setDefaultPitch(pitch: number): void {
    this.defaultOptions.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  async speakFlightUpdate(message: string): Promise<void> {
    await this.speak(message, {
      rate: 0.9,
      pitch: 1.0,
    });
  }

  async speakEmergency(message: string): Promise<void> {
    await this.speak(message, {
      rate: 0.7, // Slow and clear
      pitch: 0.9, // Lower pitch for seriousness
    });
  }
}

export default new TTSService();