import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from '../components/common/SafeAreaView';
import { ThemedText } from '../components/common/ThemedText';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useNavigation, useRoute } from '@react-navigation/native';

interface RoutePackInfo {
  id: string;
  origin: string;
  destination: string;
  landmarks: number;
  sizeInMB: number;
  downloadProgress: number;
  isDownloaded: boolean;
}

export const PreFlightScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { flightNumber, airline, seatNumber } = route.params as any;

  const [routePack, setRoutePack] = useState<RoutePackInfo>({
    id: 'LAX-JFK',
    origin: 'Los Angeles (LAX)',
    destination: 'New York (JFK)',
    landmarks: 47,
    sizeInMB: 32,
    downloadProgress: 0,
    isDownloaded: false,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('pilot');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  const avatars = [
    { id: 'pilot', emoji: '👨‍✈️', name: 'Pilot Pete' },
    { id: 'astronaut', emoji: '👩‍🚀', name: 'Astronaut Amy' },
    { id: 'explorer', emoji: '🧭', name: 'Explorer Emma' },
    { id: 'scientist', emoji: '👨‍🔬', name: 'Scientist Sam' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', age: '4-6 years', color: '#2ECC71' },
    { id: 'medium', name: 'Medium', age: '7-9 years', color: '#F39C12' },
    { id: 'hard', name: 'Hard', age: '10+ years', color: '#E74C3C' },
  ];

  useEffect(() => {
    simulateRoutePackCheck();
  }, []);

  const simulateRoutePackCheck = () => {
    setTimeout(() => {
      setRoutePack(prev => ({
        ...prev,
        origin: 'Los Angeles (LAX)',
        destination: 'New York (JFK)',
        landmarks: 47,
      }));
    }, 500);
  };

  const handleDownloadRoutePack = () => {
    setIsDownloading(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setRoutePack(prev => ({
        ...prev,
        downloadProgress: progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setRoutePack(prev => ({
          ...prev,
          isDownloaded: true,
        }));
        setIsDownloading(false);
      }
    }, 300);
  };

  const handleStartFlight = () => {
    navigation.navigate('InFlight', {
      flightNumber,
      airline,
      seatNumber,
      avatar: selectedAvatar,
      difficulty: selectedDifficulty,
      routePack,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText variant="title" style={styles.title}>
            Pre-Flight Setup
          </ThemedText>
          <ThemedText variant="caption" style={styles.flightInfo}>
            {airline} {flightNumber} • Seat {seatNumber}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            📦 Route Pack
          </ThemedText>
          <View style={styles.routePackCard}>
            <View style={styles.routeInfo}>
              <ThemedText variant="body" style={styles.routeText}>
                {routePack.origin}
              </ThemedText>
              <ThemedText variant="caption">✈️ to ✈️</ThemedText>
              <ThemedText variant="body" style={styles.routeText}>
                {routePack.destination}
              </ThemedText>
            </View>
            <View style={styles.packDetails}>
              <ThemedText variant="caption">
                {routePack.landmarks} landmarks • {routePack.sizeInMB}MB
              </ThemedText>
            </View>

            {!routePack.isDownloaded ? (
              <>
                {isDownloading ? (
                  <View style={styles.downloadProgress}>
                    <ThemedText variant="caption" style={styles.progressText}>
                      Downloading... {routePack.downloadProgress}%
                    </ThemedText>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${routePack.downloadProgress}%` }
                        ]}
                      />
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={handleDownloadRoutePack}
                  >
                    <ThemedText variant="button" style={styles.downloadButtonText}>
                      Download Route Pack
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.downloadedIndicator}>
                <ThemedText variant="body" style={styles.downloadedText}>
                  ✅ Ready for offline use
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            🎭 Choose Your Avatar
          </ThemedText>
          <View style={styles.avatarGrid}>
            {avatars.map(avatar => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarCard,
                  selectedAvatar === avatar.id && styles.avatarCardSelected,
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <ThemedText style={styles.avatarEmoji}>{avatar.emoji}</ThemedText>
                <ThemedText variant="caption">{avatar.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            🎯 Select Difficulty
          </ThemedText>
          <View style={styles.difficultyContainer}>
            {difficulties.map(diff => (
              <TouchableOpacity
                key={diff.id}
                style={[
                  styles.difficultyCard,
                  selectedDifficulty === diff.id && styles.difficultyCardSelected,
                  { borderColor: diff.color },
                ]}
                onPress={() => setSelectedDifficulty(diff.id)}
              >
                <ThemedText
                  variant="body"
                  style={[styles.difficultyName, { color: diff.color }]}
                >
                  {diff.name}
                </ThemedText>
                <ThemedText variant="caption">{diff.age}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            !routePack.isDownloaded && styles.startButtonDisabled,
          ]}
          onPress={handleStartFlight}
          disabled={!routePack.isDownloaded}
        >
          <ThemedText variant="button">
            {routePack.isDownloaded ? 'Start Flight Adventure' : 'Download Pack First'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    color: '#3498DB',
    marginBottom: 10,
  },
  flightInfo: {
    color: '#7F8C8D',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#2C3E50',
  },
  routePackCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  routeInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  routeText: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  packDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#3498DB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
  },
  downloadProgress: {
    alignItems: 'center',
  },
  progressText: {
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  downloadedIndicator: {
    alignItems: 'center',
  },
  downloadedText: {
    color: '#27AE60',
    fontWeight: '600',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#ECF0F1',
  },
  avatarCardSelected: {
    borderColor: '#3498DB',
    backgroundColor: '#F0F8FF',
  },
  avatarEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  difficultyContainer: {
    gap: 10,
  },
  difficultyCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    borderWidth: 3,
    marginBottom: 10,
  },
  difficultyCardSelected: {
    backgroundColor: '#F8F9FF',
  },
  difficultyName: {
    fontWeight: '600',
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: '#27AE60',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: '#95A5A6',
    shadowColor: '#95A5A6',
  },
});

export default PreFlightScreen;