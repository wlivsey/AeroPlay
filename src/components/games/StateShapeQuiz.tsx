import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';

const { width: screenWidth } = Dimensions.get('window');

interface StateShape {
  id: string;
  name: string;
  shape: string; // Using emoji representations for now
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockStates: StateShape[] = [
  {
    id: '1',
    name: 'Texas',
    shape: '🤠',
    hint: 'The Lone Star State',
    difficulty: 'easy',
  },
  {
    id: '2',
    name: 'California',
    shape: '🏄',
    hint: 'The Golden State',
    difficulty: 'easy',
  },
  {
    id: '3',
    name: 'Florida',
    shape: '🐊',
    hint: 'The Sunshine State',
    difficulty: 'easy',
  },
  {
    id: '4',
    name: 'New York',
    shape: '🗽',
    hint: 'The Empire State',
    difficulty: 'medium',
  },
  {
    id: '5',
    name: 'Colorado',
    shape: '⛰️',
    hint: 'The Centennial State',
    difficulty: 'medium',
  },
  {
    id: '6',
    name: 'Hawaii',
    shape: '🌺',
    hint: 'The Aloha State',
    difficulty: 'easy',
  },
];

interface StateShapeQuizProps {
  landmarksPassed?: string[];
  onComplete: (score: number) => void;
}

export const StateShapeQuiz: React.FC<StateShapeQuizProps> = ({
  landmarksPassed = [],
  onComplete,
}) => {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [currentState, setCurrentState] = useState<StateShape | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setupNewRound();
  }, [round]);

  const setupNewRound = () => {
    const availableStates = mockStates;
    const correct = availableStates[Math.floor(Math.random() * availableStates.length)];

    const otherStates = availableStates
      .filter(s => s.id !== correct.id)
      .map(s => s.name);

    const shuffled = [correct.name, ...otherStates.slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    setCurrentState(correct);
    setOptions(shuffled);
    setShowHint(false);
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentState?.name) {
      const points = showHint ? 5 : 10;
      const streakBonus = streak * 2;
      setScore(score + points + streakBonus);
      setStreak(streak + 1);

      Alert.alert(
        'Correct!',
        `That's ${currentState.name}! ${streak > 0 ? `Streak: ${streak + 1}!` : ''}`,
        [{ text: 'Next', onPress: nextRound }]
      );
    } else {
      setStreak(0);
      Alert.alert(
        'Not Quite!',
        `That was ${currentState?.name}. Try the next one!`,
        [{ text: 'OK', onPress: nextRound }]
      );
    }
  };

  const nextRound = () => {
    if (round < 10) {
      setRound(round + 1);
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    const finalScore = score + (hintsUsed === 0 ? 20 : 0); // Bonus for no hints
    onComplete(finalScore);
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  if (!currentState) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.title}>
          State Shape Quiz
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText variant="body">Round: {round}/10</ThemedText>
          <ThemedText variant="body">Score: {score}</ThemedText>
          {streak > 1 && (
            <ThemedText variant="body" style={styles.streak}>
              Streak: {streak}!
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.questionSection}>
        <ThemedText variant="subtitle">Which state is this?</ThemedText>
        <View style={styles.shapeDisplay}>
          <ThemedText style={styles.stateShape}>{currentState.shape}</ThemedText>
        </View>

        {showHint && (
          <View style={styles.hintBox}>
            <ThemedText variant="caption" style={styles.hintText}>
              Hint: {currentState.hint}
            </ThemedText>
          </View>
        )}

        {!showHint && hintsUsed < 3 && (
          <TouchableOpacity style={styles.hintButton} onPress={useHint}>
            <ThemedText variant="caption">
              Need a hint? ({3 - hintsUsed} left)
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <ThemedText variant="body">{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {landmarksPassed.length > 0 && (
        <View style={styles.landmarkHint}>
          <ThemedText variant="caption" style={styles.landmarkText}>
            You've passed {landmarksPassed.length} landmarks on your journey!
          </ThemedText>
        </View>
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
  streak: {
    color: '#F39C12',
    fontWeight: 'bold',
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  shapeDisplay: {
    width: 200,
    height: 200,
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
  stateShape: {
    fontSize: 100,
  },
  hintBox: {
    backgroundColor: '#FFF9E5',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  hintText: {
    color: '#F39C12',
    fontStyle: 'italic',
  },
  hintButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF9E5',
    borderRadius: 10,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  landmarkHint: {
    backgroundColor: '#E8F6F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  landmarkText: {
    color: '#27AE60',
    textAlign: 'center',
  },
});

export default StateShapeQuiz;