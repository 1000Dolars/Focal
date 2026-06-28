import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize, shadow } from '../theme';

// One of the three small "Resumen de hoy" stat tiles on the Home screen:
// an emoji badge, a big value and a caption.
export default function SummaryCard({ emoji, value, label, tint = colors.primarySoft }) {
  return (
    <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: tint }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    ...shadow.soft,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emoji: { fontSize: 20 },
  value: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textDark,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
