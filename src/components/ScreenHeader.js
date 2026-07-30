import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, fontSize, tracking } from '../theme';

// Minimal top bar: an optional back arrow, a left-aligned title and one
// optional action. Titles sit left, not centred — it reads calmer and gives
// long titles room.
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel = 'Acción',
}) {
  const { colors } = useTheme();

  return (
    <View>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          hitSlop={hit}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
      ) : null}

      <View style={styles.row}>
        <View style={styles.titleWrap}>
          <Text
            style={[styles.title, { color: colors.text }]}
            maxFontSizeMultiplier={1.3}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            hitSlop={hit}
            style={[styles.action, { borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel={rightAccessibilityLabel}
          >
            <Ionicons name={rightIcon} size={20} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const hit = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  back: { paddingTop: spacing.lg, paddingBottom: spacing.sm, alignSelf: 'flex-start' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  titleWrap: { flex: 1, paddingRight: spacing.md },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    letterSpacing: tracking.tight,
  },
  subtitle: { fontSize: fontSize.sm, marginTop: 4 },
  action: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
