import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { urgencyRank } from '../utils/urgency';
import { useTheme, spacing, fontSize, tracking } from '../theme';

const SORTS = [
  { id: 'urgencia', label: 'Urgencia' },
  { id: 'fecha', label: 'Entrega' },
  { id: 'nombre', label: 'A–Z' },
];

// Tasks without a due date sort last.
function compareDue(a, b) {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

export default function TasksScreen() {
  const { colors } = useTheme();
  const { tasks, addTask, toggleTask, removeTask, summary } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState('urgencia');

  const sorted = useMemo(() => {
    const copy = [...tasks];
    if (sortBy === 'urgencia') {
      copy.sort(
        (a, b) =>
          (urgencyRank[a.urgency] ?? 1) - (urgencyRank[b.urgency] ?? 1) || compareDue(a, b)
      );
    } else if (sortBy === 'fecha') {
      copy.sort(
        (a, b) =>
          compareDue(a, b) || (urgencyRank[a.urgency] ?? 1) - (urgencyRank[b.urgency] ?? 1)
      );
    } else {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    // Completed work always drops to the bottom.
    return copy.sort((a, b) => Number(a.done) - Number(b.done));
  }, [tasks, sortBy]);

  return (
    <ScreenContainer edges={['top']} contentStyle={styles.container}>
      <ScreenHeader
        title="Tareas"
        subtitle={
          summary.taskCount
            ? `${summary.pending} pendientes · ${summary.completed} hechas`
            : undefined
        }
        rightIcon="add"
        onRightPress={() => setModalVisible(true)}
        rightAccessibilityLabel="Crear una nueva tarea"
      />

      {tasks.length > 1 ? (
        <View style={styles.sortRow}>
          {SORTS.map((s) => {
            const active = sortBy === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSortBy(s.id)}
                style={styles.sortBtn}
                accessibilityRole="radio"
                accessibilityState={{ selected: active, checked: active }}
                accessibilityLabel={`Ordenar por ${s.label}`}
              >
                <Text
                  style={[
                    styles.sortText,
                    { color: active ? colors.text : colors.textMuted },
                    active && styles.sortTextActive,
                  ]}
                >
                  {s.label}
                </Text>
                {active ? (
                  <View style={[styles.sortUnderline, { backgroundColor: colors.text }]} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => removeTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin tareas</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Añade lo que necesitas estudiar y armamos tu plan.
            </Text>
            <Button
              label="Añadir la primera"
              full={false}
              style={styles.emptyBtn}
              onPress={() => setModalVisible(true)}
            />
          </View>
        }
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addTask}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl },

  sortRow: { flexDirection: 'row', marginBottom: spacing.sm },
  sortBtn: { marginRight: spacing.xl, paddingBottom: spacing.sm },
  sortText: {
    fontSize: fontSize.xs,
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
  },
  sortTextActive: { fontWeight: '700' },
  sortUnderline: { height: 1.5, marginTop: 5 },

  listContent: { paddingBottom: spacing.xxxl },
  empty: { alignItems: 'center', marginTop: spacing.xxxl * 1.5 },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: '600' },
  emptyText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  emptyBtn: { marginTop: spacing.xl },
});
