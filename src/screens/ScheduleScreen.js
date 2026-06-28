import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import ScheduleItem from '../components/ScheduleItem';
import { useApp } from '../context/AppContext';
import {
  formatLongDate,
  formatDuration,
  toDateKey,
  formatShortDate,
  weekdayName,
} from '../utils/time';
import { getUrgency } from '../utils/urgency';
import { colors, spacing, fontSize, radius } from '../theme';

const VIEWS = ['Día', 'Semana', 'Mes'];

// "Mi cronograma" — Día shows the generated timeline plus the deliveries due
// that day; Semana lists deliveries for the next 7 days; Mes is an overview.
export default function ScheduleScreen() {
  const { schedule, tasks, summary } = useApp();
  const [view, setView] = useState('Día');
  const [offset, setOffset] = useState(0); // days from today

  const date = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  }, [offset]);

  // Tasks due on the currently selected day.
  const deliveries = useMemo(() => {
    const key = toDateKey(date);
    return tasks.filter((t) => t.dueDate === key);
  }, [tasks, date]);

  const dateLabel = offset === 0 ? `Hoy, ${formatLongDate(date)}` : formatLongDate(date);

  return (
    <ScreenContainer edges={['top']} contentStyle={styles.container}>
      <ScreenHeader title="Mi cronograma" />

      {/* View switcher */}
      <View style={styles.tabs}>
        {VIEWS.map((v) => {
          const active = view === v;
          return (
            <TouchableOpacity
              key={v}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setView(v)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{v}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Date navigator */}
      <View style={styles.dateRow}>
        <TouchableOpacity hitSlop={hit} onPress={() => setOffset((o) => o - 1)}>
          <Ionicons name="chevron-back" size={20} color={colors.textBody} />
        </TouchableOpacity>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
        <TouchableOpacity hitSlop={hit} onPress={() => setOffset((o) => o + 1)}>
          <Ionicons name="chevron-forward" size={20} color={colors.textBody} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {view === 'Día' && <DayView schedule={schedule} deliveries={deliveries} />}
        {view === 'Semana' && <WeekView tasks={tasks} startDate={date} />}
        {view === 'Mes' && <MonthView summary={summary} tasks={tasks} />}
      </ScrollView>
    </ScreenContainer>
  );
}

// A small "Entrega" chip listing one task due on a given day.
function DeliveryRow({ task }) {
  const urgency = getUrgency(task.urgency);
  return (
    <View style={styles.deliveryRow}>
      <View style={[styles.deliveryDot, { backgroundColor: urgency.color }]} />
      <Text style={styles.deliveryIcon}>{task.icon}</Text>
      <Text style={styles.deliveryTitle} numberOfLines={1}>
        {task.title}
      </Text>
      <Text style={[styles.deliveryTag, { color: urgency.color }]}>{urgency.label}</Text>
    </View>
  );
}

// --- Día -----------------------------------------------------------------
function DayView({ schedule, deliveries }) {
  if (!schedule.length) {
    return <Empty text="Agrega tareas para generar tu cronograma del día." />;
  }
  return (
    <View>
      {/* Deliveries due today */}
      {deliveries.length > 0 && (
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryHeader}>📌 Entregas de este día</Text>
          {deliveries.map((task) => (
            <DeliveryRow key={task.id} task={task} />
          ))}
        </View>
      )}

      {/* Study timeline */}
      <Text style={styles.timelineHeader}>Tu plan de estudio</Text>
      {schedule.map((block) => (
        <ScheduleItem key={block.id} block={block} />
      ))}
    </View>
  );
}

// --- Semana --------------------------------------------------------------
// Shows the next 7 days starting from the selected date and the deliveries
// due on each one.
function WeekView({ tasks, startDate }) {
  const days = useMemo(() => {
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = toDateKey(d);
      out.push({ date: d, key, deliveries: tasks.filter((t) => t.dueDate === key) });
    }
    return out;
  }, [tasks, startDate]);

  return (
    <View>
      {days.map(({ date, key, deliveries }) => (
        <View key={key} style={styles.weekRow}>
          <View style={[styles.weekDayBadge, deliveries.length > 0 && styles.weekDayBadgeActive]}>
            <Text style={styles.weekDayText}>{weekdayName(date).slice(0, 3)}</Text>
            <Text style={styles.weekDayNum}>{date.getDate()}</Text>
          </View>
          <View style={styles.weekBody}>
            {deliveries.length > 0 ? (
              deliveries.map((t) => (
                <Text key={t.id} style={styles.weekDelivery} numberOfLines={1}>
                  {t.icon} {t.title}
                </Text>
              ))
            ) : (
              <Text style={styles.weekDaySub}>Sin entregas</Text>
            )}
          </View>
          <Text style={styles.weekEmoji}>{deliveries.length > 0 ? '📌' : '—'}</Text>
        </View>
      ))}
    </View>
  );
}

