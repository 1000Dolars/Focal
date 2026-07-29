import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, radius, spacing, fontSize } from '../theme';

// Selectable study style. Selection is shown by a filled radio and a stronger
// border — no fills, no colour.
export default function PersonalityOption({ option, selected, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: selected ? colors.accent : colors.border,
          backgroundColor: colors.surface,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected, checked: !!selected }}
      accessibilityLabel={`${option.title}. ${option.description}`}
      accessibilityHint={option.planSummary}
    >
      <View
        style={[
          styles.radio,
          { borderColor: selected ? colors.accent : colors.borderStrong },
        ]}
      >
        {selected ? <View style={[styles.radioCore, { backgroundColor: colors.accent }]} /> : null}
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]} maxFontSizeMultiplier={1.3}>
          {option.title}
        </Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]} maxFontSizeMultiplier={1.3}>
          {option.description}
        </Text>
        <Text style={[styles.plan, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
          {option.planSummary}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  radioCore: { width: 10, height: 10, borderRadius: 5 },
  body: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: '600' },
  desc: { fontSize: fontSize.sm, marginTop: 3 },
  plan: { fontSize: fontSize.xs, marginTop: 6 },
});
