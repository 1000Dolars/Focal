import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, fontSize } from '../theme';

// A feature line: a hairline rule and quiet type, no icon badges.
export default function FeatureRow({ title, description, last = false }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]} maxFontSizeMultiplier={1.3}>
        {title}
      </Text>
      <Text style={[styles.desc, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.lg },
  title: { fontSize: fontSize.sm, fontWeight: '600' },
  desc: { fontSize: fontSize.sm, marginTop: 3, lineHeight: 20 },
});
