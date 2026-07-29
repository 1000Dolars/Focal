import React, { useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider, useApp } from './src/context/AppContext';
import { ThemeProvider, useTheme } from './src/theme';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';

// Hold the native splash until saved state is restored, so the user never sees
// demo data flash before their own tasks load.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Fine to ignore: the splash may already be hidden.
});

function Root() {
  const { hydrated } = useApp();
  const { colors, isDark, themeReady } = useTheme();
  const ready = hydrated && themeReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Spread the base theme so required fields (notably `fonts`, required by
  // React Navigation v7) are present; we only override the palette.
  const navTheme = useMemo(() => {
    const base = isDark ? NavDarkTheme : DefaultTheme;
    return {
      ...base,
      dark: isDark,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.bg,
        card: colors.bg,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
    };
  }, [colors, isDark]);

  if (!ready) return null; // native splash stays visible

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <SafeAreaProvider>
          <AppProvider>
            <Root />
          </AppProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
