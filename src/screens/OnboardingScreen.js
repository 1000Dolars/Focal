import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Logo from '../components/Logo';
import Button from '../components/Button';
import FeatureRow from '../components/FeatureRow';
import { useTheme, spacing, fontSize, tracking } from '../theme';

// Every claim here matches what the app actually does.
const FEATURES = [
  {
    title: 'Un plan a tu ritmo',
    description: 'Divide tus tareas en bloques de enfoque con descansos, según cómo estudias.',
  },
  {
    title: 'Entregas a la vista',
    description: 'Registra cuándo vence cada cosa y velo por día, semana o mes.',
  },
  {
    title: 'Progreso real',
    description: 'Suma puntos al completar y revisa tu actividad de los últimos 30 días.',
  },
  {
    title: 'Privado por diseño',
    description: 'Todo se guarda en tu dispositivo. Sin cuentas, sin rastreo, sin internet.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.hero}>
        <Logo size="large" />
        <Text style={[styles.tagline, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
          Una cosa a la vez.
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.title} {...f} last={i === FEATURES.length - 1} />
        ))}
      </View>

      <Button
        label="Empezar"
        onPress={() => navigation.navigate('Login')}
        accessibilityLabel="Empezar a usar Focal"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingTop: spacing.xxxl * 1.5 },
  hero: { alignItems: 'center' },
  tagline: {
    fontSize: fontSize.md,
    marginTop: spacing.md,
    letterSpacing: tracking.normal,
  },
  features: { flex: 1, marginTop: spacing.xxxl, marginBottom: spacing.xxl },
});
