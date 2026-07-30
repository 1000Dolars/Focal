import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import ScheduleItem from '../components/ScheduleItem';
import Stat from '../components/Stat';
import { useApp } from '../context/AppContext';
import {
  formatLongDate,
  toDateKey,
  parseDateKey,
  formatShortDate,
  weekdayName,
} from '../utils/time';
import { getUrgency, urgencyStyle } from '../utils/urgency';
import { useTheme, spacing, fontSize, radius, tracking } from '../theme';

const VIEWS = ['Día', 'Semana', 'Mes'];

// Plan — the day's timeline plus what is due, with week and month overviews.
export default function ScheduleScreen() {
  const { colors } = useTheme();
  const { schedule, tasks, summary, history } = useApp();
  const [view, setView] = useState('Día');
  const [offset, setOffset] = useState(0);

  const date = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  }, [offset]);

  const deliveries = useMemo(() => {
    const key = toDateKey(date);
    return tasks.filter((t) => t.dueDate === key && !t.done);
  }, [tasks, date]);

  const dateLabel = offset === 0 ? 'Hoy' : formatLongDate(date);

  return (
    <ScreenContainer edges={['top']} contentStyle={styles.container}>
      <ScreenHeader title="Plan" />

      {/* View switcher */}
      <View style={styles.tabs}>
        {VIEWS.map((v) => {
          const active = view === v;
          return (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Vista por ${v.toLowerCase()}`}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? colors.text : colors.textMuted },
                  active && styles.tabTextActive,
                ]}
              >
                {v}
              </Text>
              {active ? (
                <View style={[styles.tabUnderline, { backgroundColor: colors.text }]} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Date navigator */}
      <View style={[styles.dateRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          hitSlop={hit}
          onPress={() => setOffset((o) => o - 1)}
          accessibilityRole="button"
          accessibilityLabel="Día anterior"
        >
          <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={[styles.dateLabel, { color: colors.text }]} accessibilityRole="header">
          {dateLabel}
          <Text style={{ color: colors.textMuted }}>
            {offset === 0 ? `  ${formatLongDate(date)}` : ''}
          </Text>
        </Text>
        <TouchableOpacity
          hitSlop={hit}
          onPress={() => setOffset((o) => o + 1)}
          accessibilityRole="button"
          accessibilityLabel="Día siguiente"
        >
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {view === 'Día' && <DayView schedule={schedule} deliveries={deliveries} />}
        {view === 'Semana' && <WeekView tasks={tasks} startDate={date} />}
        {view === 'Mes' && <MonthView summary={summary} tasks={tasks} history={history} />}
      </ScrollView>
    </ScreenContainer>
  );
}

// --- Día ------------------------------------------------------------------
function DayView({ schedule, deliveries }) {
  const { colors } = useTheme();

  return (
    <View>
      {deliveries.length > 0 && (
        <View style={[styles.dueBox, { borderColor: colors.borderStrong }]}>
          <Text style={[styles.dueHeader, { color: colors.textMuted }]}>Vence hoy</Text>
          {deliveries.map((task) => {
            const u = urgencyStyle(colors, getUrgency(task.urgency).id);
            return (
              <View key={task.id} style={styles.dueRow}>
                <View
                  style={[styles.dueDot, { backgroundColor: u.dotBg, borderColor: u.dotBorder }]}
                />
                <Text
                  style={[styles.dueTitle, { color: colors.text }]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.3}
                >
                  {task.title}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {schedule.length ? (
        schedule.map((block) => <ScheduleItem key={block.id} block={block} />)
      ) : (
        <Empty text="Sin tareas pendientes para planificar." />
      )}
    </View>
  );
}

// --- Semana ---------------------------------------------------------------
function WeekView({ tasks, startDate }) {
  const { colors } = useTheme();

  const days = useMemo(() => {
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = toDateKey(d);
      out.push({ date: d, key, due: tasks.filter((t) => t.dueDate === key && !t.done) });
    }
    return out;
  }, [tasks, startDate]);

  return (
    <View>
      {days.map(({ date, key, due }) => (
        <View key={key} style={[styles.weekRow, { borderBottomColor: colors.border }]}>
          <View style={styles.weekDate}>
            <Text style={[styles.weekDay, { color: colors.textMuted }]}>
              {weekdayName(date).slice(0, 3).toUpperCase()}
            </Text>
            <Text style={[styles.weekNum, { color: colors.text }]}>{date.getDate()}</Text>
          </View>

          <View style={styles.weekBody}>
            {due.length ? (
              due.map((t) => (
                <Text
                  key={t.id}
                  style={[styles.weekItem, { color: colors.text }]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.3}
                >
                  {t.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.weekEmpty, { color: colors.textMuted }]}>—</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

// --- Mes ------------------------------------------------------------------
// Real data only: recorded activity and genuine upcoming deadlines.
function MonthView({ summary, tasks, history }) {
  const { colors } = useTheme();

  const upcoming = useMemo(() => {
    const today = toDateKey(new Date());
    return tasks
      .filter((t) => t.dueDate && t.dueDate >= today && !t.done)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  const { completed, activeDays } = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffKey = toDateKey(cutoff);
    const recent = Object.entries(history || {}).filter(([k, n]) => k >= cutoffKey && n > 0);
    return {
      completed: recent.reduce((s, [, n]) => s + n, 0),
      activeDays: recent.length,
    };
  }, [history]);

  return (
    <View>
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Últimos 30 días</Text>
      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <Stat value={completed} label="Completadas" />
        <View style={[styles.vDivider, { backgroundColor: colors.border }]} />
        <Stat value={activeDays} label="Días activos" />
        <View style={[styles.vDivider, { backgroundColor: colors.border }]} />
        <Stat value={summary.points} label="Puntos" />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Próximas entregas</Text>
      {upcoming.length ? (
        upcoming.map((task) => (
          <View key={task.id} style={[styles.upcomingRow, { borderBottomColor: colors.border }]}>
            <Text
              style={[styles.upcomingTitle, { color: colors.text }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {task.title}
            </Text>
            <Text style={[styles.upcomingDate, { color: colors.textMuted }]}>
              {formatShortDate(parseDateKey(task.dueDate))}
            </Text>
          </View>
        ))
      ) : (
        <Empty text="No tienes entregas programadas." />
      )}
    </View>
  );
}

function Empty({ text }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.emptyBox, { borderColor: colors.border }]}>
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>{text}</Text>
    </View>
  );
}

const hit = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl },

  tabs: { flexDirection: 'row', marginBottom: spacing.lg },
  tab: { marginRight: spacing.xl },
  tabText: {
    fontSize: fontSize.xs,
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
  },
  tabTextActive: { fontWeight: '700' },
  tabUnderline: { height: 1.5, marginTop: 5 },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    marginBottom: spacing.lg,
  },
  dateLabel: { fontSize: fontSize.sm, fontWeight: '600' },

  scroll: { paddingBottom: spacing.xxxl },

  dueBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  dueHeader: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  dueRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  dueDot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1, marginRight: spacing.md },
  dueTitle: { flex: 1, fontSize: fontSize.sm, fontWeight: '500' },

  weekRow: { flexDirection: 'row', paddingVertical: spacing.lg, borderBottomWidth: 1 },
  weekDate: { width: 52 },
  weekDay: { fontSize: 10, letterSpacing: tracking.wide, fontWeight: '600' },
  weekNum: { fontSize: fontSize.lg, fontWeight: '700', fontVariant: ['tabular-nums'] },
  weekBody: { flex: 1, justifyContent: 'center' },
  weekItem: { fontSize: fontSize.sm, marginVertical: 1 },
  weekEmpty: { fontSize: fontSize.sm },

  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.lg,
  },
  vDivider: { width: 1, alignSelf: 'stretch', marginHorizontal: spacing.md },

  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  upcomingTitle: { flex: 1, fontSize: fontSize.sm, fontWeight: '500', paddingRight: spacing.md },
  upcomingDate: { fontSize: fontSize.xs, fontVariant: ['tabular-nums'] },

  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: fontSize.sm, textAlign: 'center' },
});
