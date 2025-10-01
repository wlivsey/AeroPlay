import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';

const { width: screenWidth } = Dimensions.get('window');

interface CloudType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  altitude: 'low' | 'middle' | 'high';
  weatherIndicator: string;
  spotted: boolean;
}

const cloudTypes: CloudType[] = [
  {
    id: '1',
    name: 'Cumulus',
    emoji: '☁️',
    description: 'Fluffy, cotton-like clouds that look like floating cotton balls',
    altitude: 'low',
    weatherIndicator: 'Fair weather ahead!',
    spotted: false,
  },
  {
    id: '2',
    name: 'Cirrus',
    emoji: '🌫️',
    description: 'Thin, wispy clouds high in the sky, like horse tails',
    altitude: 'high',
    weatherIndicator: 'Weather change in 24 hours',
    spotted: false,
  },
  {
    id: '3',
    name: 'Stratus',
    emoji: '☁️',
    description: 'Gray layer clouds that cover the whole sky like a blanket',
    altitude: 'low',
    weatherIndicator: 'Overcast day, possible light rain',
    spotted: false,
  },
  {
    id: '4',
    name: 'Cumulonimbus',
    emoji: '⛈️',
    description: 'Tall, towering clouds that can produce thunderstorms',
    altitude: 'low',
    weatherIndicator: 'Thunderstorms likely!',
    spotted: false,
  },
  {
    id: '5',
    name: 'Altocumulus',
    emoji: '☁️',
    description: 'Gray or white patches in waves or bands',
    altitude: 'middle',
    weatherIndicator: 'Fair weather, but change coming',
    spotted: false,
  },
  {
    id: '6',
    name: 'Nimbostratus',
    emoji: '🌧️',
    description: 'Dark, thick clouds that bring continuous rain or snow',
    altitude: 'middle',
    weatherIndicator: 'Steady rain or snow',
    spotted: false,
  },
];

interface CloudSpotterProps {
  isNightFlight?: boolean;
  onAchievement?: (achievement: string) => void;
}

