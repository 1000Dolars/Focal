import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { personalities, currencySymbol } from '../data/seed';
import { formatDuration } from '../utils/time';
import { colors, spacing, fontSize, radius } from '../theme';

// "Perfil" — identity, gamification stats, current personality (editable) and
// donation history.
export default function ProfileScreen({ navigation }) {
  const { userName, personality, summary, tasks, donations } = useApp();
  const current = personalities.find((p) => p.id === personality) || personalities[0];
  const completed = tasks.filter((t) => t.done).length;
  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <ScreenContainer scroll edges={['top']}>
      <ScreenHeader title="Perfil" />

      {/* Identity */}
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>Estudiante · {current.emoji} {current.title}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat value={summary.points} label="Puntos" tint={colors.pastels.yellow.bg} emoji="⭐" />
        <View style={styles.gap} />
        <Stat value={completed} label="Completadas" tint={colors.pastels.green.bg} emoji="✅" />
        <View style={styles.gap} />
        <Stat
          value={formatDuration(summary.studyMinutes)}
          label="Estudio"
          tint={colors.pastels.blue.bg}
          emoji="⏱️"
        />
      </View>

      {/* Personality */}
      <Text style={styles.sectionTitle}>Tu personalidad</Text>
      <Card style={styles.personalityCard}>
        <View style={[styles.persIcon]}>
          <Text style={{ fontSize: 24 }}>{current.emoji}</Text>
        </View>
        <View style={styles.persBody}>
          <Text style={styles.persTitle}>{current.title}</Text>
          <Text style={styles.persDesc}>{current.description}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Personality')}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </Card>

      {/* Donations */}
      <Text style={styles.sectionTitle}>Donaciones</Text>
      <Card>
        {donations.length ? (
          <>
            <Text style={styles.donationTotal}>
              Has donado {currencySymbol} {totalDonated}
            </Text>
            <Text style={styles.donationSub}>
              {donations.length} {donations.length === 1 ? 'aporte' : 'aportes'} · ¡gracias por tu apoyo! 💜
            </Text>
          </>
        ) : (
          <Text style={styles.donationSub}>Aún no has realizado donaciones.</Text>
        )}
      </Card>

      <Button
        label="♥  Apoyar el proyecto"
        variant="pink"
        style={styles.donateBtn}
        onPress={() => navigation.navigate('Donations')}
      />
    </ScreenContainer>
  );
}

function Stat({ value, label, tint, emoji }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statBadge, { backgroundColor: tint }]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: colors.white },
  name: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textDark, marginTop: spacing.md },
  role: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },

  statsRow: { flexDirection: 'row' },
  gap: { width: spacing.md },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  statBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: fontSize.md, fontWeight: '800', color: colors.textDark },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  personalityCard: { flexDirection: 'row', alignItems: 'center' },
  persIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  persBody: { flex: 1, paddingRight: spacing.sm },
  persTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  persDesc: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },

  donationTotal: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  donationSub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },

  donateBtn: { marginTop: spacing.xl },
});
