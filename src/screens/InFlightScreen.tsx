import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from '../components/common/SafeAreaView';
import { ThemedText } from '../components/common/ThemedText';
import { LandmarkCard } from '../components/inflight/LandmarkCard';
import { WindowAlert } from '../components/inflight/WindowAlert';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteEngine } from '../services/RouteEngine';

const { width: screenWidth } = Dimensions.get('window');

interface Landmark {
  id: string;
  name: string;
  type: 'natural' | 'city' | 'structure' | 'water';
  description: string;
  kidFacts: string[];
  side: 'left' | 'right';
  etaMinutes: number;
  spotted: boolean;
}

export const InFlightScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { flightNumber, airline, seatNumber } = route.params as any;

  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [totalFlightMinutes] = useState(305);
  const [currentLandmark, setCurrentLandmark] = useState<Landmark | null>(null);
  const [alertLandmark, setAlertLandmark] = useState<Landmark | null>(null);
  const [showLandmarkModal, setShowLandmarkModal] = useState(false);
  const [completedLandmarks, setCompletedLandmarks] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const landmarks: Landmark[] = [
    {
      id: '1',
      name: 'Grand Canyon',
      type: 'natural',
      description: 'One of the world\'s most spectacular natural wonders! Look for the deep red and orange layers of rock.',
      kidFacts: [
        'The Grand Canyon is 277 miles long and up to 18 miles wide!',
        'It was carved by the Colorado River over 6 million years.',
        'You can see rocks that are 2 billion years old!',
      ],
      side: 'left',
      etaMinutes: 45,
      spotted: false,
    },
    {
      id: '2',
      name: 'Denver',
      type: 'city',
      description: 'The Mile High City! Look for the tall buildings and the Rocky Mountains nearby.',
      kidFacts: [
        'Denver is exactly one mile above sea level - that\'s 5,280 feet!',
        'The 13th step of the State Capitol building is exactly one mile high.',
        'Denver has 300 days of sunshine per year!',
      ],
      side: 'right',
      etaMinutes: 120,
      spotted: false,
    },
    {
      id: '3',
      name: 'Mississippi River',
      type: 'water',
      description: 'The mighty Mississippi! Look for the winding river that looks like a giant snake.',
      kidFacts: [
        'The Mississippi River is 2,320 miles long!',
        'It takes a drop of water 90 days to travel the entire river.',
        'The river is home to 260 species of fish!',
      ],
      side: 'left',
      etaMinutes: 180,
      spotted: false,
    },
    {
      id: '4',
      name: 'Chicago',
      type: 'city',
      description: 'The Windy City! Look for the tall skyscrapers and Lake Michigan.',
      kidFacts: [
        'Chicago has the world\'s first skyscraper built in 1885!',
        'The city is famous for deep-dish pizza.',
        'Lake Michigan looks like an ocean from the air!',
      ],
      side: 'right',
      etaMinutes: 220,
      spotted: false,
    },
  ];

  const [upcomingLandmarks, setUpcomingLandmarks] = useState(landmarks);

  useEffect(() => {
    startFlightSimulation();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startFlightSimulation = () => {
    intervalRef.current = setInterval(() => {
      setElapsedMinutes(prev => {
        const newMinutes = prev + 1;

        if (newMinutes >= totalFlightMinutes) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleFlightComplete();
          return totalFlightMinutes;
        }

        checkUpcomingLandmarks(newMinutes);
        return newMinutes;
      });
    }, 1000);
  };

  const checkUpcomingLandmarks = (currentMinutes: number) => {
    upcomingLandmarks.forEach(landmark => {
      if (Math.abs(currentMinutes - landmark.etaMinutes) <= 5 && !landmark.spotted) {
        if (currentMinutes === landmark.etaMinutes - 5) {
          setAlertLandmark(landmark);
        }
      }
    });
  };

  const handlePauseResume = () => {
    if (isPaused) {
      startFlightSimulation();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    setIsPaused(!isPaused);
  };

  const handleLandmarkSpotted = (landmarkId: string) => {
    setCompletedLandmarks([...completedLandmarks, landmarkId]);
    setUpcomingLandmarks(prev =>
      prev.map(l => l.id === landmarkId ? { ...l, spotted: true } : l)
    );
    setShowLandmarkModal(false);
    setCurrentLandmark(null);

    Alert.alert(
      '🎉 Great Spotting!',
      'You earned 10 points! Keep looking for more landmarks.',
      [{ text: 'Awesome!' }]
    );
  };

  const handleFlightComplete = () => {
    Alert.alert(
      '✈️ Landing Soon!',
      `Great job! You spotted ${completedLandmarks.length} landmarks on this flight.`,
      [
        {
          text: 'View Summary',
          onPress: () => navigation.navigate('Home'),
        }
      ]
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const progressPercentage = (elapsedMinutes / totalFlightMinutes) * 100;

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText variant="title" style={styles.title}>
            In-Flight Adventure
          </ThemedText>
          <ThemedText variant="caption" style={styles.flightInfo}>
            {airline} {flightNumber} • Seat {seatNumber}
          </ThemedText>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <ThemedText variant="caption">Elapsed</ThemedText>
            <ThemedText variant="body" style={styles.timeText}>
              {formatTime(elapsedMinutes)}
            </ThemedText>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
              <View
                style={[
                  styles.airplane,
                  { left: `${progressPercentage}%` },
                ]}
              >
                <ThemedText style={styles.airplaneEmoji}>✈️</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.progressInfo}>
            <ThemedText variant="caption">Remaining</ThemedText>
            <ThemedText variant="body" style={styles.timeText}>
              {formatTime(totalFlightMinutes - elapsedMinutes)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statEmoji}>🎯</ThemedText>
            <ThemedText variant="body" style={styles.statValue}>
              {completedLandmarks.length}
            </ThemedText>
            <ThemedText variant="caption">Spotted</ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText style={styles.statEmoji}>⭐</ThemedText>
            <ThemedText variant="body" style={styles.statValue}>
              {completedLandmarks.length * 10}
            </ThemedText>
            <ThemedText variant="caption">Points</ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText style={styles.statEmoji}>📍</ThemedText>
            <ThemedText variant="body" style={styles.statValue}>
              {upcomingLandmarks.filter(l => !l.spotted).length}
            </ThemedText>
            <ThemedText variant="caption">Upcoming</ThemedText>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            🗺️ Upcoming Landmarks
          </ThemedText>

          {upcomingLandmarks
            .filter(l => !l.spotted)
            .slice(0, 3)
            .map(landmark => (
              <TouchableOpacity
                key={landmark.id}
                style={styles.upcomingCard}
                onPress={() => {
                  setCurrentLandmark(landmark);
                  setShowLandmarkModal(true);
                }}
              >
                <View style={styles.upcomingInfo}>
                  <ThemedText variant="body">{landmark.name}</ThemedText>
                  <ThemedText variant="caption">
                    In {landmark.etaMinutes - elapsedMinutes} minutes
                  </ThemedText>
                </View>
                <View style={[
                  styles.sideBadge,
                  landmark.side === 'left' ? styles.leftBadge : styles.rightBadge,
                ]}>
                  <ThemedText variant="caption">
                    {landmark.side === 'left' ? '👈' : '👉'}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, isPaused && styles.pausedButton]}
            onPress={handlePauseResume}
          >
            <ThemedText variant="button">
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.navigate('GamesScreen')}
          >
            <ThemedText variant="button">🎮 Play Games</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {alertLandmark && (
        <WindowAlert
          landmark={alertLandmark}
          onDismiss={() => setAlertLandmark(null)}
          onViewDetails={() => {
            setCurrentLandmark(alertLandmark);
            setShowLandmarkModal(true);
            setAlertLandmark(null);
          }}
        />
      )}

      <Modal
        visible={showLandmarkModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLandmarkModal(false)}
      >
        <View style={styles.modalContainer}>
          {currentLandmark && (
            <LandmarkCard
              landmark={currentLandmark}
              onComplete={() => handleLandmarkSpotted(currentLandmark.id)}
              onDismiss={() => setShowLandmarkModal(false)}
            />
          )}
        </View>
      </Modal>
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
    marginTop: 20,
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
  progressSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressBarContainer: {
    marginVertical: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#ECF0F1',
    borderRadius: 6,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: 6,
  },
  airplane: {
    position: 'absolute',
    top: -15,
    marginLeft: -15,
  },
  airplaneEmoji: {
    fontSize: 30,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#2C3E50',
  },
  upcomingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#2C3E50',
  },
  upcomingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingInfo: {
    flex: 1,
  },
  sideBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  leftBadge: {
    backgroundColor: '#E8F5E9',
  },
  rightBadge: {
    backgroundColor: '#FFF3E0',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  pausedButton: {
    backgroundColor: '#27AE60',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InFlightScreen;