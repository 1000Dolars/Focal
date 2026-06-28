import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import PersonalityOption from '../components/PersonalityOption';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { personalities } from '../data/seed';
import { colors, spacing, fontSize } from '../theme';

// "Elige tu personalidad" — sets the archetype that personalizes the plan, then
// continues into the main app.
export default function PersonalityScreen({ navigation }) {
  const { personality, setPersonality } = useApp();
  const [selected, setSelected] = useState(personality || 'organizado');

  const handleContinue = () => {
    setPersonality(selected);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <ScreenHeader onBack={() => navigation.goBack()} title="" />

      <Text style={styles.title}>Elige tu personalidad</Text>
      <Text style={styles.subtitle}>Esto nos ayuda a crear un plan perfecto para ti.</Text>

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

      <Button label="Continuar" onPress={handleContinue} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textDark, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
  list: { marginTop: spacing.xl },
  cta: { marginTop: spacing.sm },
});
