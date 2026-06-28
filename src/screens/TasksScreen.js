import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { urgencyRank } from '../utils/urgency';
import { colors, spacing, fontSize, radius } from '../theme';

// Ways to sort the task list.
const SORTS = [
  { id: 'urgencia', label: 'Urgencia' },
  { id: 'fecha', label: 'Entrega' },
  { id: 'nombre', label: 'Nombre' },
];

// Put tasks without a due date at the end.
function compareDue(a, b) {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

// "Mis tareas" — the list (with sorting); new tasks are created from a pop-up
// opened with the "+" button.
export default function TasksScreen() {
  const { tasks, addTask, toggleTask, removeTask } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState('urgencia');

  const sortedTasks = useMemo(() => {
    const copy = [...tasks];
    if (sortBy === 'urgencia') {
      copy.sort(
        (a, b) =>
          (urgencyRank[a.urgency] ?? 1) - (urgencyRank[b.urgency] ?? 1) || compareDue(a, b)
      );
    } else if (sortBy === 'fecha') {
      copy.sort((a, b) => compareDue(a, b) || (urgencyRank[a.urgency] ?? 1) - (urgencyRank[b.urgency] ?? 1));
    } else if (sortBy === 'nombre') {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [tasks, sortBy]);

  return (
    <ScreenContainer edges={['top']} contentStyle={styles.container}>
      <ScreenHeader
        title="Mis tareas"
        rightIcon="add"
        onRightPress={() => setModalVisible(true)}
      />

      {/* Sort control */}
      <View style={styles.sortRow}>
        <Ionicons name="swap-vertical" size={16} color={colors.textMuted} />
        <Text style={styles.sortLabel}>Ordenar:</Text>
        {SORTS.map((s) => {
          const active = sortBy === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSortBy(s.id)}
              style={[styles.sortChip, active && styles.sortChipActive]}
            >
              <Text style={[styles.sortText, active && styles.sortTextActive]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={sortedTasks}
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
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>Aún no tienes tareas.</Text>
            <Button
              label="＋  Agregar tarea"
              full={false}
              style={styles.emptyBtn}
              onPress={() => setModalVisible(true)}
            />
          </View>
        }
        ListFooterComponent={
          tasks.length ? (
            <Text style={styles.hint}>Toca para completar · usa 🗑 para eliminar</Text>
          ) : null
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

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sortLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600',
    marginLeft: 5,
    marginRight: spacing.sm,
  },
  sortChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  sortChipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  sortText: { fontSize: fontSize.xs, color: colors.textBody, fontWeight: '600' },
  sortTextActive: { color: colors.primary },

  listContent: { paddingBottom: spacing.xxxl, paddingTop: spacing.xs },
  empty: { alignItems: 'center', marginTop: spacing.xxxl },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.md },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
  emptyBtn: { marginTop: spacing.lg },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