export const CloudSpotter: React.FC<CloudSpotterProps> = ({
  isNightFlight = false,
  onAchievement,
}) => {
  const [spottedClouds, setSpottedClouds] = useState<string[]>([]);
  const [selectedCloud, setSelectedCloud] = useState<CloudType | null>(null);
  const [score, setScore] = useState(0);
  const [showEducation, setShowEducation] = useState(false);

  const handleSpotCloud = (cloud: CloudType) => {
    if (!spottedClouds.includes(cloud.id)) {
      const newSpotted = [...spottedClouds, cloud.id];
      setSpottedClouds(newSpotted);
      setScore(score + 10);

      // Check for achievements
      if (newSpotted.length === 3 && onAchievement) {
        onAchievement('Cloud Observer');
      }
      if (newSpotted.length === cloudTypes.length && onAchievement) {
        onAchievement('Master Meteorologist');
      }

      Alert.alert(
        'Cloud Spotted!',
        `You found a ${cloud.name} cloud! ${cloud.weatherIndicator}`,
        [{ text: 'Cool!' }]
      );
    }

    setSelectedCloud(cloud);
  };

  const CloudEducation = () => (
    <ScrollView style={styles.educationSection}>
      <ThemedText variant="subtitle" style={styles.educationTitle}>
        Cloud Science
      </ThemedText>
      <View style={styles.altitudeGuide}>
        <View style={styles.altitudeLevel}>
          <ThemedText variant="caption" style={styles.altitudeLabel}>
            High (20,000+ ft)
          </ThemedText>
          <ThemedText>Cirrus, Cirrocumulus</ThemedText>
        </View>
        <View style={styles.altitudeLevel}>
          <ThemedText variant="caption" style={styles.altitudeLabel}>
            Middle (6,500-20,000 ft)
          </ThemedText>
          <ThemedText>Altocumulus, Altostratus</ThemedText>
        </View>
        <View style={styles.altitudeLevel}>
          <ThemedText variant="caption" style={styles.altitudeLabel}>
            Low (0-6,500 ft)
          </ThemedText>
          <ThemedText>Cumulus, Stratus, Stratocumulus</ThemedText>
        </View>
      </View>
      <View style={styles.funFact}>
        <ThemedText variant="caption" style={styles.funFactText}>
          Fun Fact: Clouds can weigh as much as 100 elephants, but they float
          because the air below them is even heavier!
        </ThemedText>
      </View>
    </ScrollView>
  );

  if (isNightFlight) {
    return (
      <View style={styles.container}>
        <View style={styles.nightMode}>
          <ThemedText variant="title" style={styles.nightTitle}>
            Cloud Spotting (Night Mode)
          </ThemedText>
          <ThemedText variant="body" style={styles.nightText}>
            It's too dark to spot clouds now, but look for the moon and stars!
            Clouds may be visible as dark shapes against the moonlit sky.
          </ThemedText>
          <TouchableOpacity
            style={styles.educationButton}
            onPress={() => setShowEducation(!showEducation)}
          >
            <ThemedText variant="button">Learn About Clouds</ThemedText>
          </TouchableOpacity>
          {showEducation && <CloudEducation />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.title}>
          Cloud Spotter
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText variant="body">
            Spotted: {spottedClouds.length}/{cloudTypes.length}
          </ThemedText>
          <ThemedText variant="body">Score: {score}</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.cloudGrid}>
        <ThemedText variant="subtitle" style={styles.instruction}>
          Look out your window and tap the clouds you see!
        </ThemedText>

        <View style={styles.cloudsContainer}>
          {cloudTypes.map(cloud => (
            <TouchableOpacity
              key={cloud.id}
              style={[
                styles.cloudCard,
                spottedClouds.includes(cloud.id) && styles.spottedCard,
                selectedCloud?.id === cloud.id && styles.selectedCard,
              ]}
              onPress={() => handleSpotCloud(cloud)}
            >
              <ThemedText style={styles.cloudEmoji}>{cloud.emoji}</ThemedText>
              <ThemedText variant="body" style={styles.cloudName}>
                {cloud.name}
              </ThemedText>
              {spottedClouds.includes(cloud.id) && (
                <ThemedText variant="caption" style={styles.spottedText}>
                  ✓ Spotted
                </ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedCloud && (
          <View style={styles.detailCard}>
            <ThemedText variant="subtitle">{selectedCloud.name}</ThemedText>
            <ThemedText variant="body" style={styles.description}>
              {selectedCloud.description}
            </ThemedText>
            <View style={styles.weatherBox}>
              <ThemedText variant="caption" style={styles.weatherLabel}>
                Weather Prediction:
              </ThemedText>
              <ThemedText variant="body">
                {selectedCloud.weatherIndicator}
              </ThemedText>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.educationButton}
          onPress={() => setShowEducation(!showEducation)}
        >
          <ThemedText variant="button">
            {showEducation ? 'Hide' : 'Show'} Cloud Science
          </ThemedText>
        </TouchableOpacity>

        {showEducation && <CloudEducation />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
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
  cloudGrid: {
    flex: 1,
    padding: 20,
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#34495E',
  },
  cloudsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cloudCard: {
    width: (screenWidth - 60) / 3,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spottedCard: {
    backgroundColor: '#E8F6F3',
    borderWidth: 2,
    borderColor: '#27AE60',
  },
  selectedCard: {
    backgroundColor: '#E8F4FF',
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  cloudEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  cloudName: {
    textAlign: 'center',
    fontSize: 12,
  },
  spottedText: {
    color: '#27AE60',
    marginTop: 5,
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  description: {
    marginVertical: 10,
    lineHeight: 20,
  },
  weatherBox: {
    backgroundColor: '#FFF9E5',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  weatherLabel: {
    color: '#F39C12',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  educationButton: {
    backgroundColor: '#3498DB',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  educationSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  educationTitle: {
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  altitudeGuide: {
    marginBottom: 20,
  },
  altitudeLevel: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  altitudeLabel: {
    color: '#3498DB',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  funFact: {
    backgroundColor: '#E8F6F3',
    padding: 15,
    borderRadius: 10,
  },
  funFactText: {
    color: '#27AE60',
    lineHeight: 18,
  },
  nightMode: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  nightTitle: {
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 20,
  },
  nightText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    color: '#7F8C8D',
  },
});

export default CloudSpotter;