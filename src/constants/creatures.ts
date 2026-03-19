// ============================================================
// Habitarium — Creature Data
// ============================================================
// Names, personality descriptions, egg options, and zone styles.
// This is the "game content" that makes each creature feel alive.
// ============================================================

import { EggOption, Personality, CreatureSpecies } from "../types";

/** Cute random names the app can pick from when hatching a creature */
export const CREATURE_NAMES: string[] = [
  "Puddle", "Mochi", "Biscuit", "Nimbus", "Pebble",
  "Sprout", "Tofu", "Pip", "Clover", "Doodle",
  "Waffle", "Snooze", "Fern", "Bumble", "Marshmallow",
  "Noodle", "Cocoa", "Fizz", "Maple", "Luna",
  "Twig", "Scone", "Velvet", "Acorn", "Bloop",
];

/** Short flavour text for each personality */
export const PERSONALITY_DESCRIPTIONS: Record<Personality, string> = {
  sleepy: "Loves naps and cosy corners. Yawns a lot. Don't wake them unless you have to.",
  chaotic: "Can't sit still. Runs in circles. Might knock something over. Adorable anyway.",
  anxious: "A little nervous, but trying their best. Needs gentle encouragement.",
  funny: "Always goofing around. Might trip over their own feet for laughs.",
  needy: "Wants your attention ALL the time. Will stare at you until you tap them.",
  shy: "Hides behind things. Peeks out when they trust you. Worth the wait.",
  brave: "Stands tall no matter what. First to try new things. A tiny hero.",
  curious: "Pokes everything. Investigates every corner. Asks a lot of silent questions.",
  clingy: "Follows you around the screen. Never wants you to leave. Separation anxiety: maximum.",
  cheerful: "Smiles at literally everything. A ray of sunshine with tiny legs.",
};

/**
 * For each new habit, the user picks from 3 eggs. Each egg hints at a
 * different creature type. We pre-define several sets of 3 eggs that the
 * app randomly picks from.
 */
export const EGG_SETS: EggOption[][] = [
  [
    { variant: "warm", hintWord: "playful", species: "blobby", personality: "funny" },
    { variant: "cool", hintWord: "dreamy", species: "droplet", personality: "sleepy" },
    { variant: "earthy", hintWord: "gentle", species: "leafling", personality: "shy" },
  ],
  [
    { variant: "warm", hintWord: "feisty", species: "ember", personality: "brave" },
    { variant: "cool", hintWord: "curious", species: "dustmote", personality: "curious" },
    { variant: "earthy", hintWord: "cuddly", species: "fluffkin", personality: "clingy" },
  ],
  [
    { variant: "warm", hintWord: "bouncy", species: "blobby", personality: "chaotic" },
    { variant: "cool", hintWord: "calm", species: "droplet", personality: "cheerful" },
    { variant: "earthy", hintWord: "nervous", species: "leafling", personality: "anxious" },
  ],
  [
    { variant: "warm", hintWord: "silly", species: "fluffkin", personality: "funny" },
    { variant: "cool", hintWord: "sparkly", species: "dustmote", personality: "cheerful" },
    { variant: "earthy", hintWord: "bold", species: "ember", personality: "brave" },
  ],
];

/** Suggested zone styles based on common habit themes */
export const ZONE_STYLE_SUGGESTIONS: Record<string, string> = {
  "Drink water": "pond",
  "Read for 5 minutes": "library",
  "Stretch for 5 minutes": "garden",
  "Sleep before midnight": "dreamNook",
  "Walk for 10 minutes": "trail",
  "Tidy for 5 minutes": "cottage",
  "Revise for 10 minutes": "study",
  "No doomscrolling": "zenGarden",
  "No vaping today": "clearSky",
};

/** Default zone style when we can't match the habit name */
export const DEFAULT_ZONE_STYLE = "meadow";

/** How much XP is needed to reach each evolution stage */
export const EVOLUTION_THRESHOLDS = {
  /** Egg → Baby: hatch immediately on creation */
  baby: 0,
  /** Baby → Grown: roughly 7 days of consistency */
  grown: 70,
} as const;

/** XP awarded for completing a habit */
export const XP_PER_COMPLETION = 10;

/** Suggested habits shown during onboarding */
export const SUGGESTED_HABITS = [
  { name: "Drink water", type: "do" as const },
  { name: "Read for 5 minutes", type: "do" as const },
  { name: "Stretch for 5 minutes", type: "do" as const },
  { name: "Walk for 10 minutes", type: "do" as const },
  { name: "Sleep before midnight", type: "do" as const },
  { name: "Tidy for 5 minutes", type: "do" as const },
  { name: "Revise for 10 minutes", type: "do" as const },
  { name: "No doomscrolling", type: "avoid" as const },
  { name: "No vaping today", type: "avoid" as const },
];
