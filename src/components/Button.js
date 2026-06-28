import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, fontSize, shadow } from '../theme';

// Versatile button with three visual variants used throughout the app.
//   variant="primary"  -> solid purple (default)
//   variant="pink"     -> solid rose, for donation calls-to-action
//   variant="outline"  -> bordered, transparent fill
export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  full = true,
}) {
  const isOutline = variant === 'outline';
  const bg =
    variant === 'pink' ? colors.pink : variant === 'outline' ? 'transparent' : colors.primary;
  const textColor = isOutline ? colors.primary : colors.white;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bg },
        isOutline && styles.outline,
        !isOutline && shadow.soft,
        full && styles.full,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { alignSelf: 'stretch' },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.pink,
  },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
