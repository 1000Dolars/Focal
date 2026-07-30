import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, radius, spacing, fontSize } from '../theme';
import { formatDuration, dueLabel, isOverdue } from '../utils/time';
import { getUrgency, urgencyStyle } from '../utils/urgency';

// A task row: checkbox, title, optional description and a metadata line.
// No coloured badges — urgency is a dot whose fill encodes the level.
export default function TaskItem({ task, onToggle, onDelete }) {
  const { colors } = useTheme();
  const urgency = getUrgency(task.urgency);
  const u = urgencyStyle(colors, urgency.id);
  const overdue = isOverdue(task.dueDate) && !task.done;

  const spoken = [
    task.title,
    task.description,
    `urgencia ${urgency.label}`,
    formatDuration(task.duration),
    task.dueDate ? `entrega ${dueLabel(task.dueDate)}` : null,
    task.done ? 'completada' : 'pendiente',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={styles.main}
        activeOpacity={0.6}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!task.done }}
        accessibilityLabel={spoken}
        accessibilityHint="Toca dos veces para marcar como completada o pendiente"
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: task.done ? colors.accent : colors.borderStrong },
            task.done && { backgroundColor: colors.accent },
          ]}
        >
          {task.done ? <Ionicons name="checkmark" size={13} color={colors.accentText} /> : null}
        </View>

        <View style={styles.body}>
          <Text
            style={[
              styles.title,
              { color: task.done ? colors.textMuted : colors.text },
              task.done && styles.struck,
            ]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.4}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, { color: colors.textMuted }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {task.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={[styles.dot, { backgroundColor: u.dotBg, borderColor: u.dotBorder }]} />
            <Text style={[styles.meta, { color: u.textColor, fontWeight: u.fontWeight }]}>
              {urgency.label}
            </Text>

            <Text style={[styles.sep, { color: colors.border }]}>·</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {formatDuration(task.duration)}
            </Text>

            {task.dueDate ? (
              <>
                <Text style={[styles.sep, { color: colors.border }]}>·</Text>
                <Text
                  style={[
                    styles.meta,
                    { color: overdue ? colors.danger : colors.textMuted },
                    overdue && styles.overdue,
                  ]}
                >
                  {dueLabel(task.dueDate)}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDelete}
        hitSlop={hit}
        style={styles.delete}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar la tarea ${task.title}`}
        accessibilityHint="Elimina esta tarea de tu lista"
      >
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const hit = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  main: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  body: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: '500', lineHeight: 21 },
  struck: { textDecorationLine: 'line-through' },
  description: { fontSize: fontSize.sm, marginTop: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7, flexWrap: 'wrap' },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 6,
  },
  meta: { fontSize: fontSize.xs },
  overdue: { fontWeight: '600' },
  sep: { fontSize: fontSize.xs, marginHorizontal: 6 },
  delete: { paddingLeft: spacing.md, paddingTop: spacing.xs },
});
