import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { clearState } from '../utils/storage';
import { useTheme, spacing, fontSize, tracking } from '../theme';

// The visible fallback. Split out as a function component so it can read the
// theme — the class below cannot use hooks.
function ErrorFallback({ onRetry, onReset }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Algo salió mal</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        La app encontró un problema inesperado. Puedes reintentar sin perder tus datos.
      </Text>

      <Button label="Reintentar" onPress={onRetry} style={styles.btn} />
      <Button
        label="Borrar datos y reiniciar"
        variant="danger"
        onPress={onReset}
        style={styles.btn}
      />
    </View>
  );
}

// Catches render errors below it so a crash shows a recovery screen instead of
// a blank app. Must sit inside ThemeProvider for the fallback to be themed.
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (__DEV__) console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleRetry = () => this.setState({ hasError: false });

  // Last resort: corrupt saved data could otherwise crash on every launch.
  handleReset = async () => {
    await clearState();
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return <ErrorFallback onRetry={this.handleRetry} onReset={this.handleReset} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '700', letterSpacing: tracking.tight },
  message: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    lineHeight: 21,
  },
  btn: { marginTop: spacing.md, alignSelf: 'stretch' },
});
