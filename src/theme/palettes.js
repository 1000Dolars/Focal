// Focal — monochrome design system.
//
// There are no decorative colours. Hierarchy comes from typography, weight and
// space. The "accent" is simply the inverse of the background, so primary
// actions read as solid blocks of contrast in both themes.
//
// `danger` is the one semantic hue, reserved for destructive actions and
// overdue work. It is never used for decoration.
//
// Contrast ratios against their own background are noted per token; every text
// colour clears WCAG AA (4.5:1).

export const light = {
  scheme: 'light',

  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F4F5',
  surfaceSunken: '#FAFAFA',

  border: '#E4E4E7',
  borderStrong: '#D4D4D8',

  text: '#18181B', //  15.9:1
  textSecondary: '#52525B', //   7.5:1
  textMuted: '#71717A', //   4.8:1

  accent: '#18181B',
  accentText: '#FFFFFF',
  accentSoft: '#F4F4F5',

  danger: '#B91C1C',
  dangerSoft: '#FEF2F2',

  // Neutral fills used to distinguish schedule blocks without colour.
  blockStudy: '#F4F4F5',
  blockBreak: '#FAFAFA',
};

export const dark = {
  scheme: 'dark',

  bg: '#0F0F11',
  surface: '#161619',
  surfaceAlt: '#1F1F23',
  surfaceSunken: '#131316',

  border: '#27272A',
  borderStrong: '#3F3F46',

  text: '#FAFAFA', //  17.1:1
  textSecondary: '#A1A1AA', //   7.8:1
  textMuted: '#8B8B94', //   5.7:1

  accent: '#FAFAFA',
  accentText: '#0F0F11',
  accentSoft: '#1F1F23',

  danger: '#F87171',
  dangerSoft: '#2A1616',

  blockStudy: '#1F1F23',
  blockBreak: '#161619',
};

export default { light, dark };
