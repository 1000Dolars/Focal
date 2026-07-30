import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import Chip from '../components/Chip';
import Stat from '../components/Stat';
import PersonalityOption from '../components/PersonalityOption';
import { useApp } from '../context/AppContext';
import { personalities } from '../data/seed';
import { formatDuration } from '../utils/time';
import { useTheme, THEME_MODES, spacing, fontSize, radius, tracking } from '../theme';

// "Ajustes" — profile, appearance (including dark mode), study rhythm, legal
// and data deletion. The old separate Perfil tab folded into here.
export default function SettingsScreen({ navigation }) {
  const { colors, mode, setThemeMode } = useTheme();
  const {
    userName,
    setUserName,
    resetAllData,
    summary,
    history,
    personality,
    setPersonality,
  } = useApp();
  const [name, setName] = useState(userName);

  const activeDays = Object.values(history || {}).filter((n) => n > 0).length;

  const saveName = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      Alert.alert('Nombre muy corto', 'Usa al menos 2 caracteres.');
      return;
    }
    setUserName(trimmed);
    Alert.alert('Guardado', 'Tu nombre se actualizó.');
  };

  const confirmReset = () => {
    Alert.alert(
      '¿Borrar todos tus datos?',
      'Se eliminarán tus tareas, tu progreso y tu nombre de este dispositivo. No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Ajustes" />

        {/* Progress */}
        <View style={[styles.statsRow, { borderColor: colors.border }]}>
          <Stat value={summary.points} label="Puntos" />
          <View style={[styles.vDivider, { backgroundColor: colors.border }]} />
          <Stat value={summary.completed} label="Completadas" />
          <View style={[styles.vDivider, { backgroundColor: colors.border }]} />
          <Stat value={activeDays} label="Días activos" />
        </View>

        {/* Name */}
        <Label>Tu nombre</Label>
        <View style={styles.nameRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[
              styles.input,
              { backgroundColor: colors.surfaceAlt, color: colors.text },
            ]}
            autoCapitalize="words"
            maxLength={20}
            accessibilityLabel="Tu nombre"
            returnKeyType="done"
            onSubmitEditing={saveName}
          />
          <TouchableOpacity
            onPress={saveName}
            style={[styles.saveBtn, { borderColor: colors.borderStrong }]}
            accessibilityRole="button"
            accessibilityLabel="Guardar el nombre"
          >
            <Text style={[styles.saveText, { color: colors.text }]}>Guardar</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <Label>Apariencia</Label>
        <View style={styles.chipRow}>
          {THEME_MODES.map((m) => (
            <Chip
              key={m.id}
              label={m.label}
              selected={mode === m.id}
              onPress={() => setThemeMode(m.id)}
              role="radio"
              accessibilityLabel={`Tema ${m.label}`}
            />
          ))}
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          «Sistema» sigue la configuración de tu teléfono.
        </Text>

        {/* Study rhythm */}
        <Label>Tu ritmo de estudio</Label>
        {personalities.map((option) => (
          <PersonalityOption
            key={option.id}
            option={option}
            selected={personality === option.id}
            onPress={() => setPersonality(option.id)}
          />
        ))}

        {/* Legal */}
        <Label>Legal</Label>
        <Row
          icon="lock-closed-outline"
          label="Política de privacidad"
          onPress={() => navigation.navigate('Privacy')}
        />
        <Row
          icon="document-text-outline"
          label="Términos de uso"
          onPress={() => navigation.navigate('Terms')}
        />

        {/* Data */}
        <Label>Tus datos</Label>
        <Text style={[styles.hint, { color: colors.textMuted, marginBottom: spacing.lg }]}>
          Todo se guarda solo en este dispositivo. Nada se envía a internet.
        </Text>
        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: colors.danger }]}
          onPress={confirmReset}
          accessibilityRole="button"
          accessibilityLabel="Borrar todos mis datos"
          accessibilityHint="Elimina de forma permanente tus tareas y tu progreso"
        >
          <Text style={[styles.deleteText, { color: colors.danger }]}>
            Borrar todos mis datos
          </Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>Focal 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ children }) {
  const { colors } = useTheme();
  return (
    <Text
      style={[styles.label, { color: colors.textMuted }]}
      accessibilityRole="header"
      maxFontSizeMultiplier={1.3}
    >
      {children}
    </Text>
  );
}

function Row({ icon, label, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={[styles.rowText, { color: colors.text }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: spacing.lg,
  },
  vDivider: { width: 1, alignSelf: 'stretch', marginHorizontal: spacing.md },

  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: tracking.wide,
    textTransform: 'uppercase',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  nameRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.md,
  },
  saveBtn: {
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginLeft: spacing.sm,
  },
  saveText: { fontSize: fontSize.sm, fontWeight: '600' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  hint: { fontSize: fontSize.xs, lineHeight: 17 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  rowText: { flex: 1, fontSize: fontSize.md, marginLeft: spacing.md },

  deleteBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: { fontSize: fontSize.sm, fontWeight: '600' },

  version: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
