import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import PersonalityOption from '../components/PersonalityOption';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { personalities } from '../data/seed';
import { useTheme, spacing, fontSize, tracking } from '../theme';

// Picks the study rhythm, which genuinely changes how the plan is built.
export default function PersonalityScreen({ navigation }) {
  const { colors } = useTheme();
  const { personality, setPersonality } = useApp();
  const [selected, setSelected] = useState(personality || 'organizado');

  const handleContinue = () => {
    setPersonality(selected);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <ScreenHeader onBack={() => navigation.goBack()} title="¿Cómo estudias?" />

      <Text style={[styles.subtitle, { color: colors.textMuted }]} maxFontSizeMultiplier={1.3}>
        Esto define la duración de tus bloques y descansos. Puedes cambiarlo cuando quieras.
      </Text>

      <View style={styles.list}>
        {personalities.map((option) => (
          <PersonalityOption
            key={option.id}
            option={option}
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </View>

      <Button label="Continuar" onPress={handleContinue} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: -spacing.sm,
    letterSpacing: tracking.normal,
  },
  list: { marginTop: spacing.xl, marginBottom: spacing.lg },
});
