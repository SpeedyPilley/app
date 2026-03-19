// ============================================================
// Habitarium — App Store (Zustand)
// ============================================================
// This is the app's "memory". It stores all habits, creatures,
// streaks, and world zones, and provides actions to change them.
//
// Zustand is a simple state manager. Think of it like a shared
// notebook that every screen in the app can read and write to.
//
// AsyncStorage saves this notebook to the phone so data
// survives when the app is closed and reopened.
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AppState,
  Creature,
  DailyLog,
  EggOption,
  Habit,
  HabitType,
  Streak,
  WorldZone,
} from "../types";
import {
  CREATURE_NAMES,
  DEFAULT_ZONE_STYLE,
  ZONE_STYLE_SUGGESTIONS,
} from "../constants/creatures";
import { generateId, pickRandom, todayDate } from "../utils/helpers";
import {
  calculateMood,
  calculateZoneHealth,
  checkEvolution,
  healthToVisualState,
  recordCompletion,
  xpForCompletion,
} from "../engine/progression";

// ---- Actions (things the app can do) ----

interface AppActions {
  /** Mark onboarding as complete */
  completeOnboarding: () => void;

  /** Create a new habit with a chosen egg → hatches a creature */
  createHabit: (name: string, type: HabitType, egg: EggOption) => string;

  /** Mark a habit as completed for today */
  completeHabit: (habitId: string) => void;

  /** Check if a habit was completed today */
  isCompletedToday: (habitId: string) => boolean;

  /** Run the progression engine (recalc moods, zones, evolutions) */
  refreshWorld: () => void;

  /** Get the creature for a specific habit */
  getCreatureForHabit: (habitId: string) => Creature | undefined;

  /** Get the streak for a specific habit */
  getStreak: (habitId: string) => Streak | undefined;

  /** Get the zone for a specific habit */
  getZone: (habitId: string) => WorldZone | undefined;

  /** Delete a habit and its linked creature/zone/streak */
  deleteHabit: (habitId: string) => void;
}

// ---- Initial State ----

const initialState: AppState = {
  hasCompletedOnboarding: false,
  habits: [],
  creatures: [],
  dailyLogs: [],
  streaks: [],
  worldZones: [],
  reminderTime: "09:00",
};

// ---- Store ----

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      createHabit: (name, type, egg) => {
        const habitId = generateId();
        const creatureId = `creature_${habitId}`;

        // Figure out zone style from the habit name, or use default
        const zoneStyle =
          ZONE_STYLE_SUGGESTIONS[name] ?? DEFAULT_ZONE_STYLE;

        const habit: Habit = {
          id: habitId,
          name,
          type,
          creatureId,
          zoneStyle,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        const creature: Creature = {
          id: creatureId,
          name: pickRandom(CREATURE_NAMES),
          species: egg.species,
          personality: egg.personality,
          evolutionStage: "baby", // hatches immediately
          mood: "happy",
          xp: 0,
          hatchedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        const streak: Streak = {
          habitId,
          current: 0,
          longest: 0,
          lastCompletedDate: null,
        };

        const zone: WorldZone = {
          habitId,
          health: 50,
          visualState: "normal",
        };

        set((state) => ({
          habits: [...state.habits, habit],
          creatures: [...state.creatures, creature],
          streaks: [...state.streaks, streak],
          worldZones: [...state.worldZones, zone],
        }));

        return habitId;
      },

      completeHabit: (habitId) => {
        const state = get();
        const today = todayDate();

        // Don't double-count
        const alreadyDone = state.dailyLogs.some(
          (log) => log.habitId === habitId && log.date === today && log.completed
        );
        if (alreadyDone) return;

        // Record the daily log
        const log: DailyLog = { habitId, date: today, completed: true };

        // Update streak
        const oldStreak = state.streaks.find((s) => s.habitId === habitId);
        if (!oldStreak) return;
        const newStreak = recordCompletion(oldStreak);

        // Award XP to creature
        const habit = state.habits.find((h) => h.id === habitId);
        if (!habit) return;
        const xp = xpForCompletion(newStreak);

        const updatedCreatures = state.creatures.map((c) => {
          if (c.id !== habit.creatureId) return c;
          const updated = { ...c, xp: c.xp + xp };
          // Check evolution
          updated.evolutionStage = checkEvolution(updated);
          updated.mood = calculateMood(newStreak);
          return updated;
        });

        // Update zone
        const zoneHealth = calculateZoneHealth(newStreak);
        const updatedZones = state.worldZones.map((z) =>
          z.habitId === habitId
            ? { ...z, health: zoneHealth, visualState: healthToVisualState(zoneHealth) }
            : z
        );

        const updatedStreaks = state.streaks.map((s) =>
          s.habitId === habitId ? newStreak : s
        );

        set({
          dailyLogs: [...state.dailyLogs, log],
          streaks: updatedStreaks,
          creatures: updatedCreatures,
          worldZones: updatedZones,
        });
      },

      isCompletedToday: (habitId) => {
        const state = get();
        const today = todayDate();
        return state.dailyLogs.some(
          (log) => log.habitId === habitId && log.date === today && log.completed
        );
      },

      refreshWorld: () => {
        const state = get();

        const updatedCreatures = state.creatures.map((creature) => {
          // Find the habit linked to this creature
          const habit = state.habits.find((h) => h.creatureId === creature.id);
          if (!habit) return creature;

          const streak = state.streaks.find((s) => s.habitId === habit.id);
          if (!streak) return creature;

          return {
            ...creature,
            mood: calculateMood(streak),
            evolutionStage: checkEvolution(creature),
          };
        });

        const updatedZones = state.worldZones.map((zone) => {
          const streak = state.streaks.find((s) => s.habitId === zone.habitId);
          if (!streak) return zone;

          const health = calculateZoneHealth(streak);
          return { ...zone, health, visualState: healthToVisualState(health) };
        });

        set({ creatures: updatedCreatures, worldZones: updatedZones });
      },

      getCreatureForHabit: (habitId) => {
        const state = get();
        const habit = state.habits.find((h) => h.id === habitId);
        if (!habit) return undefined;
        return state.creatures.find((c) => c.id === habit.creatureId);
      },

      getStreak: (habitId) => {
        return get().streaks.find((s) => s.habitId === habitId);
      },

      getZone: (habitId) => {
        return get().worldZones.find((z) => z.habitId === habitId);
      },

      deleteHabit: (habitId) => {
        const state = get();
        const habit = state.habits.find((h) => h.id === habitId);
        if (!habit) return;

        set({
          habits: state.habits.filter((h) => h.id !== habitId),
          creatures: state.creatures.filter((c) => c.id !== habit.creatureId),
          streaks: state.streaks.filter((s) => s.habitId !== habitId),
          worldZones: state.worldZones.filter((z) => z.habitId !== habitId),
          dailyLogs: state.dailyLogs.filter((l) => l.habitId !== habitId),
        });
      },
    }),
    {
      name: "habitarium-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
