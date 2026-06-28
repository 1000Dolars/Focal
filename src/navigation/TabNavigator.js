import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, fontSize } from '../theme';

const Tab = createBottomTabNavigator();

// Bottom navigation present on every main screen:
// Inicio · Tareas · Cronograma · Amigos · Perfil.
const ICONS = {
  Inicio: 'home',
  Tareas: 'checkbox',
  Cronograma: 'calendar',
  Amigos: 'trophy',
  Perfil: 'person',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '600', marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const name = ICONS[route.name];
          return (
            <Ionicons name={focused ? name : `${name}-outline`} size={size - 2} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Tareas" component={TasksScreen} />
      <Tab.Screen name="Cronograma" component={ScheduleScreen} />
      <Tab.Screen name="Amigos" component={FriendsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
