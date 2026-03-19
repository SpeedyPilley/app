// ============================================================
// Habitarium — Core Data Types
// ============================================================
// This file defines the shape of all the data the app stores.
// Think of each "type" as a template describing what information
// we track for each thing (a user, a habit, a creature, etc.)
// ============================================================

/** The two kinds of habits the app supports */
export type HabitType = "do" | "avoid";

/** How a creature is feeling right now */
export type CreatureMood = "ecstatic" | "happy" | "neutral" | "sad" | "very_sad";

/** The growth stages a creature goes through */
export type EvolutionStage = "egg" | "baby" | "grown";

/** Personality archetypes — makes each creature feel unique */
export type Personality =
  | "sleepy"
  | "chaotic"
  | "anxious"
  | "funny"
  | "needy"
  | "shy"
  | "brave"
  | "curious"
  | "clingy"
  | "cheerful";

/** Visual species of a creature (we start with a small set for MVP) */
export type CreatureSpecies =
  | "blobby"    // round, jiggly, friendly
  | "leafling"  // plant-based, earthy
  | "fluffkin"  // fluffy, cloud-like
  | "ember"     // warm, glowy
  | "droplet"   // water-themed, shiny
  | "dustmote"; // tiny, floaty, sparkly

/** The visual health state of a zone in the world */
export type ZoneVisualState = "thriving" | "normal" | "wilting" | "neglected";

/** Colour hint for eggs during egg selection */
export type EggVariant = "warm" | "cool" | "earthy";

// ============================================================
// Core Data Structures
// ============================================================

export interface Creature {
  id: string;
  name: string;
  species: CreatureSpecies;
  personality: Personality;
  evolutionStage: EvolutionStage;
  mood: CreatureMood;
  /** Experience points — drives evolution */
  xp: number;
  hatchedAt: string | null; // ISO date string, null while still an egg
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  creatureId: string;
  /** Which visual style the zone gets (e.g. "pond", "library", "garden") */
  zoneStyle: string;
  isActive: boolean;
  createdAt: string;
}

export interface DailyLog {
  habitId: string;
  /** Date in YYYY-MM-DD format */
  date: string;
  completed: boolean;
}

export interface Streak {
  habitId: string;
  current: number;
  longest: number;
  lastCompletedDate: string | null;
}

export interface WorldZone {
  habitId: string;
  /** 0–100 health score, drives the visual state */
  health: number;
  visualState: ZoneVisualState;
}

/** An egg option shown during the egg selection screen */
export interface EggOption {
  variant: EggVariant;
  hintWord: string; // e.g. "dreamy", "feisty", "gentle"
  species: CreatureSpecies;
  personality: Personality;
}

/** Top-level app state shape (used by Zustand store) */
export interface AppState {
  hasCompletedOnboarding: boolean;
  habits: Habit[];
  creatures: Creature[];
  dailyLogs: DailyLog[];
  streaks: Streak[];
  worldZones: WorldZone[];
  reminderTime: string; // HH:MM format
}
