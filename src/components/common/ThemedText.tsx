import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

interface ThemedTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'button';
  color?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  style,
  variant = 'body',
  color,
  numberOfLines,
  ellipsizeMode = 'tail',
}) => {
  const variantStyle = styles[variant];
  const colorStyle = color ? { color } : {};

  return (
    <Text
      style={[variantStyle, colorStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      accessibilityRole="text"
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#34495E',
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 18,
    fontWeight: '400',
    color: '#34495E',
    lineHeight: 26,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7F8C8D',
    lineHeight: 20,
  },
  button: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default ThemedText;