import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, radius, spacing, fontSize } from '../theme';

// Three weights of action:
//   solid   – inverse block, the single primary action on a screen
//   outline – secondary, hairline border only
//   ghost   – tertiary, text only
//   danger  – destructive, the one place a hue is allowed
export default function Button({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
  loading = false,
  style,
  full = true,
  accessibilityLabel,
  accessibilityHint,
}) {
  const { colors } = useTheme();

  const palette = {
    solid: { bg: colors.accent, fg: colors.accentText, border: colors.accent },
    outline: { bg: 'transparent', fg: colors.text, border: colors.borderStrong },
    ghost: { bg: 'transparent', fg: colors.textSecondary, border: 'transparent' },
    danger: { bg: 'transparent', fg: colors.danger, border: colors.danger },
  }[variant] || {};

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        full && styles.full,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} size="small" />
      ) : (
        <Text style={[styles.label, { color: palette.fg }]} maxFontSizeMultiplier={1.4}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { alignSelf: 'stretch' },
  disabled: { opacity: 0.35 },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
