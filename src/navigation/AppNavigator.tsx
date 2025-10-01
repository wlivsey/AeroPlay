import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '../components/common/ThemedText';

import HomeScreen from '../screens/HomeScreen';
import PreFlightScreen from '../screens/PreFlightScreen';
import InFlightScreen from '../screens/InFlightScreen';
import GamesScreen from '../screens/GamesScreen';
import ParentDashboard from '../screens/ParentDashboard';

export type RootStackParamList = {
  Home: undefined;
  PreFlight: {
    flightNumber: string;
    airline: string;
    seatNumber: string;
  };
  InFlight: {
    flightNumber: string;
    airline: string;
    seatNumber: string;
    avatar: string;
    difficulty: string;
    routePack: any;
  };
  GamesScreen: undefined;
  ParentDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498DB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'AeroPlay',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('ParentDashboard')}
                style={{ marginRight: 15 }}
              >
                <ThemedText style={{ color: 'white', fontSize: 24 }}>⚙️</ThemedText>
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="PreFlight"
          component={PreFlightScreen}
          options={{
            title: 'Pre-Flight Setup',
          }}
        />

        <Stack.Screen
          name="InFlight"
          component={InFlightScreen}
          options={{
            title: 'Flight in Progress',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="GamesScreen"
          component={GamesScreen}
          options={{
            title: 'Mini Games',
          }}
        />

        <Stack.Screen
          name="ParentDashboard"
          component={ParentDashboard}
          options={{
            title: 'Parent Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;