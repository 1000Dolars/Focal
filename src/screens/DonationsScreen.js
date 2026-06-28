import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import DonationOption from '../components/DonationOption';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { donationAmounts, currencySymbol } from '../data/seed';
import { colors, spacing, fontSize, radius } from '../theme';

// "Donaciones" — pick a preset amount or enter a custom one, then confirm.
// Recording the donation is handled by the app context.
export default function DonationsScreen({ navigation }) {
  const { addDonation } = useApp();
  const [selected, setSelected] = useState(50); // matches the design default
  const [custom, setCustom] = useState('');

  const isOther = selected === 'other';
  const amount = isOther ? parseFloat(custom) : selected;
  const canDonate = !!amount && amount > 0;

  const handleDonate = () => {
    if (!canDonate) return;
    addDonation(amount);
    Alert.alert(
      '¡Gracias por tu apoyo! 💜',
      `Tu donación de ${currencySymbol} ${amount} ayuda a más estudiantes.`,
      [{ text: 'Cerrar', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <ScreenHeader title="Donaciones" onBack={() => navigation.goBack()} />

      <View style={styles.illustration}>
        <View style={styles.heartCircle}>
          <Ionicons name="heart" size={40} color={colors.white} />
        </View>
        <Text style={styles.hands}>🤲</Text>
      </View>

      <Text style={styles.title}>Tu apoyo hace la diferencia</Text>
      <Text style={styles.subtitle}>
        Con tu donación ayudas a que sigamos mejorando la app y apoyando a más estudiantes.
      </Text>

      <View style={styles.grid}>
        {donationAmounts.map((value) => (
          <DonationOption
            key={value}
            label={`${currencySymbol} ${value}`}
            selected={selected === value}
            onPress={() => setSelected(value)}
          />
        ))}
        <DonationOption
          label="Otro"
          selected={isOther}
          onPress={() => setSelected('other')}
        />
      </View>

      {isOther && (
        <View style={styles.customRow}>
          <Text style={styles.currency}>{currencySymbol}</Text>
          <TextInput
            value={custom}
            onChangeText={setCustom}
            placeholder="Ingresa un monto"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            style={styles.customInput}
            autoFocus
          />
        </View>
      )}

      <Button
        label="Donar ahora  💜"
        variant="primary"
        disabled={!canDonate}
        onPress={handleDonate}
        style={styles.cta}
      />

      <View style={styles.secureRow}>
        <Ionicons name="lock-closed" size={13} color={colors.textMuted} />
        <Text style={styles.secure}>Pago 100% seguro</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  illustration: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg },
  heartCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hands: { fontSize: 34, marginTop: -10 },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  currency: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textDark },
  customInput: {
    flex: 1,
    height: 50,
    fontSize: fontSize.md,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },
  cta: { marginTop: spacing.xxl },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  secure: { fontSize: fontSize.xs, color: colors.textMuted, marginLeft: 6 },
});
