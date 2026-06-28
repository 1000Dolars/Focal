// Initial demo content so the app feels alive on first launch.
// Mirrors the tasks shown in the design mockup.

import { toDateKey } from '../utils/time';

// Due-date key N days from today (timezone-safe "YYYY-MM-DD").
function dueIn(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export const seedTasks = [
  { id: 't1', title: 'Matemáticas', description: 'Resolver ejercicios de derivadas', duration: 120, icon: '📘', done: false, color: 'blue', urgency: 'alta', dueDate: dueIn(1) },
  { id: 't2', title: 'Historia', description: 'Ensayo sobre la independencia', duration: 90, icon: '📙', done: false, color: 'orange', urgency: 'media', dueDate: dueIn(3) },
  { id: 't3', title: 'Inglés', description: 'Repasar vocabulario unidad 4', duration: 60, icon: '📗', done: false, color: 'green', urgency: 'baja', dueDate: dueIn(0) },
  { id: 't4', title: 'Biología', description: 'Informe de laboratorio', duration: 90, icon: '🧪', done: false, color: 'purple', urgency: 'media', dueDate: dueIn(5) },
  { id: 't5', title: 'Leer libro', description: '', duration: 30, icon: '📕', done: false, color: 'pink', urgency: 'baja', dueDate: null },
];

// Personality archetypes that tune how the plan is generated.
export const personalities = [
  {
    id: 'organizado',
    title: 'Organizado',
    emoji: '🗂️',
    description: 'Te gusta planificar y cumplir con todo a tiempo.',
  },
  {
    id: 'creativo',
    title: 'Creativo',
    emoji: '🎨',
    description: 'Piensas diferente y te motiva la inspiración.',
  },
  {
    id: 'procrastinador',
    title: 'Procrastinador',
    emoji: '🦥',
    description: 'Te cuesta empezar, pero ¡podemos ayudarte!',
  },
];

// Demo friends for the leaderboard — you compete by who has the most points.
export const seedFriends = [
  { id: 'f1', name: 'Mateo', points: 320, emoji: '🦊' },
  { id: 'f2', name: 'Sofía', points: 260, emoji: '🦄' },
  { id: 'f3', name: 'Diego', points: 185, emoji: '🐼' },
  { id: 'f4', name: 'Luana', points: 95, emoji: '🐱' },
];

// Fun emojis assigned to newly added friends.
export const friendEmojis = ['🐶', '🐯', '🐵', '🐨', '🦁', '🐸', '🐙', '🦉', '🐝', '🦋'];

// Preset donation amounts (Peruvian soles, per the mockup).
export const donationAmounts = [5, 10, 20, 30, 50];
export const currencySymbol = 'S/';
