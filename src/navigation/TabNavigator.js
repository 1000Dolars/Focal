import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme, fontSize } from '../theme';

const Tab = createBottomTabNavigator();

// Four destinations: Hoy · Tareas · Plan · Ajustes.
// Profile folded into Ajustes; the friends leaderboard is gone.
const ICONS = {
  Hoy: 'ellipse',
  Tareas: 'checkmark-circle',
  Plan: 'calendar',
  Ajustes: 'settings',
};

export default function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: fontSize.xs - 1, fontWeight: '500', marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarIcon: ({ color, focused }) => {
          const name = ICONS[route.name];
          return <Ionicons name={focused ? name : `${name}-outline`} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Hoy" component={HomeScreen} />
      <Tab.Screen name="Tareas" component={TasksScreen} />
      <Tab.Screen name="Plan" component={ScheduleScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
