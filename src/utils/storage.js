import AsyncStorage from '@react-native-async-storage/async-storage';

// Local persistence for the whole app state. Everything stays on the device —
// nothing is uploaded anywhere.
//
// The payload is versioned so future releases can migrate old data instead of
// crashing on an unexpected shape.

const KEY = 'focal:state';
export const SCHEMA_VERSION = 1;

// Load the saved state. Never throws: on any failure (missing, corrupt JSON,
// unreadable storage) it returns null so the caller falls back to defaults.
export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    // Unknown/newer schema: ignore rather than risk rendering bad data.
    if (parsed.v !== SCHEMA_VERSION) return null;

    return parsed.data ?? null;
  } catch (err) {
    // Corrupt payload would crash on every launch — clear it once and move on.
    if (__DEV__) console.warn('[storage] load failed, resetting:', err?.message);
    try {
      await AsyncStorage.removeItem(KEY);
    } catch {
      // Storage itself is unavailable; defaults will be used.
    }
    return null;
  }
}

// Persist the state. Never throws — a failed save must not break the UI.
export async function saveState(data) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify({ v: SCHEMA_VERSION, data }));
    return true;
  } catch (err) {
    if (__DEV__) console.warn('[storage] save failed:', err?.message);
    return false;
  }
}

// Wipe every stored value (used by "Borrar mis datos" in Ajustes).
export async function clearState() {
  try {
    await AsyncStorage.removeItem(KEY);
    return true;
  } catch (err) {
    if (__DEV__) console.warn('[storage] clear failed:', err?.message);
    return false;
  }
}
