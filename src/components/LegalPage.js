import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from './ScreenContainer';
import ScreenHeader from './ScreenHeader';
import { useTheme, spacing, fontSize } from '../theme';

// Shared layout for the privacy and terms pages.
export default function LegalPage({ title, updated, highlight, sections, onBack }) {
  const { colors } = useTheme();

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <ScreenHeader title={title} onBack={onBack} />

      <Text style={[styles.updated, { color: colors.textMuted }]}>Actualizado: {updated}</Text>

      {highlight ? (
        <View style={[styles.highlight, { borderColor: colors.borderStrong }]}>
          <Text style={[styles.highlightText, { color: colors.text }]}>{highlight}</Text>
        </View>
      ) : null}

      {sections.map((s) => (
        <View key={s.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{s.title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{s.body}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  updated: { fontSize: fontSize.xs },
  highlight: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  highlightText: { fontSize: fontSize.sm, fontWeight: '600', lineHeight: 20 },
  section: { marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600' },
  body: { fontSize: fontSize.sm, lineHeight: 21, marginTop: spacing.sm },
});
