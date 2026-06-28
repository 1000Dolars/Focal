// Helpers for working with durations (stored in minutes) and clock times.

// Format a duration in minutes as "2h", "1h 30m" or "30m".
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

// Format minutes-since-midnight as a 12h clock time, e.g. "4:00 PM".
export function formatClock(totalMinutes) {
  const minutesInDay = ((totalMinutes % 1440) + 1440) % 1440;
  let h = Math.floor(minutesInDay / 60);
  const m = minutesInDay % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${period}`;
}

// Sum total study minutes from a list of tasks.
export function totalMinutes(tasks) {
  return tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// Human friendly date label like "20 de mayo".
export function formatLongDate(date) {
  return `${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Weekday name for a Date, e.g. "Lunes".
export function weekdayName(date) {
  return WEEKDAYS[date.getDay()];
}

// --- Due dates ----------------------------------------------------------
// Due dates are stored as timezone-safe "YYYY-MM-DD" keys.

// Date -> "YYYY-MM-DD" (local).
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// "YYYY-MM-DD" -> Date (at local midnight).
export function parseDateKey(key) {
  return new Date(`${key}T00:00:00`);
}

// Today's key, for comparisons.
export function todayKey() {
  return toDateKey(new Date());
}

// Short date label like "30 jun".
export function formatShortDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

// Relative label for a due-date key: "Hoy", "Mañana", "Vencida", or "30 jun".
export function dueLabel(key) {
  if (!key) return '';
  const today = todayKey();
  if (key === today) return 'Hoy';
  // Difference in whole days.
  const diff = Math.round((parseDateKey(key) - parseDateKey(today)) / 86400000);
  if (diff === 1) return 'Mañana';
  if (diff < 0) return 'Vencida';
  return formatShortDate(parseDateKey(key));
}

// True when the due key is before today (overdue).
export function isOverdue(key) {
  return !!key && key < todayKey();
}
