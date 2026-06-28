import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontSize, shadow } from '../theme';

// The StudyFlow IA brand mark: a rounded purple tile with a book emoji, plus the
// "StudyFlow IA" wordmark (Study in dark, Flow in purple).
export default function Logo({ size = 'large' }) {
  const tile = size === 'large' ? 96 : 56;
  const word = size === 'large' ? fontSize.display : fontSize.xl;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.tile,
          { width: tile, height: tile, borderRadius: tile * 0.28 },
          shadow.card,
        ]}
      >
        <Text style={{ fontSize: tile * 0.46 }}>📖</Text>
        <Text style={[styles.spark, { fontSize: tile * 0.22 }]}>✨</Text>
      </View>

      <View style={styles.wordRow}>
        <Text style={[styles.word, { fontSize: word, color: colors.textDark }]}>Study</Text>
        <Text style={[styles.word, { fontSize: word, color: colors.primary }]}>Flow</Text>
        <Text style={[styles.ia, { fontSize: word }]}> IA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  tile: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spark: { position: 'absolute', top: 8, right: 10 },
  wordRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  word: { fontWeight: '800', letterSpacing: 0.2 },
  ia: { fontWeight: '800', color: colors.primaryLight },
});
