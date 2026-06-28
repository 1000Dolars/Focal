import { pastelOrder } from '../theme/colors';
import { urgencyRank } from './urgency';

// Builds a daily timeline from the task list. Each task becomes a study block,
// followed by a short break ("Descanso") so the plan feels humane — the core
// idea behind StudyFlow: reduce stress with a realistic, paced schedule.
//
// Tasks are ordered by urgency (Alta first) so the most pressing work is
// scheduled earliest in the session.
//
// startHour: hour of day (24h) the study session begins. Default 16 = 4:00 PM,
// matching the design mockup.
export function generateSchedule(tasks, { startHour = 16, breakMinutes = 15 } = {}) {
  const blocks = [];
  let cursor = startHour * 60; // minutes since midnight
  let colorIndex = 0;

  // Sort a copy by urgency (stable: keeps original order within a level).
  const ordered = [...tasks].sort(
    (a, b) => (urgencyRank[a.urgency] ?? 1) - (urgencyRank[b.urgency] ?? 1)
  );

  ordered.forEach((task, i) => {
    const color = pastelOrder[colorIndex % pastelOrder.length];
    blocks.push({
      id: `task-${task.id}`,
      title: task.title,
      icon: task.icon,
      type: 'study',
      color,
      start: cursor,
      end: cursor + task.duration,
    });
    cursor += task.duration;
    colorIndex += 1;

    // Insert a break between tasks (not after the very last one).
    if (i < ordered.length - 1) {
      blocks.push({
        id: `break-${task.id}`,
        title: 'Descanso',
        icon: '☕',
        type: 'break',
        color: 'green',
        start: cursor,
        end: cursor + breakMinutes,
      });
      cursor += breakMinutes;
    }
  });

  return blocks;
}
