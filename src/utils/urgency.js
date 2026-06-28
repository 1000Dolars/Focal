// Urgency levels for tasks. Each has a label, an accent color and a soft
// background used for the pill shown on every task. Higher urgency is scheduled
// first (see utils/schedule.js).

export const URGENCY = {
  alta: { id: 'alta', label: 'Alta', color: '#E5484D', bg: '#FDECEC', emoji: '🔴' },
  media: { id: 'media', label: 'Media', color: '#E0962F', bg: '#FFF1E0', emoji: '🟠' },
  baja: { id: 'baja', label: 'Baja', color: '#3E9D6E', bg: '#E7F6EC', emoji: '🟢' },
};

// Order shown in the picker (most urgent first).
export const urgencyOrder = ['alta', 'media', 'baja'];

// Sort rank: lower number = more urgent = scheduled earlier.
export const urgencyRank = { alta: 0, media: 1, baja: 2 };

export function getUrgency(id) {
  return URGENCY[id] || URGENCY.media;
}