// --- Mes -----------------------------------------------------------------
function MonthView({ summary, tasks }) {
  const monthlyMinutes = summary.studyMinutes * 22; // ~22 study days
  const upcoming = useMemo(() => {
    const today = toDateKey(new Date());
    return tasks
      .filter((t) => t.dueDate && t.dueDate >= today && !t.done)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  return (
    <View>
      <View style={styles.monthCard}>
        <Text style={styles.monthEmoji}>🗓️</Text>
        <Text style={styles.monthTitle}>Resumen del mes</Text>
        <View style={styles.monthStats}>
          <MonthStat value={`${upcoming.length}`} label="Entregas" />
          <MonthStat value={formatDuration(monthlyMinutes)} label="Estudio" />
          <MonthStat value={`${summary.points}`} label="Puntos" />
        </View>
        <Text style={styles.monthHint}>
          Mantén tu ritmo diario para desbloquear nuevos logros. 🏆
        </Text>
      </View>

      {upcoming.length > 0 && (
        <>
          <Text style={styles.timelineHeader}>Próximas entregas</Text>
          {upcoming.map((task) => {
            const urgency = getUrgency(task.urgency);
            return (
              <View key={task.id} style={styles.upcomingRow}>
                <View style={[styles.deliveryDot, { backgroundColor: urgency.color }]} />
                <Text style={styles.deliveryIcon}>{task.icon}</Text>
                <Text style={styles.deliveryTitle} numberOfLines={1}>
                  {task.title}
                </Text>
                <Text style={styles.upcomingDate}>
                  {formatShortDate(new Date(`${task.dueDate}T00:00:00`))}
                </Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
}

function MonthStat({ value, label }) {
  return (
    <View style={styles.monthStat}>
      <Text style={styles.monthStatValue}>{value}</Text>
      <Text style={styles.monthStatLabel}>{label}</Text>
    </View>
  );
}

function Empty({ text }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>📅</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const hit = { top: 10, bottom: 10, left: 10, right: 10 };

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: radius.pill,
    padding: 4,
    marginTop: spacing.sm,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textBody },
  tabTextActive: { color: colors.white },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  dateLabel: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },

  scroll: { paddingBottom: spacing.xxxl },

  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  weekDayBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  weekDayBadgeActive: { backgroundColor: colors.primary },
  weekDayText: { fontSize: fontSize.xs, fontWeight: '800', color: colors.primary },
  weekDayNum: { fontSize: fontSize.sm, fontWeight: '800', color: colors.textDark },
  weekBody: { flex: 1 },
  weekDayTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  weekDaySub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  weekDelivery: { fontSize: fontSize.sm, color: colors.textDark, fontWeight: '600', marginVertical: 1 },
  weekEmoji: { fontSize: 22 },

  // Deliveries (Día view)
  deliveryCard: {
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  deliveryHeader: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.pinkDark,
    marginBottom: spacing.md,
  },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  deliveryDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  deliveryIcon: { fontSize: 16, marginRight: spacing.sm },
  deliveryTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.textDark },
  deliveryTag: { fontSize: fontSize.xs, fontWeight: '700' },

  timelineHeader: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: spacing.md,
  },

  // Upcoming deliveries (Mes view)
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  upcomingDate: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },

  monthCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  monthEmoji: { fontSize: 40 },
  monthTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: spacing.md,
  },
  monthStats: { flexDirection: 'row', marginTop: spacing.xl, width: '100%' },
  monthStat: { flex: 1, alignItems: 'center' },
  monthStatValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
  monthStatLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  monthHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
  },

  empty: { alignItems: 'center', marginTop: spacing.xxxl },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.md },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
