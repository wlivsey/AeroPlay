import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';

const { width: screenWidth } = Dimensions.get('window');

interface LandmarkCardProps {
  landmark: {
    id: string;
    name: string;
    type: 'natural' | 'city' | 'structure' | 'water';
    description: string;
    kidFacts: string[];
    side: 'left' | 'right';
    etaMinutes: number;
  };
  onComplete?: () => void;
  onDismiss?: () => void;
}

export const LandmarkCard: React.FC<LandmarkCardProps> = ({
  landmark,
  onComplete,
  onDismiss,
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const pan = useState(new Animated.ValueXY())[0];
  const flipAnimation = useState(new Animated.Value(0))[0];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5;
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > screenWidth * 0.3) {
        const direction = gesture.dx > 0 ? 1 : -1;
        Animated.timing(pan, {
          toValue: { x: direction * screenWidth, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          if (onDismiss) onDismiss();
        });
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextFact = () => {
    if (currentFactIndex < landmark.kidFacts.length - 1) {
      setCurrentFactIndex(currentFactIndex + 1);
    }
  };

  const prevFact = () => {
    if (currentFactIndex > 0) {
      setCurrentFactIndex(currentFactIndex - 1);
    }
  };

  const markAsSpotted = () => {
    if (onComplete) onComplete();
  };

  const getTypeIcon = () => {
    switch (landmark.type) {
      case 'natural': return '🏔️';
      case 'city': return '🏙️';
      case 'structure': return '🌉';
      case 'water': return '🌊';
      default: return '📍';
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
        <View style={styles.card}>
          <Animated.View
            style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}
          >
            <View style={styles.header}>
              <ThemedText variant="subtitle" style={styles.title}>
                {getTypeIcon()} {landmark.name}
              </ThemedText>
              <View style={[
                styles.sideBadge,
                landmark.side === 'left' ? styles.leftBadge : styles.rightBadge
              ]}>
                <ThemedText variant="caption" style={styles.sideText}>
                  {landmark.side === 'left' ? '👈 LEFT' : 'RIGHT 👉'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.content}>
              <ThemedText variant="body" style={styles.description}>
                {landmark.description}
              </ThemedText>

              <View style={styles.etaContainer}>
                <ThemedText variant="caption" style={styles.etaText}>
                  ⏱️ Look for it in {landmark.etaMinutes} minutes
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.spottedButton}
              onPress={markAsSpotted}
            >
              <ThemedText variant="button" style={styles.spottedButtonText}>
                I Spotted It! 🎯
              </ThemedText>
            </TouchableOpacity>

            <ThemedText variant="caption" style={styles.flipHint}>
              Tap to see fun facts →
            </ThemedText>
          </Animated.View>

          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              backAnimatedStyle,
              { position: 'absolute' },
            ]}
          >
            <View style={styles.factsHeader}>
              <ThemedText variant="subtitle" style={styles.factsTitle}>
                Fun Facts! 🌟
              </ThemedText>
            </View>

            <View style={styles.factContent}>
              <ThemedText variant="body" style={styles.factText}>
                {landmark.kidFacts[currentFactIndex]}
              </ThemedText>

              <View style={styles.factNavigation}>
                <TouchableOpacity
                  style={[styles.factNavButton, currentFactIndex === 0 && styles.navButtonDisabled]}
                  onPress={prevFact}
                  disabled={currentFactIndex === 0}
                >
                  <ThemedText variant="caption">←</ThemedText>
                </TouchableOpacity>

                <ThemedText variant="caption" style={styles.factCounter}>
                  {currentFactIndex + 1} / {landmark.kidFacts.length}
                </ThemedText>

                <TouchableOpacity
                  style={[
                    styles.factNavButton,
                    currentFactIndex === landmark.kidFacts.length - 1 && styles.navButtonDisabled
                  ]}
                  onPress={nextFact}
                  disabled={currentFactIndex === landmark.kidFacts.length - 1}
                >
                  <ThemedText variant="caption">→</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <ThemedText variant="caption" style={styles.flipHint}>
              ← Tap to go back
            </ThemedText>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: screenWidth - 40,
    height: 400,
  },
  cardFace: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    justifyContent: 'space-between',
  },
  cardBack: {
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    flex: 1,
    color: '#2C3E50',
  },
  sideBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  leftBadge: {
    backgroundColor: '#E8F5E9',
  },
  rightBadge: {
    backgroundColor: '#FFF3E0',
  },
  sideText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    lineHeight: 24,
    color: '#34495E',
    marginBottom: 20,
  },
  etaContainer: {
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  etaText: {
    color: '#3498DB',
    fontWeight: '600',
  },
  spottedButton: {
    backgroundColor: '#27AE60',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  spottedButtonText: {
    color: 'white',
    fontSize: 18,
  },
  flipHint: {
    textAlign: 'center',
    color: '#95A5A6',
    marginTop: 10,
  },
  factsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  factsTitle: {
    color: '#9B59B6',
  },
  factContent: {
    flex: 1,
    justifyContent: 'center',
  },
  factText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  factNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  factNavButton: {
    backgroundColor: '#ECF0F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  factCounter: {
    fontWeight: '600',
  },
});

export default LandmarkCard;