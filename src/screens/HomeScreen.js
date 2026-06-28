import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import SummaryCard from '../components/SummaryCard';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { formatDuration } from '../utils/time';
import { colors, spacing, fontSize, radius, shadow } from '../theme';

// "Inicio" — greeting, the smart-schedule call to action, today's summary
// (tasks / study time / points) and the donations banner.
export default function HomeScreen({ navigation }) {
  const { userName, summary } = useApp();

  return (
    <ScreenContainer scroll>
      {/* Top bar with menu + notifications */}
      <View style={styles.topBar}>
        <TouchableOpacity hitSlop={hit}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={hit}>
          <View>
            <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.hello}>¡Hola, {userName}! 👋</Text>
      <Text style={styles.prompt}>¿Qué quieres hacer hoy?</Text>

      {/* Smart schedule CTA card */}
      <View style={styles.heroCard}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Crea tu cronograma inteligente ✨</Text>
          <Text style={styles.heroSubtitle}>
            Organizamos tus tareas según tu personalidad y hábitos.
          </Text>
          <Button
            label="Comenzar"
            variant="primary"
            full={false}
            style={styles.heroBtn}
            onPress={() => navigation.navigate('Cronograma')}
          />
        </View>
        <Text style={styles.mascot}>🧠</Text>
      </View>

      {/* Today's summary */}
      <Text style={styles.sectionTitle}>Resumen de hoy</Text>
      <View style={styles.summaryRow}>
        <SummaryCard
          emoji="📚"
          value={summary.taskCount}
          label="Tareas"
          tint={colors.pastels.blue.bg}
        />
        <View style={styles.gap} />
        <SummaryCard
          emoji="⏱️"
          value={formatDuration(summary.studyMinutes)}
          label="Estudio"
          tint={colors.pastels.green.bg}
        />
        <View style={styles.gap} />
        <SummaryCard
          emoji="⭐"
          value={summary.points}
          label="Puntos"
          tint={colors.pastels.yellow.bg}
        />
      </View>

      {/* Donations banner */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.donateCard}
        onPress={() => navigation.navigate('Donations')}
      >
        <View style={styles.donateIcon}>
          <Ionicons name="heart" size={22} color={colors.white} />
        </View>
        <View style={styles.donateText}>
          <Text style={styles.donateTitle}>Donaciones</Text>
          <Text style={styles.donateSubtitle}>Apoya nuestro proyecto</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.white} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const hit = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  dot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.pink,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  hello: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textDark, marginTop: spacing.sm },
  prompt: { fontSize: fontSize.md, color: colors.textMuted, marginTop: 4 },

  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardPurple,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.xl,
    alignItems: 'center',
    ...shadow.card,
  },
  heroText: { flex: 1, paddingRight: spacing.sm },
  heroTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.white },
  heroSubtitle: { fontSize: fontSize.sm, color: '#EFEAFF', marginTop: 6, lineHeight: 19 },
  heroBtn: { backgroundColor: colors.white, marginTop: spacing.lg, paddingVertical: 11 },
  mascot: { fontSize: 52, marginLeft: spacing.sm },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  summaryRow: { flexDirection: 'row' },
  gap: { width: spacing.md },

  donateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pink,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    ...shadow.soft,
  },
  donateIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  donateText: { flex: 1 },
  donateTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.white },
  donateSubtitle: { fontSize: fontSize.sm, color: '#FFE3F0', marginTop: 2 },
});
