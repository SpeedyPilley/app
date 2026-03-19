// ============================================================
// Habitarium — Progression Engine
// ============================================================
// This is the "brain" of the game. It calculates:
//  - What mood a creature should be in
//  - Whether a creature should evolve
//  - How healthy a zone looks
//  - What happens when habits are missed
//
// All the rules that make the game feel alive live here.
// ============================================================

import {
  Creature,
  CreatureMood,
  DailyLog,
  EvolutionStage,
  Streak,
  WorldZone,
  ZoneVisualState,
} from "../types";
import { EVOLUTION_THRESHOLDS, XP_PER_COMPLETION } from "../constants/creatures";
import { clamp, daysBetween, todayDate } from "../utils/helpers";

// ---- Mood Calculation ----

/**
 * Figure out how a creature should feel based on recent habit completions.
 *
 * Rules:
 *  - Completed today → happy (ecstatic if 3+ day streak)
 *  - Missed 1 day → neutral ("everyone needs a rest day")
 *  - Missed 2-3 days → sad
 *  - Missed 4+ days → very_sad
 */
export function calculateMood(streak: Streak): CreatureMood {
  if (!streak.lastCompletedDate) return "neutral"; // brand new, no data yet

  const daysMissed = daysBetween(streak.lastCompletedDate, todayDate());

  if (daysMissed === 0) {
    // Completed today!
    return streak.current >= 3 ? "ecstatic" : "happy";
  }
  if (daysMissed === 1) return "neutral";
  if (daysMissed <= 3) return "sad";
  return "very_sad";
}

// ---- Evolution ----

/**
 * Check whether a creature is ready to evolve to the next stage.
 * Returns the new stage, or the same stage if not ready yet.
 */
export function checkEvolution(creature: Creature): EvolutionStage {
  if (creature.evolutionStage === "egg") {
    // Eggs hatch immediately (handled during creation)
    return "baby";
  }
  if (
    creature.evolutionStage === "baby" &&
    creature.xp >= EVOLUTION_THRESHOLDS.grown
  ) {
    return "grown";
  }
  return creature.evolutionStage;
}

// ---- Zone Health ----

/**
 * Calculate the health (0–100) of a zone based on the streak.
 *
 * Rules:
 *  - Each day of streak adds health (up to 100)
 *  - Each day missed subtracts health (gently at first, more over time)
 *  - Health never goes below 10 (zones never fully die — recovery is always possible)
 */
export function calculateZoneHealth(streak: Streak): number {
  if (!streak.lastCompletedDate) return 50; // starting health

  const daysMissed = daysBetween(streak.lastCompletedDate, todayDate());

  if (daysMissed === 0) {
    // Active — health based on streak length
    // Streak of 1 = 60, streak of 7 = 95, caps at 100
    return clamp(50 + streak.current * 5, 50, 100);
  }

  // Decline: gentle at first, steeper over time
  // Miss 1 day: lose 5. Miss 3 days: lose 20. Miss 7: lose 40.
  const decline = daysMissed <= 2 ? daysMissed * 5 : daysMissed * 7;
  const baseHealth = 50 + (streak.longest > 0 ? Math.min(streak.longest * 3, 30) : 0);
  return clamp(baseHealth - decline, 10, 100);
}

/**
 * Map a health score to a visual state that the UI can display.
 */
export function healthToVisualState(health: number): ZoneVisualState {
  if (health >= 75) return "thriving";
  if (health >= 50) return "normal";
  if (health >= 30) return "wilting";
  return "neglected";
}

// ---- Streak Management ----

/**
 * Update a streak after the user completes a habit today.
 * Returns a new streak object (does not mutate the original).
 */
export function recordCompletion(streak: Streak): Streak {
  const today = todayDate();

  if (streak.lastCompletedDate === today) {
    // Already completed today — no change
    return streak;
  }

  const isConsecutive =
    streak.lastCompletedDate != null &&
    daysBetween(streak.lastCompletedDate, today) === 1;

  const newCurrent = isConsecutive ? streak.current + 1 : 1;
  const newLongest = Math.max(streak.longest, newCurrent);

  return {
    ...streak,
    current: newCurrent,
    longest: newLongest,
    lastCompletedDate: today,
  };
}

/**
 * Calculate how much XP to award for today's completion.
 * Bonus XP for streaks to reward consistency.
 */
export function xpForCompletion(streak: Streak): number {
  const base = XP_PER_COMPLETION;
  // Small bonus: +1 XP per streak day (max +5 bonus)
  const streakBonus = Math.min(streak.current, 5);
  return base + streakBonus;
}

// ---- Updating All Creatures & Zones ----

/**
 * Run a "tick" — recalculate moods and zone health for all habits.
 * Call this whenever the app opens or a habit is completed.
 */
export function recalculateWorld(
  creatures: Creature[],
  streaks: Streak[],
  worldZones: WorldZone[]
): { creatures: Creature[]; worldZones: WorldZone[] } {
  const updatedCreatures = creatures.map((creature) => {
    const streak = streaks.find((s) => s.habitId === creature.id.replace("creature_", ""));
    if (!streak) return creature;

    const mood = calculateMood(streak);
    const newStage = checkEvolution(creature);

    return { ...creature, mood, evolutionStage: newStage };
  });

  const updatedZones = worldZones.map((zone) => {
    const streak = streaks.find((s) => s.habitId === zone.habitId);
    if (!streak) return zone;

    const health = calculateZoneHealth(streak);
    const visualState = healthToVisualState(health);

    return { ...zone, health, visualState };
  });

  return { creatures: updatedCreatures, worldZones: updatedZones };
}
