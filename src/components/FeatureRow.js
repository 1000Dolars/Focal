import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../theme';

// One feature in the "Características principales" list: an emoji badge with a
// title and short description.
export default function FeatureRow({ emoji, title, description, tint }) {
  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: tint || colors.primarySoft }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: { fontSize: 20 },
  body: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  desc: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
});
