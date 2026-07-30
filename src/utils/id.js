// Collision-safe id generator.
//
// The previous in-memory counter restarted at the same value on every launch,
// which would collide with ids restored from storage. Timestamp + randomness
// stays unique across restarts.
export function createId(prefix = 'id') {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${time}${rand}`;
}
