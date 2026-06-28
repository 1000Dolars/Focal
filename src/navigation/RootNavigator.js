import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import PersonalityScreen from '../screens/PersonalityScreen';
import DonationsScreen from '../screens/DonationsScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

// App-level navigation:
//   Onboarding -> Login (username) -> Personality -> Main (bottom tabs)
//   Donations is reachable from Onboarding, Home and Profile.
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Personality" component={PersonalityScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="Donations"
        component={DonationsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
