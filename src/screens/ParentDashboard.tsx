import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from '../components/common/SafeAreaView';
import { ThemedText } from '../components/common/ThemedText';
import { useNavigation } from '@react-navigation/native';

export const ParentDashboard: React.FC = () => {
  const navigation = useNavigation();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [quietTimeEnabled, setQuietTimeEnabled] = useState(false);
  const [quietStartTime, setQuietStartTime] = useState('21:00');
  const [quietEndTime, setQuietEndTime] = useState('07:00');
  const [maxGameTime, setMaxGameTime] = useState('30');

  const recentFlights = [
    {
      id: '1',
      date: 'Dec 15, 2024',
      route: 'LAX → JFK',
      landmarks: 12,
      points: 450,
      duration: '5h 15m',
    },
    {
      id: '2',
      date: 'Nov 28, 2024',
      route: 'DFW → ORD',
      landmarks: 8,
      points: 320,
      duration: '2h 45m',
    },
    {
      id: '3',
      date: 'Nov 10, 2024',
      route: 'SEA → MIA',
      landmarks: 15,
      points: 580,
      duration: '6h 30m',
    },
  ];

  const achievements = [
    { id: '1', name: 'First Flight', emoji: '🛫', unlocked: true },
    { id: '2', name: 'Landmark Hunter', emoji: '🎯', unlocked: true },
    { id: '3', name: 'Game Master', emoji: '🎮', unlocked: true },
    { id: '4', name: 'Cross Country', emoji: '🌎', unlocked: false },
    { id: '5', name: 'Night Owl', emoji: '🦉', unlocked: false },
    { id: '6', name: 'Cloud Expert', emoji: '☁️', unlocked: false },
  ];

  const handleClearCache = () => {
    Alert.alert(
      'Clear Offline Content',
      'This will delete all downloaded route packs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress',
      'This will delete all achievements and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Progress reset successfully');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText variant="title" style={styles.title}>
            Parent Dashboard 👨‍👩‍👧‍👦
          </ThemedText>
          <ThemedText variant="caption" style={styles.subtitle}>
            Manage settings and view flight history
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            ⚙️ Settings
          </ThemedText>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <ThemedText variant="body">Sound Effects</ThemedText>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#767577', true: '#3498DB' }}
              />
            </View>

            <View style={styles.settingRow}>
              <ThemedText variant="body">Notifications</ThemedText>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#3498DB' }}
              />
            </View>

            <View style={styles.settingRow}>
              <ThemedText variant="body">Text-to-Speech</ThemedText>
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ false: '#767577', true: '#3498DB' }}
              />
            </View>

            <View style={styles.settingRow}>
              <ThemedText variant="body">Quiet Time</ThemedText>
              <Switch
                value={quietTimeEnabled}
                onValueChange={setQuietTimeEnabled}
                trackColor={{ false: '#767577', true: '#3498DB' }}
              />
            </View>

            {quietTimeEnabled && (
              <View style={styles.quietTimeSettings}>
                <View style={styles.timeInputRow}>
                  <ThemedText variant="caption">Start:</ThemedText>
                  <TextInput
                    style={styles.timeInput}
                    value={quietStartTime}
                    onChangeText={setQuietStartTime}
                    placeholder="21:00"
                  />
                  <ThemedText variant="caption">End:</ThemedText>
                  <TextInput
                    style={styles.timeInput}
                    value={quietEndTime}
                    onChangeText={setQuietEndTime}
                    placeholder="07:00"
                  />
                </View>
              </View>
            )}

            <View style={styles.settingRow}>
              <ThemedText variant="body">Max Game Time (min)</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={maxGameTime}
                onChangeText={setMaxGameTime}
                keyboardType="numeric"
                placeholder="30"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            ✈️ Recent Flights
          </ThemedText>

          {recentFlights.map((flight) => (
            <View key={flight.id} style={styles.flightCard}>
              <View style={styles.flightHeader}>
                <ThemedText variant="body" style={styles.flightRoute}>
                  {flight.route}
                </ThemedText>
                <ThemedText variant="caption">{flight.date}</ThemedText>
              </View>
              <View style={styles.flightStats}>
                <View style={styles.flightStat}>
                  <ThemedText variant="caption">📍 {flight.landmarks}</ThemedText>
                </View>
                <View style={styles.flightStat}>
                  <ThemedText variant="caption">⭐ {flight.points}</ThemedText>
                </View>
                <View style={styles.flightStat}>
                  <ThemedText variant="caption">⏱️ {flight.duration}</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            🏆 Achievements
          </ThemedText>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementBadge,
                  !achievement.unlocked && styles.achievementLocked,
                ]}
              >
                <ThemedText style={styles.achievementEmoji}>
                  {achievement.unlocked ? achievement.emoji : '🔒'}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.achievementNameLocked,
                  ]}
                >
                  {achievement.name}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            🔧 Maintenance
          </ThemedText>

          <View style={styles.maintenanceButtons}>
            <TouchableOpacity
              style={styles.maintenanceButton}
              onPress={handleClearCache}
            >
              <ThemedText variant="body" style={styles.maintenanceButtonText}>
                Clear Cache
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.maintenanceButton, styles.dangerButton]}
              onPress={handleResetProgress}
            >
              <ThemedText variant="body" style={styles.dangerButtonText}>
                Reset Progress
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ThemedText variant="button">← Back to Home</ThemedText>
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
    marginBottom: 30,
  },
  title: {
    color: '#3498DB',
    marginBottom: 10,
  },
  subtitle: {
    color: '#7F8C8D',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#2C3E50',
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  quietTimeSettings: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginTop: 10,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#D0D3D4',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 60,
    textAlign: 'center',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#D0D3D4',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 60,
    textAlign: 'center',
  },
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  flightRoute: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  flightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flightStat: {
    alignItems: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementBadge: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementLocked: {
    opacity: 0.5,
    backgroundColor: '#ECF0F1',
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  achievementName: {
    textAlign: 'center',
    color: '#2C3E50',
  },
  achievementNameLocked: {
    color: '#95A5A6',
  },
  maintenanceButtons: {
    gap: 10,
  },
  maintenanceButton: {
    backgroundColor: '#95A5A6',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  maintenanceButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#3498DB',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ParentDashboard;