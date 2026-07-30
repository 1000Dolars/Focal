import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, fontSize, tracking } from '../theme';

// A single figure with its label. Replaces the old emoji stat cards: the number
// carries the weight, the label stays quiet.
export default function Stat({ value, label, accessibilityLabel, align = 'flex-start' }) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.wrap, { alignItems: align }]}
      accessible
      accessibilityLabel={accessibilityLabel || `${label}: ${value}`}
    >
      <Text
        style={[styles.value, { color: colors.text }]}
        maxFontSizeMultiplier={1.4}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.textMuted }]} maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  value: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    letterSpacing: tracking.tight,
    fontVariant: ['tabular-nums'],
  },
  label: { fontSize: fontSize.xs, marginTop: spacing.xs },
});
