// Central color palette extracted from the StudyFlow IA design mockup.
// White base, purple accents, pink for donations, pastels for the schedule.

export const colors = {
  // Base
  white: '#FFFFFF',
  background: '#FBFAFF',
  surface: '#FFFFFF',

  // Brand purple
  primary: '#7C5CFF',
  primaryDark: '#6A40E8',
  primaryLight: '#A78BFA',
  primarySoft: '#EDE7FB',
  cardPurple: '#9577E8',

  // Donations pink / rose
  pink: '#EC4899',
  pinkDark: '#DB2777',
  pinkSoft: '#FCE7F1',

  // Accents
  gold: '#F5C542',

  // Text
  textDark: '#2D2A3A',
  textBody: '#56536A',
  textMuted: '#9A97AE',

  // Lines & fills
  border: '#ECEAF4',
  inputBg: '#F6F5FB',
  divider: '#F0EEF7',

  // Status
  success: '#4CAF7D',

  // Pastel palette for schedule blocks (and task accents)
  pastels: {
    blue: { bg: '#E8F1FE', accent: '#5B9BF3', text: '#3B6FB0' },
    green: { bg: '#E7F6EC', accent: '#4CAF7D', text: '#2F8159' },
    orange: { bg: '#FFF1E6', accent: '#F0A35E', text: '#C47A36' },
    purple: { bg: '#F0EAFB', accent: '#9B7FE8', text: '#6F52C0' },
    pink: { bg: '#FDEAF2', accent: '#EC7BA8', text: '#C04F82' },
    yellow: { bg: '#FFF7E0', accent: '#F5C542', text: '#B58A12' },
  },
};

// Ordered list used to cycle accent colors across dynamic lists.
export const pastelOrder = ['blue', 'green', 'orange', 'purple', 'pink', 'yellow'];

export default colors;
