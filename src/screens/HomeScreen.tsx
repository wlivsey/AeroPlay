import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from '../components/common/SafeAreaView';
import { ThemedText } from '../components/common/ThemedText';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartFlight = async () => {
    if (!flightNumber || !airline || !seatNumber) {
      Alert.alert('Missing Information', 'Please fill in all flight details');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('PreFlight', {
        flightNumber,
        airline,
        seatNumber,
      });
    }, 1500);
  };

  const quickSetup = () => {
    setAirline('United');
    setFlightNumber('UA328');
    setSeatNumber('14A');
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ThemedText variant="title" style={styles.title}>
            AeroPlay ✈️
          </ThemedText>
          <ThemedText variant="caption" style={styles.subtitle}>
            Your in-flight adventure companion
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText variant="body" style={styles.label}>
              Airline
            </ThemedText>
            <TextInput
              style={styles.input}
              value={airline}
              onChangeText={setAirline}
              placeholder="e.g., United, Delta, American"
              placeholderTextColor="#95A5A6"
              autoCapitalize="words"
              accessibilityLabel="Airline name input"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText variant="body" style={styles.label}>
              Flight Number
            </ThemedText>
            <TextInput
              style={styles.input}
              value={flightNumber}
              onChangeText={setFlightNumber}
              placeholder="e.g., UA328, DL1234"
              placeholderTextColor="#95A5A6"
              autoCapitalize="characters"
              accessibilityLabel="Flight number input"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText variant="body" style={styles.label}>
              Seat Number
            </ThemedText>
            <TextInput
              style={styles.input}
              value={seatNumber}
              onChangeText={setSeatNumber}
              placeholder="e.g., 14A, 23F"
              placeholderTextColor="#95A5A6"
              autoCapitalize="characters"
              accessibilityLabel="Seat number input"
            />
          </View>
        </View>

        {isLoading ? (
          <LoadingSpinner
            size="large"
            message="Preparing your flight adventure..."
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartFlight}
              accessibilityRole="button"
              accessibilityLabel="Start flight adventure"
            >
              <ThemedText variant="button">Start Adventure</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={quickSetup}
              accessibilityRole="button"
              accessibilityLabel="Quick setup for demo"
            >
              <ThemedText variant="caption" style={styles.secondaryButtonText}>
                Quick Demo Setup
              </ThemedText>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>🗺️</ThemedText>
            <ThemedText variant="caption">Track Landmarks</ThemedText>
          </View>
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>🎮</ThemedText>
            <ThemedText variant="caption">Play Games</ThemedText>
          </View>
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>📚</ThemedText>
            <ThemedText variant="caption">Learn Facts</ThemedText>
          </View>
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>🏆</ThemedText>
            <ThemedText variant="caption">Earn Badges</ThemedText>
          </View>
        </View>
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
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    color: '#3498DB',
    marginBottom: 10,
  },
  subtitle: {
    color: '#7F8C8D',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E7FF',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#2C3E50',
    backgroundColor: '#F8F9FF',
  },
  primaryButton: {
    backgroundColor: '#3498DB',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3498DB',
    textDecorationLine: 'underline',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  featureCard: {
    width: (width - 60) / 2,
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
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
});

export default HomeScreen;