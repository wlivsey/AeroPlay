import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { PreFlightScreen } from './src/screens/PreFlightScreen';
import { InFlightScreen } from './src/screens/InFlightScreen';
import { ContentCache } from './src/services/ContentCache';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      await ContentCache.initialize();
      setIsReady(true);
    }
    initialize();
  }, []);

  if (!isReady) {
    return null; // Or splash screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PreFlight" component={PreFlightScreen} />
          <Stack.Screen name="InFlight" component={InFlightScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}