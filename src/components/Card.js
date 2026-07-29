import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, radius, spacing } from '../theme';

// A surface defined by a hairline border rather than a shadow — flat surfaces
// keep the layout quiet and behave identically in dark mode.
export default function Card({ children, style, padded = true }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  padded: { padding: spacing.lg },
});
