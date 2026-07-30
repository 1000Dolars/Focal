// Static design tokens. Colours are NOT here — they depend on the active theme,
// so read them with `useTheme()` from './ThemeContext'.

// Generous spacing is what makes the layout feel calm; the scale is deliberately
// coarse so screens stay consistent.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Restrained radii — minimalism favours near-square corners over pills.
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
};

// Weights used across the app. Hierarchy leans on these rather than colour.
export const weight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Tight, deliberate letter spacing on large text.
export const tracking = {
  tight: -0.6,
  normal: 0,
  wide: 1.2,
};

export { ThemeProvider, useTheme, THEME_MODES } from './ThemeContext';
export { light, dark } from './palettes';

export default { spacing, radius, fontSize, weight, tracking };
