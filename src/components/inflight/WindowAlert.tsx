import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';

const { width: screenWidth } = Dimensions.get('window');

interface WindowAlertProps {
  landmark: {
    name: string;
    side: 'left' | 'right';
    type: 'natural' | 'city' | 'structure' | 'water';
  };
  onDismiss: () => void;
  onViewDetails: () => void;
}

export const WindowAlert: React.FC<WindowAlertProps> = ({
  landmark,
  onDismiss,
  onViewDetails,
}) => {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(dismissTimer);
  }, []);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getDirectionEmoji = () => {
    return landmark.side === 'left' ? '👈' : '👉';
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

  const backgroundColor = landmark.side === 'left' ? '#4CAF50' : '#FF9800';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [
            { translateY: slideAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onViewDetails}
        activeOpacity={0.8}
      >
        <View style={styles.directionSection}>
          <Animated.Text style={styles.directionEmoji}>
            {getDirectionEmoji()}
          </Animated.Text>
          <ThemedText variant="button" style={styles.lookText}>
            LOOK {landmark.side.toUpperCase()}!
          </ThemedText>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.landmarkInfo}>
            <ThemedText style={styles.typeIcon}>{getTypeIcon()}</ThemedText>
            <ThemedText variant="body" style={styles.landmarkName}>
              {landmark.name}
            </ThemedText>
          </View>

          <ThemedText variant="caption" style={styles.tapHint}>
            Tap for details →
          </ThemedText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
      >
        <ThemedText style={styles.dismissText}>✕</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  directionEmoji: {
    fontSize: 32,
  },
  lookText: {
    color: 'white',
    fontSize: 20,
  },
  infoSection: {
    flex: 1,
    marginLeft: 20,
  },
  landmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIcon: {
    fontSize: 24,
  },
  landmarkName: {
    color: 'white',
    fontWeight: '600',
    flex: 1,
  },
  tapHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  dismissButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WindowAlert;