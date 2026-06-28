import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, fontSize, shadow } from '../theme';
import { formatDuration, dueLabel, isOverdue } from '../utils/time';
import { getUrgency } from '../utils/urgency';

// A single row in the "Mis tareas" list: a colored subject badge, the title
// with an urgency pill and duration, a checkbox to complete it, and a delete
// (trash) button. Tapping the row also toggles completion.
export default function TaskItem({ task, onToggle, onDelete }) {
  const pastel = colors.pastels[task.color] || colors.pastels.purple;
  const urgency = getUrgency(task.urgency);
  const overdue = isOverdue(task.dueDate) && !task.done;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onToggle} style={styles.row}>
      <View style={[styles.badge, { backgroundColor: pastel.bg }]}>
        <Text style={styles.icon}>{task.icon}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, task.done && styles.done]} numberOfLines={1}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <View style={[styles.urgencyPill, { backgroundColor: urgency.bg }]}>
            <View style={[styles.urgencyDot, { backgroundColor: urgency.color }]} />
            <Text style={[styles.urgencyText, { color: urgency.color }]}>{urgency.label}</Text>
          </View>
          <Text style={styles.duration}>{formatDuration(task.duration)}</Text>
          {task.dueDate ? (
            <View style={styles.dueWrap}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={overdue ? colors.pink : colors.textMuted}
              />
              <Text style={[styles.due, overdue && styles.dueOverdue]}>
                {dueLabel(task.dueDate)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Complete */}
      <TouchableOpacity onPress={onToggle} hitSlop={hit} style={styles.actionBtn}>
        <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
          {task.done ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
        </View>
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity onPress={onDelete} hitSlop={hit} style={styles.actionBtn}>
        <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const hit = { top: 8, bottom: 8, left: 8, right: 8 };

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
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: { fontSize: 18 },
  body: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: '600', color: colors.textDark },
  done: { textDecorationLine: 'line-through', color: colors.textMuted },
  description: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  urgencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  urgencyDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  urgencyText: { fontSize: fontSize.xs, fontWeight: '700' },
  duration: { fontSize: fontSize.xs, color: colors.textMuted },
  dueWrap: { flexDirection: 'row', alignItems: 'center', marginLeft: spacing.sm },
  due: { fontSize: fontSize.xs, color: colors.textMuted, marginLeft: 3 },
  dueOverdue: { color: colors.pink, fontWeight: '700' },
  actionBtn: { paddingHorizontal: spacing.sm, justifyContent: 'center' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
