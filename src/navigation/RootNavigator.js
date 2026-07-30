import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import PersonalityScreen from '../screens/PersonalityScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import TermsScreen from '../screens/TermsScreen';
import TabNavigator from './TabNavigator';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();

// App-level navigation:
//   First launch:   Onboarding -> Login (name) -> Personality -> Main
//   Returning user: straight to Main, since the name was restored from storage.
//   Privacy / Terms open from Ajustes.
export default function RootNavigator() {
  const { userName } = useApp();

  return (
    <Stack.Navigator
      initialRouteName={userName ? 'Main' : 'Onboarding'}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Personality" component={PersonalityScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
    </Stack.Navigator>
  );
}
