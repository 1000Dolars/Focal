import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark } from './palettes';

// Theme preference: 'system' follows the device, 'light'/'dark' force one.
// The choice is persisted separately from app data so it survives a data reset.

const KEY = 'focal:theme';
const ThemeContext = createContext(null);

export const THEME_MODES = [
  { id: 'system', label: 'Sistema' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
];

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState('system');
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (!cancelled && saved && THEME_MODES.some((m) => m.id === saved)) {
          setMode(saved);
        }
      } catch {
        // Unreadable storage: fall back to following the system.
      }
      if (!cancelled) setThemeReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setThemeMode = useCallback((next) => {
    setMode(next);
    AsyncStorage.setItem(KEY, next).catch(() => {
      // A failed save only means the choice won't persist; the UI still updates.
    });
  }, []);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors = isDark ? dark : light;

  const value = useMemo(
    () => ({ colors, isDark, mode, setThemeMode, themeReady }),
    [colors, isDark, mode, setThemeMode, themeReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export default ThemeContext;
