import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../theme';

// Top bar used across the inner screens: optional back button, centered title
// and an optional right-side action (e.g. the "+" on the Tasks screen).
export default function ScreenHeader({ title, onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={hit} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={[styles.side, styles.right]}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} hitSlop={hit} style={styles.plusBtn}>
            <Ionicons name={rightIcon} size={22} color={colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const hit = { top: 10, bottom: 10, left: 10, right: 10 };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  side: { width: 44, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  iconBtn: { alignItems: 'flex-start' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textDark,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
