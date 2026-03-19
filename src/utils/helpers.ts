// ============================================================
// Habitarium — Helper Utilities
// ============================================================

/** Generate a simple unique ID (good enough for local-only MVP) */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/** Get today's date as YYYY-MM-DD */
export function todayDate(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

/** Pick a random item from an array */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Count days between two YYYY-MM-DD date strings */
export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffMs = Math.abs(b.getTime() - a.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
