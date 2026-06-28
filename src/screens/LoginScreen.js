import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { colors, spacing, fontSize, radius } from '../theme';

// Simple sign-in: the user only enters a username. We store it and continue to
// the personality step.
export default function LoginScreen({ navigation }) {
  const { userName, setUserName } = useApp();
  const [name, setName] = useState(userName || '');

  const canContinue = name.trim().length >= 2;

  const handleLogin = () => {
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
        <View style={styles.hero}>
          <Logo size="large" />
        </View>

        <Text style={styles.title}>¡Bienvenido! 👋</Text>
        <Text style={styles.subtitle}>
          Ingresa tu nombre de usuario para comenzar a organizar tus estudios.
        </Text>

        <Text style={styles.label}>Nombre de usuario</Text>
        <View style={styles.inputRow}>
          <Text style={styles.at}>@</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="tu_usuario"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />
        </View>

        <Button
          label="Iniciar sesión"
          onPress={handleLogin}
          disabled={!canContinue}
          style={styles.cta}
        />

        <Text style={styles.note}>
          No necesitas contraseña. Tu progreso se guarda en este dispositivo.
        </Text>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', paddingTop: spacing.xxxl },
  flex: { flex: 1, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: spacing.xxl },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: spacing.xxxl,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  at: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textMuted },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textDark,
    marginLeft: spacing.sm,
    height: '100%',
  },
  cta: { marginTop: spacing.xl },
  note: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
