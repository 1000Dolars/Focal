// Urgency levels.
//
// In a monochrome system urgency cannot be signalled with hue, so it is encoded
// as fill and weight instead: solid + bold for high, solid muted for medium,
// hollow for low. This also reads correctly for colour-blind users, which a
// red/amber/green scale does not.

export const URGENCY = {
  alta: { id: 'alta', label: 'Alta', rank: 0 },
  media: { id: 'media', label: 'Media', rank: 1 },
  baja: { id: 'baja', label: 'Baja', rank: 2 },
};

export const urgencyOrder = ['alta', 'media', 'baja'];

export const urgencyRank = { alta: 0, media: 1, baja: 2 };

export function getUrgency(id) {
  return URGENCY[id] || URGENCY.media;
}

// Visual treatment for a level against the active palette.
export function urgencyStyle(colors, id) {
  switch (id) {
    case 'alta':
      return {
        dotBg: colors.text,
        dotBorder: colors.text,
        textColor: colors.text,
        fontWeight: '600',
      };
    case 'baja':
      return {
        dotBg: 'transparent',
        dotBorder: colors.borderStrong,
        textColor: colors.textMuted,
        fontWeight: '400',
      };
    case 'media':
    default:
      return {
        dotBg: colors.textMuted,
        dotBorder: colors.textMuted,
        textColor: colors.textSecondary,
        fontWeight: '500',
      };
  }
}
