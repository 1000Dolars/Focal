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
import Chip from './Chip';
import { useTheme, radius, spacing, fontSize, tracking } from '../theme';
import { URGENCY, urgencyOrder, urgencyStyle } from '../utils/urgency';
import { toDateKey, formatShortDate } from '../utils/time';

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
  { label: '1 semana', days: 7 },
];

function dayFromToday(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

// Bottom sheet holding every field of a new task.
export default function AddTaskModal({ visible, onClose, onAdd }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [urgency, setUrgency] = useState('media');
  const [dueDate, setDueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const dueKey = dueDate ? toDateKey(dueDate) : null;
  const canAdd = title.trim().length > 0;

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

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surfaceAlt, color: colors.text },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose} accessible={false}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
        pointerEvents="box-none"
      >
        <View
          style={[styles.sheet, { backgroundColor: colors.bg, borderColor: colors.border }]}
        >
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          <View style={styles.headerRow}>
            <Text
              style={[styles.heading, { color: colors.text }]}
              accessibilityRole="header"
              maxFontSizeMultiplier={1.3}
            >
              Nueva tarea
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={hit}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sin guardar"
            >
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="¿Qué necesitas estudiar?"
              placeholderTextColor={colors.textMuted}
              style={[...inputStyle, styles.titleInput]}
              autoFocus
              returnKeyType="next"
              maxLength={80}
              accessibilityLabel="Nombre de la tarea"
            />

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Notas (opcional)"
              placeholderTextColor={colors.textMuted}
              style={[...inputStyle, styles.textArea]}
              multiline
              textAlignVertical="top"
              maxLength={500}
              accessibilityLabel="Descripción de la tarea, opcional"
            />

            <Label>Duración</Label>
            <View style={styles.chipRow}>
              {DURATIONS.map((d) => (
                <Chip
                  key={d.value}
                  label={d.label}
                  selected={duration === d.value}
                  onPress={() => setDuration(d.value)}
                  accessibilityLabel={`Duración ${d.label}`}
                  role="radio"
                />
              ))}
            </View>

            <Label>Entrega</Label>
            <View style={styles.chipRow}>
              {DUE_QUICK.map((q) => {
                const key = q.days === null ? null : toDateKey(dayFromToday(q.days));
                return (
                  <Chip
                    key={q.label}
                    label={q.label}
                    selected={dueKey === key}
                    onPress={() => setDueDate(q.days === null ? null : dayFromToday(q.days))}
                    accessibilityLabel={`Entrega: ${q.label}`}
                    role="radio"
                  />
                );
              })}
              <Chip
                label={dueDate ? formatShortDate(dueDate) : 'Otra fecha'}
                icon="calendar-outline"
                selected={false}
                onPress={() => setShowPicker(true)}
                accessibilityLabel="Elegir otra fecha de entrega en el calendario"
              />
            </View>

            {showPicker && (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={onPickDate}
                  themeVariant={colors.scheme}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.iosDone}
                    onPress={() => setShowPicker(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Confirmar fecha de entrega"
                  >
                    <Text style={[styles.iosDoneText, { color: colors.text }]}>Listo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <Label>Urgencia</Label>
            <View style={styles.chipRow}>
              {urgencyOrder.map((id) => {
                const u = urgencyStyle(colors, id);
                return (
                  <Chip
                    key={id}
                    label={URGENCY[id].label}
                    selected={urgency === id}
                    onPress={() => setUrgency(id)}
                    accessibilityLabel={`Urgencia ${URGENCY[id].label}`}
                    role="radio"
                    dot={{ bg: u.dotBg, border: u.dotBorder }}
                  />
                );
              })}
            </View>

            <Button
              label="Añadir tarea"
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

function Label({ children }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.label, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
      {children}
    </Text>
  );
}

const hit = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '90%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  heading: { fontSize: fontSize.xl, fontWeight: '700', letterSpacing: tracking.tight },
  scroll: { paddingBottom: spacing.lg },

  input: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: fontSize.md,
  },
  titleInput: { fontWeight: '500' },
  textArea: { minHeight: 78, paddingTop: 13, marginTop: spacing.md },

  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },

  pickerWrap: { alignItems: 'center', marginTop: spacing.md },
  iosDone: { alignSelf: 'flex-end', paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  iosDoneText: { fontWeight: '600', fontSize: fontSize.md },

  cta: { marginTop: spacing.xxl },
});
