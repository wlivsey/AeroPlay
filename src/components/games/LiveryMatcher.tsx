import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';

const { width: screenWidth } = Dimensions.get('window');

interface Livery {
  id: string;
  airline: string;
  tailDesign: string;
  logo: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockLiveries: Livery[] = [
  {
    id: '1',
    airline: 'United',
    tailDesign: '🔵',
    logo: '✈️',
    difficulty: 'easy',
  },
  {
    id: '2',
    airline: 'Delta',
    tailDesign: '🔺',
    logo: '🛩️',
    difficulty: 'easy',
  },
  {
    id: '3',
    airline: 'American',
    tailDesign: '🦅',
    logo: '🛫',
    difficulty: 'medium',
  },
  {
    id: '4',
    airline: 'Southwest',
    tailDesign: '❤️',
    logo: '🛬',
    difficulty: 'medium',
  },
];

interface LiveryMatcherProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

export const LiveryMatcher: React.FC<LiveryMatcherProps> = ({
  difficulty,
  onComplete,
}) => {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [selectedTail, setSelectedTail] = useState<string | null>(null);
  const [correctLivery, setCorrectLivery] = useState<Livery | null>(null);
  const [options, setOptions] = useState<Livery[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setupNewRound();
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive]);

  const setupNewRound = () => {
    const filtered = mockLiveries.filter(l =>
      difficulty === 'hard' || l.difficulty === difficulty || l.difficulty === 'easy'
    );

    const correct = filtered[Math.floor(Math.random() * filtered.length)];
    const others = filtered
      .filter(l => l.id !== correct.id)
      .slice(0, 3);

    const allOptions = [correct, ...others].sort(() => Math.random() - 0.5);

    setCorrectLivery(correct);
    setOptions(allOptions);
    setSelectedTail(null);
  };

  const handleSelection = (livery: Livery) => {
    setSelectedTail(livery.tailDesign);

    if (livery.id === correctLivery?.id) {
      setScore(score + 10);
      Alert.alert('Correct!', `That's ${livery.airline}!`, [
        { text: 'Next', onPress: () => nextRound() }
      ]);
    } else {
      Alert.alert('Try Again!', `That's ${livery.airline}, not ${correctLivery?.airline}`, [
        { text: 'OK' }
      ]);
    }
  };

  const nextRound = () => {
    if (round < 5) {
      setRound(round + 1);
      setTimeLeft(timeLeft + 5); // Bonus time for correct answer
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsActive(false);
    onComplete(score);
  };

  if (!correctLivery) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.title}>
          Match the Airline!
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText variant="body">Round: {round}/5</ThemedText>
          <ThemedText variant="body">Score: {score}</ThemedText>
          <ThemedText variant="body" style={timeLeft < 10 ? styles.urgentTime : undefined}>
            Time: {timeLeft}s
          </ThemedText>
        </View>
      </View>

      <View style={styles.targetSection}>
        <ThemedText variant="subtitle">Which airline has this logo?</ThemedText>
        <View style={styles.logoDisplay}>
          <ThemedText style={styles.largeLogo}>{correctLivery.logo}</ThemedText>
        </View>
      </View>

      <View style={styles.optionsGrid}>
        {options.map(livery => (
          <TouchableOpacity
            key={livery.id}
            style={[
              styles.optionCard,
              selectedTail === livery.tailDesign && styles.selectedCard,
            ]}
            onPress={() => handleSelection(livery)}
            disabled={!isActive}
          >
            <ThemedText style={styles.tailDesign}>{livery.tailDesign}</ThemedText>
            <ThemedText variant="caption">{livery.airline}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {!isActive && (
        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={() => {
            setRound(1);
            setScore(0);
            setTimeLeft(30);
            setIsActive(true);
          }}
        >
          <ThemedText variant="button">Play Again</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    color: '#3498DB',
    textAlign: 'center',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentTime: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  targetSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoDisplay: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  largeLogo: {
    fontSize: 80,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#E8F4FF',
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  tailDesign: {
    fontSize: 50,
    marginBottom: 10,
  },
  playAgainButton: {
    backgroundColor: '#27AE60',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default LiveryMatcher;