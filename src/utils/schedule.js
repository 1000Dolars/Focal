import { urgencyRank } from './urgency';

// How each personality shapes the day. This is what makes the personality
// choice meaningful: it changes block length, break length and task ordering.
//
//   focusBlock  – max minutes of continuous study before a break
//   breakShort  – break after a normal block
//   breakLong   – longer break after several blocks
//   blocksUntilLongBreak – how many blocks before the long break
//   interleave  – alternate between different subjects instead of finishing one
export const PERSONALITY_PLANS = {
  organizado: {
    focusBlock: 50,
    breakShort: 10,
    breakLong: 20,
    blocksUntilLongBreak: 3,
    interleave: false,
  },
  creativo: {
    focusBlock: 40,
    breakShort: 12,
    breakLong: 25,
    blocksUntilLongBreak: 3,
    interleave: true,
  },
  procrastinador: {
    focusBlock: 25,
    breakShort: 8,
    breakLong: 20,
    blocksUntilLongBreak: 2,
    interleave: false,
  },
};

// Round-robin across tasks so subjects alternate (used by "Creativo").
function interleaveChunks(chunks) {
  const byTask = new Map();
  chunks.forEach((c) => {
    if (!byTask.has(c.taskId)) byTask.set(c.taskId, []);
    byTask.get(c.taskId).push(c);
  });
  const queues = [...byTask.values()];
  const out = [];
  let added = true;
  while (added) {
    added = false;
    for (const q of queues) {
      const next = q.shift();
      if (next) {
        out.push(next);
        added = true;
      }
    }
  }
  return out;
}

// Builds a daily timeline from the task list.
//
// Long tasks are split into focus blocks sized for the chosen personality, with
// breaks in between — the core idea behind Focal: reduce stress with a
// realistic, paced schedule. Tasks are ordered by urgency (Alta first).
export function generateSchedule(tasks, { startHour = 16, personality = 'organizado' } = {}) {
  const plan = PERSONALITY_PLANS[personality] || PERSONALITY_PLANS.organizado;

  // Pending tasks only — finished work shouldn't fill tomorrow's plan.
  const pending = tasks.filter((t) => !t.done);
  if (!pending.length) return [];

  // Most urgent first; ties broken by the earlier due date.
  const ordered = [...pending].sort(
    (a, b) =>
      (urgencyRank[a.urgency] ?? 1) - (urgencyRank[b.urgency] ?? 1) ||
      (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
  );

  // Split each task into focus-sized chunks.
  let chunks = [];
  ordered.forEach((task) => {
    let remaining = Math.max(1, task.duration || 0);
    let part = 1;
    const parts = Math.ceil(remaining / plan.focusBlock);
    while (remaining > 0) {
      const length = Math.min(plan.focusBlock, remaining);
      chunks.push({
        taskId: task.id,
        title: task.title,
        urgency: task.urgency,
        length,
        // Only label parts when a task is actually split.
        label: parts > 1 ? `${task.title} (${part}/${parts})` : task.title,
      });
      remaining -= length;
      part += 1;
    }
  });

  if (plan.interleave) chunks = interleaveChunks(chunks);

  // Lay the chunks onto the clock, inserting breaks.
  const blocks = [];
  let cursor = startHour * 60; // minutes since midnight
  let sinceLongBreak = 0;

  chunks.forEach((chunk, i) => {
    blocks.push({
      id: `study-${chunk.taskId}-${i}`,
      title: chunk.label,
      urgency: chunk.urgency,
      type: 'study',
      start: cursor,
      end: cursor + chunk.length,
    });
    cursor += chunk.length;
    sinceLongBreak += 1;

    // No break after the final block.
    if (i < chunks.length - 1) {
      const isLong = sinceLongBreak >= plan.blocksUntilLongBreak;
      const breakLength = isLong ? plan.breakLong : plan.breakShort;
      if (isLong) sinceLongBreak = 0;

      blocks.push({
        id: `break-${i}`,
        title: isLong ? 'Descanso largo' : 'Descanso',
        type: 'break',
        start: cursor,
        end: cursor + breakLength,
      });
      cursor += breakLength;
    }
  });

  return blocks;
}
