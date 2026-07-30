// Initial content so the app isn't empty on first launch.

import { toDateKey } from '../utils/time';

// Due-date key N days from today (timezone-safe "YYYY-MM-DD").
function dueIn(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export const seedTasks = [
  { id: 't1', title: 'Matemáticas', description: 'Resolver ejercicios de derivadas', duration: 120, done: false, urgency: 'alta', dueDate: dueIn(1) },
  { id: 't2', title: 'Historia', description: 'Ensayo sobre la independencia', duration: 90, done: false, urgency: 'media', dueDate: dueIn(3) },
  { id: 't3', title: 'Inglés', description: 'Repasar vocabulario unidad 4', duration: 60, done: false, urgency: 'baja', dueDate: dueIn(0) },
  { id: 't4', title: 'Biología', description: 'Informe de laboratorio', duration: 90, done: false, urgency: 'media', dueDate: dueIn(5) },
  { id: 't5', title: 'Leer libro', description: '', duration: 30, done: false, urgency: 'baja', dueDate: null },
];

// Study styles. Each one changes how the daily plan is built — see
// utils/schedule.js. The choice has a real effect on the schedule.
export const personalities = [
  {
    id: 'organizado',
    title: 'Constante',
    description: 'Planificas y cumples a tiempo.',
    planSummary: 'Bloques de 50 min · descansos de 10',
  },
  {
    id: 'creativo',
    title: 'Variado',
    description: 'Te motiva cambiar de tema.',
    planSummary: 'Bloques de 40 min · alterna materias',
  },
  {
    id: 'procrastinador',
    title: 'Gradual',
    description: 'Te cuesta empezar.',
    planSummary: 'Bloques de 25 min · descansos frecuentes',
  },
];
