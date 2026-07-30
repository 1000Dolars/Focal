import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, radius, spacing, fontSize } from '../theme';
import { formatClock, formatDuration } from '../utils/time';

// A timeline entry: the start time in a fixed left gutter, then the block.
// Study and break blocks are told apart by fill and weight, not colour.
export default function ScheduleItem({ block }) {
  const { colors } = useTheme();
  const isBreak = block.type === 'break';
  const minutes = block.end - block.start;

  return (
    <View style={styles.row}>
      <Text style={[styles.time, { color: colors.textMuted }]} maxFontSizeMultiplier={1.2}>
        {formatClock(block.start)}
      </Text>

      <View style={styles.trackWrap}>
        <View style={[styles.rail, { backgroundColor: colors.border }]} />
        <View
          style={[
            styles.marker,
            {
              backgroundColor: isBreak ? colors.bg : colors.accent,
              borderColor: isBreak ? colors.borderStrong : colors.accent,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.block,
          {
            backgroundColor: isBreak ? 'transparent' : colors.blockStudy,
            borderColor: isBreak ? colors.border : 'transparent',
          },
          isBreak && styles.blockBreak,
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isBreak ? colors.textMuted : colors.text },
            !isBreak && styles.titleStudy,
          ]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
        >
          {block.title}
        </Text>
        <Text style={[styles.duration, { color: colors.textMuted }]}>
          {formatDuration(minutes)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch', minHeight: 56 },
  time: {
    width: 62,
    fontSize: fontSize.xs,
    fontVariant: ['tabular-nums'],
    paddingTop: spacing.lg,
  },
  trackWrap: { width: 20, alignItems: 'center' },
  rail: { width: 1, flex: 1 },
  marker: {
    position: 'absolute',
    top: spacing.lg + 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
  },
  block: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  blockBreak: { borderStyle: 'dashed' },
  title: { fontSize: fontSize.sm },
  titleStudy: { fontWeight: '600' },
  duration: { fontSize: fontSize.xs, marginTop: 2 },
});
