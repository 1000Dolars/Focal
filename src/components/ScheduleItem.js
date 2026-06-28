import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../theme';
import { formatClock } from '../utils/time';

// A timeline entry on the "Mi cronograma" screen: the start time on the left,
// and a pastel block (left accent bar + title + time range) on the right.
export default function ScheduleItem({ block }) {
  const pastel = colors.pastels[block.color] || colors.pastels.blue;

  return (
    <View style={styles.row}>
      <Text style={styles.time}>{formatClock(block.start)}</Text>

      <View style={[styles.block, { backgroundColor: pastel.bg }]}>
        <View style={[styles.accent, { backgroundColor: pastel.accent }]} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: pastel.text }]} numberOfLines={1}>
            {block.icon ? `${block.icon}  ` : ''}
            {block.title}
          </Text>
          <Text style={styles.range}>
            {formatClock(block.start)} - {formatClock(block.end)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  time: {
    width: 64,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radius.md,
    overflow: 'hidden',
    minHeight: 54,
    alignItems: 'stretch',
  },
  accent: { width: 5 },
  content: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  title: { fontSize: fontSize.md, fontWeight: '700' },
  range: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
