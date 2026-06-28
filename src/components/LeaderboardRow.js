import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize, shadow } from '../theme';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

// One entry in the friends leaderboard: rank/medal, avatar, name and points.
// The current user's row is highlighted. Long-press a friend to remove them.
export default function LeaderboardRow({ entry, onRemove }) {
  const medal = MEDALS[entry.rank];

  return (
    <TouchableOpacity
      activeOpacity={entry.isMe ? 1 : 0.8}
      onLongPress={entry.isMe ? undefined : onRemove}
      style={[styles.row, entry.isMe && styles.rowMe]}
    >
      <View style={styles.rankWrap}>
        {medal ? (
          <Text style={styles.medal}>{medal}</Text>
        ) : (
          <Text style={styles.rank}>{entry.rank}</Text>
        )}
      </View>

      <View style={[styles.avatar, entry.isMe && styles.avatarMe]}>
        <Text style={styles.avatarText}>{entry.emoji}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, entry.isMe && styles.nameMe]} numberOfLines={1}>
          {entry.name}
        </Text>
        {entry.isMe ? <Text style={styles.youTag}>Tú</Text> : null}
      </View>

      <View style={styles.pointsWrap}>
        <Text style={[styles.points, entry.isMe && styles.pointsMe]}>{entry.points}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  rowMe: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  rankWrap: { width: 30, alignItems: 'center' },
  rank: { fontSize: fontSize.md, fontWeight: '800', color: colors.textMuted },
  medal: { fontSize: 20 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
  },
  avatarMe: { backgroundColor: colors.white },
  avatarText: { fontSize: 22 },
  body: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  nameMe: { color: colors.primaryDark },
  youTag: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
    overflow: 'hidden',
  },
  pointsWrap: { alignItems: 'flex-end' },
  points: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textDark },
  pointsMe: { color: colors.primaryDark },
  pointsLabel: { fontSize: fontSize.xs, color: colors.textMuted },
});
