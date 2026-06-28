import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../theme';

// A selectable amount chip on the Donations screen. Selected state fills purple.
export default function DonationOption({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexGrow: 1,
    flexBasis: '30%',
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  labelSelected: { color: colors.white },
});
