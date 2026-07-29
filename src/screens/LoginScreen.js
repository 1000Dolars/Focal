import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useTheme, spacing, fontSize, radius, tracking } from '../theme';

// Sign-in is just a name — no password, no email, no account.
export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { userName, setUserName } = useApp();
  const [name, setName] = useState(userName || '');

  const canContinue = name.trim().length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    setUserName(name.trim());
    navigation.navigate('Personality');
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <Text
          style={[styles.title, { color: colors.text }]}
          accessibilityRole="header"
          maxFontSizeMultiplier={1.3}
        >
          ¿Cómo te llamamos?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
          Puede ser tu nombre o un apodo.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text }]}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={20}
          returnKeyType="go"
          onSubmitEditing={handleContinue}
          accessibilityLabel="Tu nombre"
          accessibilityHint="Escribe el nombre con el que quieres que te llamemos"
        />

        <Button
          label="Continuar"
          onPress={handleContinue}
          disabled={!canContinue}
          style={styles.cta}
        />

        <Text style={[styles.note, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
          Sin contraseña ni correo. Tu nombre y tu progreso se guardan solo en este dispositivo.
        </Text>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center' },
  flex: { flex: 1, justifyContent: 'center' },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    letterSpacing: tracking.tight,
  },
  subtitle: { fontSize: fontSize.sm, marginTop: spacing.sm },
  input: {
    height: 54,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.lg,
    marginTop: spacing.xxl,
  },
  cta: { marginTop: spacing.lg },
  note: {
    fontSize: fontSize.xs,
    marginTop: spacing.xl,
    lineHeight: 17,
  },
});
