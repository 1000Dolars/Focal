import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, fontSize, shadow } from '../theme';

// Selectable card on the "Elige tu personalidad" screen. Highlights with a
// purple border + check when selected.
export default function PersonalityOption({ option, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Text style={styles.emoji}>{option.emoji}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.desc}>{option.description}</Text>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FBFAFF',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconWrapSelected: { backgroundColor: colors.primarySoft },
  emoji: { fontSize: 24 },
  body: { flex: 1, paddingRight: spacing.sm },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.textDark },
  desc: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
});
