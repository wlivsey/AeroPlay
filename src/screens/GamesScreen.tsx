import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from '../components/common/SafeAreaView';
import { ThemedText } from '../components/common/ThemedText';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  points: number;
  color: string;
}

export const GamesScreen: React.FC = () => {
  const navigation = useNavigation();

  const games: Game[] = [
    {
      id: 'livery-matcher',
      name: 'Livery Matcher',
      emoji: '✈️',
      description: 'Match airline logos to their tail designs',
      difficulty: 'easy',
      timeEstimate: '5 mins',
      points: 50,
      color: '#3498DB',
    },
    {
      id: 'state-shape-quiz',
      name: 'State Shape Quiz',
      emoji: '🗺️',
      description: 'Identify states and countries from their outlines',
      difficulty: 'medium',
      timeEstimate: '10 mins',
      points: 100,
      color: '#27AE60',
    },
    {
      id: 'cloud-spotter',
      name: 'Cloud Spotter',
      emoji: '☁️',
      description: 'Learn to identify different types of clouds',
      difficulty: 'easy',
      timeEstimate: '7 mins',
      points: 75,
      color: '#9B59B6',
    },
    {
      id: 'airport-codes',
      name: 'Airport Code Master',
      emoji: '🛫',
      description: 'Match airport codes to cities around the world',
      difficulty: 'hard',
      timeEstimate: '15 mins',
      points: 150,
      color: '#E74C3C',
    },
    {
      id: 'plane-parts',
      name: 'Airplane Parts',
      emoji: '🛩️',
      description: 'Learn the parts of an airplane',
      difficulty: 'easy',
      timeEstimate: '5 mins',
      points: 50,
      color: '#F39C12',
    },
    {
      id: 'time-zones',
      name: 'Time Zone Traveler',
      emoji: '🕐',
      description: 'Calculate time differences around the world',
      difficulty: 'hard',
      timeEstimate: '12 mins',
      points: 125,
      color: '#16A085',
    },
  ];

  const handleGamePress = (game: Game) => {
    Alert.alert(
      `${game.emoji} ${game.name}`,
      `This game is coming soon! It will award ${game.points} points when completed.`,
      [
        { text: 'Can\'t Wait!', style: 'cancel' },
        { text: 'Back to Flight', onPress: () => navigation.goBack() },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#2ECC71';
      case 'medium': return '#F39C12';
      case 'hard': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText variant="title" style={styles.title}>
            Mini Games 🎮
          </ThemedText>
          <ThemedText variant="caption" style={styles.subtitle}>
            Play games and earn points while you fly!
          </ThemedText>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statEmoji}>⭐</ThemedText>
            <ThemedText variant="body" style={styles.statValue}>250</ThemedText>
            <ThemedText variant="caption">Total Points</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statEmoji}>🏆</ThemedText>
            <ThemedText variant="body" style={styles.statValue}>5</ThemedText>
            <ThemedText variant="caption">Games Won</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statEmoji}>🎯</ThemedText>
            <ThemedText variant="body" style={styles.statValue}>Level 3</ThemedText>
            <ThemedText variant="caption">Current Level</ThemedText>
          </View>
        </View>

        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderTopColor: game.color }]}
              onPress={() => handleGamePress(game)}
              activeOpacity={0.8}
            >
              <View style={styles.gameHeader}>
                <ThemedText style={styles.gameEmoji}>{game.emoji}</ThemedText>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(game.difficulty) }
                ]}>
                  <ThemedText variant="caption" style={styles.difficultyText}>
                    {game.difficulty.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              <ThemedText variant="body" style={styles.gameName}>
                {game.name}
              </ThemedText>

              <ThemedText variant="caption" style={styles.gameDescription}>
                {game.description}
              </ThemedText>

              <View style={styles.gameFooter}>
                <View style={styles.gameInfo}>
                  <ThemedText variant="caption">⏱️ {game.timeEstimate}</ThemedText>
                </View>
                <View style={styles.gameInfo}>
                  <ThemedText variant="caption">⭐ {game.points} pts</ThemedText>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: game.color }]}
                onPress={() => handleGamePress(game)}
              >
                <ThemedText variant="button" style={styles.playButtonText}>
                  PLAY
                </ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ThemedText variant="button" style={styles.backButtonText}>
            ← Back to Flight
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
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    color: '#3498DB',
    marginBottom: 10,
  },
  subtitle: {
    color: '#7F8C8D',
    fontSize: 16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: (screenWidth - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameEmoji: {
    fontSize: 32,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gameName: {
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  gameDescription: {
    color: '#7F8C8D',
    marginBottom: 10,
    minHeight: 40,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gameInfo: {
    flexDirection: 'row',
  },
  playButton: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#95A5A6',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
  },
});

export default GamesScreen;