import { colors, pastelOrder } from './colors';

// Spacing scale (multiples of 4) for consistent layout.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Corner radii — the design leans heavily on soft, rounded shapes.
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

// Typography sizes.
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 28,
};

// Reusable soft shadow (works on iOS; elevation handles Android).
export const shadow = {
  card: {
    shadowColor: '#5B4B8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: '#5B4B8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

export { colors, pastelOrder };
export default { colors, spacing, radius, fontSize, shadow, pastelOrder };
