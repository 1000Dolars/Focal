import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Stat from '../components/Stat';
import { useApp } from '../context/AppContext';
import { formatDuration, formatClock } from '../utils/time';
import { personalities } from '../data/seed';
import { useTheme, spacing, fontSize, radius, tracking } from '../theme';

// Home — a greeting, today's figures and the next block. Deliberately sparse:
// the point is to answer "what now?" without any noise.
export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { userName, summary, personality, schedule } = useApp();
  const style = personalities.find((p) => p.id === personality) || personalities[0];
  const nextBlock = schedule.find((b) => b.type === 'study');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
          {greeting}
        </Text>
        <Text
          style={[styles.name, { color: colors.text }]}
          maxFontSizeMultiplier={1.3}
          accessibilityRole="header"
        >
          {userName || 'Hola'}
        </Text>
      </View>

      {/* Today's figures */}
      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <Stat
          value={summary.pending}
          label="Pendientes"
          accessibilityLabel={`${summary.pending} tareas pendientes`}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Stat
          value={formatDuration(summary.studyMinutes)}
          label="Por estudiar"
          accessibilityLabel={`${formatDuration(summary.studyMinutes)} por estudiar`}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Stat
          value={summary.points}
          label="Puntos"
          accessibilityLabel={`${summary.points} puntos`}
        />
      </View>

      {/* Next up */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]} accessibilityRole="header">
        A continuación
      </Text>

      {nextBlock ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Plan')}
          style={[styles.nextCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
          accessibilityRole="button"
          accessibilityLabel={`Siguiente: ${nextBlock.title} a las ${formatClock(nextBlock.start)}. Ver el plan completo`}
        >
          <View style={styles.nextBody}>
            <Text style={[styles.nextTime, { color: colors.textMuted }]}>
              {formatClock(nextBlock.start)} – {formatClock(nextBlock.end)}
            </Text>
            <Text
              style={[styles.nextTitle, { color: colors.text }]}
              numberOfLines={2}
              maxFontSizeMultiplier={1.3}
            >
              {nextBlock.title}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ) : (
        <View style={[styles.empty, { borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {summary.taskCount === 0
              ? 'Aún no has añadido tareas.'
              : 'Todo completado. Buen trabajo.'}
          </Text>
        </View>
      )}

      {/* Study style */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]} accessibilityRole="header">
        Tu ritmo
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Ajustes')}
        style={[styles.styleRow, { borderColor: colors.border }]}
        accessibilityRole="button"
        accessibilityLabel={`Ritmo actual: ${style.title}. ${style.planSummary}. Tocar para cambiar`}
      >
        <View style={styles.nextBody}>
          <Text style={[styles.styleTitle, { color: colors.text }]}>{style.title}</Text>
          <Text style={[styles.styleDesc, { color: colors.textMuted }]}>{style.planSummary}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  greeting: { fontSize: fontSize.sm },
  name: {
    fontSize: fontSize.display,
    fontWeight: '700',
    letterSpacing: tracking.tight,
    marginTop: 2,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.xl,
  },
  divider: { width: 1, alignSelf: 'stretch', marginHorizontal: spacing.md },

  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  nextBody: { flex: 1 },
  nextTime: { fontSize: fontSize.xs, fontVariant: ['tabular-nums'] },
  nextTitle: { fontSize: fontSize.lg, fontWeight: '600', marginTop: 4 },

  empty: {
    borderWidth: 1,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: fontSize.sm },

  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  styleTitle: { fontSize: fontSize.md, fontWeight: '600' },
  styleDesc: { fontSize: fontSize.xs, marginTop: 3 },
});
