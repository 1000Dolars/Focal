import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';
import { URGENCY, urgencyOrder } from '../utils/urgency';
import { toDateKey, formatShortDate } from '../utils/time';
import { colors, spacing, fontSize, radius } from '../theme';

// Quick-pick durations (minutes) and due dates (days from today).
const DURATIONS = [
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '1h 30m', value: 90 },
  { label: '2h', value: 120 },
];
const DUE_QUICK = [
  { label: 'Sin fecha', days: null },
  { label: 'Hoy', days: 0 },
  { label: 'Mañana', days: 1 },
  { label: 'En 1 sem', days: 7 },
];

function dayFromToday(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

// Bottom-sheet popup to create a task. Holds all task fields: name,
// description, duration, due date and urgency. Calls onAdd with a task object.
export default function AddTaskModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [urgency, setUrgency] = useState('media');
  const [dueDate, setDueDate] = useState(null); // Date | null
  const [showPicker, setShowPicker] = useState(false);

  const dueKey = dueDate ? toDateKey(dueDate) : null;
  const canAdd = title.trim().length > 0;

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
      setDuration(60);
      setUrgency('media');
      setDueDate(null);
      setShowPicker(false);
    }
  }, [visible]);

  const onPickDate = useCallback((event, selected) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selected) setDueDate(selected);
    } else if (selected) {
      setDueDate(selected);
    }
  }, []);

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ title, description, duration, urgency, dueDate: dueKey });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.heading}>Nueva tarea</Text>
            <TouchableOpacity onPress={onClose} hitSlop={hit}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
          >
            {/* Name */}
            <Text style={styles.label}>Nombre de la tarea</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ej. Matemáticas"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoFocus
              returnKeyType="next"
            />

            {/* Description */}
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Detalles de la tarea (opcional)"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Duration */}
            <Text style={styles.label}>Duración</Text>
            <View style={styles.chipRow}>
              {DURATIONS.map((d) => {
                const active = duration === d.value;
                return (
                  <TouchableOpacity
                    key={d.value}
                    onPress={() => setDuration(d.value)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Due date */}
            <Text style={styles.label}>Día de entrega</Text>
            <View style={styles.chipRow}>
              {DUE_QUICK.map((q) => {
                const key = q.days === null ? null : toDateKey(dayFromToday(q.days));
                const active = dueKey === key;
                return (
                  <TouchableOpacity
                    key={q.label}
                    onPress={() => setDueDate(q.days === null ? null : dayFromToday(q.days))}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {q.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={[styles.chip, styles.dateChip]}
              >
                <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                <Text style={[styles.chipText, styles.chipTextActive, styles.dateChipText]}>
                  {dueDate ? formatShortDate(dueDate) : 'Otro'}
                </Text>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={onPickDate}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.iosDone} onPress={() => setShowPicker(false)}>
                    <Text style={styles.iosDoneText}>Listo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Urgency */}
            <Text style={styles.label}>Nivel de urgencia</Text>
            <View style={styles.chipRow}>
              {urgencyOrder.map((id) => {
                const u = URGENCY[id];
                const active = urgency === id;
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => setUrgency(id)}
                    style={[
                      styles.chip,
                      styles.urgChip,
                      active && { backgroundColor: u.bg, borderColor: u.color },
                    ]}
                  >
                    <View style={[styles.urgDot, { backgroundColor: u.color }]} />
                    <Text style={[styles.chipText, active && { color: u.color }]}>{u.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              label="Agregar tarea"
              onPress={handleAdd}
              disabled={!canAdd}
              style={styles.cta}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const hit = { top: 10, bottom: 10, left: 10, right: 10 };

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,25,55,0.45)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '88%',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  heading: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textDark },
  scroll: { paddingBottom: spacing.lg },

  label: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: fontSize.md,
    color: colors.textDark,
  },
  textArea: { minHeight: 72, paddingTop: 12 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.textBody, fontWeight: '600' },
  chipTextActive: { color: colors.primary },
  dateChip: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  dateChipText: { marginLeft: 5 },
  urgChip: {},
  urgDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },

  pickerWrap: { alignItems: 'center', marginBottom: spacing.sm },
  iosDone: { alignSelf: 'flex-end', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  iosDoneText: { color: colors.primary, fontWeight: '700', fontSize: fontSize.md },

  cta: { marginTop: spacing.xl },
});
