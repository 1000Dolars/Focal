import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fontSize, tracking } from '../theme';

// The Focal mark: a ring with a solid centre — a focal point. Drawn with views
// rather than an image so it inverts cleanly between themes.
export default function Logo({ size = 'large', showWordmark = true }) {
  const { colors } = useTheme();
  const ring = size === 'large' ? 56 : 36;
  const core = ring * 0.34;
  const word = size === 'large' ? fontSize.display : fontSize.xl;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.ring,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderColor: colors.text,
            borderWidth: Math.max(2, ring * 0.055),
          },
        ]}
      >
        <View
          style={{
            width: core,
            height: core,
            borderRadius: core / 2,
            backgroundColor: colors.text,
          }}
        />
      </View>

      {showWordmark ? (
        <Text style={[styles.word, { color: colors.text, fontSize: word }]}>Focal</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  ring: { alignItems: 'center', justifyContent: 'center' },
  word: {
    fontWeight: '700',
    letterSpacing: tracking.tight,
    marginTop: 18,
  },
});
