import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  isAirplane?: boolean;
}

const { width } = Dimensions.get('window');

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3498DB',
  message,
  isAirplane = true,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (isAirplane) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateXAnim, {
            toValue: width,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: -width,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [rotateAnim, translateXAnim, isAirplane]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizeMap = {
    small: 30,
    medium: 50,
    large: 70,
  };

  const spinnerSize = sizeMap[size];
  const airplaneSize = spinnerSize * 1.5;

  return (
    <View style={styles.container}>
      {isAirplane ? (
        <Animated.Text
          style={[
            styles.airplane,
            {
              fontSize: airplaneSize,
              transform: [{ translateX: translateXAnim }],
            },
          ]}
        >
          ✈️
        </Animated.Text>
      ) : (
        <Animated.View
          style={[
            styles.spinner,
            {
              width: spinnerSize,
              height: spinnerSize,
              borderColor: color,
              transform: [{ rotate: spin }],
            },
          ]}
        />
      )}
      {message && (
        <ThemedText variant="caption" style={styles.message}>
          {message}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    borderWidth: 4,
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  airplane: {
    marginVertical: 10,
  },
  message: {
    marginTop: 15,
    textAlign: 'center',
  },
});

export default LoadingSpinner;