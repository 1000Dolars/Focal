import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, radius, spacing, fontSize } from '../theme';

// A selectable pill. Selected state inverts to the accent block — the same
// language as the primary button, so selection always reads the same way.
export default function Chip({
  label,
  selected,
  onPress,
  icon,
  dot,
  role = 'button',
  accessibilityLabel,
}) {
  const { colors } = useTheme();

  const bg = selected ? colors.accent : 'transparent';
  const fg = selected ? colors.accentText : colors.textSecondary;
  const border = selected ? colors.accent : colors.border;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, { backgroundColor: bg, borderColor: border }]}
      accessibilityRole={role}
      accessibilityState={role === 'radio' ? { selected: !!selected, checked: !!selected } : undefined}
      accessibilityLabel={accessibilityLabel || label}
    >
      {dot ? (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: selected ? colors.accentText : dot.bg,
              borderColor: selected ? colors.accentText : dot.border,
            },
          ]}
        />
      ) : null}
      {icon ? <Ionicons name={icon} size={14} color={fg} style={styles.icon} /> : null}
      <Text style={[styles.label, { color: fg }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  dot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1, marginRight: 7 },
  icon: { marginRight: 6 },
  label: { fontSize: fontSize.sm, fontWeight: '500' },
});
