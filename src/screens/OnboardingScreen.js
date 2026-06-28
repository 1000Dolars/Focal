import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Logo from '../components/Logo';
import Button from '../components/Button';
import FeatureRow from '../components/FeatureRow';
import { colors, spacing, fontSize, radius } from '../theme';

const FEATURES = [
  {
    emoji: '🧠',
    title: 'IA personalizada',
    description: 'Crea tu horario ideal según tu personalidad y hábitos.',
    tint: colors.primarySoft,
  },
  {
    emoji: '🗓️',
    title: 'Cronogramas inteligentes',
    description: 'Organiza tu día, semana o mes fácilmente.',
    tint: colors.pastels.blue.bg,
  },
  {
    emoji: '🏆',
    title: 'Gamificación',
    description: 'Gana puntos, desbloquea logros y mantén la motivación.',
    tint: colors.pastels.yellow.bg,
  },
  {
    emoji: '📈',
    title: 'Seguimiento',
    description: 'Visualiza tu progreso y mejora cada día.',
    tint: colors.pastels.green.bg,
  },
  {
    emoji: '💜',
    title: 'Donaciones',
    description: 'Apoya nuestro proyecto y ayúdanos a crecer.',
    tint: colors.pinkSoft,
  },
];

// First screen: brand intro, the two primary CTAs, and the feature list.
export default function OnboardingScreen({ navigation }) {
  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.hero}>
        <Logo size="large" />
        <Text style={styles.tagline}>Tu plan. Tu ritmo. Tu éxito.</Text>
        <Text style={styles.subtitle}>
          La app que crea tu cronograma de estudio ideal según tu personalidad y te ayuda a
          alcanzar tus metas.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Comenzar" onPress={() => navigation.navigate('Login')} />
        <Button
          label="♥  Donaciones"
          variant="outline"
          style={styles.donate}
          onPress={() => navigation.navigate('Donations')}
        />
      </View>

      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>Características principales</Text>
        {FEATURES.map((f) => (
          <FeatureRow key={f.title} {...f} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xxxl },
  hero: { alignItems: 'center', paddingHorizontal: spacing.md },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textBody,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  actions: { marginTop: spacing.xxxl },
  donate: { marginTop: spacing.md },
  featuresCard: {
    marginTop: spacing.xxxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  featuresTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
